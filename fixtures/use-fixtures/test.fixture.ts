import { test as base } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { KeywordPage } from "../../pages/keyword.page";

type Fixtures = {
  loginPage: LoginPage;
  keywordPage: KeywordPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  keywordPage: async ({ page }, use) => {
    await use(new KeywordPage(page));
  },
});

export { expect } from "@playwright/test";
