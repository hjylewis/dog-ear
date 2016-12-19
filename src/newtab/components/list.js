import React from 'react';

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
            return <Tab key={tab.url} data={tab} />;
        });

        return (
            <div>
                {tabs}
                {this.props.showLoadMore ? <LoadMoreBtn onClick={this.props.loadMore} /> : ''}
            </div>
        );
    }
}

List.propTypes = {
    tabs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired, // Array of tabs
    loadMore: React.PropTypes.func, // Function that loads more
    showLoadMore: React.PropTypes.bool, // Whether there's more to load (Show the button)
};

export default List;
