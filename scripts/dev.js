#!/usr/bin/env node
// this_file: scripts/dev.js

const fs = require('fs-extra');
const path = require('path');
const { execSync, spawn } = require('child_process');

/**
 * Development workflow script
 */
async function dev() {
  console.log('Starting development workflow...');
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'test':
      console.log('Running tests...');
      execSync('node test/run-tests.js', { stdio: 'inherit' });
      break;
      
    case 'test:watch':
      console.log('Starting test watcher...');
      execSync('node test/run-tests.js --watch', { stdio: 'inherit' });
      break;
      
    case 'build':
      console.log('Building project...');
      execSync('node scripts/build.js', { stdio: 'inherit' });
      break;
      
    case 'version':
      console.log('Checking version...');
      execSync('node scripts/version.js', { stdio: 'inherit' });
      break;
      
    case 'release':
      const version = args[1];
      if (!version) {
        console.error('Please provide a version number');
        process.exit(1);
      }
      console.log(`Releasing version ${version}...`);
      execSync(`node scripts/release.js ${version}`, { stdio: 'inherit' });
      break;
      
    case 'integration':
      console.log('Running integration tests...');
      execSync('node test/integration-test.js', { stdio: 'inherit' });
      break;
      
    case 'clean':
      console.log('Cleaning build artifacts...');
      await fs.remove(path.join(__dirname, '../build'));
      await fs.remove(path.join(__dirname, '../dist'));
      await fs.remove(path.join(__dirname, '../test/temp'));
      console.log('✅ Cleaned build artifacts');
      break;
      
    default:
      console.log('Available commands:');
      console.log('  test         - Run tests');
      console.log('  test:watch   - Run tests in watch mode');
      console.log('  build        - Build project');
      console.log('  version      - Check current version');
      console.log('  release <v>  - Release version');
      console.log('  integration  - Run integration tests');
      console.log('  clean        - Clean build artifacts');
      break;
  }
}

if (require.main === module) {
  dev();
}

module.exports = { dev };