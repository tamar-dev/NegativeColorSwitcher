document.addEventListener('DOMContentLoaded', function () {
    const modeSelect = document.getElementById('mode');
    const enableDisableToggle = document.getElementById('enable-disable-toggle');
    const siteToggle = document.getElementById('site-toggle');
    const urlListDiv = document.getElementById('url-list');
    // False on restricted pages (chrome://, Web Store, etc.) where there is no host to list
    let siteAvailable = false;

    function syncDisabledState() {
        const enabled = enableDisableToggle.checked;
        modeSelect.disabled = !enabled;
        siteToggle.disabled = !enabled || !siteAvailable;
    }

    // Returns the active tab's hostname, or null for pages the extension cannot act on
    function getActiveHostname(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let hostname = null;
            try {
                const parsed = new URL(tabs[0].url);
                if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                    hostname = parsed.hostname;
                }
            } catch (e) {
                // no tab or unparsable URL
            }
            callback(hostname);
        });
    }

    // Load saved mode and URL lists
    chrome.storage.sync.get(['mode', 'blacklist', 'whitelist', 'enabled'], function (data) {
        const mode = data.mode || 'blacklist';
        enableDisableToggle.checked = data.enabled !== false;
        syncDisabledState();
        modeSelect.value = mode;
        updateUrlList(mode, data.blacklist, data.whitelist);
        updateSiteToggle(mode, data.blacklist, data.whitelist);
    });

    // Handle mode change; the background updates tabs on storage change
    modeSelect.addEventListener('change', function () {
        const mode = modeSelect.value;
        chrome.storage.sync.set({ mode: mode });
        chrome.storage.sync.get(['blacklist', 'whitelist'], function (data) {
            updateUrlList(mode, data.blacklist, data.whitelist);
            updateSiteToggle(mode, data.blacklist, data.whitelist);
        });
    });

    // Handle enable/disable toggle change; the background updates all tabs on storage change
    enableDisableToggle.addEventListener('change', function () {
        syncDisabledState();
        chrome.storage.sync.set({ enabled: enableDisableToggle.checked });
    });

    // Handle site toggle change
    siteToggle.addEventListener('change', function () {
        getActiveHostname(function (url) {
            if (!url) return;
            chrome.storage.sync.get([modeSelect.value], function (data) {
                let list = data[modeSelect.value] || [];
                if (siteToggle.checked) {
                    if (!list.includes(url)) {
                        list.push(url);
                    }
                } else {
                    list = list.filter(item => item !== url);
                }
                const update = {};
                update[modeSelect.value] = list;
                chrome.storage.sync.set(update, function () {
                    updateUrlList(modeSelect.value, data.blacklist, data.whitelist);
                });
            });
        });
    });

    function updateUrlList(mode, blacklist = [], whitelist = []) {
        const list = mode === 'blacklist' ? blacklist : whitelist;
        urlListDiv.innerHTML = list.map(url => `<div>${url}</div>`).join('');
        console.log('Current URLs in List:', list);
    }
    function updateSiteToggle(mode, blacklist = [], whitelist = []) {
        getActiveHostname(function (url) {
            siteAvailable = url !== null;
            siteToggle.title = siteAvailable ? '' : 'Not available on this page';
            if (siteAvailable) {
                const list = mode === 'blacklist' ? blacklist : whitelist;
                siteToggle.checked = list.includes(url);
            } else {
                siteToggle.checked = false;
            }
            syncDisabledState();
        });
    }
});
