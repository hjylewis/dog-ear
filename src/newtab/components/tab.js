import React from 'react';
import classNames from 'classnames';

import CheckedIcon from '../assets/Checked.svg';
import UncheckedIcon from '../assets/Unchecked.svg';


class Icon extends React.Component {
    render () {
        return (
            <span className={classNames('icon')}>
                {this.props.favicon ? <img src={this.props.favicon} className={classNames('favicon')}/> : ''}
                <CheckedIcon className={classNames('checked-icon')}/>
                <UncheckedIcon className={classNames('unchecked-icon')}/>
            </span>
        );
    }
}

Icon.propTypes = {
    favicon: React.PropTypes.string,
};

class Tab extends React.Component {
    onClick () {
        this.props.data.remove();
        window.location.href = this.props.data.url; // Go to url
    }

    render () {
        return (
            <div className={classNames('tab')} onClick={this.onClick.bind(this)}>
                <Icon favicon={this.props.data.favicon}/>
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
};

export default Tab;
