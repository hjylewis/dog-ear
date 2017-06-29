import React from 'react';
import classNames from 'classnames';

class Alert extends React.Component {
    render () {
        if (this.props.message) {
            return (
                <div className={classNames('alert', this.props.className)}>
                    {this.props.message}
                    <button
                        className={classNames('btn', 'btn--alert')}
                        onClick={this.props.closeAlert}
                    >
                        Close
                    </button>
                </div>
            );
        } else {
            return null;
        }
    }
}

Alert.propTypes = {
    message: React.PropTypes.string,
    className: React.PropTypes.string,
    closeAlert: React.PropTypes.func
};


class ErrorAlert extends React.Component {
    render () {
        return (
            <Alert className="alert--error" {...this.props} />
        );
    }
}

export { ErrorAlert };
