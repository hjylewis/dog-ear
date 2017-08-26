import React from 'react';
import classNames from 'classnames';

import Tab from './tab';
import { Group, GroupWithDragAndDrop } from './group';
import NewGroup from './newGroup';

class List extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            dragOverCount: 0,
            tabInTransit: null
        };

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.changeCategoryFactory = this.changeCategoryFactory.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
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

    changeCategoryFactory (category) {
        return (tab) => {
            if (category !== tab.category) {
                tab.category = category;
                tab.update();
            }
        };
    }

    createNewGroup (tab) {
        this.setState({ tabInTransit: tab });
    }

    render () {
        const GroupComponent = this.props.customizable ? GroupWithDragAndDrop : Group;

        var groups = [];

        if (this.state.tabInTransit) {
            let tab = this.state.tabInTransit;
            groups.push(
                <Group
                    key='newgroup'
                    data={{
                        group: '',
                        tabs: [ tab ]
                    }}
                    forceHeaderEditMode={true}
                    customizable={true}
                    select={this.props.select}
                    selection={this.props.selection}
                    onHeaderEditModeOff={this.createNewGroup.bind(null, null)}
                >
                    <Tab
                        data={tab}
                        selected={tab.url in this.props.selection}
                        openTab={this.props.openTabs ? this.props.openTabs.bind(null, tab) : null}
                        select={this.props.select.bind(null, tab)}
                    />
                </Group>
            );
        }

        this.props.groups.forEach((group) => {
            let tabs = [];
            group.tabs.forEach((tab) => {
                if (!this.state.tabInTransit || tab.url !== this.state.tabInTransit.url) {
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
                }
            });

            if (tabs.length > 0) {
                groups.push(
                    <GroupComponent
                        key={group.group ? `${group.group}-key` : 'groupless'}
                        data={group}
                        select={this.props.select}
                        selection={this.props.selection}
                        onDrop={this.changeCategoryFactory(group.group)}
                    >
                        {tabs}
                    </GroupComponent>
                );
            }
        });

        return (
            <div
                className={classNames('list')}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
            >
                {this.state.dragOverCount > 0 ? <NewGroup onDrop={this.createNewGroup}/> : ''}
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
