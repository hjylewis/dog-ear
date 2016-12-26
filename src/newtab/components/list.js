import React from 'react';
import classNames from 'classnames';

import Tab from './tab';

class GroupHeaders extends React.Component {
    render () {
        return (
            <div className='group-header'>
                <h3>{this.props.data.timeago}</h3>
                <span className='select-all'>select all</span>
            </div>
        );
    }
}

GroupHeaders.propTypes = {
    data: React.PropTypes.object.isRequired // group data
};

class List extends React.Component {
    render () {
        var tabs = [];
        this.props.groups.forEach((group) => {
            tabs.push(
                <GroupHeaders key={group.timeago} data={group}/>
            );

            group.tabs.forEach((tab) => {
                tabs.push(
                    <Tab
                        key={tab.url}
                        data={tab}
                        selected={tab.url in this.props.selection}
                        openTab={this.props.openTabs.bind(null, tab)}
                        toggleSelection={this.props.toggleSelection.bind(null, tab)}
                    />
                );
            });
        });

        return (
            <div className={classNames('list')}>
                {tabs}
            </div>
        );
    }
}

List.propTypes = {
    groups: React.PropTypes.arrayOf(React.PropTypes.object).isRequired, // Array of groups
    openTabs: React.PropTypes.func, // Function that opens tab

    toggleSelection: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default List;
