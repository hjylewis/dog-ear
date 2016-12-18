import Storage from './storage';

class Tab {
    constructor (config) {
        var {url, favicon, added, id} = config;
        this.id = id;
        this.url = url;
        this.favicon = favicon;
        this.added = added;
    }

    static create (config) {
        let tab = new Tab(config);

        if (!tab.added) {
            tab.added = Date.now();
        }

        return tab;
    }

    static get (id) {
        return Storage.getTab(id);
    }

    static getRecent (num = 20) {
        return Storage.getRecentTabs(num);
    }

    add () {
        return Storage.addTab(this);
    }

    remove () {
        return Storage.removeTab(this);
    }
}

export default Tab;
