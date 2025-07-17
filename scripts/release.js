#!/usr/bin/env node
// this_file: scripts/release.js

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { getVersion, updateVersionInFiles } = require('./version');
const { build } = require('./build');

/**
 * Check if working directory is clean
 */
function checkCleanWorkingDirectory() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.error('Working directory is not clean. Please commit or stash changes first.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to check git status:', error.message);
    process.exit(1);
  }
}

/**
 * Validate that we're on the correct branch
 */
function validateBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (branch !== 'main' && branch !== 'master') {
      console.warn(`Warning: You are on branch '${branch}', not 'main' or 'master'`);
    }
  } catch (error) {
    console.error('Failed to check current branch:', error.message);
    process.exit(1);
  }
}

/**
 * Create and push git tag
 */
function createGitTag(version) {
  try {
    const tagName = `v${version}`;
    
    // Check if tag already exists
    try {
      execSync(`git rev-parse ${tagName}`, { stdio: 'ignore' });
      console.error(`Tag ${tagName} already exists`);
      process.exit(1);
    } catch (error) {
      // Tag doesn't exist, which is what we want
    }
    
    // Create tag
    execSync(`git tag -a ${tagName} -m "Release ${version}"`, { stdio: 'inherit' });
    console.log(`Created tag: ${tagName}`);
    
    // Push tag
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
    console.log(`Pushed tag: ${tagName}`);
    
    return tagName;
  } catch (error) {
    console.error('Failed to create or push tag:', error.message);
    process.exit(1);
  }
}

/**
 * Update package.json version
 */
function updatePackageVersion(version) {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Updated package.json version to ${version}`);
}

/**
 * Main release function
 */
async function release() {
  console.log('Starting release process...');
  
  const args = process.argv.slice(2);
  const version = args[0];
  
  if (!version) {
    console.error('Please provide a version number (e.g., npm run release 2.1.0)');
    process.exit(1);
  }
  
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    console.error('Version must be in format X.Y.Z (e.g., 2.1.0)');
    process.exit(1);
  }
  
  try {
    // Pre-release checks
    validateBranch();
    checkCleanWorkingDirectory();
    
    // Update versions
    updatePackageVersion(version);
    updateVersionInFiles(version);
    
    // Commit version changes
    execSync(`git add package.json src/`, { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump version to ${version}"`, { stdio: 'inherit' });
    
    // Create and push tag
    createGitTag(version);
    
    // Build
    await build();
    
    console.log(`\nRelease ${version} completed successfully!`);
    console.log('GitHub Actions will now build and create the release artifacts.');
    
  } catch (error) {
    console.error('Release failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  release();
}

module.exports = { release };