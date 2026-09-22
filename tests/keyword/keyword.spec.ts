import { test, expect } from "../../fixtures";

test.describe(
  "Studio - Keyword Management",
  { tag: ["@ui", "@regression"] },
  () => {
    test(
      "KEYWORD-001: Kiểm tra xem các element có hoạt động không",
      { tag: "@smoke" },
      async ({ keywordPage, authenticatedPage }) => {
        await keywordPage.open();
        await expect(keywordPage.campaignTrackingInput).toBeVisible();
        await expect(keywordPage.brandTrackingInput).toBeVisible();
        await expect(keywordPage.criticalCrisisInput).toBeVisible();
      },
    );
    test(
      "KEYWORD-002: Kiểm tra xem click được filterByKeyword không",
      { tag: "@smoke" },
      async ({ keywordPage, authenticatedPage }) => {
        await keywordPage.open();
        await keywordPage.filterByKeyword();
        await expect(keywordPage.keywordFilter.btnApply).toBeVisible();
      },
    );
  },
);
