#!/bin/bash
# 双向验证：正例必须报，反例必须不报（误报是安全工具的头号杀手）
set -uo pipefail
export PATH="/usr/local/bin:$PATH"
cd "$(dirname "$0")/.."
PASS=0; FAIL=0
ok(){ echo "  ✅ $1"; PASS=$((PASS+1)); }
bad(){ echo "  ❌ $1"; FAIL=$((FAIL+1)); }

RULE_IDS="SECRET-AWS-AKID SECRET-GITHUB-TOKEN SECRET-PRIVATE-KEY SECRET-SLACK-TOKEN SECRET-STRIPE-LIVE SECRET-STRIPE-PUBLISHABLE SECRET-CREDENTIAL-LITERAL"

echo ""; echo "  @deepwhale-cn/dsh-secret-scan · 双向验证"
echo "  ────────────────────────────────────────────────"

FAIL_JSON=$(mktemp); PASS_JSON=$(mktemp)
trap 'rm -f "$FAIL_JSON" "$PASS_JSON"' EXIT

node bin/cli.mjs --root tests/fixtures/fail/demo-project --json > "$FAIL_JSON" 2>&1
node bin/cli.mjs --root tests/fixtures/pass/clean-project --json > "$PASS_JSON" 2>&1

echo ""; echo "  【正例】像真实项目的违规样本（每条规则都必须报出）"
for rid in $RULE_IDS; do
  c=$(F="$FAIL_JSON" R="$rid" python3 -c "
import json,os
d=json.load(open(os.environ['F'],encoding='utf-8'))
print(len([f for f in d.get('findings',[]) if f.get('ruleId')==os.environ['R']]))" 2>/dev/null)
  [ "${c:-0}" -gt 0 ] && ok "$rid 报出（$c 处）" || bad "$rid 未报出 —— 死规则"
done

echo ""; echo "  【反例】干净样本（必须 0 命中）"
M=$(F="$PASS_JSON" python3 -c "
import json,os
print(json.load(open(os.environ['F'],encoding='utf-8'))['stats']['findings'])" 2>/dev/null)
[ "${M:-1}" = "0" ] && ok "0 命中" || bad "误报 ${M} 条"

echo ""; echo "  【防假绿】正例真的扫到了文件"
S=$(F="$FAIL_JSON" python3 -c "
import json,os
print(json.load(open(os.environ['F'],encoding='utf-8'))['stats']['scannedFiles'])" 2>/dev/null)
[ "${S:-0}" -ge 7 ] && ok "扫描 ${S} 个文件" || bad "只扫到 ${S} 个文件，扫描范围可能不对"

echo ""; echo "  【不落原值】报告里不得出现样本密钥的完整值"
F="$FAIL_JSON" python3 - <<'PY' && ok "证据字段只有前缀/变量名，无密钥原值" || bad "报告里出现了密钥原值 —— 工具自己成了泄露源"
import json, os
BAD = ['IOSFODNN7EXAMPLE', 'wJalrXUtnFEMI/K7MDENG', '16C7e42F292c6912E7710c838347Ae178B4a',
       'xoxb-123456789012', 'sk_live_51H8xYz', 'pk_live_51H8xYz',
       '2f9aC7bE4d1F8a3B6c0D9e2F5a8B1c4D7e0F3a6B', 'b3BlbnNzaC1rZXk']
d = json.load(open(os.environ['F'], encoding='utf-8'))
leaks = [(f.get('ruleId'), n) for f in d.get('findings', [])
         for n in BAD if n in ((f.get('evidence') or '') + (f.get('excerpt') or ''))]
if leaks:
    print('  泄露：', leaks)
    raise SystemExit(1)
raise SystemExit(0)
PY

echo ""; echo "  【溯源】每条规则必须带可查证的 source"
python3 - <<'PY' && ok "全部规则均有 source" || bad "有规则缺 source"
import json, glob, sys
bad = [json.load(open(f, encoding='utf-8')).get('id') for f in glob.glob('rules/*.json')
       if not json.load(open(f, encoding='utf-8')).get('source')]
if bad:
    print('  缺 source:', bad); sys.exit(1)
sys.exit(0)
PY

echo ""; echo "  ────────────────────────────────────────────────"
echo "  通过 $PASS · 失败 $FAIL"; echo ""
[ "$FAIL" -eq 0 ] || exit 1
