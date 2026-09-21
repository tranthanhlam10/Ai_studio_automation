import { test as base, expect } from "./test.fixture";
import { env } from "../../config/env";

type authFixtures = {
  authenticatedPage: void;
};

export const test = base.extend<authFixtures>({
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.open();
    await loginPage.fillCredentials("lamtt@younetgroup.com", "Lam@12345");
    await loginPage.submit();

    await expect(page).toHaveURL(
      new URL("http://studio-testing.ynm.local/profile/info", env.baseURL).href,
    );

    await use();
  },
});

export { expect } from "@playwright/test";
