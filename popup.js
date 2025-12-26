// Firefox and Chrome compatible
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.getElementById('removePaywall').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  statusEl.style.display = 'block';
  statusEl.textContent = 'Removing paywall...';
  
  try {
    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    
    // First inject the script if necessary
    try {
      await browserAPI.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
      });
    } catch (injectError) {
      console.log('Script already injected or error:', injectError);
    }
    
    // Wait a bit for the script to load
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Try to send message
    try {
      await browserAPI.tabs.sendMessage(tab.id, { action: 'removePaywall' });
    } catch (msgError) {
      console.log('Error sending message:', msgError);
    }
    
    // Reload the page
    statusEl.textContent = 'Reloading page...';
    await browserAPI.tabs.reload(tab.id);
    
    statusEl.textContent = '✓ Page reloaded!';
    
    setTimeout(() => {
      window.close();
    }, 1000);
    
  } catch (error) {
    statusEl.textContent = '✓ Attempting reload...';
    console.error('Error:', error);
    
    // Try to reload even with error
    try {
      const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
      await browserAPI.tabs.reload(tab.id);
      setTimeout(() => window.close(), 500);
    } catch (reloadError) {
      statusEl.textContent = '✗ Cannot access page';
    }
  }
});