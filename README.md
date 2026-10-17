# @deepwhale-cn/dsh-secret-scan

[![Listed on DSH Plugin Hub](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/zh/plugins/feely0208/dsh-secret-scan)

**密钥与敏感信息扫描** —— 给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 用的 skill 插件。

提交前、发布前、开源前，把不该出现在代码里的东西找出来。

这是这一组技能里唯一**通用**的（不限中国大陆）—— 因为"密钥进了仓库"是所有技术团队都会踩的坑。

## 它能扫出什么（7 条规则）

技能负责「怎么处理」，规则引擎负责「有没有」。一条命令出证据：

```bash
dsh-secret-scan --root <项目路径>   # 扫一遍
dsh-secret-scan --demo             # 看内置演示样本
dsh-secret-scan --list-rules       # 列出规则与依据
```

| 规则 | 查什么 | 级别 |
|---|---|---|
| `SECRET-PRIVATE-KEY` | PEM 私钥块（标签 + 后面真跟着密钥正文）| 严重 |
| `SECRET-AWS-AKID` | `AKIA` + 16 位 | 高 |
| `SECRET-GITHUB-TOKEN` | `gh[pousr]_` / `github_pat_` | 高 |
| `SECRET-SLACK-TOKEN` | `xox[baprs]-` / `xapp-` | 高 |
| `SECRET-STRIPE-LIVE` | `sk_live_` / `rk_live_` | 高 |
| `SECRET-CREDENTIAL-LITERAL` | 变量名含 secret/token/password + 高熵字面量 | 中 |
| `SECRET-STRIPE-PUBLISHABLE` | `pk_live_` —— **Stripe 官方说可公开，故单列低级别** | 低 |

**输出不落原值**：正则只消费前缀或变量名，密钥正文放在零宽断言里，
所以报告里的证据是 `AKIA` / `ghp_` / `secretAccessKey` 这种，**不含密钥本身**。

**只写标签不写正文不报**（文档里贴格式示意不误报）；`process.env.SECRET` 这类不报。

**已知边界**：`.pem` / `.key` / `.p12` 文件本体不被引擎当文本读（core 的扩展名名单没收录），
直接放 `server.pem` 会漏；同样私钥写成 `id_rsa` 或贴进代码/文档则能命中。报告会如实列出「跳过文件」。

## 它查什么

| 类别 | 内容 |
|---|---|
| 🔴 **高置信令牌** | 云厂商 Access Key（AKIA/LTAI/AKID）、GitHub/npm/Slack 令牌、Google API Key |
| 🔴 **私钥与证书** | `id_rsa`、`*.pem`/`*.p12`/`*.jks`，以及嵌在代码里的 PEM 私钥内容 |
| 🔴 **凭据文件进了 git** | `.env`、`credentials.json`、`.npmrc` 等是否已被 `git ls-files` 跟踪 |
| 🟠 **配置里的敏感赋值** | `password=` / `token=` / `api_key=` 这类硬编码（误报较多，逐条看） |
| 🟠 **内部信息** | 内网 IP（`10.` / `192.168.` / `172.16-31.`）、内部域名（`.corp` / `.internal`） |

**退出码 1 = 有高置信命中**，可直接挂到 pre-commit 或 CI 上。

## 两条刻意的设计

**1. 输出默认打码**（只留前后 4 位）。

扫描工具把完整密钥打进终端或日志，等于换个地方又泄露一次。要看全必须显式 `--reveal`，
而且别把输出存进文件或贴进聊天。

**2. 技能正文里，处置顺序比扫描本身更重要**：

```
1. 轮换密钥  →  2. 清理代码  →  3. 再决定要不要改写历史
```

**删代码不会让已泄露的密钥失效** —— 它还在 git 历史、已推送的远端副本、CI 日志与缓存、
你的 shell 历史和编辑器备份里。判断标准很简单：**这个密钥有没有离开过你的机器？**

一个只教人"删掉就好"的工具，是在帮倒忙。

## 误报怎么办

文档里的示例值（`your-api-key-here`、`sk-example-...`）**已自动过滤**。测试用的假密钥建议
写成含 `example` / `dummy` 的明显假值，同样会被过滤。

剩下的 🟠 逐条看上下文 —— 但**别因为误报多就不看报告了**，那正是这类工具失效的方式。

## 安装

```bash
dsh plugin --profile <profile> add @deepwhale-cn/dsh-secret-scan
```

## 用法

```bash
# 脚本路径由插件注册时注入到技能正文里，或到安装目录找 skill/scan.sh
scan.sh --dir /path/to/repo          # 默认打码
scan.sh --dir /path/to/repo --reveal # ⚠️ 打印完整密钥，仅排障时用
```

## 与相邻技能的边界

| 包 | 管什么 |
| --- | --- |
| **`dsh-secret-scan`** | **内部信息进了代码仓库**（该不该提交、提交了怎么补救） |
| `dsh-cn-compliance` 的 I 类 | **内部文件的公网暴露面**（被搜索引擎或公开链接读到） |

两者的交集是"内部信息"，但一个看**版本控制**，一个看**暴露面**。

## 许可

MIT

---

## 深鲸网安守护系列（共 31 个）

> 一个插件做一件事。**安全问题是链式的** —— 配套用才完整。

**国内合规** ｜ [等保对照](https://github.com/feely0208/dsh-cn-mlps) · [日志留存](https://github.com/feely0208/dsh-cn-log-retention) · [备案公示](https://github.com/feely0208/dsh-cn-filing) · [用户同意](https://github.com/feely0208/dsh-consent-guard) · [个人信息权利](https://github.com/feely0208/dsh-data-rights) · [未成年人保护](https://github.com/feely0208/dsh-minor-guard) · [影响评估](https://github.com/feely0208/dsh-pipia) · [数据分类分级](https://github.com/feely0208/dsh-data-classify) · [算法备案](https://github.com/feely0208/dsh-algorithm-filing) · [数据出境](https://github.com/feely0208/dsh-cn-data-export) · [国密合规](https://github.com/feely0208/dsh-cn-crypto) · [AI 内容标识](https://github.com/feely0208/dsh-cn-ai-labeling)

**AI 与 Agent 治理** ｜ [AI 输出信任](https://github.com/feely0208/dsh-ai-output-trust) · [外部内容信任](https://github.com/feely0208/dsh-content-trust) · [MCP 安全](https://github.com/feely0208/dsh-mcp-audit) · [Agent 权限](https://github.com/feely0208/dsh-agent-scope) · [策略核对](https://github.com/feely0208/dsh-agent-policy) · [可疑指令](https://github.com/feely0208/dsh-phishing-guard)

**数据与凭据** ｜ [敏感数据](https://github.com/feely0208/dsh-data-scan) · [密钥轮换](https://github.com/feely0208/dsh-key-rotate) · [数据留存](https://github.com/feely0208/dsh-data-lifecycle) · [配置审计](https://github.com/feely0208/dsh-env-audit) · [**密钥扫描**](https://github.com/feely0208/dsh-secret-scan)

**供应链与构建** ｜ [开源许可](https://github.com/feely0208/dsh-license-guard) · [依赖投毒](https://github.com/feely0208/dsh-dep-audit) · [CI 安全](https://github.com/feely0208/dsh-ci-guard) · [工具审查](https://github.com/feely0208/dsh-tool-vet) · [物料清单](https://github.com/feely0208/dsh-sbom)

**权限与应急** ｜ [最小权限](https://github.com/feely0208/dsh-least-privilege) · [告警外发](https://github.com/feely0208/dsh-alert-relay) · [应急证据包](https://github.com/feely0208/dsh-incident-package)

都在 DSH 插件市场（dsh-plugin.org）、npm 和 deepwhale.org.cn/guard.html 上。
