// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
        // Notify the content script
        chrome.tabs.sendMessage(tabId, { action: "checkAndSelect" })
            .catch(err => console.log("Content script not ready yet"));
    }
});

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    // Set default settings
    chrome.storage.sync.set({ 'enabled': true });
});
