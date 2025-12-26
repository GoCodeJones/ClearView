// Background script for ClearView extension (Firefox and Chrome compatible)
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onInstalled.addListener(() => {
  console.log('ClearView installed successfully!');
});

// Listener for messages
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'paywallRemoved') {
    console.log('Paywall removed on page:', sender.tab?.url || 'unknown');
    sendResponse({ success: true });
  }
  return true;
});