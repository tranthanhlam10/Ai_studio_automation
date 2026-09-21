import { existsSync } from 'node:fs';
import path from 'node:path';

// Node 22 có sẵn bộ đọc .env, tránh phụ thuộc vào module resolution của editor.
// Biến môi trường đã có sẵn từ shell/CI vẫn được giữ nguyên.
const envFile = path.resolve(__dirname, '../.env');
if (typeof process.loadEnvFile === 'function' && existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const baseURL = new URL(
  process.env.BASE_URL ?? 'http://studio-testing.ynm.local',
);

if (!['http:', 'https:'].includes(baseURL.protocol)) {
  throw new Error('BASE_URL phải là URL http hoặc https.');
}

const loginEmail = process.env.LOGIN_EMAIL?.trim() ?? '';
const loginPassword = process.env.LOGIN_PASSWORD ?? '';
const loginSuccessPath = process.env.LOGIN_SUCCESS_PATH?.trim() ?? '';
const hasLoginConfig = Boolean(loginEmail || loginPassword || loginSuccessPath);

if (hasLoginConfig && !(loginEmail && loginPassword && loginSuccessPath)) {
  throw new Error('Cần điền đủ LOGIN_EMAIL, LOGIN_PASSWORD và LOGIN_SUCCESS_PATH.');
}

if (loginSuccessPath && (!loginSuccessPath.startsWith('/') || loginSuccessPath.startsWith('//'))) {
  throw new Error('LOGIN_SUCCESS_PATH phải là đường dẫn nội bộ bắt đầu bằng /.');
}

if (loginSuccessPath && new URL(loginSuccessPath, baseURL).pathname === '/auth/login') {
  throw new Error('LOGIN_SUCCESS_PATH phải là trang sau khi đăng nhập thành công.');
}

export const env = Object.freeze({
  baseURL: baseURL.origin,
  loginEmail,
  loginPassword,
  loginSuccessPath,
  hasLoginCredentials: Boolean(loginEmail && loginPassword && loginSuccessPath),
});
