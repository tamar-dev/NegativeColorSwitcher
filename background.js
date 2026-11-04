// הקשב לשינויים בהגדרות שנשמרות
chrome.storage.onChanged.addListener((changes) => {
    if (changes.mode || changes.blacklist || changes.whitelist || changes.enabled) {
        updateTabs();
    }
});

// הקשב לטעינת טאב מחדש
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        updateTab(tabId);
    }
});

// פונקציה לעדכון כל הטאבים הפתוחים בהתאם להגדרות
function updateTabs() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            if (tab.id !== undefined && /^(https?|file):/.test(tab.url || '')) {
                updateTab(tab.id);
            }
        });
    });
}

// פונקציה לעדכון טאב בודד - ההחלטה אם להחיל נעשית ב-content.js
async function updateTab(tabId) {
    try {
        await chrome.tabs.sendMessage(tabId, { type: 'nc:refresh' });
    } catch (e) {
        // טאב שנפתח לפני התקנה/טעינה מחדש של ההרחבה אין בו content script
        try {
            await chrome.scripting.insertCSS({ target: { tabId: tabId }, files: ['styles.css'] });
            await chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['content.js'] });
        } catch (injectError) {
            // דפים מוגבלים (chrome://, חנות האינטרנט וכו') - מתעלמים
        }
    }
}
