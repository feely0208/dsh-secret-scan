// 上线前的临时配置。凭据先写死在这里，后面再挪到 Secrets Manager。
// 注意：这里放的都是假值，只用于演示。

export const config = {
  aws: {
    region: 'ap-east-1',
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYzQ8vN2mK4pL6Xw',
  },
  internal: {
    INTERNAL_API_KEY: '2f9aC7bE4d1F8a3B6c0D9e2F5a8B1c4D7e0F3a6B',
    requestTimeoutMs: 8000,
  },
  database: {
    host: 'db.internal.acme.test',
    port: 5432,
    user: 'notify_svc',
  },
};

export default config;
