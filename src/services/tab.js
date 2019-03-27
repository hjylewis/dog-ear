import Storage from './storage/index';
import Error from './error';

class Tab {
  constructor({ url, favicon, added, title, category }) {
    this.url = url;
    if (title && title.length < 500) {
      this.title = title;
    }

    if (favicon && favicon.length < 500) {
      this.favicon = favicon;
    }
    this.added = added;
    this.category = category;

    // Make url (the id) readonly
    Object.defineProperty(this, 'url', {
      writable: false,
    });
  }

  static create(config) {
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

  static get(id) {
    return Storage.getTab(id);
  }

  add() {
    return Storage.addTab(this);
  }

  update() {
    return Storage.updateTab(this);
  }

  remove() {
    return Storage.removeTab(this);
  }
}

export default Tab;
