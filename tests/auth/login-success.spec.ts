import { test, expect } from "../../fixtures/use-fixtures/test.fixture";
import { env } from "../../config/env";


test.use({ trace: "off", video: "off", screenshot: "off" });

test.describe(
  "Studio - Valid account",
  { tag: ["@ui", "@regression", "@authenticated"] },
  () => {
    test.skip(
      !env.hasLoginCredentials,
      `Set LOGIN_EMAIL, LOGIN_PASSWORD, and LOGIN_SUCCESS_PATH for ${env.environment} to run this test.`,
    );

    test("LOGIN-005: Log in successfully", async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login(env.loginEmail, env.loginPassword);

      await expect(page).toHaveURL(
        new URL(env.loginSuccessPath, env.baseURL).href,
      );
      await expect(loginPage.heading).toBeHidden();
      await expect(loginPage.signInButton).toBeHidden();
    });
  },
);
