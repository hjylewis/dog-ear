import React from 'react';
import classNames from 'classnames';

import withDragAndDrop from './withDragAndDrop';

const NewGroup = ({dragOver}) => (
    <div
        className={classNames('group', {
            'group--dragover': dragOver
        })}
    >
        Add to New Group + {dragOver}
    </div>
);

NewGroup.propTypes = {
    dragOver: React.PropTypes.bool, // If is being dragged over
};

export default withDragAndDrop(NewGroup);
