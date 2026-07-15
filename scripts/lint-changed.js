import { execSync } from 'child_process';
import fs from 'fs';

try {
  // Get git status porcelain output to find all modified, added, and untracked files
  const output = execSync('git status --porcelain', { encoding: 'utf-8' });
  const lines = output.split('\n');
  const files = [];

  for (const line of lines) {
    if (!line) continue;
    
    // Status can be e.g. ' M file.ts', 'A  file.ts', '?? file.ts'
    // Ignore deleted files (denoted by 'D' in status)
    const status = line.substring(0, 2);
    if (status.includes('D')) continue;

    // Get the file path (handle rename 'R  old -> new')
    let filePath = line.substring(3).trim();
    if (status.startsWith('R')) {
      const parts = filePath.split(' -> ');
      filePath = parts[parts.length - 1];
    }

    // Filter for JavaScript/TypeScript files
    if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
      if (fs.existsSync(filePath)) {
        files.push(filePath);
      }
    }
  }

  if (files.length === 0) {
    console.log('✨ No changed JS/TS files found. Skipping linter.');
    process.exit(0);
  }

  console.log(`🔍 Found ${files.length} changed file(s) to lint:`);
  files.forEach(f => console.log(`  - ${f}`));

  // Run oxlint on the changed files
  console.log('\n🚀 Running oxlint on changed files...');
  try {
    execSync(`npx oxlint ${files.join(' ')}`, { stdio: 'inherit' });
  } catch {
    console.error('❌ oxlint found errors.');
    process.exit(1);
  }

  // Run eslint on the changed files
  console.log('\n🚀 Running eslint on changed files...');
  try {
    execSync(`npx eslint ${files.join(' ')} --cache --cache-strategy content`, { stdio: 'inherit' });
  } catch {
    console.error('❌ eslint found errors.');
    process.exit(1);
  }

  console.log('\n✅ Linting completed successfully!');
} catch {
  console.log('⚠️ Failed to detect changed files via Git. Falling back to full scan...');
  try {
    execSync('npx oxlint && npx eslint . --cache --cache-strategy content', { stdio: 'inherit' });
  } catch {
    process.exit(1);
  }
}
