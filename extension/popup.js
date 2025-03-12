document.addEventListener('DOMContentLoaded', function() {
    const enabledCheckbox = document.getElementById('enabled');
    const statusText = document.getElementById('status');

    // Load saved state
    chrome.storage.sync.get('enabled', function(data) {
        enabledCheckbox.checked = data.enabled !== false; // Default to true
        updateStatusText();
    });

    // Save state on change
    enabledCheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({ 'enabled': enabledCheckbox.checked });
        updateStatusText();

        // Notify content script of the change
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && (tabs[0].url.includes('twitter.com') || tabs[0].url.includes('x.com'))) {
                chrome.tabs.sendMessage(tabs[0].id, { enabled: enabledCheckbox.checked })
                    .catch(err => console.log("Content script not ready yet"));
            }
        });
    });

    function updateStatusText() {
        statusText.textContent = enabledCheckbox.checked ? 'Active' : 'Disabled';
    }
});
