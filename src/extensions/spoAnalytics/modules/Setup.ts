import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { ExtensionContext } from "@microsoft/sp-extension-base";

export const pageSet = (path: string) => {
  let it: string = path;
  it = it.substring(it.lastIndexOf("/") + 1);
  it = it.replace(".aspx", "");
  it = it.replace(/-/g, "_x002d_");
  return it;
};

export const identity = (ctxt: ExtensionContext) => {
  return ctxt.spHttpClient
    .get(
      `${ctxt.pageContext.web.absoluteUrl}/_api/web/currentuser?$select=Title,UserPrincipalName`,
      SPHttpClient.configurations.v1
    )
    .then(
      (
        res: SPHttpClientResponse
      ): Promise<{ Title: string; UserPrincipalName: string }> => {
        return res.json();
      }
    )
    .then((web: { Title: string; UserPrincipalName: string }) => {
      return { name: web.Title, upn: web.UserPrincipalName };
    });
};

export const listStatus = async (ctxt: ExtensionContext, url: string) => {
  let statusCode: number = 0;
  await ctxt.spHttpClient
    .get(url, SPHttpClient.configurations.v1)
    .then((results: SPHttpClientResponse) => {
      statusCode = results.status;
    });
  return statusCode;
};

export const newUser = async (ctxt: ExtensionContext, url: string) => {
  let exists: boolean = true;
  await ctxt.spHttpClient
    .get(url, SPHttpClient.configurations.v1)
    .then((res: SPHttpClientResponse) => {
      return res.json();
    })
    .then((results: any) => {
      if (results.value.length === 0) {
        exists = true;
      } else {
        exists = false;
      }
    });

  return exists;
};