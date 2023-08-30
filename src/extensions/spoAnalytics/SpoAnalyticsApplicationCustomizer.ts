import { Log } from "@microsoft/sp-core-library";
import { BaseApplicationCustomizer } from "@microsoft/sp-application-base";

import * as strings from "SpoAnalyticsApplicationCustomizerStrings";
import { override } from "@microsoft/decorators";

const LOG_SOURCE: string = "SpoAnalyticsApplicationCustomizer";

export default class SpoAnalyticsApplicationCustomizer extends BaseApplicationCustomizer<any> {
  @override
  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    let page = await pageSet(this.context.pageContext.site.serverRequestPath);
    page = page.substring(0, 32);
    this.pageHit(page);

    this.context.application.navigatedEvent.add(this, () => {
      page = pageSet(this.context.pageContext.site.serverRequestPath);
      page = page.substring(0, 32);
      this.pageHit(page);
    });
  }

  public async pageHit(page: string) {
    const user = await Identity(this.context);
    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SPO_Analytics')/items?$select=Id,Title,${page}&$filter=Title eq ${user.upn}'`;
    const status: number = await listStatus(this.context, url);

    if (status === 200) {
      const n: boolean = await newUser(this.context, url);
      n
        ? createItem(this.context, user, page)
        : updateItem(this.context, page, url);
    } else if (status === 404) {
      console.log(`'SPO_Analytics' list does not exist on this site`);
    } else if (status === 400) {
      console.log(`This page is not being tracked`);
    }
  }
}
