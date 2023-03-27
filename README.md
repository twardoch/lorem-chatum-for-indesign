# Lorem Chatum for Adobe InDesign

**Script for Adobe InDesign that uses ChatGPT to produce better lorem ipsum.** 

Lorem Chatum is a script for Adobe InDesign that uses ChatGPT to generate multilingual, contextually relevant _lorem ipsum_ text. It has two functionalities: fill an empty text frame based on other texts on the page, or extend existing text within a selected frame. 

![Lorem Chatum for Adobe InDesign](./documentation/lorem-chatum.gif)

To use the script, you need your own [OpenAI API secret key](https://platform.openai.com/account/api-keys). The usage of the OpenAI API is paid, but it’s cheap. For example, Leo Tolstoy’s “War and Peace” is 1,200+ pages, 500k words, 3M+ characters. In OpenAI terms, it’s 780k tokens. Processing this book with OpenAI’s `gpt-3.5-turbo` model would cost you about US$3 (yes, just three U.S. dollars!) 

_As of March 2023, the GPT-4 model is much more expensive: it would cost US$900 to process the same book._

ChatGPT has heavily assisted me in writing this code. 

Here’s a few ChatGPT-written taglines about this project: 

> “Unleash the Power of AI-Generated Lorem Ipsum with Lorem Chatum for Adobe InDesign!”
> 
> “Elevate Your InDesign Experience with Contextually Rich Lorem Ipsum Text from Lorem Chatum!”
> 
> “Transform Your Design Process: Discover the AI-Enhanced Lorem Ipsum Revolution with Lorem Chatum!”
> 
> “Lorem Chatum: Where Cutting-Edge AI Meets Adobe InDesign for Unparalleled Lorem Ipsum Creativity!”

Here’s a few usage scenarios, also written by ChatGPT: 

> Let’s say you’re working on a magazine layout with multiple articles on a single page. You’ve completed a few articles, but you still need to fill the remaining empty text frames with placeholder text that matches the style and language of the existing content. With _Lorem Chatum_, you can quickly generate contextually relevant _lorem ipsum_ text, making your layout design process more efficient and visually cohesive.
> 
> Or let’s say that you’re designing a multilingual brochure for a global event. You have text in various languages, and you need to create placeholder content that accurately reflects the characteristics of each language. _Lorem Chatum_ allows you to assign a specific language to each text frame, and then generate AI-powered _lorem ipsum_ text that matches the language and style of your actual content, making your design more professional and consistent.
> 
> Or imagine that you’re designing a book cover with a quote on the front. You have the beginning of the quote, but you need to extend it to fill the available space on the cover. Using _Lorem Chatum_, you can select the text frame containing the quote, and let the script generate an extended version of the quote that maintains its original style and language. This enables you to quickly create an engaging and visually appealing book cover design without manually searching for additional text.

## Installation

### [Download current code](https://github.com/twardoch/lorem-chatum-for-indesign/archive/refs/heads/main.zip)

Click the link above to download the current code, then unzip the downloaded `lorem-chatum-for-indesign-main.zip` and navigate into the unzipped folder. Then proceed depending on your InDesign version. 

### v2 for Adobe InDesign 2023 and newer 

> **Note:** Version 2 of the code is licensed under the [Apache 2.0 License](src/v2-indesign-2023-and-newer/LICENSE.txt).

The [`src/v2-indesign-2023-and-newer/`](src/v2-indesign-2023-and-newer/) folder contains a version of the script that uses the new UXP JavaScript scripting for Adobe InDesign 2023 and newer. This is the version that I plan to continue developing. 

#### Simple installation 

Go to [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys) and generate a new OpenAI API secret key that starts with `sk-`. Copy the key to your clipboard. 

The folder also contains simple installers. Double-click the appropriate `install-` file for your platform (macOS or Windows) and when prompted, paste your OpenAI API key. (I tested the macOS installer, the Windows installer is untested.)

Once the script is installed, start InDesign. Open **Window > Utilities > Scripts**. In the **Scripts** panel, expand the **User** section. The `Lorem-Chatum-v2.idjs` script should be there. 

#### Alternative installation 

Alternatively, open the `Lorem-Chatum-v2.idjs` script in a plain-text editor and put your OpenAI API key at the beginning of the script in the indicated place. Save the file, then put the modified script into the appropriate location where you have InDesign scripts.

### v1 Adobe InDesign 2022 and older

> **Note:** Version 1 of the code is licensed under the [GNU General Public License v3.0](src/v1-indesign-2022-and-older/LICENSE.txt), due to a dependency.

The [`src/v1-indesign-2022-and-older`](src/v1-indesign-2022-and-older) folder contains version 1.0 of the script that uses the old ExtendScript scripting for Adobe InDesign 2022 and older. I no longer plan to develop this version, but as of March 2023, it has largely the same functionality as version 2. 

#### Installation 

1. Go to [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys) and generate a new OpenAI API secret key that starts with `sk-`. Copy the key to your clipboard. 
2. Open the `Lorem-Chatum-v1.jsx` script in a plain-text editor and put your OpenAI API key at the beginning of the script in the indicated place. Save the file. 
3. Put the modified script into the appropriate location where you have InDesign scripts.

## Usage

The script (in both editions) has two functionalities: 

1. If you select an **empty text frame** and you run the script, ChatGPT will fill the frame with text, based on **other texts on the current page**. 
2. If you select a frame that **has some text** and you run the script, ChatGPT will make the existing text longer, but will disregard other texts on the page. 

You can repeat the process on the same frame. The approximate length of the text completion depends on the size of the text frame, and on its main font size. Set the main language of the text frame in the **Character** panel to choose the language in which ChatGPT will write the text. 

### Lorem Chatum in an empty text frame

1. Make sure you have some text frames on your current page that have some text. 
2. Create an empty text frame (that has no text). 
3. Assign a language to the text frame in the **Character** panel. 
4. Select the frame with the **Selection Tool**. 
5. Double-click `Lorem-Chatum` (`-v2.idjs` or `-v1.jsx`) in the **Scripts** panel. 
6. The script gathers the text from the other text frames on the current page. 
7. The script sends that text to ChatGPT and asks it to complete the text in the language selected in the **Character** panel. The length of the text completion is estimated based on the size of the text frame. 
8. The script puts the result into the selected text frame. 

### Lorem Chatum in a text frame that has text

1. Select a text frame that has some text with the **Selection Tool**.
2. Double-click `Lorem-Chatum` in the **Scripts** panel. 
3. The script sends that text to ChatGPT and asks it to complete the text in the language selected in the **Character** panel. The length of the text completion is estimated based on the size of the text frame. 
4. The script adds the result to the text of the selected frame. 
5. To get additional text, enlarge the text frame, and double-click the script again. 

## Authors & License

- Copyright (c) 2023 Adam Twardoch
- Code written with significant assistance from ChatGPT-4.

### v2 for Adobe InDesign 2023 and newer

- Version 2 is licensed under the [Apache 2.0 License](src/v2-indesign-2023-and-newer/LICENSE.txt).

### v1 for Adobe InDesign 2022 and older

- Version 1 is licensed under the [GNU General Public License v3.0](src/v1-indesign-2022-and-older/LICENSE.txt) (due to a dependency).
- Version 1 includes the [standalone JSON](https://github.com/indiscripts/extendscript/tree/master/JSON) code, copyright (c) 2017-2022 [Marc Autret](https://indiscripts.com/), licensed under the MIT license.  
- Version 1 includes the [Restix](https://github.com/grefel/restix/blob/master/restix.jsx) code by [Gregor Fellenz](http://www.publishingx.de) licensed under the GNU General Public License v3.0. This makes the entire code GPL3.





