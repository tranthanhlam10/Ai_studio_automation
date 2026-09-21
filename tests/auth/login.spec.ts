import { test, expect } from "../../fixtures/use-fixtures/test.fixture";
import { loginData } from "../../data/login.data";
import { env } from "../../config/env";

test.describe("Studio - Đăng nhập", { tag: ["@ui", "@regression"] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    "LOGIN-001: Hiển thị form đăng nhập",
    { tag: "@smoke" },
    async ({ loginPage }) => {
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.emailInput).toBeEditable();
      await expect(loginPage.passwordInput).toBeEditable();
      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
      await expect(loginPage.signInButton).toBeEnabled();
    },
  );

  test("LOGIN-002: Báo lỗi khi bỏ trống email và mật khẩu", async ({
    loginPage,
    page,
  }) => {
    await loginPage.submit();

    await expect(loginPage.emailRequiredError).toBeVisible();
    await expect(loginPage.passwordRequiredError).toBeVisible();
    await expect(page).toHaveURL(new URL("/auth/login", env.baseURL).href);
  });

  test("LOGIN-003: Báo lỗi khi email sai định dạng", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(loginData.invalidEmail, loginData.dummyPassword);

    await expect(loginPage.emailInvalidError).toBeVisible();
    await expect(loginPage.passwordRequiredError).toBeHidden();
    await expect(page).toHaveURL(new URL("/auth/login", env.baseURL).href);
  });

  test("LOGIN-004: Báo lỗi khi chỉ nhập email", async ({ loginPage }) => {
    await loginPage.login(loginData.validFormatEmail, "");

    await expect(loginPage.passwordRequiredError).toBeVisible();
    await expect(loginPage.emailRequiredError).toBeHidden();
    await expect(loginPage.emailInvalidError).toBeHidden();
  });
});
