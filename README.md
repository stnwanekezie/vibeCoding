# Chrome ChatGPT Extension

Leveraging OpenAI's ChatGPT model for definition of technical terms, people and general phenomena when surfing the net usually involves a multi-step process of opening ChatGPT in a new tab and navigating to and fro for each new request. This Chrome extension simplifies the process by allowing users to highlight text, right-click, and get instant explanations in a floating window. Additionally, it provides a chat interface for continued conversations with ChatGPT.

## Features
- Quick explanations via context menu (right-click)
- Persistent chat interface through extension popup
- Conversation history preservation
- Simple API key management
- Works on any webpage
- Markdown support in responses

## Requirements
- Google Chrome browser (version 88 or later)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Active internet connection

## Installation

1. Clone this repository or download the ZIP file:
```bash
git clone https://github.com/stnwanekezie/vibeCoding.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension source directory

## Setup

1. Click the extension icon in Chrome's toolbar
2. Right-click and select "Options"
3. Enter your OpenAI API key in the settings page
4. Click "Save"

## Usage

### Quick Explanations
1. Highlight any text on a webpage
2. Right-click the selected text
3. Choose "Explain with ChatGPT"
4. View the explanation in the floating window

### Chat Interface
1. Click the extension icon in the toolbar
2. Type your message in the input field
3. Press Enter or click Send
4. View the conversation history
5. Clear chat using the "Clear Chat" button

## Features in Detail

### Context Menu Explanation
- Works on any webpage
- Provides quick explanations in a non-intrusive floating window
- Easy to dismiss or keep open while browsing

### Chat Interface
- Persistent conversation history
- Support for multi-line input
- Error handling and status messages
- Clear chat functionality
- Responsive design

## Technical Details
- Built with vanilla JavaScript
- Uses Chrome Extensions Manifest V3
- Implements OpenAI's GPT-3.5 Turbo API
- Supports async/await for API calls
- Implements proper error handling

## Privacy & Security
- API keys are stored locally in Chrome's secure storage
- No data is collected or stored externally
- All communications are direct between your browser and OpenAI

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments
- OpenAI for providing the ChatGPT API
- Chrome Extensions documentation and community
