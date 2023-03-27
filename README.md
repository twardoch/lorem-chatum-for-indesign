# Lorem Chatum for Adobe InDesign

**Script for Adobe InDesign that uses ChatGPT to produce better lorem ipsum.** 

- Run it on an empty text frame, and ChatGPT will fill it with text in any language based on other texts on the current page. 
- Run it on a frame that has some text, and ChatGPT will make the text longer. 

To use the script, you need your own [OpenAI API secret key](https://platform.openai.com/account/api-keys). See below for more info. 

## Installation

### v2 for Adobe InDesign 2023 and newer 

**Note:** Version 2 of the code is licensed under the [Apache 2.0 License](src/v2-indesign-2023-and-newer/LICENSE.txt).

The [`src/v2-indesign-2023-and-newer/`](src/v2-indesign-2023-and-newer/) folder contains a version of the script that uses the new UXP JavaScript scripting for Adobe InDesign 2023 and newer. This is the version that I plan to continue developing. 

To install: 

Go to [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys) and generate a new OpenAI API secret key that starts with `sk-`. Copy the key to your clipboard. 

The folder also contains simple installers. Double-click the appropriate `install-` file for your platform (macOS or Windows) and when prompted, paste your OpenAI API key. (I tested the macOS installer, the Windows installer is untested.)

Once the script is installed, start InDesign. Open **Window > Utilities > Scripts**. In the **Scripts** panel, expand the **User** section. The `Lorem-Chatum-v2.idjs` script should be there. 

Alternatively, open the `Lorem-Chatum-v2.idjs` script in a plain-text editor and put your OpenAI API key at the beginning of the script in the indicated place. Save the file, then put the modified script into the appropriate location where you have InDesign scripts.

### v1 Adobe InDesign 2022 and older

**Note:** Version 1 of the code is licensed under the [GNU General Public License v3.0](src/v1-indesign-2022-and-older/LICENSE.txt), due to a dependency.

The [`src/v1-indesign-2022-and-older`](src/v1-indesign-2022-and-older) folder contains version 1.0 of the script that uses the old ExtendScript scripting for Adobe InDesign 2022 and older. I no longer plan to develop this version, but as of March 2023, it has largely the same functionality as version 2. 

To install: 

1. Go to [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys) and generate a new OpenAI API secret key that starts with `sk-`. Copy the key to your clipboard. 
2. Open the `Lorem-Chatum-v1.jsx` script in a plain-text editor and put your OpenAI API key at the beginning of the script in the indicated place. Save the file. 
3. Put the modified script into the appropriate location where you have InDesign scripts.

## Usage

The script (in both editions) has two functionalities: 

### Lorem Chatum in an empty text frame

1. Make sure you have some text frames on your current page that have some text. 
2. Create an empty text frame (that has no text). 
3. Assign a language to the text frame in the **Character** panel. 
4. Select the frame with the **Selection Tool**. 
5. Double-click `Lorem-Chatum` in the **Scripts** panel. 
6. The script gathers the text from the other text frames on the current page. 
7. The script sends that text to ChatGPT and asks it to complete the text in the language selected in the **Character** panel. The length of the text completion is estimated based on the size of the text frame. 
8. The script puts the result into the selected text frame. 

### Lorem Chatum in a text frame that has text

1. Select a text frame that has some text with the **Selection Tool**.
2. Double-click `Lorem-Chatum` in the **Scripts** panel. 
3. The script sends that text to ChatGPT and asks it to complete the text in the language selected in the **Character** panel. The length of the text completion is estimated based on the size of the text frame. 
4. The script adds the result to the text of the selected frame. 
5. Enlarge the text frame and double-click the script again to get additional text. 

## License

- Copyright (c) 2023 Adam Twardoch
- Version 2 is licensed under the [Apache 2.0 License](src/v2-indesign-2023-and-newer/LICENSE.txt).
- Version 1 is licensed under the [GNU General Public License v3.0](src/v1-indesign-2022-and-older/LICENSE.txt) (due to a dependency).
- Version 1 uses the [standalone JSON](https://github.com/indiscripts/extendscript/tree/master/JSON) code, copyright (c) 2017-2022 [Marc Autret](https://indiscripts.com/) licensed under the MIT license.
- Version 1 uses the [Restix](https://github.com/grefel/restix/blob/master/restix.jsx) code by [Gregor Fellenz](http://www.publishingx.de) licensed under the GNU General Public License v3.0.

