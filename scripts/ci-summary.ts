import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { en } from '../utils/i18n/en.js';
import { zhCN } from '../utils/i18n/zh-CN.js';
import { zhTW } from '../utils/i18n/zh-TW.js';
import { zhHK } from '../utils/i18n/zh-HK.js';
import { ja } from '../utils/i18n/ja.js';
import { ru } from '../utils/i18n/ru.js';
import { languageNames, Language } from '../utils/i18n/index.js';

const translations = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'zh-HK': zhHK,
  ja,
  ru
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to recursively get all translation keys
const getAllKeys = (obj: Record<string, unknown> | unknown, prefix = ''): string[] => {
  if (!obj || typeof obj !== 'object') return [];
  const record = obj as Record<string, unknown>;
  return Object.keys(record).reduce((acc: string[], key: string) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof record[key] === 'object' && record[key] !== null) {
      acc.push(...getAllKeys(record[key], path));
    } else {
      acc.push(path);
    }
    return acc;
  }, []);
};

// Parse command line arguments
const args = process.argv.slice(2);
const getArgValue = (flag: string): string => {
  const arg = args.find(a => a.startsWith(flag));
  return arg ? arg.split('=')[1] : '';
};

const mode = getArgValue('--mode');
const status = getArgValue('--status') || 'success';

// Generate progress bar for translations
const makeProgressBar = (percent: number): string => {
  const totalWidth = 15;
  const filledWidth = Math.min(totalWidth, Math.max(0, Math.round((percent / 100) * totalWidth)));
  const emptyWidth = totalWidth - filledWidth;
  return `\`${'█'.repeat(filledWidth)}${'░'.repeat(emptyWidth)}\` **${percent.toFixed(1)}%**`;
};

// Scan directory recursively for file sizes
const getFilesRecursively = (dir: string, fileList: string[] = []): string[] => {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFilesRecursively(name, fileList);
    } else {
      fileList.push(name);
    }
  }
  return fileList;
};

