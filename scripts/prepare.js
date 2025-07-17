#!/usr/bin/env node
// this_file: scripts/prepare.js

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Prepare the project for development
 */
async function prepare() {
  console.log('Preparing project for development...');
  
  try {
    // Ensure directories exist
    await fs.ensureDir(path.join(__dirname, '../build'));
    await fs.ensureDir(path.join(__dirname, '../dist'));
    await fs.ensureDir(path.join(__dirname, '../test/temp'));
    
    // Install dependencies if needed
    try {
      const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, '../package.json'), 'utf8'));
      if (packageJson.devDependencies) {
        console.log('Installing dependencies...');
        execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
      }
    } catch (error) {
      console.warn('Could not install dependencies:', error.message);
    }
    
    // Check git hooks
    const gitHooksDir = path.join(__dirname, '../.git/hooks');
    if (await fs.pathExists(gitHooksDir)) {
      const preCommitHook = path.join(gitHooksDir, 'pre-commit');
      if (!await fs.pathExists(preCommitHook)) {
        const hookContent = `#!/bin/sh
# Run tests before commit
npm test
`;
        await fs.writeFile(preCommitHook, hookContent);
        await fs.chmod(preCommitHook, '755');
        console.log('Created pre-commit hook');
      }
    }
    
    console.log('✅ Project preparation complete!');
    
  } catch (error) {
    console.error('❌ Project preparation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  prepare();
}

module.exports = { prepare };