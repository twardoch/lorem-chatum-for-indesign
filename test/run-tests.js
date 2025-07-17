#!/usr/bin/env node
// this_file: test/run-tests.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEST_DIR = __dirname;
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Colors for console output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Test result tracking
 */
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test assertion functions
 */
function assert(condition, message) {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
    return true;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    return false;
  }
}

function assertEqual(actual, expected, message) {
  const passed = actual === expected;
  if (passed) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}`);
  }
  return passed;
}

function assertMatch(actual, regex, message) {
  const passed = regex.test(actual);
  if (passed) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    console.log(`  Expected to match: ${regex}`);
    console.log(`  Actual: ${actual}`);
  }
  return passed;
}

/**
 * Run a test function
 */
function runTest(testName, testFunction) {
  console.log(`\n${colors.cyan}Running test: ${testName}${colors.reset}`);
  
  try {
    const results = testFunction();
    const passed = results.every(result => result === true);
    
    testResults.tests.push({
      name: testName,
      passed: passed,
      results: results
    });
    
    if (passed) {
      testResults.passed++;
      console.log(`${colors.green}Test passed: ${testName}${colors.reset}`);
    } else {
      testResults.failed++;
      console.log(`${colors.red}Test failed: ${testName}${colors.reset}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name: testName,
      passed: false,
      error: error.message
    });
    console.log(`${colors.red}Test error: ${testName}${colors.reset}`);
    console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
  }
}

/**
 * Test: File structure validation
 */
function testFileStructure() {
  const results = [];
  
  // Check main files exist
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'package.json')), 'package.json exists'));
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'README.md')), 'README.md exists'));
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'LICENSE.txt')), 'LICENSE.txt exists'));
  
  // Check source files exist
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'src/v1-indesign-2022-and-older/Lorem-Chatum-v1.jsx')), 'v1 script exists'));
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'src/v2-indesign-2023-and-newer/Lorem-Chatum-v2.idjs')), 'v2 script exists'));
  
  // Check installer files exist
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'src/v2-indesign-2023-and-newer/install-Mac.command')), 'Mac installer exists'));
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'src/v2-indesign-2023-and-newer/install-Win.bat')), 'Windows installer exists'));
  
  // Check script files exist
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'scripts/version.js')), 'version.js script exists'));
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'scripts/build.js')), 'build.js script exists'));
  results.push(assert(fs.existsSync(path.join(ROOT_DIR, 'scripts/release.js')), 'release.js script exists'));
  
  return results;
}

/**
 * Test: Package.json validation
 */
function testPackageJson() {
  const results = [];
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
    
    results.push(assert(packageJson.name === 'lorem-chatum-for-indesign', 'Package name is correct'));
    results.push(assert(typeof packageJson.version === 'string', 'Version is a string'));
    results.push(assertMatch(packageJson.version, /^\d+\.\d+\.\d+/, 'Version follows semver format'));
    results.push(assert(packageJson.license === 'Apache-2.0', 'License is Apache-2.0'));
    results.push(assert(packageJson.scripts && typeof packageJson.scripts === 'object', 'Scripts section exists'));
    results.push(assert(packageJson.scripts.test, 'Test script exists'));
    results.push(assert(packageJson.scripts.build, 'Build script exists'));
    results.push(assert(packageJson.scripts.release, 'Release script exists'));
    
  } catch (error) {
    results.push(assert(false, `Failed to parse package.json: ${error.message}`));
  }
  
  return results;
}

/**
 * Test: Version script functionality
 */
function testVersionScript() {
  const results = [];
  
  try {
    const { getVersion } = require(path.join(ROOT_DIR, 'scripts/version.js'));
    const version = getVersion();
    
    results.push(assert(typeof version === 'string', 'getVersion returns a string'));
    results.push(assert(version.length > 0, 'Version is not empty'));
    results.push(assertMatch(version, /^\d+\.\d+\.\d+/, 'Version follows semver format (basic)'));
    
  } catch (error) {
    results.push(assert(false, `Version script test failed: ${error.message}`));
  }
  
  return results;
}

/**
 * Test: Source file syntax validation
 */
