import React from 'react';
import classNames from 'classnames';

class Alert extends React.Component {
    render () {

        return (
            <div className={classNames('alert', this.props.className)}>
                {this.props.message}
            </div>
        );
    }
}

Alert.propTypes = {
    message: React.PropTypes.string,
    className: React.PropTypes.string
};


class ErrorAlert extends React.Component {
    render () {
        return (
            <Alert className="alert--error" {...this.props} />
        );
    }
}

export { ErrorAlert };
