class BrowserStorage {
    static api;
    static storage;
    static initialized = false;

    // internal listeners
    static _listeners = [];

    static init() {
        if (this.initialized) return;

        // Extension APIs
        if (typeof globalThis.browser !== "undefined" && globalThis.browser?.storage) {
            this.api = "extension";
            this.storage = globalThis.browser.storage;
        } else if (typeof globalThis.chrome !== "undefined" && globalThis.chrome?.storage) {
            this.api = "extension";
            this.storage = globalThis.chrome.storage;
        }
        // Fallback
        else {
            this.api = "localStorage";
            this.storage = globalThis.localStorage;
        }

        this.initialized = true;
    }

    static get(key) {
        this.init();

        if (this.api === "localStorage") {
            return Promise.resolve(this.storage.getItem(key));
        }

        return new Promise((resolve) => {
            this.storage.local.get(key, (result) => {
                resolve(result[key]);
            });
        });
    }

    static set(key, value) {
        this.init();

        // localStorage
        if (this.api === "localStorage") {
            const oldValue = this.storage.getItem(key);
            this.storage.setItem(key, value);

            this._emitChange(key, oldValue, value);
            return Promise.resolve();
        }

        // extension storage
        return new Promise((resolve) => {
            this.storage.local.get(key, (result) => {
                const oldValue = result[key];

                this.storage.local.set({ [key]: value }, () => {
                    this._emitChange(key, oldValue, value);
                    resolve();
                });
            });
        });
    }

    static onChange(keys, callback) {
        this.init();

        // allow onChange(callback)
        if (typeof keys === "function") {
            callback = keys;
            keys = null;
        }

        // register internal listener
        this._listeners.push({ keys, callback });

        // native extension listener
        if (this.api === "extension") {
            this.storage.onChanged.addListener((changes, area) => {
                if (area !== "local") return;

                Object.entries(changes).forEach(([key, change]) => {
                    if (
                        !keys ||
                        keys === key ||
                        (Array.isArray(keys) && keys.includes(key))
                    ) {
                        callback(change);
                    }
                });
            });
        }
    }

    static _emitChange(key, oldValue, newValue) {
        this._listeners.forEach(({ keys, callback }) => {
            if (
                !keys ||
                keys === key ||
                (Array.isArray(keys) && keys.includes(key))
            ) {
                callback({ oldValue, newValue });
            }
        });
    }
}
