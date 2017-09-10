import React from 'react';
import classNames from 'classnames';

import CheckedIcon from '../assets/Checked.svg';
import UncheckedIcon from '../assets/Unchecked.svg';
import FileIcon from '../assets/File.svg';

class Icon extends React.Component {
    constructor (props) {
        super(props);

        this.select = this.select.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }
    select (e) {
        e.stopPropagation();
        this.props.select();
    }

    onKeyUp (e) {
        e.stopPropagation();

        if (e.keyCode === 13) {
            this.props.select();
        }
    }

    render () {
        return (
            <span
                tabIndex="0"
                className={classNames({ 'icon': true, 'selected': this.props.selected })}
                onClick={this.select} onKeyUp={this.onKeyUp}
            >
                {this.props.favicon ?
                    <img src={this.props.favicon} className={classNames('favicon')}/> :
                    <FileIcon className={classNames('favicon')}/>
                }
                <CheckedIcon className={classNames('checked-icon')}/>
                <UncheckedIcon className={classNames('unchecked-icon')}/>
            </span>
        );
    }
}

Icon.propTypes = {
    favicon: React.PropTypes.string,
    selected: React.PropTypes.bool,
    select: React.PropTypes.func
};

class Tab extends React.Component {
    constructor (props) {
        super(props);

        this.onDragStart = this.onDragStart.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    onDragStart (event) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('application/tab', JSON.stringify(this.props.data));
        event.dataTransfer.setData('text/uri-list', this.props.data.url);
        event.dataTransfer.setData('text/plain', this.props.data.title);
    }

    onKeyUp ({keyCode}) {
        if (keyCode === 13) {
            this.props.openTab();
        }
    }

    render () {
        return (
            <div
                tabIndex="0"
                draggable={this.props.draggable}
                onDragStart={this.onDragStart}
                className={classNames({
                    'tab': true,
                    'no-highlight': !this.props.openTab
                })}
                onKeyUp={this.onKeyUp}
            >
                <Icon
                    favicon={this.props.data.favicon}
                    selected={this.props.selected}
                    select={this.props.select}
                />
                <span className={classNames('tab-info')} onClick={this.props.openTab}>
                    <span className={classNames('title')}>
                        {this.props.data.title}
                    </span>
                    <span className={classNames('url')}>
                        {this.props.data.url}
                    </span>
                </span>
            </div>
        );
    }
}

Tab.propTypes = {
    data: React.PropTypes.object.isRequired,
    draggable: React.PropTypes.bool,
    openTab: React.PropTypes.func,
    selected: React.PropTypes.bool.isRequired,
    select: React.PropTypes.func.isRequired
};

export default Tab;
