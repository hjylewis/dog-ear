class Connection {
    constructor () {
        // TODO: check that chrome.storage.sync exits
        // if (!chrome.storage) {
        //     throw Error.NO_STORAGE();
        // }
        //
        // this.storageArea = chrome.storage.sync;
    }

    get (key) {
        var getPromise = new Promise ((resolve, reject) => {
            chrome.storage.sync.get(key, (value) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(value);
            });
        });

        return getPromise;
    }

    set (key, value) {
        let object = {};
        object[key] = value;

        var setPromise = new Promise ((resolve, reject) => {
            chrome.storage.sync.set(object, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });

        return setPromise;
    }

    delete (key) {
        var deletePromise = new Promise ((resolve, reject) => {
            chrome.storage.sync.remove(key, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });

        return deletePromise;
    }

    onChange (callback) {
        chrome.storage.onChanged.addListener(callback);
    }

}

export default new Connection();
