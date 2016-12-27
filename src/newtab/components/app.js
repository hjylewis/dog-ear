import React from 'react';
import Storage from '../../services/storage/index';
import TimeGrouping from '../../services/timeGrouping';

import List from './list';
import ActionBar from './actionBar';

import DogLogo from '../assets/Dog.svg';

const PAGE_SIZE = 40;

class App extends React.Component {
    constructor (props) {
        super(props);

        this.tabNumber = PAGE_SIZE;

        this.state = {
            tabs: [],
            groups: [],
            selection: {}
        };

        this.loadMore = this.loadMore.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.openTabs = this.openTabs.bind(this);
        this.select = this.select.bind(this);
    }

    componentDidMount () {
        this.loadTabs();
        Storage.onChange(() => {
            this.loadTabs();
        });
    }

    loadTabs () {
        Storage.getRecentTabs(this.tabNumber).then((tabs) => {
            this.setState({
                tabs: tabs,
                groups: TimeGrouping.createGrouping(tabs)
            });
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

    // Works like a toggle when force is not defined
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

    render () {
        console.log(this.state.tabs);

        return (
            <div className="app" onScroll={this.onScroll}>
                <div className="header">
                    <div className="content">
                        <DogLogo className="dog-logo"/>
                        <h1>Your Dog Ears</h1>
                    </div>
                </div>
                <List
                    groups={this.state.groups}
                    openTabs={this.openTabs}

                    select={this.select}
                    selection={this.state.selection}
                />
                { Object.keys(this.state.selection).length > 0 ?
                    <ActionBar
                        select={this.select}
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
