import Tab from '../services/tab';

const NEWTAB_URL = 'chrome://newtab';

// Browser Action Click
chrome.browserAction.onClicked.addListener(tab => {
  if (!tab.id || tab.id === chrome.tabs.TAB_ID_NONE) {
    return;
  }

  var toStore = Tab.create({
    url: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl,
  });
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, tabs => {
    var tabNum = tabs.length;

    let addAndRemoveTab = () => {
      toStore
        .add()
        .then(() => {
          chrome.tabs.remove(tab.id);
        })
        .catch(displayErrorNotification);
    };

    // If we are removing the last tab
    if (tabNum === 1) {
      chrome.tabs.create({ url: NEWTAB_URL }, addAndRemoveTab);
    } else {
      addAndRemoveTab();
    }
  });
});

// Add menu items
chrome.contextMenus.create({
  id: 'all_tabs',
  title: 'Dog Ear all tabs',
  contexts: ['browser_action'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'all_tabs') {
    chrome.tabs.query({ windowId: tab.windowId }, tabs => {
      chrome.tabs.create({ url: NEWTAB_URL }, () => {
        tabs.forEach(tab => {
          var toStore = Tab.create({
            url: tab.url,
            title: tab.title,
            favicon: tab.favIconUrl,
          });

          toStore
            .add()
            .then(() => {
              chrome.tabs.remove(tab.id);
            })
            .catch(displayErrorNotification);
        });
      });
    });
  }
});

// Error notifications

function displayErrorNotification(message) {
  // If Error object
  if (message && message.message) {
    message = message.message;
  }

  chrome.notifications.create('ERROR', {
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'Error',
    message: message,
  });
}