function testSourceFileSyntax() {
  const results = [];
  
  const sourceFiles = [
    'src/v1-indesign-2022-and-older/Lorem-Chatum-v1.jsx',
    'src/v2-indesign-2023-and-newer/Lorem-Chatum-v2.idjs'
  ];
  
  sourceFiles.forEach(filePath => {
    try {
      const fullPath = path.join(ROOT_DIR, filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Basic syntax checks
      results.push(assert(content.includes('OPENAI_API_KEY'), `${filePath} contains OPENAI_API_KEY`));
      results.push(assert(content.includes('Lorem Chatum'), `${filePath} contains Lorem Chatum header`));
      results.push(assert(content.length > 1000, `${filePath} has substantial content`));
      
      // Check for required functions (v2 specific)
      if (filePath.includes('v2')) {
        results.push(assert(content.includes('async function'), `${filePath} uses async functions`));
        results.push(assert(content.includes('fetch'), `${filePath} uses fetch for API calls`));
      }
      
    } catch (error) {
      results.push(assert(false, `Failed to read ${filePath}: ${error.message}`));
    }
  });
  
  return results;
}

/**
 * Test: Build script functionality
 */
function testBuildScript() {
  const results = [];
  
  try {
    // Test that build script can be imported
    const { build } = require(path.join(ROOT_DIR, 'scripts/build.js'));
    results.push(assert(typeof build === 'function', 'Build function is exported'));
    
    // Test that fs-extra and archiver are available
    const fsExtra = require('fs-extra');
    const archiver = require('archiver');
    results.push(assert(typeof fsExtra.ensureDir === 'function', 'fs-extra is available'));
    results.push(assert(typeof archiver === 'function', 'archiver is available'));
    
  } catch (error) {
    results.push(assert(false, `Build script test failed: ${error.message}`));
  }
  
  return results;
}

/**
 * Test: Installer file validation
 */
function testInstallerFiles() {
  const results = [];
  
  try {
    const macInstaller = fs.readFileSync(path.join(ROOT_DIR, 'src/v2-indesign-2023-and-newer/install-Mac.command'), 'utf8');
    const winInstaller = fs.readFileSync(path.join(ROOT_DIR, 'src/v2-indesign-2023-and-newer/install-Win.bat'), 'utf8');
    
    // Mac installer checks
    results.push(assert(macInstaller.includes('#!/usr/bin/env python3'), 'Mac installer has correct shebang'));
    results.push(assert(macInstaller.includes('platform.openai.com'), 'Mac installer mentions OpenAI'));
    results.push(assert(macInstaller.includes('LOREM CHATUM'), 'Mac installer has title'));
    
    // Windows installer checks
    results.push(assert(winInstaller.includes('@echo off'), 'Windows installer has correct header'));
    results.push(assert(winInstaller.includes('platform.openai.com'), 'Windows installer mentions OpenAI'));
    results.push(assert(winInstaller.includes('LOREM CHATUM'), 'Windows installer has title'));
    
  } catch (error) {
    results.push(assert(false, `Installer file test failed: ${error.message}`));
  }
  
  return results;
}

/**
 * Main test runner
 */
function runAllTests() {
  console.log(`${colors.bright}${colors.blue}Lorem Chatum Test Suite${colors.reset}`);
  console.log(`${colors.blue}========================${colors.reset}`);
  
  const testSuites = [
    ['File Structure', testFileStructure],
    ['Package.json', testPackageJson],
    ['Version Script', testVersionScript],
    ['Source File Syntax', testSourceFileSyntax],
    ['Build Script', testBuildScript],
    ['Installer Files', testInstallerFiles]
  ];
  
  testSuites.forEach(([name, testFunction]) => {
    runTest(name, testFunction);
  });
  
  // Print summary
  console.log(`\n${colors.bright}${colors.blue}Test Summary${colors.reset}`);
  console.log(`${colors.blue}============${colors.reset}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Total: ${testResults.passed + testResults.failed}`);
  
  if (testResults.failed > 0) {
    console.log(`\n${colors.red}Some tests failed!${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}All tests passed!${colors.reset}`);
  }
}

// Watch mode
if (process.argv.includes('--watch')) {
  console.log('Starting test watcher...');
  
  const chokidar = require('chokidar');
  const watcher = chokidar.watch([
    path.join(ROOT_DIR, 'src/**/*'),
    path.join(ROOT_DIR, 'test/**/*'),
    path.join(ROOT_DIR, 'scripts/**/*'),
    path.join(ROOT_DIR, 'package.json')
  ], {
    ignoreInitial: true,
    ignored: /node_modules/
  });
  
  watcher.on('change', (path) => {
    console.log(`\n${colors.yellow}File changed: ${path}${colors.reset}`);
    console.log('Re-running tests...\n');
    runAllTests();
  });
  
  // Initial run
  runAllTests();
} else {
  // Single run
  runAllTests();
}