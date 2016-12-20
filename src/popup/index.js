import Tab from '../services/tab';

// Browser Action Click
chrome.browserAction.onClicked.addListener((tab) => {
    if (!tab.id || tab.id === chrome.tabs.TAB_ID_NONE) {
        return;
    }

    var toStore = Tab.create({
        url: tab.url,
        title: tab.title,
        favicon: tab.favIconUrl
    });

    toStore.add().then(() => {
        chrome.tabs.remove(tab.id);
    });
});

// Add menu items
chrome.contextMenus.create({
    id: 'all_tabs',
    title: 'Dog Ear all tabs',
    contexts: ['browser_action']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'all_tabs') {
        chrome.tabs.query({windowId: tab.windowId}, (tabs) => {
            tabs.forEach((tab) => {
                var toStore = Tab.create({
                    url: tab.url,
                    title: tab.title,
                    favicon: tab.favIconUrl
                });

                toStore.add().then(() => {
                    chrome.tabs.remove(tab.id);
                });
            });
        });
    }
});
