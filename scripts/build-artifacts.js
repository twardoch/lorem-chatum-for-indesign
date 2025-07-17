#!/usr/bin/env node
// this_file: scripts/build-artifacts.js

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { getVersion } = require('./version');

const DIST_DIR = path.join(__dirname, '../dist');
const ARTIFACTS_DIR = path.join(DIST_DIR, 'artifacts');

/**
 * Generate artifact metadata
 */
async function generateArtifactMetadata() {
  const version = getVersion();
  const buildDate = new Date().toISOString();
  
  const metadata = {
    version,
    buildDate,
    platform: process.platform,
    nodeVersion: process.version,
    artifacts: [],
    checksums: {}
  };
  
  // Scan for artifacts
  const files = await fs.readdir(DIST_DIR);
  
  for (const file of files) {
    const filePath = path.join(DIST_DIR, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isFile() && (file.endsWith('.zip') || file.endsWith('.tar.gz'))) {
      const fileBuffer = await fs.readFile(filePath);
      const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      const sha1 = crypto.createHash('sha1').update(fileBuffer).digest('hex');
      
      metadata.artifacts.push({
        name: file,
        size: stat.size,
        sha256,
        sha1,
        created: stat.ctime.toISOString()
      });
      
      metadata.checksums[file] = {
        sha256,
        sha1
      };
    }
  }
  
  return metadata;
}

/**
 * Create release manifest
 */
async function createReleaseManifest() {
  const metadata = await generateArtifactMetadata();
  
  const manifest = {
    name: 'lorem-chatum-for-indesign',
    version: metadata.version,
    description: 'Generate contextually-aware placeholder text in Adobe InDesign using ChatGPT',
    homepage: 'https://github.com/twardoch/lorem-chatum-for-indesign',
    repository: 'https://github.com/twardoch/lorem-chatum-for-indesign.git',
    license: 'Apache-2.0',
    author: 'Adam Twardoch',
    build: {
      date: metadata.buildDate,
      platform: metadata.platform,
      nodeVersion: metadata.nodeVersion
    },
    downloads: metadata.artifacts.map(artifact => ({
      name: artifact.name,
      size: artifact.size,
      url: `https://github.com/twardoch/lorem-chatum-for-indesign/releases/download/v${metadata.version}/${artifact.name}`,
      checksums: {
        sha256: artifact.sha256,
        sha1: artifact.sha1
      }
    })),
    installation: {
      macos: {
        file: `lorem-chatum-${metadata.version}-macos.zip`,
        installer: 'install-Mac.command',
        requirements: ['Adobe InDesign 2022 or newer', 'OpenAI API key']
      },
      windows: {
        file: `lorem-chatum-${metadata.version}-windows.zip`,
        installer: 'install-Win.bat',
        requirements: ['Adobe InDesign 2022 or newer', 'OpenAI API key']
      },
      universal: {
        file: `lorem-chatum-${metadata.version}-universal.zip`,
        installer: 'Manual installation required',
        requirements: ['Adobe InDesign 2022 or newer', 'OpenAI API key']
      }
    }
  };
  
  return manifest;
}

/**
 * Create binary distribution info
 */
async function createBinaryInfo() {
  const version = getVersion();
  
  const binaryInfo = {
    name: 'Lorem Chatum for Adobe InDesign',
    version: version,
    type: 'javascript-addon',
    target: 'adobe-indesign',
    supported_versions: {
      'indesign-2023+': {
        script: 'Lorem-Chatum-v2.idjs',
        engine: 'UXP JavaScript',
        features: ['async-await', 'fetch-api', 'modern-dialogs']
      },
      'indesign-2022-': {
        script: 'Lorem-Chatum-v1.jsx',
        engine: 'ExtendScript',
        features: ['legacy-dialogs', 'restix-http']
      }
    },
    platforms: {
      'windows': {
        supported: true,
        installer: 'install-Win.bat',
        requirements: ['Windows 10+', 'Adobe InDesign']
      },
      'macos': {
        supported: true,
        installer: 'install-Mac.command',
        requirements: ['macOS 10.14+', 'Adobe InDesign']
      },
      'linux': {
        supported: false,
        reason: 'Adobe InDesign not available on Linux'
      }
    },
    dependencies: {
      runtime: ['OpenAI API access'],
      development: ['Node.js 16+', 'npm']
    }
  };
  
  return binaryInfo;
}

