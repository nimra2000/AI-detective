// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'check-ai-text',
    title: 'Investigate whether this was written by AI 🕵️',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'check-ai-text' && info.selectionText) {
    // Store the selected text temporarily
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // Open the popup
      chrome.action.openPopup();
    });
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedTextFromContextMenu') {
    // Retrieve the selected text stored earlier
    chrome.storage.local.get(['selectedText'], (result) => {
      sendResponse({ selectedText: result.selectedText || '' });
      // Clear the stored text
      chrome.storage.local.remove(['selectedText']);
    });
    return true; // Indicates async response
  }
});