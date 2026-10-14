# Review cấu trúc Playwright — 2026-10-06

## Phạm vi và kết luận

Review tĩnh cấu trúc locator, Page Object, component, fixture và hai nhóm test `auth`/`keyword`. Cách chia `tests → fixtures → pages → components` là nền tảng hợp lý. Phần Login tương đối rõ ràng; phần Keyword cần sửa locator và hành vi component trước khi mở rộng test.

Chưa chạy test UI hoặc đối chiếu DOM thực tế của Studio, nên những nhận xét về khả năng locator khớp phần tử là đánh giá từ mã nguồn. `npm run typecheck` chạy thành công; `npx playwright test --list` tìm thấy 7 test trong 3 file.

## Các phát hiện, theo thứ tự ưu tiên

### P0 — Credential nằm trong file được Git theo dõi

- **Vị trí:** [`fixtures/use-fixtures/auth.fixture.ts`](../../fixtures/use-fixtures/auth.fixture.ts#L9-L12).
- Fixture chứa trực tiếp email và mật khẩu đăng nhập. File này đang được Git theo dõi; `.gitignore` không bảo vệ được credential đã nằm trong file được theo dõi.
- **Đề xuất:** Đọc credential từ biến môi trường hoặc CI secret và kiểm tra cấu hình trước khi chạy test cần đăng nhập. Nếu đây là tài khoản thật, đổi mật khẩu và kiểm tra các commit đã chứa giá trị cũ. Không in credential vào report, log hoặc trace.

### P1 — Hai locator Keyword cùng trỏ tới một text

- **Vị trí:** [`pages/keyword.page.ts`](../../pages/keyword.page.ts#L19-L27), [`tests/keyword/keyword.spec.ts`](../../tests/keyword/keyword.spec.ts#L11-L14).
- `campaignTrackingInput` và `brandTrackingInput` có cùng biểu thức `getByText(...)`. Tên gọi là `Input` nhưng locator tìm text. `KEYWORD-001` vì vậy không chứng minh được hai trường độc lập đều hiển thị, và cũng chưa kiểm tra trường có nhập được hay không.
- **Đề xuất:** Xác định đúng phần tử trong DOM, dùng label/role/test id riêng cho từng trường. Nếu mục tiêu là kiểm tra ô nhập, dùng `toBeEditable()`; nếu là thẻ tổng quan, đổi tên locator theo đúng phần tử và kiểm tra nội dung tương ứng.

### P1 — Tên nút và hành động trong Filter không khớp

- **Vị trí:** [`components/common/common.filter.ts`](../../components/common/common.filter.ts#L10-L31), [`components/keyword.filter.ts`](../../components/keyword.filter.ts#L9-L12).
- `btnApply` tìm nút **Reset**, `btnClose` tìm nút **Apply**, còn `btnClear` tìm icon nằm trong heading. `filterByKeyword()` hiện chỉ bấm mở filter, chưa nhập hoặc áp dụng điều kiện lọc.
- **Đề xuất:** Đặt locator/method theo hành vi thật (`open`, `reset`, `apply`, `close`). Tạo `filterByKeyword(value)` chỉ khi method thực hiện đầy đủ việc nhập giá trị và áp dụng lọc; nếu chỉ mở panel, đặt tên `openFilter()`.

### P1 — Locator của cùng màn hình bị phân tán

- **Vị trí:** [`data/keyword.locators.ts`](../../data/keyword.locators.ts#L6-L90), [`pages/keyword.page.ts`](../../pages/keyword.page.ts#L13-L29), [`components/common/common.filter.ts`](../../components/common/common.filter.ts#L9-L16).
- `getKeywordLocators()` chưa được import hoặc sử dụng, trong khi Page Object và Filter cũng định nghĩa locator cho màn hình Keyword. Hai hướng song song dễ lệch nhau khi UI thay đổi. File `data/keyword.locators.ts` hiện cũng chưa được Git theo dõi.
- **Đề xuất:** Chọn một nguồn locator trong `KeywordPage` và các component mà page sở hữu. Để `data/` chứa dữ liệu đầu vào; bỏ file locator dư hoặc chuyển những locator cần dùng vào đúng page/component sau khi kiểm chứng DOM.

### P2 — Một số locator phụ thuộc chi tiết DOM hoặc chữ trên icon

- **Vị trí:** [`pages/keyword.page.ts`](../../pages/keyword.page.ts#L15-L28), [`components/common/common.filter.ts`](../../components/common/common.filter.ts#L10-L16), [`data/keyword.locators.ts`](../../data/keyword.locators.ts#L11-L13).
- `navigationButton` lọc theo `description`, không phải accessible `name`; cần kiểm tra xem link có thực sự có accessible description hay không. Các tên như `"filter 󰝥"` hoặc `"reload Refresh"` phụ thuộc ký tự icon. `locator('..').locator('..')` phụ thuộc số lớp DOM cha. `.first()` có thể chọn nhầm khi thứ tự phần tử đổi.
- **Đề xuất:** Ưu tiên `getByRole(..., { name: ... })`, `getByLabel(...)`, hoặc `getByTestId(...)` với hợp đồng test ổn định. Scope locator vào panel/dialog/table trước khi tìm nút hoặc input. Với UI hiện chưa có label liên kết, `getByPlaceholder()` trong Login là lựa chọn thực dụng; nên bổ sung label/test id ở ứng dụng nếu có thể.

### P2 — Test Keyword mới kiểm tra hiển thị, chưa kiểm tra hành vi

- **Vị trí:** [`tests/keyword/keyword.spec.ts`](../../tests/keyword/keyword.spec.ts#L7-L24).
- `KEYWORD-001` mang tên “có hoạt động” nhưng chỉ `toBeVisible()`. `KEYWORD-002` kiểm tra một nút trong filter hiện ra sau click; chưa chứng minh điều kiện lọc được áp dụng hoặc bảng kết quả thay đổi.
- **Đề xuất:** Đặt tên test theo điều thực sự kiểm tra. Với test lọc, chọn một điều kiện có dữ liệu xác định, áp dụng và assertion vào chip/giá trị trường/bảng kết quả hoặc request phù hợp với yêu cầu nghiệp vụ.

### P3 — Component kế thừa chưa đem lại giá trị rõ ràng

- **Vị trí:** [`components/common/common.filter.ts`](../../components/common/common.filter.ts#L3-L33), [`components/keyword.filter.ts`](../../components/keyword.filter.ts#L4-L12).
- `KeywordFilter` chỉ kế thừa `CommonFilter` và gọi lại một hành động. Lớp `abstract` làm tăng số file phải đọc nhưng hiện chưa thể hiện biến thể Filter ở các trang khác.
- **Đề xuất:** Dùng một `KeywordFilterPanel` nhận root `Locator` và quản lý các trường/nút trong panel. Chỉ tách thành component dùng chung khi có ít nhất một vùng UI thực sự dùng lại hoặc component có nhiều hành vi độc lập. `KeywordPage` nên sở hữu component theo kiểu composition.

## Cấu trúc đề xuất tối thiểu

```text
tests/keyword/keyword.spec.ts        # Kịch bản và assertion nghiệp vụ
pages/keyword.page.ts                # Điều hướng, vùng tổng quan, toolbar
components/keyword-filter.component.ts # Locator và hành động trong filter panel
data/keyword.data.ts                 # Giá trị đầu vào phục vụ test (khi cần)
fixtures/use-fixtures/test.fixture.ts # Khởi tạo KeywordPage
```

Ví dụ hướng dùng (tên locator/root cần xác nhận bằng DOM thực tế):

```ts
await keywordPage.open();
await keywordPage.filter.open();
await keywordPage.filter.selectStatus('Crawling');
await keywordPage.filter.apply();
await expect(keywordPage.activeStatusFilter).toHaveText('Crawling');
```

Giữ assertion ở test để expected result rõ ràng; Page Object và component cung cấp locator cùng thao tác có tên theo ý định người dùng.

## Thứ tự xử lý

1. Gỡ credential khỏi fixture, đổi credential nếu đang có hiệu lực, và kiểm tra lịch sử Git.
2. Sửa các locator bị trùng/sai và ánh xạ lại nút Filter theo DOM thực tế.
3. Gom locator Keyword vào Page Object/component, bỏ nguồn định nghĩa không sử dụng.
4. Đổi tên method/test cho đúng hành vi, bổ sung assertion chứng minh lọc hoạt động.

## Tài liệu tham khảo

- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Page Object Models](https://playwright.dev/docs/pom)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright Authentication](https://playwright.dev/docs/auth)
