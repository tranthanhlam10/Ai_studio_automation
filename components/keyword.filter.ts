import { Page } from "@playwright/test";
import { CommonFilter } from "./common/common.filter";

export default class KeywordFilter extends CommonFilter {
  constructor(page: Page) {
    super(page);
  }

  async filterByKeyword() {
    await this.clickFilter();
  }
}
