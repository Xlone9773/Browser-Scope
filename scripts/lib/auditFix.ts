export interface FixAvailableObj {
  name: string;
  version: string;
  isSemVerMajor: boolean;
}

export type FixAvailable = boolean | FixAvailableObj;

export interface AuditVulnerability {
  name?: string;
  severity: string;
  isDirect: boolean;
  range?: string;
  fixAvailable: FixAvailable;
  via?: unknown[];
  effects?: string[];
  nodes?: string[];
}

export interface AuditMetadata {
  vulnerabilities?: Record<string, number>;
}

export interface AuditResult {
  auditReportVersion?: number;
  vulnerabilities: Record<string, AuditVulnerability>;
  metadata?: AuditMetadata;
}

export interface PackageJsonShape {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  overrides?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ManualAuditReportItem {
  pkg: string;
  severity: string;
  reason: string;
  fixVersion: string;
  range?: string;
}

export interface TriageResult {
  compatibleFixPackages: string[];
  toOverride: Map<string, string>;
  toUpgrade: Map<string, string>;
  toReport: ManualAuditReportItem[];
  total: number;
}

export interface AppliedChange {
  section: 'dependencies' | 'devDependencies' | 'optionalDependencies' | 'overrides' | 'audit-fix';
  pkg: string;
  from?: string;
  to: string;
}

export interface SummaryReportParams {
  beforeTotal: number;
  afterTotal: number | null;
  compatibleFixPackages: string[];
  appliedChanges: AppliedChange[];
  toReport: ManualAuditReportItem[];
  remaining: Array<{ pkg: string; severity: string }> | null;
  dryRun: boolean;
  installFailed?: boolean;
}

const UPGRADEABLE_SECTIONS = ['dependencies', 'devDependencies', 'optionalDependencies'] as const;

export function parseAuditJson(raw: string): AuditResult | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed) as (Partial<AuditResult> & { error?: unknown }) | null;
    if (!parsed || typeof parsed !== 'object') return null;

    // npm audit --json outputs { error: { code: "ENOLOCK", ... } } without vulnerabilities when lockfile is missing
    if (parsed.error && !parsed.vulnerabilities) {
      return null;
    }

    const vulnerabilities =
      parsed.vulnerabilities && typeof parsed.vulnerabilities === 'object'
        ? (parsed.vulnerabilities as Record<string, AuditVulnerability>)
        : {};

    return {
      auditReportVersion: parsed.auditReportVersion,
      vulnerabilities,
      metadata: parsed.metadata,
    };
  } catch {
    return null;
  }
}

export function extractRemainingVulnerabilities(
  audit: AuditResult
): Array<{ pkg: string; severity: string }> {
  return Object.entries(audit.vulnerabilities || {})
    .map(([pkg, vuln]) => ({
      pkg,
      severity: vuln?.severity || 'unknown',
    }))
    .sort((a, b) => a.pkg.localeCompare(b.pkg));
}

export function countAuditVulnerabilities(audit: AuditResult): number {
  return Object.keys(audit.vulnerabilities || {}).length;
}

export function hasDirectDependency(pkgJson: PackageJsonShape, pkgName: string): boolean {
  return UPGRADEABLE_SECTIONS.some((section) => {
    const map = pkgJson[section];
    return Boolean(map && typeof map === 'object' && Object.prototype.hasOwnProperty.call(map, pkgName));
  });
}

export function formatVersionWithPrefix(existingSpec: string | undefined, targetVersion: string): string {
  const cleanTarget = targetVersion.trim();
  if (!cleanTarget) return existingSpec || '';

  // Keep npm: alias or range specifiers intact if target already specifies them
  if (/^[~^><=]/.test(cleanTarget) || cleanTarget.startsWith('npm:')) {
    return cleanTarget;
  }

  if (!existingSpec) {
    return `^${cleanTarget}`;
  }

  const trimmedSpec = existingSpec.trim();
  if (trimmedSpec.startsWith('~')) {
    return `~${cleanTarget}`;
  }
  if (trimmedSpec.startsWith('^')) {
    return `^${cleanTarget}`;
  }
  // Preserve exact pin (e.g. "4.1.2") when previously pinned without ^/~
  if (/^\d+\.\d+\.\d+/.test(trimmedSpec)) {
    return cleanTarget;
  }
  return `^${cleanTarget}`;
}

