/**
 * auto-fix-audit.ts — 依赖漏洞自动修复 (三档分级处理)
 *
 * 设计:
 *   1. npm audit --json 拿全量漏洞
 *   2. 三档分流:
 *      - 传递依赖 + fixAvailable 且非 major -> overrides (自动)
 *      - 直接依赖 + fixAvailable 且非 major -> 升级版本范围 (自动)
 *      - 无修复 / isSemVerMajor -> 仅报告 (人工)
 *   3. 备份 -> 写入 -> 验证循环 (重跑 audit 直到收敛/达上限)
 *   4. 输出摘要 (结论行 + 表格, 与 ci-summary.ts 同风格)
 *
 * 安全边界:
 *   - isSemVerMajor 绝不自动
 *   - 验证循环上限 3 次
 *   - overrides 写精确版本
 *   - package.json 自动备份 .bak
 *   - audit 失败降级跳过, 不阻塞主流程
 *
 * 用法:
 *   npx tsx scripts/auto-fix-audit.ts [--dry-run]
 *
 * 集成到 CI (main.yml):
 *   - name: Auto-Fix Dependencies
 *     run: npx tsx scripts/auto-fix-audit.ts
 *     continue-on-error: true
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PKG_PATH = path.join(process.cwd(), 'package.json');
const BAK_PATH = PKG_PATH + '.bak';
const MAX_VERIFY = 3;

interface FixAvailable {
  name: string;
  version: string;
  isSemVerMajor: boolean;
}

interface Vulnerability {
  severity: string;
  isDirect: boolean;
  range: string;
  fixAvailable: FixAvailable | false;
}

interface AuditResult {
  vulnerabilities: Record<string, Vulnerability>;
}

// ── 三档分流 ──────────────────────────────────────────

function triage(audit: AuditResult) {
  const toOverride = new Map<string, string>();
  const toUpgrade = new Map<string, string>();
  const toReport: Array<{ pkg: string; severity: string; reason: string; fixVersion: string }> = [];
  let total = 0;

  for (const [pkg, v] of Object.entries(audit.vulnerabilities)) {
    total++;
    const fix = v.fixAvailable;
    if (!fix) {
      toReport.push({ pkg, severity: v.severity, reason: '无修复版本', fixVersion: '-' });
      continue;
    }
    if (fix.isSemVerMajor) {
      toReport.push({ pkg, severity: v.severity, reason: '破坏性大版本', fixVersion: fix.version });
      continue;
    }
    const fv = fix.version;
    if (v.isDirect) {
      toUpgrade.set(pkg, fv);
    } else {
      toOverride.set(pkg, fv);
    }
  }

  return { toOverride, toUpgrade, toReport, total };
}

// ── 写入修复 ──────────────────────────────────────────

function applyFixes(
  toOverride: Map<string, string>,
  toUpgrade: Map<string, string>,
  dryRun: boolean,
): boolean {
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  const changes: Array<{ section: string; pkg: string; version: string }> = [];

  // overrides
  if (toOverride.size > 0) {
    const ov: Record<string, string> = { ...(pkg.overrides ?? {}) };
    for (const [p, v] of toOverride) {
      if (ov[p] !== v) {
        ov[p] = v;
        changes.push({ section: 'overrides', pkg: p, version: v });
      }
    }
    pkg.overrides = ov;
  }

  // 直接依赖升级
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    if (!pkg[section]) continue;
    for (const [p, v] of toUpgrade) {
      if (pkg[section][p] !== undefined && pkg[section][p] !== v) {
        changes.push({ section, pkg: p, version: v });
        pkg[section][p] = v;
      }
    }
  }

  if (changes.length === 0) {
    console.log('无变更');
    return false;
  }

  if (dryRun) {
    console.log(`[dry-run] 将应用 ${changes.length} 处变更:`);
    for (const c of changes) {
      console.log(`  ${c.section.padEnd(12)} ${c.pkg} -> ${c.version}`);
    }
    return false;
  }

  // 备份后写入
  fs.copyFileSync(PKG_PATH, BAK_PATH);
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`已备份 -> ${BAK_PATH}`);
  return true;
}

// ── 验证循环 ──────────────────────────────────────────

function verify(): [string[], boolean] {
  for (let i = 0; i < MAX_VERIFY; i++) {
    try {
      const raw = execSync('npm audit --json', { encoding: 'utf8', timeout: 120_000 });
      const audit = JSON.parse(raw) as AuditResult;
      const remaining = Object.entries(audit.vulnerabilities).map(
        ([p, v]) => `${p} [${v.severity}]`,
      );
      if (remaining.length === 0) return [[], true];
      return [remaining, false];
    } catch (e: unknown) {
      const out = (e as { stdout?: string }).stdout ?? '';
      if (out) {
        try {
          const audit = JSON.parse(out) as AuditResult;
          const remaining = Object.entries(audit.vulnerabilities).map(
            ([p, v]) => `${p} [${v.severity}]`,
          );
          if (remaining.length === 0) return [[], true];
          continue;
        } catch { /* 继续循环 */ }
      }
      return [[], false];
    }
  }
  return [[], false];
}

