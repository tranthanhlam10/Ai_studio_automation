import { test, expect } from "../../fixtures";

test.describe(
  "Studio - Keyword Management",
  { tag: ["@ui", "@regression"] },
  () => {
    test(
      "KEYWORD-001: Kiểm tra xem các element có hoạt động không",
      { tag: "@smoke" },
      async ({ keywordPage, authenticatedPage }) => {
        //void authenticatedPage;
        await keywordPage.open();
        //await expect(keywordPage.navigationButton).toBeVisible();
        await expect(keywordPage.campaignTrackingInput).toBeVisible();
        await expect(keywordPage.brandTrackingInput).toBeVisible();
        await expect(keywordPage.criticalCrisisInput).toBeVisible();
      },
    );
  },
);
