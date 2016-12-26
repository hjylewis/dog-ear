import React from 'react';
import classNames from 'classnames';

import Tab from './tab';

class GroupHeaders extends React.Component {
    constructor (props) {
        super(props);

        this.allSelected = false;

        this.selectAll = this.selectAll.bind(this);
    }
    selectAll () {
        this.props.data.tabs.forEach((tab) => {
            this.props.select(tab, !this.allSelected);
        });
    }

    render () {
        this.allSelected = this.props.data.tabs.reduce((a, b) => {
            return a && (b.url in this.props.selection);
        }, true);

        return (
            <div className='group-header'>
                <h3>{this.props.data.group}</h3>
                <span className='select-all' onClick={this.selectAll}>
                    {this.allSelected ? 'un' : ''}select all
                </span>
            </div>
        );
    }
}

GroupHeaders.propTypes = {
    data: React.PropTypes.object.isRequired, // group data
    select: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

class List extends React.Component {
    render () {
        var tabs = [];
        this.props.groups.forEach((group) => {
            tabs.push(
                <GroupHeaders
                    key={group.group}
                    data={group}
                    select={this.props.select}
                    selection={this.props.selection}
                />
            );

            group.tabs.forEach((tab) => {
                tabs.push(
                    <Tab
                        key={tab.url}
                        data={tab}
                        selected={tab.url in this.props.selection}
                        openTab={this.props.openTabs.bind(null, tab)}
                        select={this.props.select.bind(null, tab)}
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

    select: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default List;
