import KeywordFilter from '../components/keyword.filter';
import {BasePage} from './base.page';
import type { Locator , Page} from '@playwright/test';

export class KeywordPage extends BasePage   {
  readonly navigationButton: Locator;
  readonly campaignTrackingInput: Locator;
  readonly brandTrackingInput: Locator;
  readonly criticalCrisisInput: Locator;
  readonly reloadButton: Locator;
  readonly keywordFilter: KeywordFilter;

constructor(page: Page) {
    super(page);
    this.navigationButton = page.getByRole("link", {
      description: "Keyword Management",
      exact: true,
    });
    this.campaignTrackingInput = page.getByText(
      "Campaign Tracking Keywords1Crawling overdue:",
    );
    this.brandTrackingInput = page.getByText(
      "Campaign Tracking Keywords1Crawling overdue:",
    );
    this.criticalCrisisInput = page.getByText(
      "Critical Crisis Keywords",
    );
    this.reloadButton = page.getByRole('button', { name: 'reload Refresh' });
    this.keywordFilter = new KeywordFilter(page);

  }

  async open(): Promise<void> {
    await this.navigate("/keyword-management/keywords");
  } 

  async reload(): Promise<void> {
    await this.reloadButton.click();
  }

  async filterByKeyword(): Promise<void> {
    await this.keywordFilter.filterByKeyword();
  }


}
