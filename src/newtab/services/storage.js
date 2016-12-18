import Tab from './tab';
import Error from './error';

const TAB_ARRAY_KEY = 'tabArray';
const DEFAULT_RECENT_NUM = 20;

class Storage {
    constructor () {
        if (!chrome.storage) {
            throw Error.NO_STORAGE;
        }

        this.storageArea = chrome.storage.sync;
    }

    _getPromise (key) {
        var getPromise = new Promise ((resolve, reject) => {
            this.storageArea.get(key, (value) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(value);
            });
        });

        return getPromise;
    }

    _setPromise (key, value) {
        let object = {};
        object[key] = value;

        var setPromise = new Promise ((resolve, reject) => {
            this.storageArea.set(object, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });

        return setPromise;
    }

    _deletePromise (key) {
        var deletePromise = new Promise ((resolve, reject) => {
            this.storageArea.remove(key, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });

        return deletePromise;
    }

    getTab (id) {
        return this._getPromise(id).then((items) => {
            return Tab.create(items[id]);
        });
    }

    getRecentTabs (num = DEFAULT_RECENT_NUM) {
        return this._getTabIDs().then(tabIDs => {
            var recent = tabIDs.splice(-1 * num);
            return this._getPromise(recent).then(items => {
                return recent.map((id) => {
                    return Tab.create(items[id]);
                });
            });
        });
    }

    addTab (tab) {
        if (tab.id) {
            return Promise.reject(Error.TAB_HAS_ID);
        }

        return this._getNewID().then((id) => {
            tab.id = id;
            return Promise.all([
                this._setPromise(tab.id, tab),
                this._addToTabIDs(tab.id)
            ]);
        });
    }

    removeTab (tab) {
        if (!tab.id) {
            return Promise.reject(Error.TAB_NO_ID);
        }

        return Promise.all([
            this._removeFromTabIDs(tab.id),
            this._deletePromise(tab.id)
        ]);
    }

    _getNewID () {
        return this._getTabIDs().then((tabs) => {
            let id = tabs.length > 0 ? parseInt(tabs[tabs.length - 1]) + 1 : 0;
            return id.toString();
        });
    }

    _getTabIDs () {
        return this._getPromise(TAB_ARRAY_KEY).then((items) => {
            // If no tab array exists
            if (!items[TAB_ARRAY_KEY]) {
                // Set to empty array
                return this._setPromise (TAB_ARRAY_KEY, []).then(() => []);
            } else {
                return items[TAB_ARRAY_KEY];
            }
        });
    }

    _addToTabIDs (id) {
        return this._getTabIDs().then((tabArray) => {
            tabArray.push(id);
            return this._setPromise(TAB_ARRAY_KEY, tabArray);
        });
    }

    _removeFromTabIDs (id) {
        return this._getTabIDs().then((tabArray) => {
            var idx = tabArray.lastIndexOf(id);
            if (idx < 0) {
                return Promise.reject(Error.TAB_ID_NOT_FOUND);
            }

            tabArray.splice(idx, 1);

            return this._setPromise(TAB_ARRAY_KEY, tabArray);
        });
    }

    onChange (callback) {
        this.storageArea.onChanged.addListener(callback);
    }

}

export default new Storage();
