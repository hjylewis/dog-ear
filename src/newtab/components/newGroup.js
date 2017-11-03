import React from 'react';
import classNames from 'classnames';

import withDragAndDrop from './withDragAndDrop';

class NewGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ expanded: true }), 0);
  }

  render() {
    return (
      <div
        className={classNames('new-group-target', 'target', {
          'new-group-target--expanded': this.state.expanded,
          'target--dragover': this.props.dragOver,
        })}
      >
        Drop Here to Create a New Group
      </div>
    );
  }
}

NewGroup.propTypes = {
  dragOver: React.PropTypes.bool, // If is being dragged over
};

export default withDragAndDrop(NewGroup);