export function triageVulnerabilities(
  audit: AuditResult,
  pkgJson?: PackageJsonShape
): TriageResult {
  const compatibleFixPackages: string[] = [];
  const toOverride = new Map<string, string>();
  const toUpgrade = new Map<string, string>();
  const toReport: ManualAuditReportItem[] = [];
  let total = 0;

  const entries = Object.entries(audit.vulnerabilities || {}).sort(([a], [b]) => a.localeCompare(b));

  for (const [pkg, vuln] of entries) {
    if (!vuln || typeof vuln !== 'object') continue;
    total++;

    const fix = vuln.fixAvailable;
    const severity = vuln.severity || 'unknown';
    const range = vuln.range;

    if (fix === false || fix === undefined || fix === null) {
      toReport.push({
        pkg,
        severity,
        reason: '无可用自动修复版本',
        fixVersion: '-',
        range,
      });
      continue;
    }

    if (fix === true) {
      compatibleFixPackages.push(pkg);
      continue;
    }

    if (typeof fix === 'object') {
      const fixName = typeof fix.name === 'string' && fix.name.trim() ? fix.name.trim() : pkg;
      const fixVersion = typeof fix.version === 'string' ? fix.version.trim() : '';

      if (fix.isSemVerMajor) {
        toReport.push({
          pkg,
          severity,
          reason: '破坏性大版本升级 (SemVer Major)',
          fixVersion: fixVersion ? `${fixName}@${fixVersion}` : fixName,
          range,
        });
        continue;
      }

      if (!fixVersion) {
        toReport.push({
          pkg,
          severity,
          reason: '缺少目标修复版本号',
          fixVersion: '-',
          range,
        });
        continue;
      }

      if (fixName === pkg) {
        const isDirectPkg = vuln.isDirect || (pkgJson ? hasDirectDependency(pkgJson, pkg) : false);
        if (isDirectPkg) {
          toUpgrade.set(pkg, fixVersion);
        } else {
          toOverride.set(pkg, fixVersion);
        }
      } else {
        // fix.version belongs to fixName (an upstream package), NOT pkg itself
        if (pkgJson && hasDirectDependency(pkgJson, fixName)) {
          toUpgrade.set(fixName, fixVersion);
        } else {
          toReport.push({
            pkg,
            severity,
            reason: `需通过上游依赖 ${fixName} 修复`,
            fixVersion: `${fixName}@${fixVersion}`,
            range,
          });
        }
      }
    }
  }

  return {
    compatibleFixPackages,
    toOverride,
    toUpgrade,
    toReport,
    total,
  };
}

export function applyPackageJsonPatches(
  pkgJson: PackageJsonShape,
  toOverride: Map<string, string>,
  toUpgrade: Map<string, string>
): { updatedPkg: PackageJsonShape; changes: AppliedChange[] } {
  const updatedPkg: PackageJsonShape = JSON.parse(JSON.stringify(pkgJson)) as PackageJsonShape;
  const changes: AppliedChange[] = [];

  if (toOverride.size > 0) {
    const currentOverrides: Record<string, unknown> =
      updatedPkg.overrides && typeof updatedPkg.overrides === 'object'
        ? { ...updatedPkg.overrides }
        : {};

    for (const [pkg, targetVersion] of toOverride) {
      if (!targetVersion) continue;
      const existing = currentOverrides[pkg];

      // Do not blindly overwrite nested object override rules
      if (existing !== undefined && typeof existing !== 'string') {
        continue;
      }

      const nextSpec = formatVersionWithPrefix(existing, targetVersion);
      if (existing !== nextSpec) {
        currentOverrides[pkg] = nextSpec;
        changes.push({
          section: 'overrides',
          pkg,
          from: existing,
          to: nextSpec,
        });
      }
    }

    if (Object.keys(currentOverrides).length > 0) {
      updatedPkg.overrides = currentOverrides;
    }
  }

  for (const section of UPGRADEABLE_SECTIONS) {
    const sectionDeps = updatedPkg[section];
    if (!sectionDeps || typeof sectionDeps !== 'object') continue;

    for (const [pkg, targetVersion] of toUpgrade) {
      if (!targetVersion) continue;
      const existing = sectionDeps[pkg];
      if (existing === undefined) continue;

      const nextSpec = formatVersionWithPrefix(existing, targetVersion);
      if (existing !== nextSpec) {
        sectionDeps[pkg] = nextSpec;
        changes.push({
          section,
          pkg,
          from: existing,
          to: nextSpec,
        });
      }
    }
  }

  return { updatedPkg, changes };
}

