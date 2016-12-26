import React from 'react';
import classNames from 'classnames';

import Tab from './tab';

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
            </div>
        );
    }
}

List.propTypes = {
    tabs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired, // Array of tabs
    openTabs: React.PropTypes.func, // Function that opens tab

    toggleSelection: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default List;
