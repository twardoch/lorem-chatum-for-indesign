#!/usr/bin/env python3


# This script installs the Lorem Chatum script in Adobe InDesign
# It prompts the user to enter their OpenAI API secret key
# It then locates the InDesign Scripts Panel folder and installs the script there

import re
import shutil
from pathlib import Path


def install_indesign_script(file_name):
    # Prompt user to enter OpenAI API secret key
    print("\n\n\n### LOREM CHATUM\n\n")
    print(
        "Go to https://platform.openai.com/account/api-keys and create an OpenAI API secret key."
    )
    print("\nNow paste the key here and press Enter:")
    openAiKey = input()

    # Locate the file in the same folder as the current Python file
    script_path = Path(__file__).parent / file_name

    # Locate the InDesign Scripts Panel folder
    indesign_base_path = Path.home() / "Library" / "Preferences" / "Adobe InDesign"

    # Find the highest version number folder
    version_folders = sorted(
        indesign_base_path.glob("Version *.*"),
        key=lambda x: tuple(map(int, re.findall(r"\d+", x.name))),
        reverse=True,
    )

    if not version_folders:
        raise FileNotFoundError("No Adobe InDesign Version folder found")

    latest_version_folder = version_folders[0]

    # Find the first language folder
    language_folders = list(latest_version_folder.glob("*_*"))

    if not language_folders:
        raise FileNotFoundError(
            "No language folder found in the Adobe InDesign Version folder"
        )

    language_folder = language_folders[0]

    # Copy the script file into the Scripts Panel folder
    scripts_panel_folder = language_folder / "Scripts" / "Scripts Panel"
    scripts_panel_path = scripts_panel_folder / file_name
    scripts_panel_path.write_text(
        script_path.read_text().replace(
            """const OPENAI_API_KEY = "sk-";""",
            f"""const OPENAI_API_KEY = "{openAiKey}";""",
        )
    )
    print(
        f"""\n\nSuccessfully installed `{file_name}` in `{scripts_panel_folder}`.\n\n1. Run Adobe InDesign, open `Window > Utilities > Scripts`, and in the Script panel, open `User`.\n\n2. Select a text frame and 2x-click `Lorem-Chatum.idjs`.\n\n"""
    )


# Example usage
install_indesign_script("Lorem-Chatum-v2.idjs")
