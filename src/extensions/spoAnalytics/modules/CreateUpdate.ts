import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { ExtensionContext } from "@microsoft/sp-extension-base";

const fetchCount = async (
  ctxt: ExtensionContext,
  page: string,
  url: string
) => {
  let id: number = 0;
  let count: number = 0;
  await ctxt.spHttpClient
    .get(url, SPHttpClient.configurations.v1)
    .then((res: SPHttpClientResponse) => {
      return res.json();
    })
    .then((results: any) => {
      id = results.value[0].Id;
      count = results.value[0][`${page}`];
    });
  return { id: id, count: count };
};

export const createItem = (
  ctxt: ExtensionContext,
  user: { name: string; upn: string },
  page: string
) => {
  console.log("creating item");
  const listItemEntityTypeName: string = "SP.Data.SPO_x005f_AnalyticsListItem";
  let metadata: string = JSON.stringify({
    __metadata: { type: listItemEntityTypeName },
  });
  metadata = metadata.substring(1, metadata.length - 1);

  const data: any = {};
  data.Title = `${user.upn}`;
  data.Username = `${user.name}`;
  data[`${page}`] = 1;

  let JSONdata: string = JSON.stringify(data);
  JSONdata = JSONdata.substring(1, JSONdata.length - 1);

  const body: string = `{${metadata},${JSONdata}}`;

  ctxt.spHttpClient
    .post(
      `${ctxt.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SPO_Analytics')/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=verbose",
          "odata-version": "",
        },
        body: body,
      }
    )
    .then(
      (response: SPHttpClientResponse): void => {
        console.log(response);
      },
      (error: any): void => {
        console.log(error);
      }
    );
};

export const updateItem = async (
  ctxt: ExtensionContext,
  page: string,
  url: string
) => {
  console.log("updating item");
  const visitCount = await fetchCount(ctxt, page, url);
  visitCount.count++;

  const listItemEntityTypeName: string = "SP.Data.SPO_x005f_AnalyticsListItem";
  let metadata: string = JSON.stringify({
    __metadata: { type: listItemEntityTypeName },
  });
  metadata = metadata.substring(1, metadata.length - 1);

  const data: any = {};
  data[`${page}`] = visitCount.count;
  let JSONdata: string = JSON.stringify(data);
  JSONdata = JSONdata.substring(1, JSONdata.length - 1);

  const body: string = `{${metadata},${JSONdata}}`;

  ctxt.spHttpClient
    .post(
      `${ctxt.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SPO_Analytics')/items(${visitCount.id})?select=${page}`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=verbose",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
        body: body,
      }
    )
    .then(
      (response: SPHttpClientResponse): void => {
        console.log(response);
      },
      (error: any): void => {
        console.log(error);
      }
    );
};