/**
 * Generate installation scripts
 */
async function generateInstallationScripts() {
  const version = getVersion();
  
  // PowerShell installer for Windows
  const powershellInstaller = `# Lorem Chatum v${version} - PowerShell Installer
# This script installs Lorem Chatum for Adobe InDesign

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey,
    
    [Parameter(Mandatory=$false)]
    [string]$InDesignVersion = "auto"
)

Write-Host "Lorem Chatum v${version} Installer" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Validate API key format
if (-not $ApiKey.StartsWith("sk-")) {
    Write-Error "Invalid API key format. Must start with 'sk-'"
    exit 1
}

# Find InDesign installation
$indesignPath = "$env:USERPROFILE\\AppData\\Roaming\\Adobe\\InDesign"
if (-not (Test-Path $indesignPath)) {
    Write-Error "Adobe InDesign not found. Please install InDesign first."
    exit 1
}

# Find latest version
$versions = Get-ChildItem -Path $indesignPath -Directory | Where-Object { $_.Name -like "Version*" } | Sort-Object Name -Descending
if ($versions.Count -eq 0) {
    Write-Error "No InDesign versions found"
    exit 1
}

$latestVersion = $versions[0]
Write-Host "Found InDesign version: $($latestVersion.Name)" -ForegroundColor Yellow

# Find Scripts Panel folder
$scriptsPath = Join-Path $latestVersion.FullName "en_US\\Scripts\\Scripts Panel"
if (-not (Test-Path $scriptsPath)) {
    Write-Error "Scripts Panel folder not found at: $scriptsPath"
    exit 1
}

# Install scripts
$scriptV2 = "Lorem-Chatum-v2.idjs"
$scriptV1 = "Lorem-Chatum-v1.jsx"

# Copy and modify v2 script
if (Test-Path $scriptV2) {
    $content = Get-Content $scriptV2 -Raw
    $content = $content -replace 'const OPENAI_API_KEY = "sk-";', "const OPENAI_API_KEY = \`"$ApiKey\`";"
    $targetPath = Join-Path $scriptsPath $scriptV2
    Set-Content -Path $targetPath -Value $content
    Write-Host "Installed: $scriptV2" -ForegroundColor Green
}

# Copy and modify v1 script
if (Test-Path $scriptV1) {
    $content = Get-Content $scriptV1 -Raw
    $content = $content -replace "const OPENAI_API_KEY = 'sk-';", "const OPENAI_API_KEY = '$ApiKey';"
    $targetPath = Join-Path $scriptsPath $scriptV1
    Set-Content -Path $targetPath -Value $content
    Write-Host "Installed: $scriptV1" -ForegroundColor Green
}

Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "Please restart Adobe InDesign if it's currently running." -ForegroundColor Yellow
`;

  // Bash installer for macOS/Linux
  const bashInstaller = `#!/bin/bash
# Lorem Chatum v${version} - Bash Installer
# This script installs Lorem Chatum for Adobe InDesign

set -e

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
API_KEY=""
INDESIGN_VERSION="auto"

echo "Lorem Chatum v${version} Installer"
echo "================================="

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --api-key)
            API_KEY="$2"
            shift 2
            ;;
        --indesign-version)
            INDESIGN_VERSION="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 --api-key <your-api-key> [--indesign-version <version>]"
            echo "  --api-key: Your OpenAI API key (required)"
            echo "  --indesign-version: Specific InDesign version (optional)"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if API key is provided
if [[ -z "$API_KEY" ]]; then
    echo "Error: API key is required"
    echo "Usage: $0 --api-key <your-api-key>"
    exit 1
fi

# Validate API key format
if [[ ! "$API_KEY" =~ ^sk- ]]; then
    echo "Error: Invalid API key format. Must start with 'sk-'"
    exit 1
fi

# Find InDesign installation
INDESIGN_BASE="$HOME/Library/Preferences/Adobe InDesign"
if [[ ! -d "$INDESIGN_BASE" ]]; then
    echo "Error: Adobe InDesign not found. Please install InDesign first."
    exit 1
fi

# Find latest version
LATEST_VERSION=$(ls -1 "$INDESIGN_BASE" | grep "Version" | sort -V | tail -1)
if [[ -z "$LATEST_VERSION" ]]; then
    echo "Error: No InDesign versions found"
    exit 1
fi

echo "Found InDesign version: $LATEST_VERSION"

# Find Scripts Panel folder
SCRIPTS_PATH="$INDESIGN_BASE/$LATEST_VERSION/en_US/Scripts/Scripts Panel"
if [[ ! -d "$SCRIPTS_PATH" ]]; then
    echo "Error: Scripts Panel folder not found at: $SCRIPTS_PATH"
    exit 1
fi

# Install scripts
SCRIPT_V2="Lorem-Chatum-v2.idjs"
SCRIPT_V1="Lorem-Chatum-v1.jsx"

# Copy and modify v2 script
if [[ -f "$SCRIPT_V2" ]]; then
    sed "s/const OPENAI_API_KEY = \\"sk-\\";/const OPENAI_API_KEY = \\"$API_KEY\\";/" "$SCRIPT_V2" > "$SCRIPTS_PATH/$SCRIPT_V2"
    echo "Installed: $SCRIPT_V2"
fi

# Copy and modify v1 script
if [[ -f "$SCRIPT_V1" ]]; then
    sed "s/const OPENAI_API_KEY = 'sk-';/const OPENAI_API_KEY = '$API_KEY';/" "$SCRIPT_V1" > "$SCRIPTS_PATH/$SCRIPT_V1"
    echo "Installed: $SCRIPT_V1"
fi

echo "Installation completed successfully!"
echo "Please restart Adobe InDesign if it's currently running."
`;

  return {
    powershell: powershellInstaller,
    bash: bashInstaller
  };
}

