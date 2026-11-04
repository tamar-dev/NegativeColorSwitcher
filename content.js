// עוטף ב-IIFE כדי שהזרקה חוזרת של הסקריפט (מ-background) לא תכפיל מאזינים או תיכשל על הצהרות כפולות
(function () {
    if (window.__negativeColorSwitcherLoaded) return;
    window.__negativeColorSwitcherLoaded = true;

    const IMAGE_FILTER = "invert(1) hue-rotate(180deg) brightness(1.05) contrast(1.05)";

    // הערך המקורי של filter בשורה (inline) לפני שהשינוי שלנו הוחל, כדי לשחזר אותו בעת כיבוי
    const originalFilters = new Map();

    // יצירת MutationObserver כדי לעקוב אחרי שינויים באלמנטים עם רקע תמונה
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            try {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    const current = target.style.getPropertyValue('filter');
                    // שינוי שנעשה על ידינו - מתעלמים כדי לא להיכנס ללולאה
                    if (current === IMAGE_FILTER) return;

                    const style = getComputedStyle(target);
                    if (style.backgroundImage !== 'none' && style.backgroundImage !== '') {
                        originalFilters.set(target, {
                            value: current,
                            priority: target.style.getPropertyPriority('filter')
                        });
                        target.style.filter = IMAGE_FILTER;
                    }
                }
            } catch (error) {
                console.error("Error applying filter: ", error);
            }
        });
    });

    // תצפית על כל תת-העץ, כך שגם אלמנטים שנוספו לאחר מכן נבדקים
    function startObserver() {
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }

    // עוצר את התצפית ומשחזר את ה-filter המקורי של כל אלמנט ששינינו
    function restoreInlineFilters() {
        observer.disconnect();
        originalFilters.forEach((original, el) => {
            if (original.value) {
                el.style.setProperty('filter', original.value, original.priority);
            } else {
                el.style.removeProperty('filter');
            }
        });
        originalFilters.clear();
    }

    // הפונקציה שמחילה את הסגנון הנגטיבי
    function applyNegativeColors() {
        document.documentElement.classList.add('inv');
        startObserver();
    }

    // הפונקציה שמסירה את הסגנון הנגטיבי
    function removeNegativeColors() {
        restoreInlineFilters();
        document.documentElement.classList.remove('inv');
    }

    // פונקציה שמחליפה בין שני המצבים
    function toggleNegativeColors() {
        if (document.documentElement.classList.contains('inv')) {
            removeNegativeColors();
        } else {
            applyNegativeColors();
        }
    }

    // קורא את ההגדרות ומחיל או מסיר את האפקט עבור הדף הנוכחי
    function refresh() {
        chrome.storage.sync.get(['mode', 'blacklist', 'whitelist', 'enabled'], function (data) {
            const mode = data.mode || 'blacklist';
            const list = mode === 'blacklist' ? data.blacklist || [] : data.whitelist || [];
            const currentHost = window.location.hostname;
            const enabled = data.enabled !== false;

            const shouldApply = enabled &&
                (mode === 'blacklist' ? !list.includes(currentHost) : list.includes(currentHost));

            if (shouldApply) {
                applyNegativeColors();
            } else {
                removeNegativeColors();
            }
        });
    }

    // ה-background מבקש רענון כשההגדרות משתנות
    chrome.runtime.onMessage.addListener(function (message) {
        if (message && message.type === 'nc:refresh') {
            refresh();
        }
    });

    // הפעלת הקוד לאחר שהדף נטען לחלוטין (או מיד אם הסקריפט הוזרק מאוחר)
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", refresh);
    } else {
        refresh();
    }
})();
