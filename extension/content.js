// Chrome extension content script for page scraping

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrapePage') {
    const url = window.location.href;
    let data = {
      company: document.title,
      website: '',
      phone: '',
      address: '',
      rating: 0,
      reviews: 0,
      category: '',
      techStack: []
    };

    if (url.includes('google.com/maps')) {
      // Scrape Google Maps details
      const titleEl = document.querySelector('h1.DUwD2b, h1.fontHeadlineLarge');
      if (titleEl) data.company = titleEl.textContent.trim();

      // Find address
      const addrEl = document.querySelector('button[data-item-id="address"]');
      if (addrEl) data.address = addrEl.textContent.trim();

      // Find phone
      const phoneEl = document.querySelector('button[data-item-id^="phone:tel:"]');
      if (phoneEl) data.phone = phoneEl.textContent.replace('Phone:', '').trim();

      // Find website URL
      const webEl = document.querySelector('a[data-item-id="authority"]');
      if (webEl) data.website = webEl.getAttribute('href') || '';

      // Find rating & review counts
      const ratingEl = document.querySelector('div.F7nice span');
      if (ratingEl) data.rating = parseFloat(ratingEl.textContent.trim()) || 0;

      const reviewsEl = document.querySelector('div.F7nice span:nth-child(2)');
      if (reviewsEl) {
        const text = reviewsEl.textContent.replace(/[^0-9]/g, '');
        data.reviews = parseInt(text, 10) || 0;
      }

      // Find category
      const catEl = document.querySelector('button[jsaction="pane.rating.category"]');
      if (catEl) data.category = catEl.textContent.trim();
    } else {
      // Analyze active website tech stacks Wappalyzer-style
      const html = document.documentElement.innerHTML.toLowerCase();
      const techList = [];

      if (html.includes('wp-content') || html.includes('wp-includes')) techList.push('WordPress');
      if (html.includes('shopify')) techList.push('Shopify');
      if (html.includes('_next/static') || html.includes('next.js')) techList.push('Next.js');
      if (html.includes('react')) techList.push('React');
      if (html.includes('googletagmanager.com') || html.includes('gtm.js')) techList.push('Google Tag Manager');
      if (html.includes('connect.facebook.net') || html.includes('fbevents.js')) techList.push('Meta Pixel');
      if (html.includes('google-analytics.com') || html.includes('ga.js')) techList.push('Google Analytics');

      data.techStack = techList;
      
      // Grab website URL
      data.website = window.location.hostname;
    }

    sendResponse({ success: true, data });
  }
});
