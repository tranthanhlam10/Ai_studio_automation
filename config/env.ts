import { existsSync } from 'node:fs';
import path from 'node:path';

const environment = process.env.TEST_ENV ?? 'testing';
if (environment !== 'testing' && environment !== 'staging') {
  throw new Error('TEST_ENV must be either testing or staging.');
}

const envFiles = [`.env.${environment}`, ...(environment === 'testing' ? ['.env'] : [])];
for (const name of envFiles) {
  const envFile = path.resolve(__dirname, '..', name);
  if (typeof process.loadEnvFile === 'function' && existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
}

const defaultBaseURLs = {
  testing: 'http://studio-testing.ynm.local/',
  staging: 'https://studio-staging.younetmedia.com/',
};
const baseURL = new URL(
  process.env.BASE_URL ?? defaultBaseURLs[environment],
);

if (!['http:', 'https:'].includes(baseURL.protocol)) {
  throw new Error('BASE_URL must be an HTTP or HTTPS URL.');
}

const loginEmail = process.env.LOGIN_EMAIL?.trim() ?? '';
const loginPassword = process.env.LOGIN_PASSWORD ?? '';
const loginSuccessPath = process.env.LOGIN_SUCCESS_PATH?.trim() ?? '';
const hasLoginConfig = Boolean(loginEmail || loginPassword || loginSuccessPath);

if (hasLoginConfig && !(loginEmail && loginPassword && loginSuccessPath)) {
  throw new Error('Set LOGIN_EMAIL, LOGIN_PASSWORD, and LOGIN_SUCCESS_PATH together.');
}

if (loginSuccessPath && (!loginSuccessPath.startsWith('/') || loginSuccessPath.startsWith('//'))) {
  throw new Error('LOGIN_SUCCESS_PATH must be an internal path starting with /.');
}

if (loginSuccessPath && new URL(loginSuccessPath, baseURL).pathname === '/auth/login') {
  throw new Error('LOGIN_SUCCESS_PATH must point to the page shown after a successful login.');
}

export const env = Object.freeze({
  environment,
  baseURL: baseURL.origin,
  loginEmail,
  loginPassword,
  loginSuccessPath,
  hasLoginCredentials: Boolean(loginEmail && loginPassword && loginSuccessPath),
});
