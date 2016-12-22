import React from 'react';
import Storage from '../../services/storage/index';

import List from './list';

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
                    loadMore={this.loadMore}
                    showLoadMore={this.state.tabs.length === this.tabNumber}

                    toggleSelection={this.toggleSelection}
                    selection={this.state.selection}
                />
            </div>
        );
    }
}

export default App;
