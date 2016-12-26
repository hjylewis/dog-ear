import React from 'react';
import Storage from '../../services/storage/index';

import List from './list';
import ActionBar from './actionBar';

const PAGE_SIZE = 30;

class App extends React.Component {
    constructor (props) {
        super(props);

        this.tabNumber = PAGE_SIZE;

        this.state = {
            tabs: [],
            selection: {}
        };

        this.loadMore = this.loadMore.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.openTabs = this.openTabs.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
    }

    componentDidMount () {
        this.loadTabs();
        Storage.onChange(() => {
            this.loadTabs();
        });
    }

    loadTabs () {
        Storage.getRecentTabs(this.tabNumber).then((tabs) => {
            this.setState({ tabs: tabs });
        });
    }

    loadMore () {
        if (this.state.tabs.length === this.tabNumber) {
            this.tabNumber += PAGE_SIZE;
            this.loadTabs();
        }
    }

    onScroll (e) {
        var distanceFromBottom = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight);

        if (distanceFromBottom < 50) {
            this.loadMore();
        }
    }

    openTabs (tabs) {
        if (!Array.isArray(tabs)) {
            tabs = [ tabs ];
        }
        chrome.tabs.getCurrent((currentTab) => {
            var count = 0;

            tabs.forEach((tab) => {
                chrome.tabs.create({ url: tab.url }, () => {
                    tab.remove().then(() => {
                        count++;

                        // If last one
                        if (count === tabs.length) {
                            chrome.tabs.remove(currentTab.id);
                        }
                    });
                });
            });
        });
    }

    toggleSelection (tab) {
        var selection = this.state.selection;
        if (tab.url in selection) {
            delete selection[tab.url];
        } else {
            selection[tab.url] = tab;
        }

        this.setState({
            selection: selection
        });
    }

    render () {
        console.log(this.state.tabs);

        return (
            <div className="app" onScroll={this.onScroll}>
                <div className="header">
                    <h1>Dog Ears</h1>
                </div>
                <List
                    tabs={this.state.tabs}
                    openTabs={this.openTabs}

                    toggleSelection={this.toggleSelection}
                    selection={this.state.selection}
                />
                { Object.keys(this.state.selection).length > 0 ?
                    <ActionBar
                        toggleSelection={this.toggleSelection}
                        openTabs={this.openTabs}
                        selection={this.state.selection}
                    /> :
                    ''
                }
            </div>
        );
    }
}

export default App;
