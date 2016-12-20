import Storage from './storage/index';
import Error from './error';

class Tab {
    constructor (config) {
        var {url, favicon, added, title} = config;
        this.title = title;
        this.url = url;
        this.favicon = favicon;
        this.added = added;
    }

    static create (config) {
        if (config === undefined) {
            return undefined;
        }

        let tab = new Tab(config);

        if (!tab.url) {
            throw Error.TAB_NO_URL();
        }

        if (!tab.added) {
            tab.added = Date.now();
        }

        return tab;
    }

    static get (id) {
        return Storage.getTab(id);
    }

    add () {
        return Storage.addTab(this);
    }

    remove () {
        return Storage.removeTab(this);
    }
}

export default Tab;
