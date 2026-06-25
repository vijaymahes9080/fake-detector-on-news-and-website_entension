// TruthGuard Chrome API Polyfill for Web/GitHub Pages Hosting
if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.storage) {
    console.log("TruthGuard: Chrome Extension APIs not detected. Loading Web Polyfill.");

    // Setup initial default local storage values
    const setupDefaults = () => {
        if (localStorage.getItem('level') === null) {
            localStorage.setItem('level', 'low');
        }
        if (localStorage.getItem('impact') === null) {
            localStorage.setItem('impact', '12');
        }
    };
    setupDefaults();

    // Reload the popup automatically when localStorage changes in the parent context
    window.addEventListener('storage', (e) => {
        if (e.key === 'level' || e.key === 'impact') {
            console.log(`TruthGuard Polyfill: Storage key "${e.key}" updated. Reloading popup UI.`);
            window.location.reload();
        }
    });

    // Export mocked chrome APIs to the window
    window.chrome = {
        runtime: {
            id: "mocked-truthguard-web",
            sendMessage: async function (message, callback) {
                console.log("Mocked runtime.sendMessage received:", message);
                if (callback) callback({ success: true });
                return { success: true };
            },
            getURL: function (path) {
                return path; // Web relative path
            }
        },
        storage: {
            local: {
                get: async function (keys, callback) {
                    const result = {};
                    const keyArray = Array.isArray(keys) ? keys : [keys];
                    
                    keyArray.forEach(key => {
                        const rawVal = localStorage.getItem(key);
                        if (rawVal === null) {
                            result[key] = undefined;
                        } else {
                            try {
                                result[key] = JSON.parse(rawVal);
                            } catch (e) {
                                result[key] = rawVal;
                            }
                        }
                    });

                    if (callback) callback(result);
                    return result;
                },
                set: async function (items, callback) {
                    Object.keys(items).forEach(key => {
                        const val = items[key];
                        localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
                    });
                    
                    if (callback) callback();
                    
                    // Dispatch local storage event for same-window updates
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: Object.keys(items)[0],
                        newValue: items[Object.keys(items)[0]]
                    }));
                }
            }
        }
    };
}
