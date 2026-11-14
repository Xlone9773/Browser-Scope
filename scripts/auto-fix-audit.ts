/**
 * auto-fix-audit.ts — 依赖漏洞自动修复引擎
 *
 * 流程:
 *   1. 在内存中对 package.json 与 package-lock.json 做快照 (不污染仓库 .bak)
 *   2. 运行 npm audit --json 并解析报告 (兼容非零退出码 stdout)
 *   3. Pass A: 对 fixAvailable === true 的项执行非破坏性 npm audit fix
 *   4. Pass B: 重新扫描剩余漏洞，对非 Major 项做精准直接依赖升级或 overrides
 *   5. 同步安装并做回滚保护；若安装失败则立即还原快照
 *   6. 复跑 npm audit --json 验证最终收敛结果，输出 Step Summary / PR 摘要
 *
 * 用法:
 *   npx tsx scripts/auto-fix-audit.ts [--dry-run] [--pr-summary=path/to/summary.md]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  AuditResult,
  PackageJsonShape,
  applyPackageJsonPatches,
  countAuditVulnerabilities,
  diffDirectAndOverrideChanges,
  extractRemainingVulnerabilities,
  parseAuditJson,
  renderAuditSummaryMarkdown,
  triageVulnerabilities,
} from './lib/auditFix';

const PKG_PATH = path.join(process.cwd(), 'package.json');
const LOCK_PATH = path.join(process.cwd(), 'package-lock.json');

interface RepoSnapshot {
  pkgRaw: string;
  lockRaw: string | null;
}

function captureSnapshot(): RepoSnapshot {
  const pkgRaw = fs.readFileSync(PKG_PATH, 'utf8');
  const lockRaw = fs.existsSync(LOCK_PATH) ? fs.readFileSync(LOCK_PATH, 'utf8') : null;
  return { pkgRaw, lockRaw };
}

function restoreSnapshot(snapshot: RepoSnapshot): void {
  fs.writeFileSync(PKG_PATH, snapshot.pkgRaw);
  if (snapshot.lockRaw !== null) {
    fs.writeFileSync(LOCK_PATH, snapshot.lockRaw);
  } else if (fs.existsSync(LOCK_PATH)) {
    fs.unlinkSync(LOCK_PATH);
  }
}

function runAuditCommand(): AuditResult | null {
  try {
    const raw = execSync('npm audit --json', { encoding: 'utf8', timeout: 120_000 });
    return parseAuditJson(raw);
  } catch (err: unknown) {
    const stdout = (err as { stdout?: unknown }).stdout;
    if (typeof stdout === 'string' && stdout.trim()) {
      return parseAuditJson(stdout);
    }
    if (Buffer.isBuffer(stdout)) {
      return parseAuditJson(stdout.toString('utf8'));
    }
    return null;
  }
}

function runCommandSafe(cmd: string, timeoutMs: number): boolean {
  try {
    execSync(cmd, { encoding: 'utf8', timeout: timeoutMs, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function readPackageJson(): PackageJsonShape {
  return JSON.parse(fs.readFileSync(PKG_PATH, 'utf8')) as PackageJsonShape;
}

function getPrSummaryPath(argv: string[]): string | null {
  const arg = argv.find((item) => item.startsWith('--pr-summary='));
  if (!arg) return null;
  const val = arg.slice('--pr-summary='.length).trim();
  return val || null;
}

function ensureLockfileForAudit(): boolean {
  if (fs.existsSync(LOCK_PATH)) {
    return false;
  }
  console.log('未检测到 package-lock.json，正在临时生成锁文件以运行 npm audit...');
  const ok = runCommandSafe(
    'npm install --package-lock-only --ignore-scripts --no-fund --no-audit',
    180_000
  );
  if (!ok) {
    // Fallback with --legacy-peer-deps in case peer ranges are strict
    runCommandSafe(
      'npm install --package-lock-only --ignore-scripts --legacy-peer-deps --no-fund --no-audit',
      180_000
    );
  }
  return fs.existsSync(LOCK_PATH);
}

function main(): void {
  const dryRun = process.argv.includes('--dry-run');
  const prSummaryPath = getPrSummaryPath(process.argv.slice(2));

  if (!fs.existsSync(PKG_PATH)) {
    console.error('package.json 不存在，跳过审计修复。');
    process.exit(0);
  }

  const initialSnapshot = captureSnapshot();
  const initialPkg = JSON.parse(initialSnapshot.pkgRaw) as PackageJsonShape;
  const createdTempLock = ensureLockfileForAudit();

  const initialAudit = runAuditCommand();
  if (!initialAudit) {
    if (createdTempLock) {
      restoreSnapshot(initialSnapshot);
    }
    console.error('npm audit 执行或解析失败，跳过修复。');
    process.exit(0);
  }

  const beforeTotal = countAuditVulnerabilities(initialAudit);
  const initialTriage = triageVulnerabilities(initialAudit, initialPkg);

  if (dryRun) {
    const previewPatch = applyPackageJsonPatches(
      initialPkg,
      initialTriage.toOverride,
      initialTriage.toUpgrade
    );
    const markdown = renderAuditSummaryMarkdown({
      beforeTotal,
      afterTotal: null,
      compatibleFixPackages: initialTriage.compatibleFixPackages,
      appliedChanges: previewPatch.changes,
      toReport: initialTriage.toReport,
      remaining: extractRemainingVulnerabilities(initialAudit),
      dryRun: true,
    });

    if (createdTempLock) {
      restoreSnapshot(initialSnapshot);
    }

    console.log(markdown);
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (summaryFile) {
      fs.appendFileSync(summaryFile, `\n${markdown}\n`);
    }
    if (prSummaryPath) {
      fs.writeFileSync(path.resolve(process.cwd(), prSummaryPath), markdown);
    }
    return;
  }

  // Pass A: 非破坏性 npm audit fix（处理 fixAvailable === true 的兼容更新）
  const prePassALock = fs.existsSync(LOCK_PATH) ? fs.readFileSync(LOCK_PATH, 'utf8') : null;
  if (initialTriage.compatibleFixPackages.length > 0) {
    console.log(
      `Pass A: 尝试执行兼容语义化修复 (${initialTriage.compatibleFixPackages.length} 项)...`
    );
    const ok = runCommandSafe('npm audit fix --no-fund --no-audit', 180_000);
    if (!ok) {
      // 若因 peer 依赖冲突导致退出，尝试 --legacy-peer-deps；注意 npm audit fix 即使修复成功也可能因剩余漏洞返回非零
      runCommandSafe('npm audit fix --legacy-peer-deps --no-fund --no-audit', 180_000);
    }
  }
  const postPassALock = fs.existsSync(LOCK_PATH) ? fs.readFileSync(LOCK_PATH, 'utf8') : null;
  const passAChangedLock = prePassALock !== postPassALock;

  // Pass B: 重新扫描剩余漏洞并进行精准直接升级 / overrides
  const midAudit = runAuditCommand() ?? initialAudit;
  const currentPkg = readPackageJson();
  const midTriage = triageVulnerabilities(midAudit, currentPkg);
  const passB = applyPackageJsonPatches(
    currentPkg,
    midTriage.toOverride,
    midTriage.toUpgrade
  );

  let installFailed = false;
  if (passB.changes.length > 0) {
    const prePassBSnapshot = captureSnapshot();
    fs.writeFileSync(PKG_PATH, JSON.stringify(passB.updatedPkg, null, 2) + '\n');
    console.log(`Pass B: 已写入 ${passB.changes.length} 项精确修复，正在同步依赖...`);

    let installed = runCommandSafe('npm install --no-fund --no-audit', 180_000);
    if (!installed) {
      console.warn('标准 npm install 失败，尝试使用 --legacy-peer-deps...');
      installed = runCommandSafe(
        'npm install --legacy-peer-deps --no-fund --no-audit',
        180_000
      );
    }

    if (!installed) {
      console.error('❌ 依赖安装失败，正在回滚至修复前快照...');
      restoreSnapshot(prePassBSnapshot);
      installFailed = true;
    }
  }

  // 验证最终审计状态
  const finalAudit = runAuditCommand();
  const finalPkg = readPackageJson();
  const appliedChanges = diffDirectAndOverrideChanges(initialPkg, finalPkg);
  const finalTriage = finalAudit ? triageVulnerabilities(finalAudit, finalPkg) : midTriage;
  const afterTotal = finalAudit ? countAuditVulnerabilities(finalAudit) : null;
  const remaining = finalAudit ? extractRemainingVulnerabilities(finalAudit) : null;

  // 若仓库原本无锁文件且本次未产生任何真实修复，清理临时生成的 package-lock.json
  if (createdTempLock && appliedChanges.length === 0 && !passAChangedLock) {
    restoreSnapshot(initialSnapshot);
  }

  const markdown = renderAuditSummaryMarkdown({
    beforeTotal,
    afterTotal,
    compatibleFixPackages: initialTriage.compatibleFixPackages,
    appliedChanges,
    toReport: finalTriage.toReport,
    remaining,
    dryRun: false,
    installFailed,
  });

  console.log(markdown);

  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    fs.appendFileSync(summaryFile, `\n${markdown}\n`);
  }

  if (prSummaryPath) {
    fs.writeFileSync(path.resolve(process.cwd(), prSummaryPath), markdown);
  }

  if (installFailed) {
    process.exitCode = 1;
  }
}

main();
