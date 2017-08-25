import React from 'react';
import classNames from 'classnames';

class GroupHeader extends React.Component {
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

        let groupName = this.props.data.group !== null
            ? (<span className='group-name__text'>
                {this.props.data.group}
            </span>) :
            (<div className='group-name__text group-name__text--no-category'>
                <span className='group-name__text__maintext'>No Category</span>
                <span className='group-name__text__subtext'> — Drag to organize into categories</span>
            </div>);


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
                        groupName
                    }
                </div>
                <span className='select-all' onClick={this.selectAll}>
                    {this.allSelected ? 'un' : ''}select all
                </span>
            </div>
        );
    }
}

GroupHeader.propTypes = {
    data: React.PropTypes.object.isRequired, // group data
    editable: React.PropTypes.bool,
    select: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired // Selected tabs
};

export default GroupHeader;
