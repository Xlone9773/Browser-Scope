import { execSync } from 'child_process';
import fs from 'fs';

const files = new Set();

function addFileIfValid(filePath) {
  if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
    if (fs.existsSync(filePath)) {
      files.add(filePath);
    }
  }
}

// 1. Detect uncommitted/unstaged dirty files (local dev or dirty CI workspace)
try {
  const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
  const lines = statusOutput.split('\n');
  for (const line of lines) {
    if (!line) continue;
    const status = line.substring(0, 2);
    if (status.includes('D')) continue; // Ignore deleted files
    
    let filePath = line.substring(3).trim();
    if (status.startsWith('R')) { // Handle renames
      const parts = filePath.split(' -> ');
      filePath = parts[parts.length - 1];
    }
    addFileIfValid(filePath);
  }
} catch (e) {
  console.warn('⚠️ git status failed:', e.message);
}

// 2. Detect committed files in GITHUB ACTIONS CI
const isCI = process.env.GITHUB_ACTIONS === 'true';
let gitDiffSuccess = false;

if (isCI) {
  console.log('🤖 Detected GitHub Actions CI environment. Detecting committed files...');
  
  const diffStrategies = [];

  // Strategy A: Pull Request event (compare HEAD against target branch)
  if (process.env.GITHUB_BASE_REF) {
    const baseRef = process.env.GITHUB_BASE_REF;
    console.log(`💬 PR event. Target base branch is: ${baseRef}`);
    diffStrategies.push({
      name: `git diff origin/${baseRef}...HEAD`,
      cmd: `git diff --name-only origin/${baseRef}...HEAD`
    });
    diffStrategies.push({
      name: `git diff ${baseRef}...HEAD`,
      cmd: `git diff --name-only ${baseRef}...HEAD`
    });
  }

  // Strategy B: Push/Other event (compare against previous commit)
  diffStrategies.push({
    name: 'git diff HEAD~1',
    cmd: 'git diff --name-only HEAD~1'
  });

  // Strategy C: Compare current commit tree (handles single-commit checkout)
  diffStrategies.push({
    name: 'git diff-tree HEAD',
    cmd: 'git diff-tree --no-commit-id --name-only -r HEAD'
  });

  // Execute strategies until one succeeds
  for (const strategy of diffStrategies) {
    try {
      console.log(`Trying strategy: ${strategy.name}`);
      const output = execSync(strategy.cmd, { encoding: 'utf-8' });
      const lines = output.split('\n');
      let foundAny = false;
      for (const line of lines) {
        const filePath = line.trim();
        if (filePath) {
          addFileIfValid(filePath);
          foundAny = true;
        }
      }
      console.log(`✅ Strategy ${strategy.name} succeeded. Found modifications: ${foundAny}`);
      gitDiffSuccess = true;
      break; // Exit loop on first successful execution
    } catch (e) {
      console.warn(`❌ Strategy ${strategy.name} failed:`, e.message);
    }
  }
}

const finalFiles = Array.from(files);

// Handle CI fallback
if (isCI && !gitDiffSuccess) {
  console.warn('⚠️ All Git diff strategies failed in CI (likely due to a shallow checkout).');
  console.log('🔄 Safely falling back to Full Scan to guarantee build quality!');
  runFullScan();
} else if (finalFiles.length === 0) {
  console.log('✨ No changed JS/TS files found. Skipping linter.');
  process.exit(0);
} else {
  runChangedLint(finalFiles);
}

function runChangedLint(fileList) {
  console.log(`\n🔍 Found ${fileList.length} changed file(s) to lint:`);
  fileList.forEach(f => console.log(`  - ${f}`));

  // Run oxlint
  console.log('\n🚀 Running oxlint on changed files...');
  try {
    execSync(`npx oxlint ${fileList.join(' ')}`, { stdio: 'inherit' });
  } catch {
    console.error('❌ oxlint found errors.');
    process.exit(1);
  }

  // Run eslint
  console.log('\n🚀 Running eslint on changed files...');
  try {
    execSync(`npx eslint ${fileList.join(' ')} --cache --cache-strategy content`, { stdio: 'inherit' });
  } catch {
    console.error('❌ eslint found errors.');
    process.exit(1);
  }

  console.log('\n✅ Linting completed successfully!');
}

function runFullScan() {
  console.log('\n🚀 Running full scan oxlint...');
  try {
    execSync('npx oxlint', { stdio: 'inherit' });
  } catch {
    console.error('❌ oxlint found errors.');
    process.exit(1);
  }

  console.log('\n🚀 Running full scan eslint...');
  try {
    execSync('npx eslint . --cache --cache-strategy content', { stdio: 'inherit' });
  } catch {
    console.error('❌ eslint found errors.');
    process.exit(1);
  }

  console.log('\n✅ Full scan linting completed successfully!');
}

