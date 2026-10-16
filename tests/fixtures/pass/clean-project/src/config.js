// 凭据一律从环境变量读，代码里不出现字面量。
// 下面这些名字看起来像密钥，但值全部来自环境 —— 不应该被判定为泄露。

export const config = {
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  githubToken: process.env.GITHUB_TOKEN,
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  requestTimeoutMs: 8000,
};

// 最常见的反例：变量名叫 secretKey，值却是环境变量引用。
export const secretKey = process.env.SECRET;

// 本地兜底常量：全小写十六进制，形态上不是密钥，只是缓存键前缀。
export const FALLBACK_CACHE_TOKEN = 'a3f5c9e1b7d2048f6a1c3e5b9d7f0a2c';

export default config;
