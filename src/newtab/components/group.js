import React from 'react';
import classNames from 'classnames';

import Tab from '../../services/tab';

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
            <div className='group__header'>
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

class Group extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            dragOverCount: 0
        };

        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDragOver (event) {
        if (event.dataTransfer.types.includes('application/tab')) {
            event.preventDefault();
        }
    }

    onDragEnter (event) {
        if (!event.dataTransfer.types.includes('application/tab')) {
            return;
        }

        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();

        this.setState({dragOverCount : this.state.dragOverCount + 1});
    }

    onDragLeave (event) {
        if (!event.dataTransfer.types.includes('application/tab')) {
            return;
        }

        this.setState({dragOverCount : this.state.dragOverCount - 1});
    }

    onDrop (event) {
        this.setState({dragOverCount : 0});
        let tabConfig = JSON.parse(event.dataTransfer.getData('application/tab'));
        let tab = Tab.create(tabConfig);

        if (this.props.data.group !== tab.category) {
            tab.category = this.props.data.group;
            tab.update();
        }

        event.preventDefault();
    }


    render () {
        return (
            <div
                className={classNames('group', {
                    'group--dragover': this.state.dragOverCount > 0
                })}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
            >
                <GroupHeaders
                    data={this.props.data}
                    select={this.props.select}
                    selection={this.props.selection}
                />
                {this.props.children}
            </div>
        );
    }
}

Group.propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    data: React.PropTypes.object.isRequired, // group data
    select: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default Group;
