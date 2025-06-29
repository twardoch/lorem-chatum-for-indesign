# _Lorem Chatum_ for Adobe InDesign

**Generate contextually-aware placeholder text in Adobe InDesign using the power of ChatGPT.**

![_Lorem Chatum_ for Adobe InDesign](./documentation/lorem-chatum.gif)

_Lorem Chatum_ is a script for Adobe InDesign that revolutionizes the way you create placeholder text. Instead of traditional static _lorem ipsum_, it leverages OpenAI's ChatGPT (specifically the `gpt-3.5-turbo` model) to generate multilingual, contextually relevant text. This helps you create more realistic and visually cohesive design mockups.

## What it Does

_Lorem Chatum_ offers two primary functionalities:

1.  **Fill Empty Text Frames:** If you select an empty text frame, the script analyzes other text content on the current InDesign page to understand the context. It then prompts ChatGPT to generate new text that fits this context and the selected frame's language.
2.  **Extend Existing Text:** If you select a text frame that already contains text, _Lorem Chatum_ uses that existing text as a starting point and asks ChatGPT to continue writing, effectively extending your current content in the same style and language.

The amount of text generated is intelligently estimated based on the selected text frame's size and its primary font size.

## Who It's For

This tool is designed for:

*   Graphic Designers
*   Layout Artists
*   UI/UX Designers working with print or digital layouts in InDesign
*   Anyone who frequently uses placeholder text and desires something more dynamic and representative than standard _lorem ipsum_.

## Why It's Useful

*   **Contextual Relevance:** Generates placeholder text that aligns with the existing content on your page, making mockups look more realistic.
*   **Multilingual Capabilities:** Supports any language that ChatGPT can handle. Simply set the desired language in InDesign's **Character** panel for the selected text frame.
*   **Improved Design Process:** Helps visualize final layouts more accurately.
*   **Cost-Effective:** While using the OpenAI API is a paid service, it's generally inexpensive for text generation. For example, processing a volume equivalent to Leo Tolstoy’s "War and Peace" (over 1,200 pages, 780k tokens) with the `gpt-3.5-turbo` model would cost approximately US$3. *(Note: GPT-4 models are significantly more expensive).*

## OpenAI API Key Requirement

To use _Lorem Chatum_, you **must** have your own OpenAI API secret key.

