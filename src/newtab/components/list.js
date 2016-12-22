import React from 'react';
import classNames from 'classnames';

import Tab from './tab';

class LoadMoreBtn extends React.Component {
    render () {
        return (
            <div onClick={this.props.onClick}>
                Load More
            </div>
        );
    }
}

LoadMoreBtn.propTypes = {
    onClick: React.PropTypes.func,
};


class List extends React.Component {
    render () {
        var tabs = this.props.tabs.map((tab) => {
            return (
                <Tab
                    key={tab.url}
                    data={tab}
                    selected={tab.url in this.props.selection}
                    openTab={this.props.openTabs.bind(null, tab)}
                    toggleSelection={this.props.toggleSelection.bind(null, tab)}
                />
            );
        });

        return (
            <div className={classNames('list')}>
                {tabs}
                {this.props.showLoadMore ? <LoadMoreBtn onClick={this.props.loadMore} /> : ''}
            </div>
        );
    }
}

List.propTypes = {
    tabs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired, // Array of tabs
    openTabs: React.PropTypes.func, // Function that opens tab

    loadMore: React.PropTypes.func, // Function that loads more
    showLoadMore: React.PropTypes.bool, // Whether there's more to load (Show the button)

    toggleSelection: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default List;
