import type { Locator, Page } from "@playwright/test";

export abstract class CommonFilter {
  readonly btnFilter: Locator;
  readonly btnClear: Locator;
  readonly btnApply: Locator;
  readonly btnClose: Locator;

  constructor(page: Page) {
    this.btnFilter = page.getByRole("button", { name: "filter 󰝥" });
    this.btnClear = page
      .getByRole("heading", { name: "Filter By 󰅖" })
      .locator("i");
    this.btnApply = page.getByRole("button", { name: "reload Reset" });
    this.btnClose = page.getByRole("button", { name: "󰈶 Apply" });
  }

  async clickFilter(): Promise<void> {
    return this.btnFilter.click();
  }

  async clickClear(): Promise<void> {
    return this.btnClear.click();
  }

  async clickApply(): Promise<void> {
    return this.btnApply.click();
  }

  async clickClose(): Promise<void> {
    return this.btnClose.click();
  }
}
