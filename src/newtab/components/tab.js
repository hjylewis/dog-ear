import React from 'react';
import classNames from 'classnames';

class Tab extends React.Component {
    onClick () {
        this.props.data.remove();
        window.location.href = this.props.data.url; // Go to url
    }

    render () {
        return (
            <div className={classNames('tab')} onClick={this.onClick.bind(this)}>
                <span className={classNames('favicon')}>
                    {this.props.data.favicon ? <img src={this.props.data.favicon} /> : ''}
                </span>
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
