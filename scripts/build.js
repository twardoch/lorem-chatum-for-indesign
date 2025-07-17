#!/usr/bin/env node
// this_file: scripts/build.js

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { getVersion } = require('./version');
const { buildMultiplatform } = require('./build-multiplatform');
const { buildArtifacts } = require('./build-artifacts');

const BUILD_DIR = path.join(__dirname, '../build');
const DIST_DIR = path.join(__dirname, '../dist');

/**
 * Clean build and dist directories
 */
async function clean() {
  await fs.remove(BUILD_DIR);
  await fs.remove(DIST_DIR);
  await fs.ensureDir(BUILD_DIR);
  await fs.ensureDir(DIST_DIR);
  console.log('Cleaned build and dist directories');
}

/**
 * Copy source files to build directory
 */
async function copySource() {
  await fs.copy(path.join(__dirname, '../src'), path.join(BUILD_DIR, 'src'));
  await fs.copy(path.join(__dirname, '../LICENSE.txt'), path.join(BUILD_DIR, 'LICENSE.txt'));
  await fs.copy(path.join(__dirname, '../README.md'), path.join(BUILD_DIR, 'README.md'));
  
  // Copy documentation if it exists
  const docPath = path.join(__dirname, '../documentation');
  if (await fs.pathExists(docPath)) {
    await fs.copy(docPath, path.join(BUILD_DIR, 'documentation'));
  }
  
  console.log('Copied source files to build directory');
}

/**
 * Create zip archive
 */
async function createZip() {
  const version = getVersion();
  const zipPath = path.join(DIST_DIR, `lorem-chatum-for-indesign-${version}.zip`);
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Best compression
    });
    
    output.on('close', () => {
      console.log(`Created ${zipPath} (${archive.pointer()} bytes)`);
      resolve(zipPath);
    });
    
    archive.on('error', reject);
    archive.pipe(output);
    
    // Add all files from build directory
    archive.directory(BUILD_DIR, false);
    archive.finalize();
  });
}

/**
 * Create platform-specific installers
 */
async function createInstallers() {
  const version = getVersion();
  const installersDir = path.join(DIST_DIR, 'installers');
  await fs.ensureDir(installersDir);
  
  // Copy v2 installers
  await fs.copy(
    path.join(BUILD_DIR, 'src/v2-indesign-2023-and-newer/install-Mac.command'),
    path.join(installersDir, `lorem-chatum-v${version}-install-Mac.command`)
  );
  
  await fs.copy(
    path.join(BUILD_DIR, 'src/v2-indesign-2023-and-newer/install-Win.bat'),
    path.join(installersDir, `lorem-chatum-v${version}-install-Win.bat`)
  );
  
  console.log('Created platform-specific installers');
}

/**
 * Main build function
 */
async function build() {
  console.log('Starting build process...');
  const startTime = Date.now();
  
  try {
    await clean();
    await copySource();
    await createZip();
    await createInstallers();
    await buildMultiplatform();
    await buildArtifacts();
    
    const duration = Date.now() - startTime;
    console.log(`Build completed successfully in ${duration}ms`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  build();
}

module.exports = { build };