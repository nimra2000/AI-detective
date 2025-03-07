// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    // Get the currently selected text
    const selectedText = window.getSelection().toString().trim();
    // Send response immediately
    sendResponse({ selectedText: selectedText });
    return true; // Keep the message channel open for async response
  }
});
