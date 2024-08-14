// הקשב לשינויים בהגדרות שנשמרות
chrome.storage.onChanged.addListener((changes) => {
    if (changes.mode || changes.blacklist || changes.whitelist) {
        updateTabs();
    }
});

// הקשב לטעינת טאב מחדש
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        updateTab(tabId);
    }
});

// פונקציה לעדכון כל הטאבים הפעילים בהתאם להגדרות
function updateTabs() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        tabs.forEach(tab => updateTab(tab.id));
    });
}

// פונקציה לעדכון טאב בודד
function updateTab(tabId) {
    chrome.storage.sync.get(['mode', 'blacklist', 'whitelist'], function (data) {
        const mode = data.mode || 'blacklist';
        const list = mode === 'blacklist' ? data.blacklist || [] : data.whitelist || [];

        chrome.tabs.get(tabId, function(tab) {
            const shouldApply = mode === 'blacklist' ? !list.includes(new URL(tab.url).hostname) : list.includes(new URL(tab.url).hostname);

            if (shouldApply) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => document.documentElement.classList.add('inv')
                });
            } else {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => document.documentElement.classList.remove('inv')
                });
            }
        });
    });
}
