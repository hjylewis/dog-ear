import React from 'react';
import Storage from '../services/storage/index';

import List from './list';

const PAGE_SIZE = 20;

class App extends React.Component {
    constructor (props) {
        super(props);

        this.tabNumber = PAGE_SIZE;

        this.state = {
            tabs: [],
        };
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

    render () {
        console.log(this.state.tabs);

        return (
            <div>
                <List
                    tabs={this.state.tabs}
                    loadMore={this.loadMore.bind(this)}
                    showLoadMore={this.state.tabs.length === this.tabNumber}
                />
            </div>
        );
    }
}

export default App;
