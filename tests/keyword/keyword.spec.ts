import { test, expect } from "../../fixtures";

test.describe(
  "Studio - Keyword Management",
  { tag: ["@ui", "@regression"] },
  () => {
    test(
      "KEYWORD-001: Display the keyword elements",
      { tag: "@smoke" },
      async ({ keywordPage, authenticatedPage }) => {
        await keywordPage.open();
        await expect(keywordPage.campaignTrackingInput).toBeVisible();
        await expect(keywordPage.brandTrackingInput).toBeVisible();
        await expect(keywordPage.criticalCrisisInput).toBeVisible();
      },
    );
    test(
      "KEYWORD-002: Open the keyword filter",
      { tag: "@smoke" },
      async ({ keywordPage, authenticatedPage }) => {
        await keywordPage.open();
        await keywordPage.filterByKeyword();
        await expect(keywordPage.keywordFilter.btnApply).toBeVisible();
      },
    );
  },
);
