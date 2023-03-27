@echo off
setlocal enabledelayedexpansion

echo.
echo ### LOREM CHATUM
echo.
echo Go to https://platform.openai.com/account/api-keys and create an OpenAI API secret key.
echo.
echo Now paste the key here and press Enter:
set /p OPENAI_API_KEY=

set SCRIPT_NAME=Lorem-Chatum-v2.idjs
set INDESIGN_BASE_PATH=%USERPROFILE%\AppData\Roaming\Adobe\InDesign
set SCRIPTS_PANEL=Scripts Panel

for /f "tokens=* delims=" %%v in ('dir /b /ad /o-n "%INDESIGN_BASE_PATH%\Version *.*"') do (
    set LATEST_VERSION_FOLDER=%%v
    goto :break
)
:break

for /f "tokens=* delims=" %%l in ('dir /b /ad "%INDESIGN_BASE_PATH%\%LATEST_VERSION_FOLDER%"') do (
    set LANGUAGE_FOLDER=%%l
    goto :break2
)
:break2

set TARGET_FOLDER=%INDESIGN_BASE_PATH%\%LATEST_VERSION_FOLDER%\%LANGUAGE_FOLDER%\%SCRIPTS_PANEL%
set TARGET_FILE=%TARGET_FOLDER%\%SCRIPT_NAME%

echo Original script path: %SCRIPT_NAME%
echo Target folder: %TARGET_FOLDER%

copy "%SCRIPT_NAME%" "%TARGET_FOLDER%" >nul
if errorlevel 1 (
    echo Error: Failed to copy the script to the target folder.
    exit /b 1
)

echo Replacing API key...
(
    for /f "tokens=1,* delims=]" %%a in ('find /n /v "" "%TARGET_FILE%"') do (
        set "line=%%b"
        if "!line!" == "const OPENAI_API_KEY = ""sk-"";" (
            echo const OPENAI_API_KEY = ""%OPENAI_API_KEY%"";
        ) else (
            echo.!line!
        )
    )
) > "%TARGET_FILE%.tmp"

move /y "%TARGET_FILE%.tmp" "%TARGET_FILE%" >nul

echo.
echo Successfully installed %SCRIPT_NAME% in %TARGET_FOLDER%.
echo.
echo 1. Run Adobe InDesign, open Window > Utilities > Scripts, and in the Script panel, open User.
echo 2. Select a text frame and 2x-click Lorem-Chatum.idjs.
echo.
pause
