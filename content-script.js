// ClearView - Main Content Script
// This script is injected into all pages and removes paywalls

// Firefox and Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

(function() {
  'use strict';

  // Main paywall removal function
  function removePaywall() {
    console.log('🔓 ClearView: Starting paywall removal...');

    // 1. Remove paywall overlays and modals
    const overlaySelectors = [
      '[class*="paywall"]',
      '[class*="overlay"]',
      '[class*="modal"]',
      '[id*="paywall"]',
      '[class*="piano"]',
      '[class*="subscription"]',
      '[class*="premium"]',
      '[data-testid*="paywall"]',
      '[class*="wall"]',
      '[class*="gate"]',
      '[class*="barrier"]',
      '.tp-modal',
      '.tp-backdrop',
      '.fc-ab-root',
      'div[style*="z-index: 2147483647"]',
      'div[style*="position: fixed"]'
    ];

    overlaySelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        // Remove large overlays that might be paywalls
        if (el.offsetHeight > window.innerHeight * 0.3 || 
            el.offsetWidth > window.innerWidth * 0.5) {
          el.remove();
          console.log('Removed:', selector);
        }
      });
    });

    // 2. Remove blur and filters from content
    const blurSelectors = [
      '[class*="blur"]',
      '[style*="blur"]',
      '[class*="fade"]',
      '[class*="truncate"]',
      '[class*="gradient"]'
    ];

    blurSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.filter = 'none';
        el.style.webkitFilter = 'none';
        el.style.opacity = '1';
        el.className = el.className.replace(/blur|fade|truncate|gradient/gi, '');
      });
    });

    // 3. Restore body overflow
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.documentElement.style.overflow = 'auto';
    
    // Remove overflow hidden from all elements
    document.querySelectorAll('[style*="overflow"]').forEach(el => {
      if (el.style.overflow === 'hidden') {
        el.style.overflow = 'visible';
      }
    });

    // 4. Remove height limiters
    document.querySelectorAll('[style*="max-height"]').forEach(el => {
      if (el.style.maxHeight && parseInt(el.style.maxHeight) < 1000) {
        el.style.maxHeight = 'none';
      }
    });

    // 5. Clear paywall cookies and localStorage
    const paywallKeys = ['paywall', 'article_count', 'meter', 'subscription', 'wall', 'premium', 'limit'];
    
    // Clear localStorage
    try {
      paywallKeys.forEach(key => {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const storageKey = localStorage.key(i);
          if (storageKey && storageKey.toLowerCase().includes(key)) {
            localStorage.removeItem(storageKey);
            console.log('Removed from localStorage:', storageKey);
          }
        }
      });
    } catch (e) {
      console.log('Could not access localStorage:', e);
    }

    // Clear sessionStorage
    try {
      paywallKeys.forEach(key => {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const storageKey = sessionStorage.key(i);
          if (storageKey && storageKey.toLowerCase().includes(key)) {
            sessionStorage.removeItem(storageKey);
            console.log('Removed from sessionStorage:', storageKey);
          }
        }
      });
    } catch (e) {
      console.log('Could not access sessionStorage:', e);
    }

    // 6. Remove classes that hide content
    document.querySelectorAll('[class*="hidden"]').forEach(el => {
      if (el.textContent.length > 200) {
        el.classList.remove(...Array.from(el.classList).filter(c => 
          c.includes('hidden') || c.includes('hide')
        ));
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
      }
    });

    // 7. Force display of full articles
    document.querySelectorAll('article, .article, [class*="article"], [class*="content"], main').forEach(el => {
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
      el.style.height = 'auto';
    });

    // 8. Remove pointer-events blocking
    document.querySelectorAll('[style*="pointer-events"]').forEach(el => {
      el.style.pointerEvents = 'auto';
    });

    // 9. Show any hidden paragraphs or text content
    document.querySelectorAll('p, div, span').forEach(el => {
      if (el.style.display === 'none' && el.textContent.length > 100) {
        el.style.display = 'block';
      }
    });

    console.log('✓ ClearView: Removal completed!');
  }

  // Execute immediately
  removePaywall();

  // Execute again after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removePaywall);
  } else {
    // DOM already loaded, run again after a short delay
    setTimeout(removePaywall, 100);
  }

  // Execute after page fully loaded (including images, etc)
  window.addEventListener('load', () => {
    setTimeout(removePaywall, 500);
  });

  // Observe DOM changes for dynamic paywalls
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          const el = node;
          if (el.className && typeof el.className === 'string' && 
              (el.className.includes('paywall') || 
               el.className.includes('overlay') || 
               el.className.includes('modal') ||
               el.className.includes('wall'))) {
            console.log('Detected dynamic paywall, removing...');
            removePaywall();
            break;
          }
        }
      }
    }
  });

  // Start observing once body is available
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // Listener for messages from popup
  browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'removePaywall') {
      console.log('Received manual removal request');
      removePaywall();
      sendResponse({ success: true });
    }
    return true;
  });

  // Notify that script has loaded
  browserAPI.runtime.sendMessage({ action: 'paywallRemoved' }).catch(() => {
    // Ignore error if background script is not ready
  });

})();