// Main generator
const main = () => {
  let markdown = '';
  const isSuccess = status.toLowerCase() === 'success' || status.toLowerCase() === 'true';

  if (mode === 'lint') {
    // =========================================================================
    // LINT & TYPE-CHECK MODE
    // =========================================================================
    markdown += `### ✨ CI Phase: Linting & Static Code Analysis\n\n`;

    let eslintErrorsCount = 0;
    let eslintWarningsCount = 0;
    let eslintFilesWithIssuesCount = 0;
    const eslintRuleBreakdown: Record<string, number> = {};
    const eslintIssueDetails: string[] = [];

    interface EslintMessage {
      ruleId: string | null;
      severity: number;
      message: string;
      line: number;
      column: number;
    }

    interface EslintFileResult {
      filePath: string;
      messages: EslintMessage[];
    }

    const eslintReportPath = path.join(process.cwd(), 'eslint-report.json');
    if (fs.existsSync(eslintReportPath)) {
      try {
        const rawJson = fs.readFileSync(eslintReportPath, 'utf8');
        const report = JSON.parse(rawJson);
        
        if (Array.isArray(report)) {
          report.forEach((fileObj: EslintFileResult) => {
            const relativePath = path.relative(process.cwd(), fileObj.filePath);
            const messages = fileObj.messages || [];
            
            if (messages.length > 0) {
              eslintFilesWithIssuesCount++;
              messages.forEach((msg: EslintMessage) => {
                const ruleId = msg.ruleId || 'generic';
                if (msg.severity === 2) {
                  eslintErrorsCount++;
                  eslintRuleBreakdown[ruleId] = (eslintRuleBreakdown[ruleId] || 0) + 1;
                  // Print GitHub Workflow Annotation
                  console.log(`::error file=${relativePath},line=${msg.line},col=${msg.column},title=ESLint [${ruleId}]::${msg.message}`);
                } else if (msg.severity === 1) {
                  eslintWarningsCount++;
                  eslintRuleBreakdown[ruleId] = (eslintRuleBreakdown[ruleId] || 0) + 1;
                  // Print GitHub Workflow Annotation
                  console.log(`::warning file=${relativePath},line=${msg.line},col=${msg.column},title=ESLint [${ruleId}]::${msg.message}`);
                }

                // Add to report list
                eslintIssueDetails.push(
                  `| ${msg.severity === 2 ? '❌ Error' : '⚠️ Warning'} | \`${relativePath}:${msg.line}:${msg.column}\` | \`${ruleId}\` | ${msg.message} |`
                );
              });
            }
          });
        }
      } catch {
        markdown += `> ⚠️ **Notice:** Failed to parse ESLint report from \`eslint-report.json\`.\n\n`;
      }
    }

    // Parse TypeScript errors
    let tscErrorsCount = 0;
    const tscIssueDetails: string[] = [];
    const tscReportPath = path.join(process.cwd(), 'tsc-output.log');
    if (fs.existsSync(tscReportPath)) {
      try {
        const content = fs.readFileSync(tscReportPath, 'utf8');
        const lines = content.split('\n');
        // Match format: src/components/Card.tsx(10,5): error TS2304: Cannot find name 'x'.
        const tscRegex = /^([^(]+)\((\d+),(\d+)\): error (TS\d+): (.*)$/;

        lines.forEach((line) => {
          const match = line.match(tscRegex);
          if (match) {
            tscErrorsCount++;
            const [, file, lineNum, colNum, errorCode, message] = match;
            const relativeFile = path.relative(process.cwd(), file.trim());
            // Print GitHub Workflow Annotation
            console.log(`::error file=${relativeFile},line=${lineNum},col=${colNum},title=TypeScript [${errorCode}]::${message}`);

            tscIssueDetails.push(
              `| ❌ Error | \`${relativeFile}:${lineNum}:${colNum}\` | \`${errorCode}\` | ${message.trim()} |`
            );
          } else if (line.trim().startsWith('error TS')) {
            // Fallback for general error lines
            tscErrorsCount++;
            tscIssueDetails.push(`| ❌ Error | \`Global/Unknown\` | \`tsc\` | ${line.trim()} |`);
          }
        });
      } catch {
        markdown += `> ⚠️ **Notice:** Failed to read TypeScript compiler log from \`tsc-output.log\`.\n\n`;
      }
    }

    const isLintSuccess = eslintErrorsCount === 0 && tscErrorsCount === 0;

    if (isLintSuccess) {
      markdown += `> 🟢 **All checks passed successfully!** Code quality and type safety guidelines are fully met.\n\n`;
    } else {
      markdown += `> 🔴 **Static analysis failed with ${eslintErrorsCount + tscErrorsCount} errors!** Please resolve the issues shown below.\n\n`;
    }

    // Breakdown Table
    markdown += `#### 📊 Static Analysis Summary:\n\n`;
    markdown += `| Quality Check Gate | Status | Errors | Warnings | Checked Items |\n`;
    markdown += `|---|---|---|---|---|\n`;
    markdown += `| 🚀 **ESLint & Oxlint** | ${eslintErrorsCount === 0 ? '✅ Passed' : '❌ Failed'} | \`${eslintErrorsCount}\` | \`${eslintWarningsCount}\` | \`${eslintFilesWithIssuesCount}\` files with issues |\n`;
    markdown += `| 🛡️ **TypeScript Compiler** | ${tscErrorsCount === 0 ? '✅ Passed' : '❌ Failed'} | \`${tscErrorsCount}\` | \`0\` | Full type-check (\`tsc --noEmit\`) |\n\n`;

    if (Object.keys(eslintRuleBreakdown).length > 0) {
      markdown += `#### 🏷️ Violated Rules Breakdown:\n\n`;
      markdown += `| Rule ID | Violations Count |\n`;
      markdown += `|---|---|\n`;
      Object.entries(eslintRuleBreakdown)
        .sort((a, b) => b[1] - a[1])
        .forEach(([rule, count]) => {
          markdown += `| \`${rule}\` | \`${count}\` |\n`;
        });
      markdown += `\n`;
    }

    if (eslintIssueDetails.length > 0) {
      markdown += `<details ${eslintErrorsCount > 0 ? 'open' : ''}>\n`;
      markdown += `<summary>🔍 Click to inspect ESLint & Oxlint violations (${eslintIssueDetails.length})</summary>\n\n`;
      markdown += `| Severity | Location | Rule ID | Message |\n`;
      markdown += `|---|---|---|---|\n`;
      // Limit list to avoid huge comment body
      markdown += eslintIssueDetails.slice(0, 50).join('\n') + '\n';
      if (eslintIssueDetails.length > 50) {
        markdown += `| ... | ... | ... | *and ${eslintIssueDetails.length - 50} more ESLint warnings/errors (see console logs)* |\n`;
      }
      markdown += `\n</details>\n\n`;
    }

    if (tscIssueDetails.length > 0) {
      markdown += `<details open>\n`;
      markdown += `<summary>❌ Click to inspect TypeScript compilation errors (${tscErrorsCount})</summary>\n\n`;
      markdown += `| Severity | Location | Error Code | Message |\n`;
      markdown += `|---|---|---|---|\n`;
      markdown += tscIssueDetails.slice(0, 50).join('\n') + '\n';
      if (tscIssueDetails.length > 50) {
        markdown += `| ... | ... | ... | *and ${tscIssueDetails.length - 50} more compilation errors (see console logs)* |\n`;
      }
      markdown += `\n</details>\n\n`;
    }

    markdown += `#### 💡 Next Steps:\n`;
    markdown += `- Run \`npm run lint\` to verify and automatically fix style issues locally before pushing.\n`;
    markdown += `- ESLint includes flat configs integrating both ESLint rules and super-fast Oxlint checks.\n\n`;

    // Exit with 1 if there are errors so GitHub Actions fails correctly
    if (!isLintSuccess) {
      process.exitCode = 1;
    }

  } else if (mode === 'test') {
    // =========================================================================
    // UNIT TEST MODE
    // =========================================================================
    markdown += `### 🧪 CI Phase: Test Suite & i18n Localization Audit\n\n`;

    // 1. Parse Vitest JSON results if available
    const testResultsPath = path.join(process.cwd(), 'test-results.json');
    const testStats = { total: 0, passed: 0, failed: 0, duration: 0 };
    const testSuites = { total: 0, passed: 0, failed: 0 };
    const failedTestsList: string[] = [];

    if (fs.existsSync(testResultsPath)) {
      try {
        const rawJson = fs.readFileSync(testResultsPath, 'utf8');
        const results = JSON.parse(rawJson);
        testStats.total = results.numTotalTests || 0;
        testStats.passed = results.numPassedTests || 0;
        testStats.failed = results.numFailedTests || 0;
        testStats.duration = (results.startTime && Date.now() - results.startTime) 
          ? Math.round((Date.now() - results.startTime) / 1000) 
          : 0;

        testSuites.total = results.numTotalTestSuites || 0;
        testSuites.passed = results.numPassedTestSuites || 0;
        testSuites.failed = results.numFailedTestSuites || 0;

        // Collect failed tests
        if (results.testResults) {
          for (const suite of results.testResults) {
            if (suite.status === 'failed' && suite.assertionResults) {
              for (const testCase of suite.assertionResults) {
                if (testCase.status === 'failed') {
                  failedTestsList.push(`- **${suite.name.split('/').pop()}**: ${testCase.ancestorTitles.join(' > ')} &rarr; \`${testCase.title}\``);
                }
              }
            }
          }
        }
      } catch {
        markdown += `> ⚠️ **Notice:** Failed to parse unit test metrics from \`test-results.json\`.\n\n`;
      }
    }

    if (testStats.total > 0) {
      if (testStats.failed === 0) {
        markdown += `> 🟢 **All unit tests passed beautifully!** (Total assertions: **${testStats.passed}/${testStats.total}** across **${testSuites.passed}** suites)\n\n`;
      } else {
        markdown += `> 🔴 **Test suite failures detected!** **${testStats.failed}** out of **${testStats.total}** tests failed.\n\n`;
        process.exitCode = 1;
      }

      markdown += `#### 📊 Test Execution Summary:\n\n`;
      markdown += `| Metric | Passed | Failed | Total | Pass Rate |\n`;
      markdown += `|---|---|---|---|---|\n`;
      markdown += `| **Test Suites** | \`${testSuites.passed}\` | \`${testSuites.failed}\` | \`${testSuites.total}\` | \`${testSuites.total ? Math.round((testSuites.passed / testSuites.total) * 100) : 0}%\` |\n`;
      markdown += `| **Assertions** | \`${testStats.passed}\` | \`${testStats.failed}\` | \`${testStats.total}\` | \`${testStats.total ? Math.round((testStats.passed / testStats.total) * 100) : 0}%\` |\n\n`;

      if (failedTestsList.length > 0) {
        markdown += `#### ❌ Failed Test Cases:\n\n`;
        markdown += failedTestsList.slice(0, 15).join('\n') + '\n';
        if (failedTestsList.length > 15) {
          markdown += `*and ${failedTestsList.length - 15} more failed tests. Please check the CI step output logs for full errors.*\n`;
        }
        markdown += `\n`;
      }
    } else {
      markdown += `> 🟡 **Test suite execution complete.** Status: \`${status}\`. Run \`npm run test\` locally to review output details.\n\n`;
      if (!isSuccess) {
        process.exitCode = 1;
      }
    }

    // 2. Localization Audit Analysis
    markdown += `#### 🌐 i18n Localization Completeness Audit:\n\n`;
    markdown += `This audit analyzes translation coverage for all production-supported locales compared to the master English reference.\n\n`;
    markdown += `| Language | Code | Completeness Progress | Translated | Missing | Status |\n`;
    markdown += `|---|---|---|---|---|---|\n`;

    const englishKeys = getAllKeys(translations['en']).sort();
    const totalEnglishKeys = englishKeys.length;

    // Output English reference line
    markdown += `| **English** | \`en\` | ${makeProgressBar(100)} | \`${totalEnglishKeys}/${totalEnglishKeys}\` | \`0\` | 🟢 Complete (Ref) |\n`;

    const missingDetails: string[] = [];

    Object.keys(translations).forEach((lang) => {
      if (lang === 'en') return;

      const targetKeys = getAllKeys(translations[lang as Language]);
      const missingKeys = englishKeys.filter((key) => !targetKeys.includes(key));
      const translatedCount = totalEnglishKeys - missingKeys.length;
      const progressPercent = totalEnglishKeys > 0 ? (translatedCount / totalEnglishKeys) * 100 : 0;
      const langName = languageNames[lang as Language] || lang;

      let statusEmoji = '🟢 Complete';
      if (progressPercent < 100 && progressPercent >= 90) statusEmoji = '🟡 Active Update';
      else if (progressPercent < 90) statusEmoji = '🔴 Needs Attention';

      markdown += `| **${langName}** | \`${lang}\` | ${makeProgressBar(progressPercent)} | \`${translatedCount}/${totalEnglishKeys}\` | \`${missingKeys.length}\` | ${statusEmoji} |\n`;

      if (missingKeys.length > 0) {
        missingDetails.push(`##### 🌐 Locales: **${langName}** (\`${lang}\`) - ${missingKeys.length} missing keys:`);
        missingDetails.push('```json');
        missingDetails.push(JSON.stringify(missingKeys.slice(0, 15), null, 2));
        if (missingKeys.length > 15) {
          missingDetails.push(`// ... and ${missingKeys.length - 15} more keys`);
        }
        missingDetails.push('```\n');
      }
    });

    markdown += `\n`;

    if (missingDetails.length > 0) {
      markdown += `<details>\n`;
      markdown += `<summary>🔍 Click to inspect missing localization keys</summary>\n\n`;
      markdown += missingDetails.join('\n');
      markdown += `</details>\n\n`;
    }

  } else if (mode === 'build') {
    // =========================================================================
    // BUILD & ASSET ANALYSIS MODE
    // =========================================================================
    markdown += `### 📦 CI Phase: Build Performance & Security Analysis\n\n`;

    const buildLogPath = path.join(process.cwd(), 'build-output.log');
    let buildErrorDetails = '';
    let buildFailedFlag = !isSuccess;

    if (fs.existsSync(buildLogPath)) {
      try {
        const buildLog = fs.readFileSync(buildLogPath, 'utf8');
        if (!isSuccess || buildLog.toLowerCase().includes('error') || buildLog.toLowerCase().includes('failed')) {
          // Extract error lines to show
          const lines = buildLog.split('\n');
          const errorLines = lines.filter(line => 
            line.toLowerCase().includes('error') || 
            line.toLowerCase().includes('failed') || 
            line.toLowerCase().includes('exception') || 
            line.startsWith('❌')
          );
          if (errorLines.length > 0) {
            buildFailedFlag = true;
            buildErrorDetails = `\n\`\`\`text\n${errorLines.slice(0, 30).join('\n')}\n\`\`\`\n`;
          }
        }
      } catch {
        // Ignore
      }
    }

    if (!buildFailedFlag) {
      markdown += `> 🟢 **Build compiled successfully!** Standalone production bundle is ready for serverless deployment.\n\n`;
    } else {
      markdown += `> 🔴 **Build compilation failed!** Please verify your Vite and Esbuild scripts or check for compilation issues.\n\n`;
      if (buildErrorDetails) {
        markdown += `#### ❌ Compilation Errors detected:\n${buildErrorDetails}\n`;
      }
      process.exitCode = 1;
    }

    markdown += `<details>\n<summary><strong>🔍 Rolldown Bundle Size breakdown:</strong></summary>\n\n`;

    if (fs.existsSync('dist')) {
      const allFiles = getFilesRecursively('dist');
      let jsTotalSize = 0;
      let cssTotalSize = 0;
      let htmlTotalSize = 0;
      let otherTotalSize = 0;

      const thresholdMB = 5.0;
      const fileRows: string[] = [];
      const warnings: string[] = [];

      allFiles.forEach(file => {
        const stats = fs.statSync(file);
        const sizeKB = stats.size / 1024;
        const sizeMB = sizeKB / 1024;
        const ext = path.extname(file);
        const relativePath = path.relative('dist', file);

        if (ext === '.js') jsTotalSize += stats.size;
        else if (ext === '.css') cssTotalSize += stats.size;
        else if (ext === '.html') htmlTotalSize += stats.size;
        else otherTotalSize += stats.size;

        // Skip listing map files to keep the report super clean
        if (ext === '.map') return;

        let alertBadge = '🟢';
        if (ext === '.js' && sizeMB > thresholdMB) {
          alertBadge = '⚠️ Large';
          warnings.push(`- ⚠️ **Warning:** Chunk \`${relativePath}\` is **${sizeMB.toFixed(2)} MB**, which exceeds our recommended single-bundle size threshold of **${thresholdMB} MB**.`);
        }

        fileRows.push(`| ${alertBadge} | \`${relativePath}\` | \`${sizeKB.toFixed(1)} KB\` | \`~${(sizeKB * 0.3).toFixed(1)} KB\` | \`${ext.toUpperCase().replace('.', '')}\` |`);
      });

      const totalSizeMB = (jsTotalSize + cssTotalSize + htmlTotalSize + otherTotalSize) / (1024 * 1024);

      markdown += `| Guard | Asset Path | Raw Size | Est. Gzip Size | Type |\n`;
      markdown += `|---|---|---|---|---|\n`;
      markdown += fileRows.join('\n') + '\n\n';

      markdown += `#### 📊 Bundle Summary:\n\n`;
      markdown += `| Language / Asset Type | Raw Compiled Size | Percentage |\n`;
      markdown += `|---|---|---|\n`;
      markdown += `| 💻 **Total JavaScript** | \`${(jsTotalSize / (1024 * 1024)).toFixed(2)} MB\` | \`${totalSizeMB > 0 ? Math.round((jsTotalSize / (jsTotalSize + cssTotalSize + htmlTotalSize + otherTotalSize)) * 100) : 0}%\` |\n`;
      markdown += `| 🎨 **Total CSS Assets** | \`${(cssTotalSize / (1024 * 1024)).toFixed(2)} MB\` | \`${totalSizeMB > 0 ? Math.round((cssTotalSize / (jsTotalSize + cssTotalSize + htmlTotalSize + otherTotalSize)) * 100) : 0}%\` |\n`;
      markdown += `| 📄 **HTML & Static** | \`${((htmlTotalSize + otherTotalSize) / (1024 * 1024)).toFixed(2)} MB\` | \`${totalSizeMB > 0 ? Math.round(((htmlTotalSize + otherTotalSize) / (jsTotalSize + cssTotalSize + htmlTotalSize + otherTotalSize)) * 100) : 0}%\` |\n`;
      markdown += `| 📦 **Grand Total Bundle** | **${totalSizeMB.toFixed(2)} MB** | **100%** |\n\n`;

      if (warnings.length > 0) {
        markdown += `#### 🚨 Bundle Sizing Warnings:\n\n`;
        markdown += warnings.join('\n') + '\n\n';
      }
    } else {
      markdown += `> ⚠️ **Notice:** No build folder (\`dist\`) detected to analyze.\n\n`;
    }

    markdown += `</details>\n\n`;

    // Dependency vulnerability check
    markdown += `#### 🛡️ Dependency Security Auditing:\n\n`;
    const auditReportPath = path.join(process.cwd(), 'audit-report.json');
    if (fs.existsSync(auditReportPath)) {
      try {
        const rawJson = fs.readFileSync(auditReportPath, 'utf8');
        const audit = JSON.parse(rawJson);
        const metadata = audit.metadata || {};
        const vulnerabilities = metadata.vulnerabilities || { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
        const totalVulnerabilities = Object.values(vulnerabilities).reduce((sum: number, val: unknown) => sum + (Number(val) || 0), 0);

        if (totalVulnerabilities === 0) {
          markdown += `> 🟢 **Security Scan Passed!** 0 vulnerabilities detected in direct/indirect dependencies.\n\n`;
        } else {
          const highAndCritical = (vulnerabilities.high || 0) + (vulnerabilities.critical || 0);
          if (highAndCritical > 0) {
            markdown += `> 🔴 **Security Alert!** Detected **${highAndCritical}** High/Critical vulnerability issues in packages. Please run \`npm audit fix\`!\n\n`;
            // Set exit code to 1 if critical or high vulnerabilities are detected
            process.exitCode = 1;
          } else {
            markdown += `> 🟡 **Minor Security Warnings.** Detected **${totalVulnerabilities}** low/moderate vulnerabilities.\n\n`;
          }
        }

        markdown += `| Severity Level | Detected Counts | Risk Status |\n`;
        markdown += `|---|---|---|\n`;
        markdown += `| 🚨 **Critical** | \`${vulnerabilities.critical || 0}\` | ${vulnerabilities.critical > 0 ? '🔴 Immediate Action Required' : '✅ Secured'} |\n`;
        markdown += `| ⚠️ **High** | \`${vulnerabilities.high || 0}\` | ${vulnerabilities.high > 0 ? '🟠 Review & Patch' : '✅ Secured'} |\n`;
        markdown += `| 🟡 **Moderate** | \`${vulnerabilities.moderate || 0}\` | ${vulnerabilities.moderate > 0 ? '🟡 Warning' : '✅ Secured'} |\n`;
        markdown += `| 🔵 **Low** | \`${vulnerabilities.low || 0}\` | ${vulnerabilities.low > 0 ? '🔵 Low Priority' : '✅ Secured'} |\n`;
        markdown += `| ℹ️ **Info** | \`${vulnerabilities.info || 0}\` | \`Info\` |\n\n`;

      } catch {
        markdown += `> ⚠️ **Notice:** Failed to parse security metrics from \`audit-report.json\`.\n\n`;
      }
    } else {
      markdown += `- No security report found. Ensure \`npm audit\` runs properly before generating summary.\n\n`;
    }
  }

  // Write to GitHub Step Summary if defined
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    fs.appendFileSync(summaryFile, markdown);
    console.log(`✨ Successfully appended --mode=${mode} summary to $GITHUB_STEP_SUMMARY.`);
  } else {
    // Local console print optimized for terminal
    console.log(`\n=== LOCAL CI SUMMARY: MODE [${mode.toUpperCase()}] ===`);
    console.log(markdown);
    console.log('====================================================\n');
  }
};

main();
