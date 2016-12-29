import React from 'react';
import classNames from 'classnames';

import CheckedIcon from '../assets/Checked.svg';
import UncheckedIcon from '../assets/Unchecked.svg';


class Icon extends React.Component {
    constructor (props) {
        super(props);

        this.select = this.select.bind(this);
    }
    select (e) {
        e.stopPropagation();
        this.props.select();
    }

    render () {
        return (
            <span
                className={classNames({ 'icon': true, 'selected': this.props.selected })}
                onClick={this.select}
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
    select: React.PropTypes.func
};

class Tab extends React.Component {
    render () {
        return (
            <div className={classNames({
                'tab': true,
                'no-highlight': !this.props.openTab
            })} >
                <Icon
                    favicon={this.props.data.favicon}
                    selected={this.props.selected}
                    select={this.props.select}
                />
                <span className={classNames('info')} onClick={this.props.openTab}>
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
    selected: React.PropTypes.bool.isRequired,
    select: React.PropTypes.func.isRequired
};

export default Tab;
