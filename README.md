# Twitter Reply Auto-Selector

A browser extension that automatically sets reply visibility to "Verified accounts" when composing tweets on Twitter/X.

## Features

- Automatically changes the default "Everyone can reply" setting to "Verified accounts"
- Works when composing new tweets or quote tweets
- Runs in the background - no manual intervention needed
- Works on both twitter.com and x.com domains

## Installation

### Chrome, Edge, Brave, or other Chromium-based browsers

1. Download this repository (Code > Download ZIP) and extract it
2. Open your browser and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `extension` folder from the extracted files
5. The extension icon should appear in your toolbar

### Firefox

Firefox support coming soon.

## Usage

Once installed, the extension works automatically whenever you compose a tweet:

1. Start composing a tweet or quote tweet on Twitter/X
2. The extension will detect the "Everyone can reply" setting
3. It will automatically change this to "Verified accounts"

## Troubleshooting

If the extension doesn't seem to be working:

- Make sure it's enabled in your browser's extension settings
- Try refreshing the Twitter/X page
- Check for console errors by right-clicking on the page, selecting "Inspect", and checking the Console tab

## Privacy

This extension:
- Only runs on twitter.com and x.com domains
- Does not collect any data
- Does not send any information to external servers
- Only interacts with the reply visibility setting

## License

MIT License

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.
