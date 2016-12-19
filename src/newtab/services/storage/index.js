import Connection from './connection';
import { TAB_ARRAY_KEY, DEFAULT_RECENT_NUM } from './constants';

import Tab from '../tab';
import Error from '../error';

import AsyncLock from 'async-lock';

class Storage {
    constructor () {
        this.lock = new AsyncLock();
    }

    getTab (url) {
        return Connection.get(url).then((items) => {
            return Tab.create(items[url]);
        });
    }

    getRecentTabs (num = DEFAULT_RECENT_NUM) {
        return this._getTabIDs().then(tabIDs => {
            var recent = tabIDs.splice(-1 * num);
            return Connection.get(recent).then(items => {
                return recent.map((url) => {
                    return Tab.create(items[url]);
                });
            });
        });
    }

    addTab (tab) {
        return this.lock.acquire(tab.url, () => {
            return this.getTab(tab.url).then((oldTab) => {
                if (oldTab) {
                    return this.removeTab(oldTab);
                }
            }).then(() => {
                return Promise.all([
                    Connection.set(tab.url, tab),
                    this._addToTabIDs(tab.url)
                ]);
            });
        });
    }

    removeTab (tab) {
        if (!tab.url) {
            return Promise.reject(Error.TAB_NO_ID());
        }

        return Promise.all([
            this._removeFromTabIDs(tab.url),
            Connection.delete(tab.url)
        ]);
    }

    onChange (callback) {
        Connection.onChanged(callback);
    }

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
                    return Promise.reject(Error.TAB_ID_NOT_FOUND());
                }

                tabArray.splice(idx, 1);

                return Connection.set(TAB_ARRAY_KEY, tabArray);
            });
        });
    }
}

export default new Storage();
