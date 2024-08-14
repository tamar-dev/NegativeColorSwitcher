// הפעלת הקוד לאחר שהדף נטען לחלוטין
document.addEventListener("DOMContentLoaded", function() {

    // הפעלת הפונקציה מידית על כל דף בהתאם לרשימות וההגדרות
    (function() {
        chrome.storage.sync.get(['mode', 'blacklist', 'whitelist'], function (data) {
            const mode = data.mode || 'blacklist';
            const list = mode === 'blacklist' ? data.blacklist || [] : data.whitelist || [];
            const currentHost = window.location.hostname;

            const shouldApply = mode === 'blacklist' ? !list.includes(currentHost) : list.includes(currentHost);

            if (shouldApply) {
                applyNegativeColors();
            }
        });
    })();

    // יצירת MutationObserver כדי לעקוב אחרי שינויים באלמנטים עם רקע תמונה
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            try {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    const style = getComputedStyle(target);
                    if (style.backgroundImage !== 'none' && style.backgroundImage !== '') {
                        console.log("found: " + style.backgroundImage);
                        target.style.filter = "invert(1) hue-rotate(180deg) brightness(1.05) contrast(1.05)";
                    }
                }
            } catch (error) {
                console.error("Error applying filter: ", error);
            }
        });
    });

    // הפעלת ה-MutationObserver על האלמנטים
    const elements = document.querySelectorAll('*');
    elements.forEach(el => observer.observe(el, { attributes: true, attributeFilter: ['style'] }));

});

// הפונקציה שמחילה את הסגנון הנגטיבי
function applyNegativeColors() {
    document.documentElement.classList.add('inv');
}

// הפונקציה שמסירה את הסגנון הנגטיבי
function removeNegativeColors() {
    document.documentElement.classList.remove('inv');
}

// פונקציה שמחליפה בין שני המצבים
function toggleNegativeColors() {
    document.documentElement.classList.toggle("inv");
}
