# acme-notify-service

Acme 的支付回调与通知服务。接收支付网关的回调，转发到 Slack 频道。

## 现状（待处理）

上线赶时间，AWS / GitHub / Slack / Stripe 的凭据还直接写在 `src/` 下面，
部署用的私钥也还在 `deploy/id_rsa`。下一步要挪到平台的密钥服务里。

## 本地运行

```bash
export DB_HOST=127.0.0.1 DB_USER=notify_svc
npm start
```

`src/db.js` 是正确写法的参考：凭据只从环境变量读。
