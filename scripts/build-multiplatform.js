#!/usr/bin/env node
// this_file: scripts/build-multiplatform.js

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { getVersion } = require('./version');

const BUILD_DIR = path.join(__dirname, '../build');
const DIST_DIR = path.join(__dirname, '../dist');
const PLATFORMS_DIR = path.join(DIST_DIR, 'platforms');

/**
 * Create platform-specific packages
 */
async function createPlatformPackages() {
  const version = getVersion();
  await fs.ensureDir(PLATFORMS_DIR);
  
  const platforms = [
    {
      name: 'macos',
      displayName: 'macOS',
      files: [
        'src/v2-indesign-2023-and-newer/Lorem-Chatum-v2.idjs',
        'src/v2-indesign-2023-and-newer/install-Mac.command',
        'src/v1-indesign-2022-and-older/Lorem-Chatum-v1.jsx',
        'LICENSE.txt',
        'README.md'
      ],
      installer: 'install-Mac.command'
    },
    {
      name: 'windows',
      displayName: 'Windows',
      files: [
        'src/v2-indesign-2023-and-newer/Lorem-Chatum-v2.idjs',
        'src/v2-indesign-2023-and-newer/install-Win.bat',
        'src/v1-indesign-2022-and-older/Lorem-Chatum-v1.jsx',
        'LICENSE.txt',
        'README.md'
      ],
      installer: 'install-Win.bat'
    },
    {
      name: 'universal',
      displayName: 'Universal',
      files: [
        'src/',
        'LICENSE.txt',
        'README.md',
        'documentation/'
      ],
      installer: null
    }
  ];
  
  for (const platform of platforms) {
    await createPlatformPackage(platform, version);
  }
}

/**
 * Create a platform-specific package
 */
async function createPlatformPackage(platform, version) {
  const packageDir = path.join(PLATFORMS_DIR, platform.name);
  await fs.ensureDir(packageDir);
  
  console.log(`Creating ${platform.displayName} package...`);
  
  // Copy files
  for (const file of platform.files) {
    const srcPath = path.join(BUILD_DIR, file);
    const destPath = path.join(packageDir, file);
    
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
    }
  }
  
  // Create platform-specific README
  await createPlatformReadme(platform, packageDir, version);
  
  // Create ZIP archive
  const zipPath = path.join(DIST_DIR, `lorem-chatum-${version}-${platform.name}.zip`);
  await createZipArchive(packageDir, zipPath);
  
  console.log(`Created ${platform.displayName} package: ${path.basename(zipPath)}`);
}

/**
 * Create platform-specific README
 */
async function createPlatformReadme(platform, packageDir, version) {
  const readmePath = path.join(packageDir, 'README.md');
  
  let content = `# Lorem Chatum v${version} - ${platform.displayName} Package

This package contains the ${platform.displayName}-specific version of Lorem Chatum for Adobe InDesign.

## Quick Start

`;

  if (platform.installer) {
    content += `### Automated Installation (Recommended)

1. Have your OpenAI API key ready
2. Double-click \`${platform.installer}\`
3. Follow the prompts to enter your API key
4. The script will be automatically installed

### Manual Installation

`;
  }

  content += `1. Open your Adobe InDesign Scripts Panel folder:
   - **InDesign 2023+**: Copy \`Lorem-Chatum-v2.idjs\` to your Scripts Panel folder
   - **InDesign 2022 and older**: Copy \`Lorem-Chatum-v1.jsx\` to your Scripts Panel folder

2. Edit the script file to add your OpenAI API key:
   - Find the line: \`const OPENAI_API_KEY = "sk-";\`
   - Replace \`"sk-"\` with your actual API key

3. Restart InDesign if it was running

## Usage

1. Open InDesign and go to Window > Utilities > Scripts
2. Find the Lorem Chatum script in the User folder
3. Select a text frame and double-click the script

## Support

For full documentation and support, visit:
https://github.com/twardoch/lorem-chatum-for-indesign

## Version Information

- Version: ${version}
- Platform: ${platform.displayName}
- Build Date: ${new Date().toISOString()}
`;

  await fs.writeFile(readmePath, content);
}

/**
 * Create ZIP archive from directory
 */
async function createZipArchive(sourceDir, zipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    output.on('close', () => resolve(zipPath));
    archive.on('error', reject);
    
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

/**
 * Create checksums for all files
 */
async function createChecksums() {
  const crypto = require('crypto');
  const checksumFile = path.join(DIST_DIR, 'checksums.txt');
  
  const files = await fs.readdir(DIST_DIR);
  const zipFiles = files.filter(file => file.endsWith('.zip'));
  
  let checksumContent = `# Lorem Chatum Release Checksums\n# Generated: ${new Date().toISOString()}\n\n`;
  
  for (const file of zipFiles) {
    const filePath = path.join(DIST_DIR, file);
    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    checksumContent += `${hash}  ${file}\n`;
  }
  
  await fs.writeFile(checksumFile, checksumContent);
  console.log('Created checksums file');
}

/**
 * Main function
 */
async function buildMultiplatform() {
  console.log('Building multiplatform packages...');
  
  try {
    await createPlatformPackages();
    await createChecksums();
    
    console.log('✅ Multiplatform build completed successfully!');
    
  } catch (error) {
    console.error('❌ Multiplatform build failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  buildMultiplatform();
}

module.exports = { buildMultiplatform, createPlatformPackages };