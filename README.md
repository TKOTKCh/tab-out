# Tab Out

**Keep tabs on your tabs.**

> **English** | [中文](README_zh.md)

Tab Out is a Chrome extension that replaces your new tab page with a dashboard of everything you have open. Tabs are grouped by domain, with homepages (Gmail, X, LinkedIn, etc.) pulled into their own group. Close tabs with a satisfying swoosh + confetti.

---
---

## 🔄 Fork Information

This project is forked from [https://github.com/zarazhangrui/tab-out](https://github.com/zarazhangrui/tab-out). The following new features have been added:

### ✨ New Features Added

1. **Idle Tabs Section** - Group tabs by last accessed time:
   - Opened in the last hour
   - Opened 1-2 hours ago
   - Opened 2+ hours ago
   - With "Close all tabs" and "Close duplicates" buttons

2. **Click Stats Section** - Track tab click counts:
   - Clicked ≥ 5 times (frequent)
   - Clicked < 5 times (moderate)
   - Not clicked recently
   - Auto-refreshes every 2 hours
   - Data stored locally in `chrome.storage.local`

3. **Enhanced Duplicate Banner** - Improved cleanup options:
   - "Close duplicate Tab-Out" button
   - "Close all duplicates" button for all duplicate tabs
   - Smart visibility - only shows when duplicates exist

4. **Real-time Updates** - Auto-sync when tabs change:
   - Tab creation/deletion triggers dashboard refresh
   - Click tracking works in background

5. **Search Bar with Smart Search**:
   - Search open tabs by title or URL
   - Search browser history (30 days)
   - Web search integration (Google/Edge)
   - Keyboard navigation with ↑/↓ arrows
   - IME (Input Method Editor) support for Asian languages
   - Focus search input automatically on page load

6. **Layout & UI Improvements**:
   - Idle tabs and click stats now side-by-side
   - Header centered with cleaner design
   - Removed header bottom divider
   - Optimized page spacing and padding
   - Improved search results styling (white background)

7. **Closing Tab Optimization**:
   - Single tab close no longer reloads entire dashboard
   - More graceful animations for card removal
   - Improved duplicate tab detection and closing
   - Properly handles chrome:// pages

8. **Additional Improvements**:
   - Support for chrome:// pages in stats
   - Better styling and UI improvements
   - Fixed Content Security Policy issues
   - Reduced unnecessary bottom space in Chrome

---

## Features

- **Smart search bar** search open tabs, browser history, or the web
- **See all your tabs at a glance** on a clean grid, grouped by domain
- **Homepages group** pulls Gmail inbox, X home, YouTube, LinkedIn, GitHub homepages into one card
- **Close tabs with style** with swoosh sound + confetti burst
- **Duplicate detection** flags when you have the same page open twice, with one-click cleanup
- **Click any tab to jump to it** across windows, no new tab opened
- **Save for later** bookmark tabs to a checklist before closing them
- **Localhost grouping** shows port numbers next to each tab so you can tell your vibe coding projects apart
- **Expandable groups** show the first 8 tabs with a clickable "+N more"
- **Idle tabs and click stats side-by-side** for better space utilization
- **Idle tabs section** groups tabs by last accessed time
- **Click stats section** tracks how often you access each tab
- **100% local** your data never leaves your machine
- **Pure Chrome extension** no server, no Node.js, no npm, no setup beyond loading the extension

---

## Install

### Chrome

**1. Clone the repo**

```bash
git clone https://github.com/TKOTKCh/tab-out.git
cd tab-out
```

**2. Load the Chrome extension**

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Navigate to the `extension/` folder inside the cloned repo and select it

**3. Open a new tab**

You'll see Tab Out.

### Microsoft Edge

**1. Clone the repo** (if not already cloned)

```bash
git clone https://github.com/TKOTKCh/tab-out.git
cd tab-out
```

**2. Load the Edge extension**

1. Open Microsoft Edge and go to `edge://extensions`
2. Enable **Developer mode** (left sidebar toggle)
3. Click **Load unpacked**
4. Navigate to the `extension-edge/` folder inside the cloned repo and select it

**3. Open a new tab**

You'll see Tab Out.

---

## How it works

```
You open a new tab
  -> Search bar automatically receives focus
  -> Tab Out shows your open tabs grouped by domain
  -> Homepages (Gmail, X, etc.) get their own group at the top
  -> Idle tabs and click stats shown side-by-side
  -> Use search to find tabs, history, or search the web
  -> Click any tab title to jump to it
  -> Close groups you're done with (swoosh + confetti)
  -> Save tabs for later before closing them
```

Everything runs inside the Chrome extension. No external server, no API calls, no data sent anywhere. Saved tabs are stored in `chrome.storage.local`.

---

## Tech stack

| What | How |
|------|-----|
| Extension | Chrome Manifest V3 |
| Permissions | tabs, storage, history, activeTab |
| Storage | chrome.storage.local |
| History | chrome.history API (30 days) |
| Sound | Web Audio API (synthesized, no files) |
| Animations | CSS transitions + JS confetti particles |

---