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
    constructor (props) {
        super(props);

        this.state = {
            dragOverCount: 0
        };

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDragEnter (event) {
        if (!event.dataTransfer.types.includes('application/tab') || !this.props.customizable) {
            return;
        }

        this.setState({dragOverCount : this.state.dragOverCount + 1});
    }

    onDragLeave (event) {
        if (!event.dataTransfer.types.includes('application/tab') || !this.props.customizable) {
            return;
        }

        this.setState({dragOverCount : this.state.dragOverCount - 1});
    }

    onDrop () {
        this.setState({dragOverCount : 0});
    }

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
            <div
                className={classNames('list')}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
            >
                {this.state.dragOverCount > 0 ? <NewGroup/> : ''}
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
