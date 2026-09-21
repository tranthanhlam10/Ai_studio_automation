# Studio Web Automation

Playwright + TypeScript, chỉ kiểm thử web UI tại `http://studio-testing.ynm.local/auth/login`.
Dùng Page Object Model và Playwright Test Fixtures. Chưa có API client hoặc API tests.

## Cấu trúc

```text
tests/auth/login.spec.ts       # Kịch bản và assertion login
tests/auth/login-success.spec.ts # Demo login thành công, cần cấu hình tài khoản
pages/login.page.ts            # Locator và thao tác trên màn hình login
fixtures/test.fixture.ts      # Inject LoginPage vào từng test
data/login.data.ts             # Input demo, không chứa tài khoản thật
config/env.ts                  # Đọc .env và validate cấu hình
components/                    # Chỗ cho component dùng chung khi cần
utils/                         # Chỗ cho hàm thuần dùng chung khi cần
playwright.config.ts           # Browser, timeout, retry, report
tsconfig.json                  # TypeScript strict
.env.example                   # Cấu hình mẫu
playwright-report/             # HTML report được sinh sau khi chạy
reports/junit.xml              # JUnit report
test-results/                  # Trace, video, screenshot khi thất bại
```

`tests/example.spec.ts` và `e2e/example.spec.ts` là starter đã có sẵn, được giữ nguyên.
Config bỏ qua `tests/example.spec.ts`; thư mục `e2e/` nằm ngoài `testDir`.

## Cài đặt và chạy

Yêu cầu Node.js 22+ và kết nối mạng nội bộ/VPN có thể truy cập domain `.ynm.local`.

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm run test:login
```

Không cần `.env` để chạy các test validation: URL mặc định đã được cấu hình.
Để thay URL hoặc chạy test tài khoản hợp lệ:

```bash
cp .env.example .env
```

Điền cả `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_SUCCESS_PATH` trong `.env`.
`LOGIN_SUCCESS_PATH` là đường dẫn chính xác sau khi đăng nhập thành công, gồm query/hash
nếu ứng dụng có sử dụng. Chưa có thông tin thực tế nên project không đoán đường dẫn này.
Biến môi trường từ shell/CI được ưu tiên hơn `.env`.

```bash
npm run test:login:headed
npm run test:smoke
npm run test:ui
npm run test:login -- --grep LOGIN-003
npm run test:login -- --grep LOGIN-005
npm run report
```

`test:ui` mở Playwright UI Mode; `test:login:headed` chạy test với cửa sổ browser.

## Các test demo

| ID | Nội dung | Cần tài khoản |
| --- | --- | --- |
| LOGIN-001 | Form, input, nút Sign in hiển thị; mật khẩu được che | Không |
| LOGIN-002 | Bỏ trống email và mật khẩu | Không |
| LOGIN-003 | Email sai định dạng | Không |
| LOGIN-004 | Chỉ nhập email, thiếu mật khẩu | Không |
| LOGIN-005 | Login hợp lệ chuyển đến URL cấu hình và rời form login | Có |

LOGIN-005 được skip có lý do khi cả ba biến login để trống. Cấu hình thiếu một phần
sẽ báo lỗi để tránh hiểu nhầm là đã kiểm tra đăng nhập thành công.
Sau khi biết trang đích thực tế, nên bổ sung assertion cho một phần tử chỉ xuất hiện
khi đã đăng nhập (ví dụ menu tài khoản) vào LOGIN-005.

Các test validation dùng dữ liệu giả, không thử mật khẩu sai trên tài khoản thật.
Không thêm test thông báo sai tài khoản vì chưa xác minh nội dung lỗi đó.

## Locator và quy ước

- DOM thực tế chưa có `data-testid`; label chưa liên kết bằng `for`/`id`.
- Dùng placeholder `Enter your email`, `Enter your password` và role button `Sign in`.
- Error text thực tế: `Email address is required`, `Email address is invalid`, `Password is required`.
- Test chứa assertion; page object chỉ chứa locator và hành động.
- Dùng fixture, mỗi test có browser context mới; riêng suite login luôn bắt đầu chưa đăng nhập.
- Không dùng sleep, XPath hoặc CSS phụ thuộc layout.
- File dùng `kebab-case`, class dùng `PascalCase`, biến/hàm dùng `camelCase`.

## Report và credential

HTML: `npm run report`. Khi validation fail, xem trace/video/screenshot trong report.
Suite sử dụng tài khoản thật tắt trace/video/screenshot để tránh ghi credential.
Không ghi credential vào test title hoặc log. `.env`, session và output đều được gitignore.
Không cần `storageState` tái sử dụng ở demo login vì chính thao tác login đang được kiểm thử.

Workflow GitHub Actions có sẵn vẫn dùng runner công cộng. Domain nội bộ cần runner
có network/DNS phù hợp; chưa thêm GitLab CI vì phạm vi hiện tại chỉ là cấu trúc và demo login.
