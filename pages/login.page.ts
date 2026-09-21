import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly emailRequiredError: Locator;
  readonly emailInvalidError: Locator;
  readonly passwordRequiredError: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Welcome Back', exact: true });
    // DOM hiện tại chưa có data-testid và label chưa liên kết với input.
    this.emailInput = page.getByPlaceholder('Enter your email', { exact: true });
    this.passwordInput = page.getByPlaceholder('Enter your password', { exact: true });
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.emailRequiredError = page.getByText('Email address is required', { exact: true });
    this.emailInvalidError = page.getByText('Email address is invalid', { exact: true });
    this.passwordRequiredError = page.getByText('Password is required', { exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.signInButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.submit();
  }
}
