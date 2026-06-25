// Live Simulator Logic for TruthGuard Landing Page

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const presetButtons = document.querySelectorAll('.preset-btn');
  const actionBtn = document.getElementById('btn_toggle_popup_control');
  const extIconBtn = document.getElementById('btn_extension_icon');
  const closePopupBtn = document.getElementById('btn_close_popup');
  const popupOverlay = document.getElementById('popup_overlay');
  
  // Simulated Browser Elements
  const tabFavicon = document.getElementById('tab_favicon');
  const tabTitleText = document.getElementById('tab_title_text');
  const addressLock = document.getElementById('address_lock');
  const addressText = document.getElementById('address_text');
  const toolbarRiskBadge = document.getElementById('toolbar_risk_badge');
  
  // Simulated Page Elements
  const articleCategory = document.getElementById('article_category');
  const articleTitle = document.getElementById('article_title');
  const articleBody = document.getElementById('article_body');
  const articleImgGraphics = document.querySelector('.img-simulated-graphics');
  
  // Simulated Popup Elements
  const simStatus = document.getElementById('sim_status');
  const simLevelIcon = document.getElementById('sim_level_icon');
  const simLevelLabel = document.getElementById('sim_level_label');
  const simImpactMetric = document.getElementById('sim_impactMetric');
  
  // Simulator State Data
  const siteData = {
    safe: {
      favicon: 'icons/low.png',
      tabTitle: 'BBC News - Climate Agreement',
      lock: '🔒',
      url: 'https://www.bbc.com/news/world-10294821',
      category: 'GLOBAL NEWS',
      title: 'Global Climate Summit Reaches Landmark Energy Agreement',
      body: 'Delegates from over 190 nations have finalized a historic agreement on carbon reduction initiatives. The deal establishes firm timelines for phasing out high-emission energy infrastructure while expanding green investment subsidies for developing economies.',
      imgGrad: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)',
      badgeText: 'LOW',
      badgeClass: 'low',
      badgeColor: '#10b981',
      popupStatus: 'Detected: Low risk',
      popupLabel: 'Low risk',
      popupIcon: 'icons/low.png',
      popupColor: '#10b981',
      impact: 12
    },
    medium: {
      favicon: 'icons/medium.png',
      tabTitle: 'Tabloid Buzz - Celebrity Secret!',
      lock: '🔓',
      url: 'http://www.tabloidbuzz.net/entertainment/exclusive-shocking-reveal',
      category: 'CELEBRITY & ENTERTAINMENT',
      title: 'SHOCKING: Star\'s Secret Island Mansion Uncovered!',
      body: 'Inside sources claim the famous actor has been hiding a multi-million dollar private estate in an uncharted tropical zone. Fans are stunned by leaked low-resolution satellite photos that seem to show a luxury resort, though official representatives have vehemently denied all statements.',
      imgGrad: 'linear-gradient(135deg, #ffedd5 0%, #fb923c 100%)',
      badgeText: 'MED',
      badgeClass: 'medium',
      badgeColor: '#f59e0b',
      popupStatus: 'Detected: Medium risk',
      popupLabel: 'Medium risk',
      popupIcon: 'icons/medium.png',
      popupColor: '#f59e0b',
      impact: 48
    },
    dangerous: {
      favicon: 'icons/high.svg',
      tabTitle: 'URGENT CLAIMS: Fake News Alerts',
      lock: '⚠️',
      url: 'http://truth-claims-unfiltered.biz/urgent-leak-government-secrets',
      category: 'URGENT ALERTS',
      title: 'WARNING: Secret System Controlling Weather Confirmed By Leaks!',
      body: 'A mysterious whistleblower has leaked documents proving that global weather patterns are entirely artificially manufactured. Click below to download the encrypted archives before the authorities take this site down. Do not trust mainstream media!',
      imgGrad: 'linear-gradient(135deg, #fee2e2 0%, #f87171 100%)',
      badgeText: 'HIGH',
      badgeClass: 'high',
      badgeColor: '#ef4444',
      popupStatus: 'Detected: High risk',
      popupLabel: 'High risk',
      popupIcon: 'icons/high.svg',
      popupColor: '#ef4444',
      impact: 94
    }
  };

  let currentType = 'safe';
  let counterInterval = null;

  // Function to load a simulated page
  function loadPage(type) {
    currentType = type;
    const data = siteData[type];
    
    // Fade out viewport content slightly for loading effect
    const viewport = document.getElementById('web_page_container');
    viewport.style.opacity = '0.3';
    viewport.style.transition = 'opacity 0.2s ease';
    
    setTimeout(() => {
      // Update Tab and Toolbar
      tabFavicon.src = data.favicon;
      tabTitleText.textContent = data.tabTitle;
      addressLock.textContent = data.lock;
      addressText.textContent = data.url;
      
      // Update Toolbar badge
      toolbarRiskBadge.textContent = data.badgeText;
      toolbarRiskBadge.className = `risk-badge ${data.badgeClass}`;
      
      // Update Page Content
      articleCategory.textContent = data.category;
      articleTitle.textContent = data.title;
      articleBody.textContent = data.body;
      articleImgGraphics.style.background = data.imgGrad;
      
      // Update localStorage for TruthGuard Polyfill
      localStorage.setItem('level', data.badgeClass);
      localStorage.setItem('impact', data.impact.toString());

      // Trigger storage events to refresh the iframe popup
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'level',
        newValue: data.badgeClass
      }));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'impact',
        newValue: data.impact.toString()
      }));
      
      viewport.style.opacity = '1';
    }, 200);
  }

  // Toggle Popup view
  function togglePopup(forceState) {
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !popupOverlay.classList.contains('open');
    
    if (shouldOpen) {
      popupOverlay.classList.add('open');
      actionBtn.textContent = 'Close Extension Popup';
      
      // Sync iframe content reload
      const iframe = document.getElementById('popupIframe');
      if (iframe) iframe.contentWindow.location.reload();
    } else {
      popupOverlay.classList.remove('open');
      actionBtn.textContent = 'Open Extension Popup';
    }
  }

  // Event Listeners
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.getAttribute('data-type');
      loadPage(type);
    });
  });

  actionBtn.addEventListener('click', () => togglePopup());
  extIconBtn.addEventListener('click', () => togglePopup());
  closePopupBtn.addEventListener('click', () => togglePopup(false));
  
  // Close popup if clicking outside of it
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      togglePopup(false);
    }
  });

  // Load initial page
  loadPage('safe');
});
