import type { Page } from '@playwright/test';

/** Locators for the Keyword Management screen in the Crawling state. */
export const keywordPagePath = '/keyword-management/keywords?keywords.status=crawling';

export function getKeywordLocators(page: Page) {
  const table = page.getByRole('table');
  const dialog = page.getByRole('dialog');

  // React Select does not always render a hidden input; locate each field by its label.
  const filterSelect = (label: string) =>
    page.locator('label').filter({ hasText: new RegExp(`^${label}$`) })
      .locator('..').locator('..').locator('input[type="text"]');

  return {
    navigation: {
      keywordManagement: page.locator('a[href="/keyword-management/keywords"]'),
      breadcrumb: page.getByTestId('topnav-breadcrumb'),
      keywordsTab: page.getByRole('tab', { name: 'Keywords', exact: true }),
      statisticsTab: page.getByRole('tab', { name: 'Statistics', exact: true }),
    },
    overview: {
      criticalCrisisKeywords: page.getByText('Critical Crisis Keywords', { exact: true }),
      crawlingOverdue: page.getByText(/^Crawling overdue:/),
    },
    toolbar: {
      searchKeywords: page.getByRole('textbox', { name: 'Search keywords' }),
      openFilter: page.getByRole('button', { name: /^filter / }),
      createKeyword: page.getByRole('button', { name: /Create Keyword/ }),
      refresh: page.getByRole('button', { name: /Refresh/ }),
      statusCrawlingChip: page.getByRole('button', { name: 'Remove filter' })
        .locator('..').getByText('Crawling', { exact: true }),
      removeStatusFilter: page.getByRole('button', { name: 'Remove filter' }),
      removeAllFilters: page.getByRole('button', { name: 'Remove All' }),
    },
    filter: {
      heading: page.getByRole('heading', { name: /^Filter By/ }),
      processes: filterSelect('Processes'),
      topics: filterSelect('Topics'),
      platforms: filterSelect('Platform'),
      crawlingType: filterSelect('Crawling Type'),
      criticalCrisisMode: filterSelect('Critical Crisis Mode'),
      analyzeImageVideo: filterSelect('Analyze Image - Video'),
      status: filterSelect('Status'),
      endDate: page.getByPlaceholder('dd/mm/yyyy - dd/mm/yyyy'),
      overdueCrawling: filterSelect('Overdue crawling'),
      creator: filterSelect('Creator'),
      reset: page.getByRole('button', { name: /Reset/ }),
      apply: page.getByRole('button', { name: /Apply/ }).first(),
    },
    table: {
      root: table,
      selectAll: table.getByRole('rowgroup').first().getByRole('checkbox'),
      column: (name: string) => table.getByRole('columnheader', { name, exact: true }),
      idColumn: table.getByRole('columnheader', { name: /^ID / }),
      keywordColumn: table.getByRole('columnheader', { name: /^Keyword / }),
      statusColumn: table.getByRole('columnheader', { name: 'Status', exact: true }),
      processesColumn: table.getByRole('columnheader', { name: 'Running Processes' }),
      topicsColumn: table.getByRole('columnheader', { name: 'Topics' }),
      platformsColumn: table.getByRole('columnheader', { name: 'Platforms' }),
      crawlingTypeColumn: table.getByRole('columnheader', { name: 'Crawling Type' }),
      endDateColumn: table.getByRole('columnheader', { name: /^End Date / }),
      lastCrawlColumn: (platform: string) =>
        table.getByRole('columnheader', { name: `Last crawl ${platform}`, exact: true }),
      rowById: (id: string | number) =>
        table.getByRole('row').filter({
          has: page.getByRole('cell', { name: String(id), exact: true }),
        }),
      rowCheckbox: (id: string | number) =>
        table.getByRole('row').filter({
          has: page.getByRole('cell', { name: String(id), exact: true }),
        }).getByRole('checkbox'),
    },
    pagination: {
      totalItems: page.getByText(/^Total [\d,]+ Items$/),
      previous: page.getByRole('button', { name: 'Previous page' }),
      current: page.getByRole('button', { name: /is your current page/ }),
      page: (number: number) => page.getByRole('button', { name: `Page ${number}`, exact: true }),
      next: page.getByRole('button', { name: 'Next page' }),
    },
    createDialog: {
      root: dialog,
      heading: dialog.getByRole('heading', { name: 'Create Keyword' }),
      keywords: dialog.locator('[data-field="keywords"] input[type="text"]'),
      processes: dialog.locator('[data-field="processes"] input[type="text"]'),
      close: dialog.getByRole('button', { name: 'Close' }),
      cancel: dialog.getByRole('button', { name: 'Cancel' }),
      save: dialog.getByRole('button', { name: 'Save' }),
    },
  };
}