1.  **Create an Account:** If you don't have one, sign up at [OpenAI](https://platform.openai.com/).
2.  **Generate a Secret Key:** Navigate to the [API keys section](https://platform.openai.com/account/api-keys) in your OpenAI account settings and create a new secret key. It will look something like `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.
3.  **Billing:** You'll also need to set up billing information in your OpenAI account. New accounts often come with some free credits, but sustained use will incur charges based on the amount of text processed (tokens).

This key will be added to the _Lorem Chatum_ script file during installation.

## Installation

First, download the latest version of the script:

➡️ **[Download _Lorem Chatum_ (main.zip)](https://github.com/twardoch/lorem-chatum-for-indesign/archive/refs/heads/main.zip)**

After downloading, unzip the `lorem-chatum-for-indesign-main.zip` file and navigate into the unzipped `lorem-chatum-for-indesign-main` folder. The installation steps vary depending on your Adobe InDesign version.

### v2 for Adobe InDesign 2023 and Newer (Recommended)

This version uses modern UXP JavaScript and is the actively developed version.
*   **License:** [Apache 2.0 License](src/v2-indesign-2023-and-newer/LICENSE.txt)

The `src/v2-indesign-2023-and-newer/` folder contains the script `Lorem-Chatum-v2.idjs` and installers.

**Using Installers (Easiest Method):**

1.  Have your OpenAI API secret key ready (copied to your clipboard).
2.  **On macOS:**
    *   Navigate to the `src/v2-indesign-2023-and-newer/` folder.
    *   Double-click the `install-Mac.command` file.
    *   A terminal window will open and prompt you to paste your OpenAI API key. Paste it and press Enter.
    *   The script will be automatically installed.
3.  **On Windows:**
    *   Navigate to the `src/v2-indesign-2023-and-newer/` folder.
    *   Double-click the `install-Win.bat` file.
    *   A command prompt window will open and prompt you to paste your OpenAI API key. Paste it and press Enter.
    *   The script will be automatically installed.

**Manual Installation (v2):**

1.  Open `src/v2-indesign-2023-and-newer/Lorem-Chatum-v2.idjs` in a plain text editor (like VS Code, Sublime Text, or even Notepad/TextEdit).
2.  Locate the line:
    ```javascript
    const OPENAI_API_KEY = "sk-";
    ```
3.  Replace `"sk-"` with your actual OpenAI API secret key, keeping the quotes:
    ```javascript
    const OPENAI_API_KEY = "sk-yourActualOpenAIKeyGoesHere";
    ```
4.  Save the file.
5.  Copy the modified `Lorem-Chatum-v2.idjs` file to your InDesign Scripts Panel folder. Common locations:
    *   **macOS:** `~/Library/Preferences/Adobe InDesign/Version X.X/en_US/Scripts/Scripts Panel/` (replace `Version X.X` and `en_US` with your version and language).
    *   **Windows:** `%USERPROFILE%\AppData\Roaming\Adobe\InDesign\Version X.X\en_US\Scripts\Scripts Panel\` (replace `Version X.X` and `en_US` with your version and language).
    *   You can also find this folder by opening InDesign, going to `Window > Utilities > Scripts`, right-clicking on the "User" folder in the Scripts panel, and selecting "Reveal in Finder" (macOS) or "Reveal in Explorer" (Windows).

### v1 for Adobe InDesign 2022 and Older (Legacy)

This version uses the older ExtendScript and is considered legacy.
*   **License:** [GNU General Public License v3.0](src/v1-indesign-2022-and-older/LICENSE.txt) (due to a dependency).

**Manual Installation (v1):**

1.  Open `src/v1-indesign-2022-and-older/Lorem-Chatum-v1.jsx` in a plain text editor.
2.  Locate the line:
    ```javascript
    const OPENAI_API_KEY = 'sk-';
    ```
3.  Replace `'sk-'` with your actual OpenAI API secret key, keeping the quotes:
    ```javascript
    const OPENAI_API_KEY = 'sk-yourActualOpenAIKeyGoesHere';
    ```
4.  Save the file.
5.  Copy the modified `Lorem-Chatum-v1.jsx` file to your InDesign Scripts Panel folder (see locations mentioned in the v2 manual installation section).

## Usage

Once installed (and after restarting InDesign if it was running during installation):

1.  Open Adobe InDesign.
2.  Go to **Window > Utilities > Scripts**. This will open the Scripts panel.
3.  In the Scripts panel, expand the **User** section. You should see `Lorem-Chatum-v2.idjs` or `Lorem-Chatum-v1.jsx` listed.

**Scenario 1: Filling an Empty Text Frame**

1.  Ensure you have some other text frames on your current page that contain text. This text will provide context.
2.  Create a new, empty text frame where you want the generated text.
3.  Select the empty text frame with the **Selection Tool** (the black arrow).
4.  **Important:** Set the desired language for the generated text. Select the text frame, then go to the **Character** panel (`Window > Type & Tables > Character`) and choose the language from the language dropdown menu.
5.  In the Scripts panel, double-click the `Lorem-Chatum` script.
6.  A progress indicator may appear. The script will:
    *   Gather text from other frames on the current page (up to about 500 words).
    *   Estimate the required length based on the frame size.
    *   Send this context to ChatGPT, asking it to generate text in the specified language.
    *   Place the generated text into your selected empty frame.

**Scenario 2: Extending Existing Text in a Frame**

1.  Select a text frame that already contains some text.
2.  **Important:** Ensure the language of the existing text (and the desired language for continuation) is set correctly in the **Character** panel.
3.  In the Scripts panel, double-click the `Lorem-Chatum` script.
4.  The script will:
    *   Take the existing text from the selected frame.
    *   Estimate how much more text is needed to fill the frame.
    *   Send the existing text to ChatGPT, asking it to continue writing in the same style and language.
    *   Append the generated text to the existing content in the frame.

You can repeat the process on the same frame. If you want more text in a frame that was filled, simply make the text frame larger and run the script again on that frame.

## Caveats

*   **Believability:** The text generated by _Lorem Chatum_ can be very authentic and believable. If you're mixing it with real content, ensure you have a system to distinguish placeholder text from final copy.
*   **Fact-Checking:** As with all AI-generated content, do not assume the text is factually accurate or ready for publication without review. It's for placeholder and layout purposes.
*   **API Costs:** While generally low, monitor your OpenAI API usage and associated costs, especially if using the script extensively.

---

## Technical Details

This section delves into the inner workings of _Lorem Chatum_ and provides guidelines for contributors.

### How the Code Works

While v1 (ExtendScript) and v2 (UXP) are implemented differently due to their respective environments, the core logic for interacting with InDesign and OpenAI is conceptually similar.

**Core Logic (Conceptual):**

1.  **Document & Selection Validation:**
    *   Checks if a document is open.
    *   Verifies that a single text frame is selected.
    *   Displays an alert if these conditions aren't met.

2.  **Context Acquisition:**
    *   **Empty Text Frame:** If the selected frame `contents` is empty, the script iterates through all other text frames on the `activePage`. It concatenates their contents to form a context string. This context is capped at approximately the first 500 words to stay within reasonable limits for the OpenAI prompt.
    *   **Non-Empty Text Frame:** If the selected frame already contains text, its `contents` are used directly as the prompt for OpenAI.

3.  **Language Determination:**
    *   The script reads the language applied to the first character (or the whole text if uniform) of the selected text frame: `textFrame.texts[0].appliedLanguage.name`. This name (e.g., "English: USA", "Polski") is parsed to extract the base language name (e.g., "English", "Polish") which is then sent to ChatGPT.

4.  **Token Estimation for OpenAI API:**
    *   To tell ChatGPT roughly how much text to generate, the script estimates the capacity of the selected text frame. This is a heuristic based on:
        *   The frame's geometric bounds (width and height).
        *   The point size of the text (`textFrame.texts[0].pointSize`).
        *   An average character width (approximated as `fontSize * 0.6`).
        *   An average line height (approximated as `fontSize * 1.2`).
    *   From these, it estimates the number of characters the frame can hold. This character count is then used as a loose proxy for `max_tokens`.
    *   The final `max_tokens` sent to the API is capped (e.g., at 4095 for `gpt-3.5-turbo`) to prevent errors and excessive costs. *Note: This estimation is approximate and primarily guides the length of the AI's response.*

5.  **OpenAI API Interaction (`gpt-3.5-turbo` model):**
    *   The script makes a POST request to `https://api.openai.com/v1/chat/completions`.
    *   **System Prompt:** A directive is sent to guide the AI's behavior:
        ```
        "Write an essay in [lang], to the max length, by continuing the prompt. Do not ask anything, do not add anything that is not requested."
        ```
        where `[lang]` is the determined language.
    *   **User Prompt:** The acquired context (from page or frame) is sent as the user's message.
    *   **Key API Parameters Used:**
        *   `model`: "gpt-3.5-turbo"
        *   `messages`: Array containing the system and user prompts.
        *   `temperature`: `1` (for creative responses).
        *   `max_tokens`: The estimated number of tokens.
        *   `top_p`: `1`.
        *   `n`: `1` (requesting a single completion).
        *   `frequency_penalty`: `0`.
        *   `presence_penalty`: `0`.

6.  **Text Insertion:**
    *   The `content` from ChatGPT's response (`responseData.choices[0].message.content`) is retrieved.
    *   A leading space is typically added, and any leading newline is removed.
    *   This generated text is appended to the `contents` of the selected InDesign text frame.

**Version-Specific Implementations:**

*   **v2 (`Lorem-Chatum-v2.idjs` - UXP for InDesign 2023+)**
    *   **Technology:** Modern ECMAScript 6+ (ES6+) JavaScript, running in Adobe's UXP (Unified Extensibility Platform) environment.
    *   **API Calls:** Uses the native `fetch` API for HTTPS requests to the OpenAI endpoint.
        ```javascript
        let response = await fetch('https://api.openai.com/v1/chat/completions', { /* ...options... */ });
        ```
    *   **JSON Handling:** Uses native `JSON.stringify()` to prepare the request body and `await response.json()` to parse the OpenAI API's JSON response.
    *   **User Interface (UI):**
        *   Dialogs for alerts and progress messages are created dynamically using UXP's DOM-like APIs (`document.createElement("dialog")`) and Spectrum UXP components (`<sp-body>`, `<sp-button>`, `<sp-text>`).
            ```javascript
            const dialog = document.createElement("dialog");
            dialog.innerHTML = \`...\`; // Spectrum UXP components
            document.body.appendChild(dialog);
            dialog.showModal();
            // dialog.close();
            ```
        *   The script detects InDesign's UI brightness (`app.generalPreferences.uiBrightnessPreference`) to set dialog text color (black/white) for better visibility.
    *   **Measurement Units:** Before performing geometric calculations for token estimation, the script temporarily sets the document's `horizontalMeasurementUnits`, `verticalMeasurementUnits`, `typographicMeasurementUnits`, and `textSizeMeasurementUnits` to `MeasurementUnits.points`. Original settings are restored afterwards.
    *   **Installers:**
        *   `install-Mac.command`: A Python 3 script. It interactively prompts for the OpenAI API key. It locates the latest InDesign version's Scripts Panel folder (e.g., `~/Library/Preferences/Adobe InDesign/Version X.X/en_US/Scripts/Scripts Panel/`) by scanning directories and sorting by version number. It then reads the `Lorem-Chatum-v2.idjs` template, replaces the placeholder API key, and writes the new file to the target Scripts Panel folder.
        *   `install-Win.bat`: A Windows Batch script. It also prompts for the API key. It finds the latest InDesign version folder in `%USERPROFILE%\AppData\Roaming\Adobe\InDesign\`. It copies `Lorem-Chatum-v2.idjs` to the target Scripts Panel folder and then uses a `for` loop with `find /n /v ""` to read the script line by line, replacing the API key placeholder, and writing to a temporary file, which then replaces the original.

*   **v1 (`Lorem-Chatum-v1.jsx` - ExtendScript for InDesign 2022 and older)**
    *   **Technology:** Legacy ExtendScript (a JavaScript ES3 dialect).
    *   **API Calls:** Relies on the embedded `restix.jsx` library by Gregor Fellenz. `Restix` acts as a bridge, using VBScript (`MSXML2.ServerXMLHTTP.6.0` or `ADODB.Stream`) on Windows and AppleScript (wrapping `curl`) on macOS to perform the actual HTTPS request to OpenAI.
    *   **JSON Handling:** Uses the embedded `json.jsx` library by Marc Autret. This provides `JSON.lave()` (similar to `JSON.stringify()`) and `JSON.eval()` (similar to `JSON.parse()`, but using `eval()`) for constructing the request body and parsing the response.
    *   **User Interface (UI):** Uses standard ExtendScript `alert()` for messages. No progress dialog.

**API Key Management:**

*   In both versions, the OpenAI API key is stored directly as a string constant within the script file (`OPENAI_API_KEY = "sk-..."`).
*   The installer scripts for v2 automate the process of writing this key into the script. For v1 or manual v2 installation, the user must edit the script file directly.
*   **Security Note:** Storing API keys directly in client-side scripts is generally not recommended for web applications. However, in the context of a local InDesign script run by the user, it's a pragmatic approach for ease of setup. Users should still protect their API keys.

### Coding and Contributing

We welcome contributions to _Lorem Chatum_, especially for the v2 (UXP) version!

**Project Structure:**

*   `src/v1-indesign-2022-and-older/`: Contains the legacy ExtendScript version (`.jsx`).
*   `src/v2-indesign-2023-and-newer/`: Contains the modern UXP JavaScript version (`.idjs`) and its installers.
*   `documentation/`: Contains assets like the demo GIF.

**v2 (Adobe InDesign 2023 and newer - Active Development):**

*   This is the primary version for future development and improvements.
*   **License:** [Apache 2.0 License](src/v2-indesign-2023-and-newer/LICENSE.txt).
*   **Contributions:**
    *   Please submit Pull Requests to the `main` branch.
    *   Try to follow the existing coding style and patterns.
    *   Ensure your changes work reliably in recent versions of InDesign (2023+).
*   **Development Tips:**
    *   Familiarize yourself with Adobe UXP: [InDesign UXP Documentation](https://developer.adobe.com/indesign/uxp/).
    *   The UXP Developer Tool can be helpful for debugging.
    *   Modern JavaScript (ES6+) features can be used.

**v1 (Adobe InDesign 2022 and older - Legacy):**

*   This version is considered "end-of-life" and is not planned for active development. It is provided for users of older InDesign versions.
*   **License:** [GNU General Public License v3.0](src/v1-indesign-2022-and-older/LICENSE.txt). This is due to its dependency on `Restix.jsx`, which is GPLv3 licensed. The `json.jsx` polyfill is MIT licensed.

**Future Ideas (Contributions Welcome!):**

The original author (Adam Twardoch, with help from ChatGPT-4 for v1) envisioned several potential enhancements:

*   [ ] **UXP Plugin:** Convert the v2 script into a full UXP plugin for better integration and potential panel UI.
*   [ ] **Improved UI:** Develop a more interactive UXP dialog/panel for settings (e.g., selecting different OpenAI models, adjusting temperature, choosing prompt styles).
*   [ ] **Secure API Key Storage:** If developed as a UXP plugin, explore UXP's [SecureStorage](https://developer.adobe.com/xd/uxp/uxp/reference-js/Modules/uxp/Key-Value%20Storage/SecureStorage/) for storing the OpenAI API key more securely than plain text in the script.
*   [ ] **More Prompting Types:** Allow users to select different styles of text generation (e.g., "more formal," "more creative," "bullet points").
*   [ ] **Improved Token Estimation:** Refine the logic for estimating the number of tokens to better match the frame's capacity.
*   [ ] **Translation Functionality:** Add a feature where if two frames are selected (one with source text, one empty target frame), the script translates the text.
*   [ ] **Summarization/Shortening:** Add functionality to shorten or summarize text within a frame to resolve overflows.

### Author and Acknowledgements

*   **Author:** Adam Twardoch
*   The initial version (v1, ExtendScript) was written with significant assistance from ChatGPT-4.
*   **v1 Dependencies:**
    *   JSON processing: [standalone JSON](https://github.com/indiscripts/extendscript/tree/master/JSON) code by Marc Autret (MIT License).
    *   HTTPS API calls: [Restix](https://github.com/grefel/restix/blob/master/restix.jsx) code by Gregor Fellenz (GNU GPL v3.0).
---

*The original README included some taglines and scenarios written by ChatGPT. These have been omitted in this version for brevity but can be found in the project's commit history if desired.*
*The section "A few words about writing code together with ChatGPT" from the original README has also been omitted here but can be found in the commit history.*
