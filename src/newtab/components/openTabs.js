import React from 'react';
import classNames from 'classnames';

import Tab from '../../services/tab';

import List from './list';

class OpenTabs extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            groups: [],
            selection: {}
        };

        this.tabMap = {}; // Maps url to chrome tab id

        this.select = this.select.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount () {
        this.getCurrentTabs();
    }

    getCurrentTabs () {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
            this.tabMap = {};

            // Remove New Tab
            tabs = tabs.filter((tab) => tab.url !== 'chrome://newtab/');

            // Convert to Tab type
            tabs = tabs.map((tab) => {
                this.tabMap[tab.url] = tab.id;

                return Tab.create({
                    url: tab.url,
                    title: tab.title,
                    favicon: tab.favIconUrl
                });
            });

            this.setState({
                groups: [{
                    group: 'Open Tabs (' + tabs.length + ')',
                    tabs: tabs
                }],
                selection: {}
            });
        });
    }

    select (tab, force) {
        var selection = this.state.selection;

        if ((tab.url in selection && force === undefined) ||
            force === false) {
            delete selection[tab.url];
        } else {
            selection[tab.url] = tab;
        }

        this.setState({
            selection: selection
        });
    }

    onClick () {
        var count = 0;
        var selectedUrls = Object.keys(this.state.selection);
        selectedUrls.forEach((url) => {
            var tab = this.state.selection[url];
            var tabID = this.tabMap[url];

            tab.add().then(() => {
                chrome.tabs.remove(tabID, () => {
                    count++;
                    if (count === selectedUrls.length) {
                        this.getCurrentTabs();
                    }
                });
            });
        });
    }

    render () {
        return (
            <div className="open-tabs">
                <List
                    groups={this.state.groups}
                    select={this.select}
                    selection={this.state.selection}
                />
                <button
                    className={classNames({
                        'save-btn': true,
                        'active': Object.keys(this.state.selection).length > 0
                    })}
                    onClick={this.onClick}
                    >
                    Dog Ear
                </button>
            </div>
        );
    }
}

export default OpenTabs;
