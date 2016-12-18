// A mock connection to Chrome storage for testing
// A simple key-value store
class MockConnection {
    constructor (store) {
        this.store = store;
    }

    get (key) {
        var ret = {};
        var keys = [];

        if (!Array.isArray(key)) {
            keys = [ key ];
        } else {
            keys = key;
        }

        keys.forEach((key) => {
            ret[key] = this.store[key];
        });

        return Promise.resolve(ret);
    }

    set (key, value) {
        this.store[key] = value;

        return Promise.resolve();
    }

    delete (key) {
        delete this.store[key];

        return Promise.resolve();
    }

    onChange () {
        // not mocked
    }

}

export default MockConnection;
