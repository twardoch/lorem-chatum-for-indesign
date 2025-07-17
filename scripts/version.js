#!/usr/bin/env node
// this_file: scripts/version.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Get version from git tags or fallback to package.json
 * @returns {string} The current version
 */
function getVersion() {
  try {
    // Try to get version from git tags
    const gitTag = execSync('git describe --tags --exact-match HEAD 2>/dev/null', { 
      encoding: 'utf8' 
    }).trim();
    
    if (gitTag.match(/^v?\d+\.\d+\.\d+/)) {
      return gitTag.replace(/^v/, ''); // Remove 'v' prefix if present
    }
  } catch (error) {
    // If no exact tag match, try to get latest tag and add commit info
    try {
      const latestTag = execSync('git describe --tags --abbrev=0 2>/dev/null', { 
        encoding: 'utf8' 
      }).trim();
      
      const commitHash = execSync('git rev-parse --short HEAD', { 
        encoding: 'utf8' 
      }).trim();
      
      if (latestTag.match(/^v?\d+\.\d+\.\d+/)) {
        const cleanTag = latestTag.replace(/^v/, '');
        return `${cleanTag}-dev+${commitHash}`;
      }
    } catch (error) {
      // Fallback to package.json
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
      return packageJson.version;
    }
  }
  
  // Final fallback
  return '0.0.0';
}

/**
 * Update version in source files
 * @param {string} version - The version to set
 */
function updateVersionInFiles(version) {
  const files = [
    'src/v1-indesign-2022-and-older/Lorem-Chatum-v1.jsx',
    'src/v2-indesign-2023-and-newer/Lorem-Chatum-v2.idjs'
  ];
  
  files.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update version in comment header
      content = content.replace(
        /\/\/ Lorem Chatum v[\d\.]+ for Adobe InDesign/,
        `// Lorem Chatum v${version} for Adobe InDesign`
      );
      
      // Add or update version constant
      if (content.includes('const VERSION')) {
        content = content.replace(
          /const VERSION = ["'][^"']*["'];/,
          `const VERSION = "${version}";`
        );
      } else {
        // Add VERSION constant after API key
        content = content.replace(
          /(const OPENAI_API_KEY = ["'][^"']*["'];)/,
          `$1\nconst VERSION = "${version}";`
        );
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated version to ${version} in ${filePath}`);
    }
  });
}

if (require.main === module) {
  const version = getVersion();
  console.log(`Current version: ${version}`);
  updateVersionInFiles(version);
}

module.exports = { getVersion, updateVersionInFiles };