/**
 * Main function to build artifacts
 */
async function buildArtifacts() {
  console.log('Building release artifacts...');
  
  try {
    await fs.ensureDir(ARTIFACTS_DIR);
    
    // Generate metadata
    const metadata = await generateArtifactMetadata();
    await fs.writeFile(
      path.join(ARTIFACTS_DIR, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    // Create release manifest
    const manifest = await createReleaseManifest();
    await fs.writeFile(
      path.join(ARTIFACTS_DIR, 'release-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    // Create binary info
    const binaryInfo = await createBinaryInfo();
    await fs.writeFile(
      path.join(ARTIFACTS_DIR, 'binary-info.json'),
      JSON.stringify(binaryInfo, null, 2)
    );
    
    // Generate installation scripts
    const installScripts = await generateInstallationScripts();
    await fs.writeFile(
      path.join(ARTIFACTS_DIR, 'install.ps1'),
      installScripts.powershell
    );
    await fs.writeFile(
      path.join(ARTIFACTS_DIR, 'install.sh'),
      installScripts.bash
    );
    
    // Make bash script executable
    await fs.chmod(path.join(ARTIFACTS_DIR, 'install.sh'), '755');
    
    // Create SBOM (Software Bill of Materials)
    const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, '../package.json'), 'utf8'));
    const sbom = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      license: packageJson.license,
      author: packageJson.author,
      dependencies: packageJson.devDependencies || {},
      generated: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(ARTIFACTS_DIR, 'sbom.json'),
      JSON.stringify(sbom, null, 2)
    );
    
    console.log('✅ Release artifacts created successfully!');
    console.log('Generated files:');
    console.log('  - metadata.json');
    console.log('  - release-manifest.json');
    console.log('  - binary-info.json');
    console.log('  - install.ps1');
    console.log('  - install.sh');
    console.log('  - sbom.json');
    
  } catch (error) {
    console.error('❌ Artifact generation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  buildArtifacts();
}

module.exports = { buildArtifacts, generateArtifactMetadata, createReleaseManifest };