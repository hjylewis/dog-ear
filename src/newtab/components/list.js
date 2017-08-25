import React from 'react';
import classNames from 'classnames';

import Tab from './tab';
import Group from './group';

const NewGroup = () => (
    <div>
        Add to New Group +
    </div>
);

class List extends React.Component {
    render () {
        var groups = [];
        this.props.groups.forEach((group) => {
            let tabs = [];
            group.tabs.forEach((tab) => {
                tabs.push(
                    <Tab
                        key={tab.url}
                        data={tab}
                        draggable={this.props.customizable}
                        selected={tab.url in this.props.selection}
                        openTab={this.props.openTabs ? this.props.openTabs.bind(null, tab) : null}
                        select={this.props.select.bind(null, tab)}
                    />
                );
            });

            groups.push(
                <Group
                    key={group.group ? `${group.group}-key` : 'groupless'}
                    data={group}
                    customizable={this.props.customizable}
                    select={this.props.select}
                    selection={this.props.selection}
                >
                    {tabs}
                </Group>
            );
        });

        return (
            <div className={classNames('list')}>
                {groups}
            </div>
        );
    }
}

List.propTypes = {
    groups: React.PropTypes.arrayOf(React.PropTypes.object).isRequired, // Array of groups
    customizable: React.PropTypes.bool,
    openTabs: React.PropTypes.func, // Function that opens tab

    select: React.PropTypes.func.isRequired, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default List;
