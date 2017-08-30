const localStorage = window.localStorage;
const settingsKey = 'settings';

class Settings {
    constructor (config) {
        Object.assign(this, config);
    }

    static import () {
        var config = JSON.parse(localStorage.getItem(settingsKey));
        return new Settings(config);
    }

    save () {
        localStorage.setItem(settingsKey, JSON.stringify(this));
    }
}

export default Settings.import();
