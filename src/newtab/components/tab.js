import React from 'react';

class Tab extends React.Component {
    onClick () {
        this.props.data.remove();
        window.location.href = this.props.data.url; // Go to url
    }

    render () {
        return (
            <div onClick={this.onClick.bind(this)}>
                {this.props.data.url}
            </div>
        );
    }
}

Tab.propTypes = {
    data: React.PropTypes.object.isRequired,
};

export default Tab;
