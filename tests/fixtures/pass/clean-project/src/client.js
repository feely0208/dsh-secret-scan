// 这些都是界面文案、协议常量、配置项名 —— 不是凭据。
// 用它们验证扫描器不会因为变量名里带 password / token / key 就乱报。

export const PASSWORD_FIELD_LABEL = '请输入密码';
export const RETRY_PASSWORD_HINT = 'please-use-a-password-manager-for-this-account';
export const API_KEY_HEADER = 'X-API-Key';
export const TOKEN_TYPE = 'Bearer';
export const SECRET_KEY_NAME = 'APP_SECRET_KEY';
export const CACHE_TOKEN_PREFIX = 'cache:';
export const SESSION_TOKEN_TTL_SECONDS = 3600;

export function authHeader(tokenType, value) {
  return `${tokenType} ${value}`;
}
