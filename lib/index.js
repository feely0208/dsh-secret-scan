import { createPlugin, pkgRootFrom } from '@deepwhale-cn/dsh-guard-core/plugin';

export const { name, inject, apply } = createPlugin({
  name: 'secret-scan',
  pkgRoot: pkgRootFrom(import.meta.url),
  skillFile: 'skill/secret-scan.md',
  binFile: 'bin/cli.mjs',
  description: '密钥被提交进仓库了吗 —— 扫代码里的密钥字面量（AWS / GitHub / Slack / Stripe / 私钥块）',
  whenToUse: '怀疑或想确认「凭据有没有被写进代码、提交进仓库」时使用。'
    + '用户会说：检查有没有密钥泄露、扫一下有没有硬编码的 key、token 泄露、'
    + 'AWS access key 是不是写死在代码里了、私钥有没有进仓库、'
    + '开源/交付/上线前查一遍凭据、提交前自检、CI 里加一道密钥卡口。'
    + '注意分工：查个人信息（身份证/银行卡/手机号）用 data-scan，'
    + '查 .env 文件本身的配置审计用 env-audit，查密钥轮换周期用 key-rotate。',
});
