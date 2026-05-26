/**
 * background.js — Service Worker for Badge Updates
 *
 * Chrome's "always-on" background script for Tab Out.
 * Its only job: keep the toolbar badge showing the current open tab count.
 *
 * Since we no longer have a server, we query chrome.tabs directly.
 * The badge counts real web tabs (skipping chrome:// and extension pages).
 *
 * Color coding gives a quick at-a-glance health signal:
 *   Green  (#3d7a4a) → 1–10 tabs  (focused, manageable)
 *   Amber  (#b8892e) → 11–20 tabs (getting busy)
 *   Red    (#b35a5a) → 21+ tabs   (time to cull!)
 */

const CLICK_STATS_KEY = 'tab-out-click-stats';

/**
 * recordTabActivation(tabId)
 *
 * Records when a tab is activated/visited.
 */
async function recordTabActivation(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) return;
    
    // Clean up URL - remove any backticks or extra characters
    let url = tab.url.trim().replace(/^`+|`+$/g, '');
    
    // Skip internal pages
    if (url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') || 
        url.startsWith('about:')) {
      return;
    }
    
    console.log('[tab-out background] Attempting to record activation for:', url);
    
    const storageData = await chrome.storage.local.get(CLICK_STATS_KEY);
    let clickStats = storageData[CLICK_STATS_KEY] || {}; // Ensure it's an object
    
    const now = Date.now();
    
    if (!clickStats[url]) {
      clickStats[url] = [];
    }
    clickStats[url].push(now);
    
    const storageObj = {};
    storageObj[CLICK_STATS_KEY] = clickStats;
    
    console.log('[tab-out background] About to save to storage:', JSON.stringify(storageObj, null, 2));
    await chrome.storage.local.set(storageObj);
    
    // Verify save
    const verifyData = await chrome.storage.local.get(CLICK_STATS_KEY);
    console.log('[tab-out background] Verified after save:', JSON.stringify(verifyData, null, 2));
    
    console.log('[tab-out background] Tab activation recorded:', url, 'Total for URL:', clickStats[url].length);
    
    // Notify Tab Out page if it's open
    notifyTabOutPage();
    
  } catch (err) {
    console.warn('[tab-out background] Failed to record tab activation:', err);
  }
}

/**
 * notifyTabOutPage()
 *
 * Notifies the Tab Out page (if open) to refresh data.
 */
async function notifyTabOutPage() {
  try {
    // Just send a broadcast message to any open extension pages
    chrome.runtime.sendMessage({ type: 'REFRESH_STATS' }).catch(() => {
      // Ignore errors if no listeners are available
    });
    console.log('[tab-out background] Broadcast REFRESH_STATS message sent');
  } catch (err) {
    console.warn('[tab-out background] Failed to notify Tab Out:', err);
  }
}

// ─── Badge updater ────────────────────────────────────────────────────────────

/**
 * updateBadge()
 *
 * Counts open real-web tabs and updates the extension's toolbar badge.
 * "Real" tabs = not chrome://, not extension pages, not about:blank.
 */
async function updateBadge() {
  try {
    const tabs = await chrome.tabs.query({});

    // Only count actual web pages — skip browser internals and extension pages
    const count = tabs.filter(t => {
      const url = t.url || '';
      return (
        !url.startsWith('chrome://') &&
        !url.startsWith('chrome-extension://') &&
        !url.startsWith('about:') &&
        !url.startsWith('edge://') &&
        !url.startsWith('brave://')
      );
    }).length;

    // Don't show "0" — an empty badge is cleaner
    await chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });

    if (count === 0) return;

    // Pick badge color based on workload level
    let color;
    if (count <= 10) {
      color = '#3d7a4a'; // Green — you're in control
    } else if (count <= 20) {
      color = '#b8892e'; // Amber — things are piling up
    } else {
      color = '#b35a5a'; // Red — time to focus and close some tabs
    }

    await chrome.action.setBadgeBackgroundColor({ color });

  } catch {
    // If something goes wrong, clear the badge rather than show stale data
    chrome.action.setBadgeText({ text: '' });
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

// Update badge when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
});

// Update badge when Chrome starts up
chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

// Update badge whenever a tab is opened
chrome.tabs.onCreated.addListener(() => {
  updateBadge();
  notifyTabOutPage();
});

// Update badge whenever a tab is closed
chrome.tabs.onRemoved.addListener(() => {
  updateBadge();
  notifyTabOutPage();
});

// Update badge and record stats when a tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    recordTabActivation(tabId);
  }
  updateBadge();
});

// Record tab activation for stats
chrome.tabs.onActivated.addListener((activeInfo) => {
  recordTabActivation(activeInfo.tabId);
  updateBadge();
});

// ─── Initial run ─────────────────────────────────────────────────────────────

// Run once immediately when the service worker first loads
updateBadge();
