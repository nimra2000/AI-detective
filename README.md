# AI Detective Chrome Extension 🔍

Detect whether text on any webpage was written by AI or humans. Perfect for content creators, educators, and anyone interested in identifying AI-generated content.
Watch the demo [here](https://drive.google.com/file/d/1FnjIskXMxQ-kZUBHzDn0jLlbXLFCCCPZ/view?usp=sharing)!

## Features ✨

- 🔍 Analyze any selected text on any webpage
- 📊 Visual probability meter showing AI content likelihood
- 📝 Detailed statistics about word counts and AI-generated content

## Installation 🚀

1. Download or clone this repository
2. Obtain an [API Key from GPTZero](https://www.zerogpt.com/pricing#api). Modify the variable `const API_KEY` in `popup.js` with your key.
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top-right corner
5. Click "Load unpacked" and select the extension directory
6. The AI Detective icon should appear in your Chrome toolbar

## Usage Guide 📖

### Method 1: Using the Extension Icon
1. Select any text on a webpage
2. Click the AI Detective icon in your Chrome toolbar
3. Click "Check Highlighted Text"
4. View the analysis results

### Method 2: Using Context Menu
1. Select any text on a webpage
2. Right-click the selected text
3. Click "Investigate whether this was written by AI 🕵️"
4. View the analysis results

## Results Interpretation 📊

The extension provides:
- AI Content Probability percentage
- Visual meter (Green: <30%, Orange: 30-70%, Red: >70%)
- Total word count
- Number of AI-generated words
- Additional feedback from the analysis

## Privacy & Security 🔒

- No data is stored locally except for temporary text selection
- All analysis is done through API call to ZeroGPT
- No tracking or analytics

## Troubleshooting 🛠️

If you encounter issues:
1. The extension works on all regular webpages (news sites, blogs, social media, etc.)
2. It does NOT work on:
   - Chrome Web Store pages
   - Chrome internal pages (chrome:// URLs)
   - Chrome settings pages
3. Try refreshing the page if the extension isn't responding
4. Ensure text is properly selected
5. Check your internet connection
6. Try reloading the extension in `chrome://extensions/`

## Credits 🙏

- Powered by ZeroGPT API
- Built with Chrome Extension APIs 
