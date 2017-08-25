import React from 'react';

import Tab from '../../services/tab';

function withDragAndDrop(WrappedComponent, onDrop) {
    class withDragAndDrop extends React.Component {
        constructor (props) {
            super(props);

            this.state = {
                dragOverCount: 0
            };

            this.onDragOver = this.onDragOver.bind(this);
            this.onDragEnter = this.onDragEnter.bind(this);
            this.onDragLeave = this.onDragLeave.bind(this);
            this.onDrop = this.onDrop.bind(this);
        }

        onDragOver (event) {
            if (event.dataTransfer.types.includes('application/tab') && this.props.customizable) {
                event.preventDefault();
            }
        }

        onDragEnter (event) {
            if (!event.dataTransfer.types.includes('application/tab') || !this.props.customizable) {
                return;
            }

            event.dataTransfer.dropEffect = 'move';
            event.preventDefault();

            this.setState({dragOverCount : this.state.dragOverCount + 1});
        }

        onDragLeave (event) {
            if (!event.dataTransfer.types.includes('application/tab') || !this.props.customizable) {
                return;
            }

            this.setState({dragOverCount : this.state.dragOverCount - 1});
        }

        onDrop (event) {
            this.setState({dragOverCount : 0});
            let tabConfig = JSON.parse(event.dataTransfer.getData('application/tab'));
            let tab = Tab.create(tabConfig);

            onDrop.call(this, tab);

            event.preventDefault();
        }

        render () {
            return (
                <div
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop}
                >
                    <WrappedComponent dragOver={this.state.dragOverCount > 0}  {...this.props}/>
                </div>
            );
        }
    }

    withDragAndDrop.propTypes = {
        customizable: React.PropTypes.bool
    };

    return withDragAndDrop;
}

export default withDragAndDrop;
