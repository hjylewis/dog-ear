import React from 'react';
import classNames from 'classnames';

import Tab from '../../services/tab';

class GroupHeaders extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            editMode: false,
            expanded: false,
            name: this.props.data.group
        };

        this.allSelected = false;

        this.selectAll = this.selectAll.bind(this);
        this.editGroupName = this.editGroupName.bind(this);
        this.onExpandTransition = this.onExpandTransition.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.changeName = this.changeName.bind(this);
        this.saveAndClose = this.saveAndClose.bind(this);
        this.resetAndClose = this.resetAndClose.bind(this);
        this.placeCursorAtEnd = this.placeCursorAtEnd.bind(this);
    }

    selectAll () {
        this.props.data.tabs.forEach((tab) => {
            this.props.select(tab, !this.allSelected);
        });
    }

    editGroupName () {
        if (this.props.editable) {
            this.setState({expanded : true});
        }
    }

    onExpandTransition (event) {
        if (event.propertyName !== 'min-width') return;

        if (this.state.expanded) {
            this.setState({editMode : true});
        }
    }

    changeName (event) {
        this.setState({name : event.target.value});
    }

    onKeyUp (event) {
        switch (event.keyCode) {
        case 13:
            this.saveAndClose();
            break;
        case 27:
            this.resetAndClose();
            break;
        }
    }

    resetAndClose () {
        this.setState({
            name: this.props.data.group,
            expanded: false,
            editMode: false
        });
    }

    saveAndClose () {
        if (this.state.name.length === 0) {
            this.resetAndClose();
            return;
        }

        if (this.state.name === this.props.data.group) {
            this.setState({
                expanded: false,
                editMode: false
            });
            return;
        }

        this.props.data.tabs.forEach((tab) => {
            tab.category = this.state.name;
            tab.update();
        });
    }

    placeCursorAtEnd (event) {
        let end = this.state.name.length;
        event.target.setSelectionRange(end, end);
    }

    render () {
        this.allSelected = this.props.data.tabs.reduce((a, b) => {
            return a && (b.url in this.props.selection);
        }, true);

        return (
            <div className='group__header'>
                <div
                    className={classNames('group-name', {
                        'group-name--editable': this.props.editable,
                        'group-name--expanded': this.state.expanded,
                        'group-name--editmode':this.state.editMode
                    })}
                    onClick={this.editGroupName}
                    onTransitionEnd={this.onExpandTransition}
                >
                    {this.state.editMode ?
                        <input
                            className='group-name__input'
                            autoFocus
                            placeholder='Your category name'
                            value={this.state.name}
                            onChange={this.changeName}
                            onKeyUp={this.onKeyUp}
                            onBlur={this.saveAndClose}
                            onFocus={this.placeCursorAtEnd}
                        /> :
                        <span>
                            {this.props.data.group}
                        </span>
                    }
                </div>
                <span className='select-all' onClick={this.selectAll}>
                    {this.allSelected ? 'un' : ''}select all
                </span>
            </div>
        );
    }
}

GroupHeaders.propTypes = {
    data: React.PropTypes.object.isRequired, // group data
    editable: React.PropTypes.bool,
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
        if (event.dataTransfer.types.includes('application/tab') && this.props.customizable) {
            event.preventDefault();
        }
    }

    onDragEnter (event) {
        if (!event.dataTransfer.types.includes('application/tab') || !this.props.customizable) {
            return;
        }

        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();

        this.setState({dragOverCount : this.state.dragOverCount + 1});
    }

    onDragLeave (event) {
        if (!event.dataTransfer.types.includes('application/tab') || !this.props.customizable) {
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
                    editable={this.props.customizable}
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
    customizable: React.PropTypes.bool,
    select: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default Group;
