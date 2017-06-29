import React from 'react';
import Storage from '../../services/storage/index';
import TimeGrouping from '../../services/timeGrouping';

import { ErrorAlert } from './alert';
import List from './list';
import Guide from './Guide';
import ActionBar from './actionBar';

import DogLogo from '../assets/Dog.svg';

const PAGE_SIZE = 40;

class App extends React.Component {
    constructor (props) {
        super(props);

        this.tabNumber = PAGE_SIZE;

        this.state = {
            tabs: null,
            errorMessage: null,
            groups: [],
            selection: {}
        };

        this.loadMore = this.loadMore.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.openTabs = this.openTabs.bind(this);
        this.select = this.select.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
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
        }).catch((error) => this.setErrorMessage(error));
    }

    loadMore () {
        if (this.state.tabs && this.state.tabs.length === this.tabNumber) {
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
                tab.remove().then(() => {
                    count++;
                    chrome.tabs.create({ url: tab.url });

                    // If last one
                    if (count === tabs.length) {
                        chrome.tabs.remove(currentTab.id);
                    }
                }).catch((error) => this.setErrorMessage(error));
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

    setErrorMessage (message) {
        // If Error object
        if (message && message.message) {
            message = message.message;
        }

        this.setState({
            errorMessage: message
        });
    }

    render () {
        return (
            <div className="app" onScroll={this.onScroll}>
                <div className="header">
                    <ErrorAlert message={this.state.errorMessage} closeAlert={this.setErrorMessage.bind(null,null)} />
                    <div className="header-content">
                        <DogLogo className="dog-logo"/>
                        <h1>Your Dog Ears</h1>
                    </div>
                </div>
                <div className="app-content">
                    <Guide
                        tabsLoaded={!!this.state.tabs}
                        tabNumber={this.state.tabs ? this.state.tabs.length : 0}
                        setErrorMessage={this.setErrorMessage}
                    />
                    <List
                        groups={this.state.groups}
                        openTabs={this.openTabs}

                        select={this.select}
                        selection={this.state.selection}
                    />
                </div>
                { Object.keys(this.state.selection).length > 0 ?
                    <ActionBar
                        select={this.select}
                        openTabs={this.openTabs}
                        selection={this.state.selection}
                        setErrorMessage={this.setErrorMessage}
                    /> :
                    ''
                }
            </div>
        );
    }
}

export default App;
