// Chrome extension Manifest V3 background service worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureTab') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ screenshot: dataUrl });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (message.action === 'syncLead') {
    chrome.storage.local.get(['auth_token'], (store) => {
      const token = store.auth_token || 'mock-admin';
      
      fetch('http://localhost:5000/api/extension/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(message.payload)
      })
      .then(res => res.json())
      .then(data => {
        sendResponse({ success: true, data });
      })
      .catch(err => {
        sendResponse({ success: false, error: err.message });
      });
    });
    return true;
  }
});