export function diffDirectAndOverrideChanges(
  beforePkg: PackageJsonShape,
  afterPkg: PackageJsonShape
): AppliedChange[] {
  const changes: AppliedChange[] = [];

  for (const section of UPGRADEABLE_SECTIONS) {
    const beforeDeps = beforePkg[section] || {};
    const afterDeps = afterPkg[section] || {};
    const allKeys = new Set([...Object.keys(beforeDeps), ...Object.keys(afterDeps)]);
    for (const pkg of Array.from(allKeys).sort()) {
      if (beforeDeps[pkg] !== afterDeps[pkg] && afterDeps[pkg] !== undefined) {
        changes.push({
          section,
          pkg,
          from: beforeDeps[pkg],
          to: afterDeps[pkg],
        });
      }
    }
  }

  const beforeOv = beforePkg.overrides || {};
  const afterOv = afterPkg.overrides || {};
  const ovKeys = new Set([...Object.keys(beforeOv), ...Object.keys(afterOv)]);
  for (const pkg of Array.from(ovKeys).sort()) {
    const beforeVal = typeof beforeOv[pkg] === 'string' ? beforeOv[pkg] : JSON.stringify(beforeOv[pkg]);
    const afterVal = typeof afterOv[pkg] === 'string' ? afterOv[pkg] : JSON.stringify(afterOv[pkg]);
    if (beforeVal !== afterVal && afterVal !== undefined) {
      changes.push({
        section: 'overrides',
        pkg,
        from: beforeVal,
        to: afterVal,
      });
    }
  }

  return changes;
}

const escapeCell = (val: string): string =>
  val.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

export function renderAuditSummaryMarkdown(params: SummaryReportParams): string {
  const {
    beforeTotal,
    afterTotal,
    compatibleFixPackages,
    appliedChanges,
    toReport,
    remaining,
    dryRun,
    installFailed = false,
  } = params;

  const lines: string[] = [];
  const tag = dryRun ? ' `[dry-run]`' : '';
  const resolvedCount =
    afterTotal !== null ? Math.max(0, beforeTotal - afterTotal) : appliedChanges.length;

  lines.push(`## 🛡️ 依赖安全修复报告${tag}`);
  lines.push('');

  if (installFailed) {
    lines.push('> ❌ **警告**：依赖安装失败，已自动回滚 `package.json` 与锁文件快照以保持仓库完整。');
    lines.push('');
  }

  const afterText = afterTotal !== null ? String(afterTotal) : '-';
  lines.push(
    `- **扫描总计**: ${beforeTotal} 个漏洞 | **已修复/变更**: ${resolvedCount} | **剩余**: ${afterText} | **需人工处理**: ${toReport.length}`
  );
  lines.push('');

  if (
    compatibleFixPackages.length > 0 ||
    appliedChanges.length > 0 ||
    toReport.length > 0
  ) {
    lines.push('| 状态 | 包 | 变更 / 原因 |');
    lines.push('|---|---|---|');

    for (const change of appliedChanges) {
      const fromText = change.from ? `\`${escapeCell(change.from)}\` → ` : '';
      lines.push(
        `| ✅ 自动 (${escapeCell(change.section)}) | \`${escapeCell(change.pkg)}\` | ${fromText}\`${escapeCell(change.to)}\` |`
      );
    }

    const changedPkgs = new Set(appliedChanges.map((c) => c.pkg));
    for (const pkg of compatibleFixPackages) {
      if (!changedPkgs.has(pkg)) {
        lines.push(
          `| ${dryRun ? '🔍 预演' : '✅ 自动 (audit fix)'} | \`${escapeCell(pkg)}\` | 非破坏性兼容更新 |`
        );
      }
    }

    for (const item of toReport) {
      lines.push(
        `| ⚠️ 人工 | \`${escapeCell(item.pkg)}\` (${escapeCell(item.severity)}) | ${escapeCell(item.reason)} (${escapeCell(item.fixVersion)}) |`
      );
    }

    lines.push('');
  } else {
    lines.push('✅ 未检测到可自动或需人工处理的漏洞。');
    lines.push('');
  }

  if (remaining) {
    if (remaining.length === 0) {
      lines.push('✅ **验证结果**：当前无剩余已知漏洞。');
    } else {
      lines.push(`⚠️ **验证后剩余 ${remaining.length} 个漏洞**：`);
      for (const item of remaining) {
        lines.push(`- \`${escapeCell(item.pkg)}\` [${escapeCell(item.severity)}]`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}
