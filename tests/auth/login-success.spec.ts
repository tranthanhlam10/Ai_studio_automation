import { test, expect } from "../../fixtures/use-fixtures/test.fixture";
import { env } from "../../config/env";

// Đặt ở cấp file: các tùy chọn artifact thay đổi cấu hình worker.
test.use({ trace: "off", video: "off", screenshot: "off" });

test.describe(
  "Studio - Tài khoản hợp lệ",
  { tag: ["@ui", "@regression", "@authenticated"] },
  () => {
    test.skip(
      !env.hasLoginCredentials,
      "Điền LOGIN_EMAIL, LOGIN_PASSWORD và LOGIN_SUCCESS_PATH trong .env để chạy.",
    );

    test("LOGIN-005: Đăng nhập thành công", async ({ loginPage, page }) => {
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
