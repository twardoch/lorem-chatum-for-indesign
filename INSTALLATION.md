# Installation Guide

This guide provides detailed instructions for installing Lorem Chatum for Adobe InDesign.

## Prerequisites

- Adobe InDesign 2022 or newer
- OpenAI API key (get one at https://platform.openai.com/account/api-keys)
- Your OpenAI account must have billing set up

## Quick Installation

### 1. Download the Latest Release

Go to the [releases page](https://github.com/twardoch/lorem-chatum-for-indesign/releases) and download the appropriate package:

- **Windows**: `lorem-chatum-vX.X.X-windows.zip`
- **macOS**: `lorem-chatum-vX.X.X-macos.zip`
- **Universal**: `lorem-chatum-vX.X.X-universal.zip` (all platforms)

### 2. Extract the Archive

Extract the downloaded zip file to a temporary location.

### 3. Run the Installer

#### Windows
1. Double-click `install-Win.bat`
2. When prompted, paste your OpenAI API key
3. Press Enter to continue

#### macOS
1. Double-click `install-Mac.command`
2. When prompted, paste your OpenAI API key
3. Press Enter to continue

### 4. Restart InDesign

If Adobe InDesign was running during installation, restart it to load the new script.

## Manual Installation

If the automated installer doesn't work, you can install manually:

### Step 1: Locate Your Scripts Panel Folder

Open Adobe InDesign and go to:
- **Window > Utilities > Scripts**
- Right-click on the "User" folder
- Select "Reveal in Finder" (macOS) or "Reveal in Explorer" (Windows)

This will open your Scripts Panel folder.

### Step 2: Choose the Right Script Version

- **InDesign 2023 and newer**: Use `Lorem-Chatum-v2.idjs`
- **InDesign 2022 and older**: Use `Lorem-Chatum-v1.jsx`

### Step 3: Add Your API Key

1. Open the script file in a text editor
2. Find the line that says:
   ```javascript
   const OPENAI_API_KEY = "sk-";
   ```
3. Replace `"sk-"` with your actual API key:
   ```javascript
   const OPENAI_API_KEY = "sk-your-actual-api-key-here";
   ```
4. Save the file

### Step 4: Copy to Scripts Panel

Copy the modified script file to your Scripts Panel folder.

### Step 5: Restart InDesign

Restart Adobe InDesign if it was running.

## Troubleshooting

### Common Issues

#### "Script not found" Error
- Make sure you copied the script to the correct Scripts Panel folder
- Restart InDesign after copying the script

#### "API key not valid" Error
- Verify your API key is correct and starts with "sk-"
- Make sure your OpenAI account has billing set up
- Check that you have sufficient credits in your OpenAI account

#### "No text frame selected" Error
- Select a text frame before running the script
- Make sure the text frame is not grouped or locked

#### Permission Errors (macOS)
If you get permission errors with the installer:
1. Open Terminal
2. Navigate to the folder containing the installer
3. Run: `chmod +x install-Mac.command`
4. Try running the installer again

#### Script Doesn't Appear in Scripts Panel
- Check that the script file has the correct extension (.idjs for v2, .jsx for v1)
- Verify you're looking in the "User" folder in the Scripts Panel
- Try refreshing the Scripts Panel by right-clicking and selecting "Refresh"

### Getting Help

If you continue to have issues:

1. Check the [GitHub Issues](https://github.com/twardoch/lorem-chatum-for-indesign/issues) page
2. Create a new issue with:
   - Your operating system
   - InDesign version
   - Error message (if any)
   - Steps you've already tried

## Uninstallation

To remove Lorem Chatum:

1. Open the Scripts Panel folder (Window > Utilities > Scripts > right-click User > Reveal in Finder/Explorer)
2. Delete the Lorem Chatum script files:
   - `Lorem-Chatum-v2.idjs`
   - `Lorem-Chatum-v1.jsx`
3. Restart InDesign

## Security Notes

- Your API key is stored in plain text in the script file
- Only install scripts from trusted sources
- Keep your API key secure and don't share it
- Monitor your OpenAI usage to avoid unexpected charges

## Version Information

This installation guide is for Lorem Chatum version 2.0.0 and newer. For older versions, refer to the documentation included with your download.