# Studio Web Automation

This repository contains TypeScript UI tests for YouNet Studio. It uses Playwright Test, page objects, and fixtures. The current suites cover login and basic Keyword Management checks. CSV, JSON, and Google Sheets data providers are also present, but they are separate from the Playwright UI suites.

## Requirements

- Node.js 22 or newer and npm.
- Chromium installed through Playwright.
- Network access to the selected Studio environment. The testing host uses an internal `.ynm.local` domain and normally requires the appropriate network or VPN.
- A test account for authenticated tests. The login validation tests do not require one.

## Install and run

From the repository root:

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm run test:login
```

`npm run test:login` selects the testing environment by default. It runs the four login UI and validation tests without credentials. `LOGIN-005` is skipped until all three login variables are set.

## Choose an environment

Set `TEST_ENV` for each run. Supported values are `testing` and `staging`.

| `TEST_ENV` | Default base URL | Local configuration file |
| --- | --- | --- |
| `testing` (default) | `http://studio-testing.ynm.local/` | `.env.testing` |
| `staging` | `https://studio-staging.younetmedia.com/` | `.env.staging` |

```bash
npm run test:login
TEST_ENV=staging npm run test:login
TEST_ENV=staging npm run test:login -- --grep LOGIN-001
```

The commands above use POSIX shell syntax, including macOS `zsh`. `config/env.ts` loads the file for the selected environment. For testing only, it then loads the legacy `.env` file for values that were not set in `.env.testing`. Staging never loads `.env`.

Shell and CI environment variables take precedence over values in the local files. `BASE_URL` can override the default URL, for example when a CI job targets another host. Keep the selected `TEST_ENV`, `BASE_URL`, and account credentials consistent with one another.

## Configure an account for authenticated tests

Add these values to `.env.testing` or `.env.staging`, depending on the target environment:

```dotenv
LOGIN_EMAIL=your-test-account@example.com
LOGIN_PASSWORD=your-test-password
LOGIN_SUCCESS_PATH=/actual/path/after/login
```

`LOGIN_SUCCESS_PATH` must be an internal path beginning with `/`, must differ from `/auth/login`, and must match the actual destination after login. Include its query string or fragment if the application uses one. Set all three variables together; partial configuration stops the test run with an error. Without them, `LOGIN-005` is skipped, while the Keyword Management tests fail because their authentication fixture needs an account.

For a legacy testing setup, you can copy `.env.example` to `.env` and fill in the values there:

```bash
cp .env.example .env
```

Local `.env` files and `credentials.json` are ignored by Git. Do not commit real credentials or put them in test data, logs, or test titles.

## Run Playwright tests

| Command | What it runs |
| --- | --- |
| `npm run test:login` | Login suite in Chromium |
| `npm run test:login:headed` | Login suite with a visible Chromium window |
| `npm run test:login -- --grep LOGIN-003` | One login test by ID |
| `npm run test:smoke` | Tests tagged `@smoke` |
| `npm test` | All tests in `tests/` |
| `npm run test:ui` | Playwright UI Mode |
| `npx playwright test --list` | List discovered tests without opening the site |

Prefix any command with `TEST_ENV=staging` to target staging, for example:

```bash
TEST_ENV=staging npm run test:smoke
TEST_ENV=staging npm test
```

The smoke suite includes Keyword Management tests, so it needs login credentials. For a credential-free smoke check, run the login form test directly:

```bash
npm run test:login -- --grep LOGIN-001
```

Playwright discovers seven tests in `tests/`: five login tests and two Keyword Management tests. The starter file in `e2e/` is outside Playwright's configured `testDir`, and `example.spec.ts` is ignored.

### Current UI coverage

| ID | Check | Account required |
| --- | --- | --- |
| LOGIN-001 | Login form fields and button are visible; password input is masked | No |
| LOGIN-002 | Required-field errors appear when email and password are empty | No |
| LOGIN-003 | Invalid email format is rejected | No |
| LOGIN-004 | Missing password is reported when only an email is entered | No |
| LOGIN-005 | A valid login reaches `LOGIN_SUCCESS_PATH` and leaves the login form | Yes |
| KEYWORD-001 | Keyword Management summary elements are visible | Yes |
| KEYWORD-002 | The keyword filter opens and its Apply control is visible | Yes |

The Keyword tests currently check visibility and opening the filter; they do not verify that filtering changes results. `LOGIN-005` checks the destination URL and disappearance of login controls. A stable element visible only after login would make its success assertion stronger.

## Reports and artifacts

Playwright writes an HTML report to `playwright-report/`, JUnit output to `reports/junit.xml`, and failure artifacts to `test-results/`. Open the HTML report after a run with:

```bash
npm run report
```

By default, Playwright retains traces and videos on failure and takes screenshots on failure. The `LOGIN-005` spec disables traces, videos, and screenshots because it uses account credentials. Each test starts with a fresh browser context; no saved login state is reused.

## Type checking and data providers

```bash
npm run typecheck
npm run unit:json
```

`npm run unit:json` runs the JSON provider tests. The repository also contains CSV and Google Sheets provider tests under `utils/data-providers/`. The current `unit:csv` and `unit:google-sheet` package scripts point to paths that do not exist. Run individual files with `npm run unit -- <path>` if you are working on those providers.

The full `npm run unit` command currently discovers Playwright specs as Vitest files, and the CSV and Google Sheets provider tests have additional failures. It is not a passing project-wide check at present.

The Google Sheets provider uses OAuth and looks for `credentials.json` in the repository root. Its test also requires Google Sheets API access and currently has an authentication implementation issue. Keep OAuth credentials local; do not commit them. The spreadsheet ID and range are currently hardcoded in `utils/data-providers/ggsheet.providers.ts`.

## Project layout

```text
config/env.ts                          Environment selection and validation
playwright.config.ts                  Browser, timeout, retry, and report settings
tests/auth/                           Login UI tests
tests/keyword/                        Keyword Management UI tests
pages/                                Page objects and navigation
components/                           Reusable UI components
fixtures/use-fixtures/                Page object and authentication fixtures
data/                                 UI test data and locator definitions
utils/data-providers/                 CSV, JSON, and Google Sheets providers
docs/                                 Architecture, conventions, and review notes
.env.example                          Example local testing configuration
```

## CI notes

`.github/workflows/playwright.yml` runs `npx playwright test` on a GitHub hosted runner. The default testing host is internal, and the full suite requires account credentials. Configure a runner with network access and provide the relevant environment secrets before treating that workflow as a reliable end-to-end gate.
