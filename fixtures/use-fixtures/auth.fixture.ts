import { test as base, expect } from "./test.fixture";
import { env } from "../../config/env";

type authFixtures = {
  authenticatedPage: void;
};

export const test = base.extend<authFixtures>({
  authenticatedPage: async ({ page, loginPage }, use) => {
    if (!env.hasLoginCredentials) {
      throw new Error(`Set LOGIN_EMAIL, LOGIN_PASSWORD, and LOGIN_SUCCESS_PATH for ${env.environment}.`);
    }
    await loginPage.open();
    await loginPage.fillCredentials(env.loginEmail, env.loginPassword);
    await loginPage.submit();

    await expect(page).toHaveURL(
      new URL(env.loginSuccessPath, env.baseURL).href,
    );

    await use();
  },
});

export { expect } from "@playwright/test";
