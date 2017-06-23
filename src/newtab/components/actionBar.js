import React from 'react';
import classNames from 'classnames';

import CloseIcon from '../assets/Close.svg';

class OpenBtn extends React.Component {
    render () {
        return (
            <button className={classNames('btn', 'btn--open')}  onClick={this.props.action}>
                Open ({this.props.count})
            </button>
        );
    }
}

OpenBtn.propTypes = {
    count: React.PropTypes.number,
    action: React.PropTypes.func
};

class DeleteBtn extends React.Component {
    render () {
        return (
            <button className={classNames('btn', 'btn--delete')}  onClick={this.props.action}>
                Delete ({this.props.count})
            </button>
        );
    }
}

DeleteBtn.propTypes = {
    count: React.PropTypes.number,
    action: React.PropTypes.func
};

class CloseBtn extends React.Component {
    render () {
        return (
            <CloseIcon className={classNames('close-btn')} onClick={this.props.action} />
        );
    }
}

CloseBtn.propTypes = {
    action: React.PropTypes.func
};

class ActionBar extends React.Component {
    constructor (props) {
        super(props);

        this.openAll = this.openAll.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.closeAll = this.closeAll.bind(this);
    }

    openAll() {
        var tabs = [];

        Object.keys(this.props.selection).forEach((id) => {
            var tab = this.props.selection[id];
            tabs.push(tab);
        });

        this.props.openTabs(tabs);
    }

    deleteAll () {
        Object.keys(this.props.selection).forEach((id) => {
            var tab = this.props.selection[id];
            this.props.select(tab);
            tab.remove().catch((error) => this.props.setErrorMessage(error));
        });
    }

    closeAll () {
        Object.keys(this.props.selection).forEach((id) => {
            var tab = this.props.selection[id];

            this.props.select(tab);
        });
    }

    render () {
        var count = Object.keys(this.props.selection).length;

        return (
            <div className={classNames('action-bar')}>
                <OpenBtn count={count} action={this.openAll} />
                <DeleteBtn count={count} action={this.deleteAll} />
                <CloseBtn action={this.closeAll} />
            </div>
        );
    }
}

ActionBar.propTypes = {
    select: React.PropTypes.func, // Function that selects or unselects tab
    openTabs: React.PropTypes.func, // Function that opens tabs
    selection: React.PropTypes.object.isRequired, // Selected tabs
    setErrorMessage: React.PropTypes.func.isRequired // function to display error message
};

export default ActionBar;
