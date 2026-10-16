// 这个文件是对的写法：凭据一律从环境变量取，仓库里不放字面量。
export function dbConfig() {
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    token: process.env.DB_TOKEN,
  };
}
