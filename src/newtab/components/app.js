import React from 'react';
import Storage from '../../services/storage/index';

import List from './list';
import ActionBar from './actionBar';

const PAGE_SIZE = 20;

class App extends React.Component {
    constructor (props) {
        super(props);

        this.tabNumber = PAGE_SIZE;

        this.state = {
            tabs: [],
            selection: {}
        };

        this.loadMore = this.loadMore.bind(this);
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
        this.tabNumber += PAGE_SIZE;
        this.loadTabs();
    }

    openTabs (tabs) {
        if (!Array.isArray(tabs)) {
            tabs = [ tabs ];
        }
        chrome.tabs.getCurrent((currentTab) => {
            var count = 0;

            tabs.forEach((tab) => {
                chrome.tabs.create({ url: tab.url }, () => {
                    tab.remove();
                    count++;

                    // If last one
                    if (count === tabs.length) {
                        chrome.tabs.remove(currentTab.id);
                    }
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
            <div>
                <List
                    tabs={this.state.tabs}
                    openTabs={this.openTabs}
                    loadMore={this.loadMore}
                    showLoadMore={this.state.tabs.length === this.tabNumber}

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
