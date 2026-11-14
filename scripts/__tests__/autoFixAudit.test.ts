import { describe, it, expect } from 'vitest';
import {
  AuditResult,
  PackageJsonShape,
  applyPackageJsonPatches,
  countAuditVulnerabilities,
  diffDirectAndOverrideChanges,
  extractRemainingVulnerabilities,
  formatVersionWithPrefix,
  parseAuditJson,
  renderAuditSummaryMarkdown,
  triageVulnerabilities,
} from '../lib/auditFix';

describe('Automated npm audit fix logic', () => {
  describe('parseAuditJson', () => {
    it('parses valid npm audit v2 JSON and handles malformed/empty/error strings safely', () => {
      expect(parseAuditJson('')).toBeNull();
      expect(parseAuditJson('   ')).toBeNull();
      expect(parseAuditJson('{invalid json')).toBeNull();
      expect(
        parseAuditJson(JSON.stringify({ error: { code: 'ENOLOCK', summary: 'missing lockfile' } }))
      ).toBeNull();

      const valid = parseAuditJson(
        JSON.stringify({
          auditReportVersion: 2,
          vulnerabilities: {
            nanoid: {
              severity: 'high',
              isDirect: false,
              fixAvailable: true,
            },
          },
        })
      );
      expect(valid).not.toBeNull();
      expect(countAuditVulnerabilities(valid!)).toBe(1);
      expect(extractRemainingVulnerabilities(valid!)).toEqual([
        { pkg: 'nanoid', severity: 'high' },
      ]);
    });
  });

  describe('formatVersionWithPrefix', () => {
    it('preserves ^ and ~ prefixes and exact pins appropriately', () => {
      expect(formatVersionWithPrefix('^1.2.0', '1.2.5')).toBe('^1.2.5');
      expect(formatVersionWithPrefix('~1.2.0', '1.2.5')).toBe('~1.2.5');
      expect(formatVersionWithPrefix('1.2.0', '1.2.5')).toBe('1.2.5');
      expect(formatVersionWithPrefix(undefined, '3.3.18')).toBe('^3.3.18');
      expect(formatVersionWithPrefix('^1.0.0', '^2.0.0')).toBe('^2.0.0');
    });
  });

  describe('triageVulnerabilities', () => {
    it('routes fixAvailable: true into compatibleFixPackages instead of undefined overrides', () => {
      const audit: AuditResult = {
        vulnerabilities: {
          'brace-expansion': {
            severity: 'high',
            isDirect: false,
            fixAvailable: true,
          },
          dompurify: {
            severity: 'moderate',
            isDirect: false,
            fixAvailable: true,
          },
        },
      };

      const result = triageVulnerabilities(audit);
      expect(result.compatibleFixPackages).toEqual(['brace-expansion', 'dompurify']);
      expect(result.toOverride.size).toBe(0);
      expect(result.toUpgrade.size).toBe(0);
      expect(result.toReport).toEqual([]);
      expect(result.total).toBe(2);
    });

    it('blocks isSemVerMajor and unfixable vulnerabilities from automatic changes', () => {
      const audit: AuditResult = {
        vulnerabilities: {
          'breaking-pkg': {
            severity: 'critical',
            isDirect: true,
            range: '<2.0.0',
            fixAvailable: { name: 'breaking-pkg', version: '2.0.0', isSemVerMajor: true },
          },
          'unfixable-pkg': {
            severity: 'moderate',
            isDirect: false,
            fixAvailable: false,
          },
        },
      };

      const result = triageVulnerabilities(audit);
      expect(result.toUpgrade.size).toBe(0);
      expect(result.toOverride.size).toBe(0);
      expect(result.toReport).toHaveLength(2);
      expect(result.toReport[0].pkg).toBe('breaking-pkg');
      expect(result.toReport[1].pkg).toBe('unfixable-pkg');
    });

    it('prevents corrupting overrides when fix.name differs from vulnerable transitive package', () => {
      const pkgJson: PackageJsonShape = {
        dependencies: {
          'parent-direct': '^1.0.0',
        },
      };

      const audit: AuditResult = {
        vulnerabilities: {
          'child-vuln': {
            severity: 'high',
            isDirect: false,
            fixAvailable: { name: 'parent-direct', version: '1.2.4', isSemVerMajor: false },
          },
          'orphan-child-vuln': {
            severity: 'high',
            isDirect: false,
            fixAvailable: { name: 'mid-transitive', version: '5.1.0', isSemVerMajor: false },
          },
        },
      };

      const result = triageVulnerabilities(audit, pkgJson);
      expect(result.toOverride.size).toBe(0);
      expect(result.toUpgrade.get('parent-direct')).toBe('1.2.4');
      expect(result.toReport).toEqual([
        {
          pkg: 'orphan-child-vuln',
          severity: 'high',
          reason: '需通过上游依赖 mid-transitive 修复',
          fixVersion: 'mid-transitive@5.1.0',
          range: undefined,
        },
      ]);
    });

    it('upgrades direct deps and overrides transitive deps when fix.name matches pkg', () => {
      const pkgJson: PackageJsonShape = {
        dependencies: {
          express: '^5.0.0',
        },
        devDependencies: {
          vite: '~8.0.0',
        },
      };

      const audit: AuditResult = {
        vulnerabilities: {
          express: {
            severity: 'high',
            isDirect: true,
            fixAvailable: { name: 'express', version: '5.2.1', isSemVerMajor: false },
          },
          postcss: {
            severity: 'moderate',
            isDirect: false,
            fixAvailable: { name: 'postcss', version: '8.5.18', isSemVerMajor: false },
          },
        },
      };

      const result = triageVulnerabilities(audit, pkgJson);
      expect(result.toUpgrade.get('express')).toBe('5.2.1');
      expect(result.toOverride.get('postcss')).toBe('8.5.18');
    });
  });

  describe('applyPackageJsonPatches & diffDirectAndOverrideChanges', () => {
    it('updates dependencies/devDependencies/overrides cleanly without mutating peerDependencies or nested overrides', () => {
      const original: PackageJsonShape = {
        dependencies: {
          express: '^5.0.0',
        },
        devDependencies: {
          vite: '~8.0.0',
        },
        peerDependencies: {
          react: '^19.0.0',
        },
        overrides: {
          postcss: '^8.5.18',
          webpack: { terser: '5.31.0' },
        },
      };

      const toUpgrade = new Map<string, string>([
        ['express', '5.2.1'],
        ['react', '19.2.8'], // peerDependency only — must NOT be mutated
      ]);
      const toOverride = new Map<string, string>([
        ['postcss', '8.5.18'], // idempotent match with ^8.5.18
        ['webpack', '5.99.0'], // nested object override — must NOT be overwritten
        ['nanoid', '3.3.18'],
      ]);

      const { updatedPkg, changes } = applyPackageJsonPatches(original, toOverride, toUpgrade);

      // Original must remain untouched
      expect(original.dependencies?.express).toBe('^5.0.0');
      expect(updatedPkg.dependencies?.express).toBe('^5.2.1');
      expect(updatedPkg.peerDependencies?.react).toBe('^19.0.0');
      expect(updatedPkg.overrides?.postcss).toBe('^8.5.18');
      expect(updatedPkg.overrides?.webpack).toEqual({ terser: '5.31.0' });
      expect(updatedPkg.overrides?.nanoid).toBe('^3.3.18');

      expect(changes).toEqual([
        { section: 'overrides', pkg: 'nanoid', from: undefined, to: '^3.3.18' },
        { section: 'dependencies', pkg: 'express', from: '^5.0.0', to: '^5.2.1' },
      ]);

      const diff = diffDirectAndOverrideChanges(original, updatedPkg);
      expect(diff).toEqual([
        { section: 'dependencies', pkg: 'express', from: '^5.0.0', to: '^5.2.1' },
        { section: 'overrides', pkg: 'nanoid', from: undefined, to: '^3.3.18' },
      ]);
    });
  });

  describe('renderAuditSummaryMarkdown', () => {
    it('renders clear markdown summary with before/after counts, applied changes, and rollback warnings', () => {
      const md = renderAuditSummaryMarkdown({
        beforeTotal: 4,
        afterTotal: 1,
        compatibleFixPackages: ['nanoid'],
        appliedChanges: [
          { section: 'dependencies', pkg: 'express', from: '^5.0.0', to: '^5.2.1' },
        ],
        toReport: [
          {
            pkg: 'legacy-pkg',
            severity: 'high',
            reason: '破坏性大版本升级 (SemVer Major)',
            fixVersion: 'legacy-pkg@4.0.0',
          },
        ],
        remaining: [{ pkg: 'legacy-pkg', severity: 'high' }],
        dryRun: false,
        installFailed: true,
      });

      expect(md).toContain('扫描总计**: 4 个漏洞 | **已修复/变更**: 3 | **剩余**: 1 | **需人工处理**: 1');
      expect(md).toContain('`express`');
      expect(md).toContain('`nanoid`');
      expect(md).toContain('`legacy-pkg`');
      expect(md).toContain('已自动回滚');
    });
  });
});
