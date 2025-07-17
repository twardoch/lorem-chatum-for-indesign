#!/usr/bin/env node
// this_file: test/integration-test.js

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { build } = require('../scripts/build');

const TEST_DIR = path.join(__dirname, 'temp');
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Integration test for build and release process
 */
async function runIntegrationTest() {
  console.log('Running integration test...');
  
  try {
    // Clean up any existing test directory
    await fs.remove(TEST_DIR);
    
    // Test version script
    console.log('\nTesting version script...');
    const { getVersion } = require('../scripts/version');
    const version = getVersion();
    console.log(`Current version: ${version}`);
    
    // Test build process
    console.log('\nTesting build process...');
    await build();
    
    // Verify build outputs
    const buildDir = path.join(ROOT_DIR, 'build');
    const distDir = path.join(ROOT_DIR, 'dist');
    
    if (!await fs.pathExists(buildDir)) {
      throw new Error('Build directory not created');
    }
    
    if (!await fs.pathExists(distDir)) {
      throw new Error('Dist directory not created');
    }
    
    // Check for zip file
    const zipFiles = await fs.readdir(distDir);
    const zipFile = zipFiles.find(file => file.endsWith('.zip'));
    
    if (!zipFile) {
      throw new Error('No zip file created');
    }
    
    console.log(`Created zip file: ${zipFile}`);
    
    // Test installer files
    const installersDir = path.join(distDir, 'installers');
    if (await fs.pathExists(installersDir)) {
      const installers = await fs.readdir(installersDir);
      console.log(`Created installers: ${installers.join(', ')}`);
    }
    
    // Test that source files are properly versioned
    const v2Script = path.join(buildDir, 'src/v2-indesign-2023-and-newer/Lorem-Chatum-v2.idjs');
    if (await fs.pathExists(v2Script)) {
      const content = await fs.readFile(v2Script, 'utf8');
      if (content.includes(`v${version}`)) {
        console.log('✓ Source files properly versioned');
      } else {
        console.log('⚠ Source files may not be properly versioned');
      }
    }
    
    console.log('\n✅ Integration test passed!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runIntegrationTest();
}

module.exports = { runIntegrationTest };