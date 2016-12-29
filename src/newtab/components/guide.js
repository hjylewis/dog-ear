import React from 'react';
import Tab from '../../services/tab';

import OpenTabs from './openTabs';

const WARNING_NUM = 10;

const emptyMessage = 'This is empty.  You currently have no dog ears saved.  Start dog earing tabs using the button on the top right of your browser.';
const emptyOpenTabs = 'This is empty.  You currently have no dog ears saved.  Start by dog earing some of your open tabs.  Click the icons to select.';
const tooManyOpenTabs = '';

class Guide extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            openTabs: [],
            selection: {}
        };

        this.tabMap = {}; // Maps url to chrome tab id

        this.select = this.select.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount () {
        this.getOpenTabs();
    }

    getOpenTabs () {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
            // Remove New Tab
            tabs = tabs.filter((tab) => tab.url !== 'chrome://newtab/');

            tabs = tabs.map((tab) => {
                this.tabMap[tab.url] = tab.id;

                return Tab.create({
                    url: tab.url,
                    title: tab.title,
                    favicon: tab.favIconUrl
                });
            });

            this.setState({
                openTabs: tabs
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
                        this.getOpenTabs();
                    }
                });
            });
        });
    }

    render () {
        // Set Type
        var type = null;
        if (this.props.tabsLoaded) { // Make sure it's been loaded first
            if (this.props.tabNumber === 0) {
                if (this.state.openTabs.length === 0) {
                    type = 'EMPTY';
                } else {
                    type = 'EMPTY_OPENTABS';
                }
            } else if (this.state.openTabs.length > WARNING_NUM) {
                type = 'MANY_OPENTABS';
            }
        }


        // Set message
        var message = '';
        if (type === 'EMPTY') {
            message = emptyMessage;
        } else if (type === 'EMPTY_OPENTABS') {
            message = emptyOpenTabs;
        } else if (type === 'MANY_OPENTABS') {
            message = tooManyOpenTabs;
        }

        // Set contents
        var contents = [];
        if (type) {
            contents.push(
                <div key='info' className='guide-info'>
                    <p>{message}</p>
                </div>
            );
        }

        if (type === 'EMPTY_OPENTABS' || type === 'MANY_OPENTABS') {
            contents.push(
                <OpenTabs
                    key='open-tabs'
                    openTabs={this.state.openTabs}
                    select={this.select}
                    selection={this.state.selection}
                    onClick={this.onClick}
                />
            );
        }

        return (
            <div className='guide'>
                { contents }
            </div>
        );
    }
}

Guide.propTypes = {
    tabsLoaded: React.PropTypes.bool.isRequired, // if tabs have been initially loaded
    tabNumber: React.PropTypes.number.isRequired // number of saved tabs
};

export default Guide;
