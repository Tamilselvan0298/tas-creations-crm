// Chrome extension Manifest V3 Actions popup logic

let activeLeadPayload = null;

document.getElementById('btn-scrape').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.id) return;

    chrome.tabs.sendMessage(activeTab.id, { action: 'scrapePage' }, (response) => {
      if (response && response.success) {
        activeLeadPayload = response.data;
        
        // Show fields in UI
        document.getElementById('no-data').style.display = 'none';
        document.getElementById('data-fields').style.display = 'block';
        document.getElementById('btn-sync').style.display = 'block';

        // Bind values
        document.getElementById('lead-company').textContent = activeLeadPayload.company || 'N/A';
        document.getElementById('lead-website').textContent = activeLeadPayload.website || 'N/A';
        document.getElementById('lead-phone').textContent = activeLeadPayload.phone || 'N/A';
        document.getElementById('lead-rating').textContent = activeLeadPayload.rating ? `${activeLeadPayload.rating} ★` : '0.0';
        
        const techs = activeLeadPayload.techStack || [];
        document.getElementById('lead-tech').textContent = techs.length ? techs.join(', ') : 'None detected';
      }
    });
  });
});

document.getElementById('btn-sync').addEventListener('click', () => {
  if (!activeLeadPayload) return;

  chrome.runtime.sendMessage({ action: 'syncLead', payload: activeLeadPayload }, (response) => {
    if (response && response.success) {
      document.getElementById('sync-status').style.display = 'block';
      setTimeout(() => {
        document.getElementById('sync-status').style.display = 'none';
      }, 3000);
    } else {
      alert('Sync failed: ' + (response ? response.error : 'Network error'));
    }
  });
});
