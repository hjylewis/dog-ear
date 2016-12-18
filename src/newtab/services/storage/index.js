import mock from './mockConnection';
import { TAB_ARRAY_KEY, DEFAULT_RECENT_NUM } from './constants';

import Tab from '../tab';
import Error from '../error';

var Connection = new mock({});

class Storage {
    getTab (id) {
        return Connection.get(id).then((items) => {
            return Tab.create(items[id]);
        });
    }

    getRecentTabs (num = DEFAULT_RECENT_NUM) {
        return this._getTabIDs().then(tabIDs => {
            var recent = tabIDs.splice(-1 * num);
            return Connection.get(recent).then(items => {
                return recent.map((id) => {
                    return Tab.create(items[id]);
                });
            });
        });
    }

    addTab (tab) {
        if (tab.id) {
            return Promise.reject(Error.TAB_HAS_ID());
        }

        return this._getNewID().then((id) => {
            tab.id = id;
            return Promise.all([
                Connection.set(tab.id, tab),
                this._addToTabIDs(tab.id)
            ]);
        });
    }

    removeTab (tab) {
        if (!tab.id) {
            return Promise.reject(Error.TAB_NO_ID());
        }

        return Promise.all([
            this._removeFromTabIDs(tab.id),
            Connection.delete(tab.id)
        ]);
    }

    onChange (callback) {
        Connection.onChanged(callback);
    }

    _getNewID () {
        return this._getTabIDs().then((tabs) => {
            let id = tabs.length > 0 ? parseInt(tabs[tabs.length - 1]) + 1 : 0;
            return id.toString();
        });
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
        return this._getTabIDs().then((tabArray) => {
            tabArray.push(id);
            return Connection.set(TAB_ARRAY_KEY, tabArray);
        });
    }

    _removeFromTabIDs (id) {
        return this._getTabIDs().then((tabArray) => {
            var idx = tabArray.lastIndexOf(id);
            if (idx < 0) {
                return Promise.reject(Error.TAB_ID_NOT_FOUND());
            }

            tabArray.splice(idx, 1);

            return Connection.set(TAB_ARRAY_KEY, tabArray);
        });
    }
}

export default new Storage();
