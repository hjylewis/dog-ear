import React from 'react';
import classNames from 'classnames';

import CheckedIcon from '../assets/Checked.svg';
import UncheckedIcon from '../assets/Unchecked.svg';


class Icon extends React.Component {
    constructor (props) {
        super(props);

        this.toggleSelection = this.toggleSelection.bind(this);
    }
    toggleSelection (e) {
        e.stopPropagation();
        this.props.toggleSelection();
    }

    render () {
        return (
            <span
                className={classNames({ 'icon': true, 'selected': this.props.selected })}
                onClick={this.toggleSelection}
            >
                {this.props.favicon ? <img src={this.props.favicon} className={classNames('favicon')}/> : ''}
                <CheckedIcon className={classNames('checked-icon')}/>
                <UncheckedIcon className={classNames('unchecked-icon')}/>
            </span>
        );
    }
}

Icon.propTypes = {
    favicon: React.PropTypes.string,
    selected: React.PropTypes.bool,
    toggleSelection: React.PropTypes.func
};

class Tab extends React.Component {
    render () {
        return (
            <div className={classNames('tab')} onClick={this.props.openTab}>
                <Icon
                    favicon={this.props.data.favicon}
                    selected={this.props.selected}
                    toggleSelection={this.props.toggleSelection}
                />
                <span className={classNames('info')}>
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
    openTab: React.PropTypes.func,
    selected: React.PropTypes.bool,
    toggleSelection: React.PropTypes.func
};

export default Tab;