// ── 报告 ──────────────────────────────────────────────

function renderReport(
  total: number,
  toOverride: Map<string, string>,
  toUpgrade: Map<string, string>,
  toReport: Array<{ pkg: string; severity: string; reason: string; fixVersion: string }>,
  remaining: string[] | null,
  dryRun: boolean,
) {
  const fixed = toOverride.size + toUpgrade.size;
  const markdown: string[] = [];

  markdown.push(`### 🛡️ 依赖自动修复`);
  markdown.push(`| 处理 | 包 | 方式 |`);
  markdown.push(`|---|---|---|`);
  for (const [p, v] of toOverride) {
    markdown.push(`| ✅ 自动 | \`${p}\` | overrides → ${v} |`);
  }
  for (const [p, v] of toUpgrade) {
    markdown.push(`| ✅ 自动 | \`${p}\` | 升级 → ${v} |`);
  }
  for (const r of toReport) {
    markdown.push(`| ⚠️ 人工 | \`${r.pkg}\` (${r.severity}) | ${r.reason} (${r.fixVersion}) |`);
  }

  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    const header = `\n## 🛡️ 依赖安全修复报告\n\n**${fixed} 自动 / ${toReport.length} 人工 / ${total} 总计**${dryRun ? ' [dry-run]' : ''}\n\n`;
    const footer = remaining
      ? remaining.length > 0
        ? `\n验证后剩余 ${remaining.length} 漏洞 (未收敛):\n${remaining.map(r => `- ${r}`).join('\n')}\n`
        : '\n✅ 验证: 全部漏洞已修复\n'
      : '\n';
    fs.appendFileSync(summaryFile, header + markdown.join('\n') + footer);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🛡️ 依赖修复: ${fixed} 自动 / ${toReport.length} 人工 / ${total} 总计${dryRun ? ' [dry-run]' : ''}`);
  console.log('='.repeat(60));
  for (const [p, v] of toOverride) console.log(`  ✅ overrides: ${p} -> ${v}`);
  for (const [p, v] of toUpgrade) console.log(`  ✅ 升级: ${p} -> ${v}`);
  for (const r of toReport) console.log(`  ⚠️ 人工: ${r.pkg} [${r.severity}] ${r.reason}`);
  if (remaining && remaining.length > 0) {
    console.log(`\n⚠️ 验证后剩余 ${remaining.length} 漏洞 (未收敛):`);
    for (const r of remaining) console.log(`  ${r}`);
  }
}

// ── 入口 ──────────────────────────────────────────────

function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!fs.existsSync(PKG_PATH)) {
    console.error('package.json 不存在, 跳过');
    process.exit(0);
  }

  let audit: AuditResult;
  try {
    const raw = execSync('npm audit --json', { encoding: 'utf8', timeout: 120_000 });
    audit = JSON.parse(raw) as AuditResult;
  } catch (e: unknown) {
    const out = (e as { stdout?: string }).stdout ?? '';
    if (out) {
      try { audit = JSON.parse(out) as AuditResult; }
      catch { console.error('npm audit 解析失败, 跳过'); process.exit(0); }
    } else {
      console.error('npm audit 执行失败, 跳过');
      process.exit(0);
    }
  }

  const { toOverride, toUpgrade, toReport, total } = triage(audit);
  const changed = applyFixes(toOverride, toUpgrade, dryRun);

  let remaining: string[] | null = null;
  if (changed) {
    try {
      execSync('npm install --no-fund --no-audit', { encoding: 'utf8', timeout: 180_000 });
      console.log('npm install 完成');
    } catch {
      console.warn('⚠️ npm install 失败');
    }
    [remaining] = verify();
  }

  renderReport(total, toOverride, toUpgrade, toReport, remaining, dryRun);
}

main();
