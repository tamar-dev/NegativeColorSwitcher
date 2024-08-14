document.addEventListener('DOMContentLoaded', function () {
    const modeSelect = document.getElementById('mode');
    const siteToggle = document.getElementById('site-toggle');
    const urlListDiv = document.getElementById('url-list');
    // Load saved mode and URL lists
    chrome.storage.sync.get(['mode', 'blacklist', 'whitelist'], function (data) {
        const mode = data.mode || 'blacklist';
        modeSelect.value = mode;
        updateUrlList(mode, data.blacklist, data.whitelist);
        updateSiteToggle(mode, data.blacklist, data.whitelist);
    });

    // Handle mode change
    modeSelect.addEventListener('change', function () {
        const mode = modeSelect.value;
        chrome.storage.sync.set({ mode: mode });
        chrome.storage.sync.get(['blacklist', 'whitelist'], function (data) {
            updateUrlList(mode, data.blacklist, data.whitelist);
            updateSiteToggle(mode, data.blacklist, data.whitelist);
            applySiteSettings(mode);
        });
    });

    // Handle site toggle change
    siteToggle.addEventListener('change', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const url = new URL(tabs[0].url).hostname;
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
                        applySiteSettings(modeSelect.value);
                    });
                });
            }
        });
    });

    function updateUrlList(mode, blacklist = [], whitelist = []) {
        const list = mode === 'blacklist' ? blacklist : whitelist;
        urlListDiv.innerHTML = list.map(url => `<div>${url}</div>`).join('');
        console.log('Current URLs in List:', list);
    }
    function updateSiteToggle(mode, blacklist = [], whitelist = []) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const url = new URL(tabs[0].url).hostname;
                const list = mode === 'blacklist' ? blacklist : whitelist;
                siteToggle.checked = list.includes(url);
            }
        });
    }

    // function applySiteSettings(mode) {
    //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //         if (tabs.length > 0) {
    //             const url = new URL(tabs[0].url).hostname;
    //             chrome.storage.sync.get([mode], function (data) {
    //                 const list = data[mode] || [];
    //                 const shouldApplyNegative = mode === 'blacklist' ? !list.includes(url) : list.includes(url);
    //                 chrome.scripting.executeScript({
    //                     target: { tabId: tabs[0].id },
    //                     func: shouldApplyNegative ? applyNegativeColors : removeNegativeColors,
    //                 });
    //             });
    //         }
    //     });
    // }

    function applyNegativeColors() {
        document.documentElement.classList.add("inv");
    }

    function removeNegativeColors() {
        document.documentElement.classList.remove("inv");
    }
});

function applySiteSettings(mode) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
            const url = new URL(tabs[0].url).hostname;
            chrome.storage.sync.get([mode], function (data) {
                const list = data[mode] || [];
                console.log('Current List:', list);
                console.log('Mode:', mode);
                console.log('Current URL:', url);
                const shouldApplyNegative = mode === 'blacklist' ? !list.includes(url) : list.includes(url);
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: shouldApplyNegative ? applyNegativeColors : removeNegativeColors,
                });
            });
        }
    });
}
