import Connection from './connection';
import { TAB_ARRAY_KEY, SETTINGS_KEY, DEFAULT_RECENT_NUM } from './constants';

import Tab from '../tab';
import Error from '../error';

import AsyncLock from 'async-lock';

const reservedIDs = [TAB_ARRAY_KEY, SETTINGS_KEY];

class Storage {
    constructor () {
        this.lock = new AsyncLock();

        if (typeof chrome !== 'undefined') {
            // Check for orphans
            Promise.all([
                this.size({ excludeReserved: true }),
                this._getTabIDsWithProtection()
            ]).then((res) => {
                var size = res[0];
                var tabIDs = res[1];

                if (tabIDs.length !== size) {
                    return this.cleanUpOrphans();
                }
            });
        }
    }

    size (options = {}) {
        var { excludeReserved } = options;
        return Connection.get(null).then((store) => {
            if (excludeReserved) {
                reservedIDs.forEach((id) => {
                    delete store[id];
                });
            }
            return Object.keys(store).length;
        });
    }

    getTab (url) {
        return Connection.get(url).then((items) => {
            return Tab.create(items[url]);
        });
    }

    getRecentTabs (num = DEFAULT_RECENT_NUM) {
        return this._getTabIDsWithProtection().then(tabIDs => {
            var recent = tabIDs.slice(-1 * num);
            return Connection.get(recent).then(items => {
                let tabs = [];
                let cleanUps = [];

                recent.reverse().forEach((url) => {
                    // Check if tab exists in storage
                    let tabConfig = items[url];
                    if (tabConfig) {
                        tabs.push(Tab.create(tabConfig));
                    } else {
                        cleanUps.push(this._removeFromTabIDs(url));
                    }
                });

                return Promise.all(cleanUps).then(() => tabs);
            });
        });
    }

    getOldestTabs (num = DEFAULT_RECENT_NUM) {
        return this._getTabIDsWithProtection().then(tabIDs => {
            var oldest = tabIDs.slice(0, num);
            return Connection.get(oldest).then(items => {
                return oldest.map((url) => {
                    return Tab.create(items[url]);
                });
            });
        });
    }

    addTab (tab) {
        if (this._isReservedID(tab.url)) {
            return Promise.reject(Error.TAB_RESERVED_ID());
        }

        // You can only add one tab at a time
        // This is because we need to check the size (and possibly clear space)
        // each time.
        return this.lock.acquire('ADDED', () => {
            // Check if more space
            return this.getSizeAndClearUpSpace(10).then(() => {
                return this.getTab(tab.url);
            }).then((oldTab) => {
                if (oldTab) {
                    return this.removeTab(oldTab);
                } else {
                    return Promise.resolve();
                }
            }).then(() => {
                return Connection.set(tab.url, tab);
            }).then(() => {
                return this._addToTabIDs(tab.url);
            });
        });
    }

    updateTab (tab) {
        return Connection.set(tab.url, tab);
    }

    removeTab (tab) {
        if (!tab.url) {
            return Promise.reject(Error.TAB_NO_ID());
        }

        return this._removeFromTabIDs(tab.url).then(() => {
            return Connection.delete(tab.url);
        });
    }

    onChange (callback) {
        Connection.onChange(callback);
    }

    cleanUpOrphans () {
        return Promise.all([
            this._getTabIDsWithProtection(),
            Connection.get(null)
        ]).then((res) => {
            var tabIDs = res[0];
            var store = res[1];

            reservedIDs.forEach((id) => {
                delete store[id];
            });

            tabIDs.forEach((id) => {
                delete store [id];
            });

            var orphans = Object.keys(store);

            return Promise.all(orphans.map((orphan) => {
                return Connection.delete(orphan);
            }));
        });
    }

    clearUpSpace (num) {
        return this.getOldestTabs(num).then(tabs => {
            return Promise.all(tabs.map(tab => {
                return tab.remove();
            }));
        });
    }

    getSizeAndClearUpSpace (num) {
        return this.size().then((size) => {
            if (size >= Connection.MAX_ITEMS) {
                return this.clearUpSpace(num);
            } else {
                return Promise.resolve();
            }
        });
    }

    // Don't try to lock this function because other functions (_addToTabIDs, _removeFromTabIDs)
    // Already lock before calling this.
    // Instead use _getTabIDsWithProtection if a lock is needed for reading.
    _getTabIDs () {
        return Connection.get(TAB_ARRAY_KEY).then((items) => {
            // If no tab array exists
            if (!items[TAB_ARRAY_KEY]) {
                // Set to empty array
                return Connection.set (TAB_ARRAY_KEY, []).then(() => []);
            } else {
                return items[TAB_ARRAY_KEY];
            }
        });
    }

    _getTabIDsWithProtection () {
        return this.lock.acquire(TAB_ARRAY_KEY, () => {
            return this._getTabIDs();
        });
    }

    _addToTabIDs (id) {
        return this.lock.acquire(TAB_ARRAY_KEY, () => {
            return this._getTabIDs().then((tabArray) => {
                tabArray.push(id);
                return Connection.set(TAB_ARRAY_KEY, tabArray);
            });
        });
    }

    _removeFromTabIDs (id) {
        return this.lock.acquire(TAB_ARRAY_KEY, () => {
            return this._getTabIDs().then((tabArray) => {
                var idx = tabArray.lastIndexOf(id);
                if (idx < 0) {
                    return Promise.reject(Error.TAB_ID_NOT_FOUND(id));
                }

                tabArray.splice(idx, 1);

                return Connection.set(TAB_ARRAY_KEY, tabArray);
            });
        });
    }

    _isReservedID (id) {
        return reservedIDs.reduce((a, b) => {
            return a || (b === id);
        }, false);
    }
}

export default new Storage();
