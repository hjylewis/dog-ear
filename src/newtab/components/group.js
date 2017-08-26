import React from 'react';
import classNames from 'classnames';

import GroupHeader from './groupHeader';
import withDragAndDrop from './withDragAndDrop';


class Group extends React.Component {
    render () {
        return (
            <div
                className={classNames('group', {
                    'group--dragover': this.props.dragOver
                })}
            >
                <GroupHeader
                    editable={this.props.customizable && this.props.data.group !== null}
                    data={this.props.data}
                    forceEditMode={this.props.forceHeaderEditMode}
                    select={this.props.select}
                    selection={this.props.selection}
                    onEditModeOff={this.props.onHeaderEditModeOff}
                />
                {this.props.children}
            </div>
        );
    }
}

Group.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.object),
        React.PropTypes.object,
    ]).isRequired,
    data: React.PropTypes.object.isRequired, // group data
    customizable: React.PropTypes.bool,
    forceHeaderEditMode: React.PropTypes.bool,
    dragOver: React.PropTypes.bool, // If group is being dragged over
    select: React.PropTypes.func, // Function that selects or unselects tab
    selection: React.PropTypes.object.isRequired, // Selected tabs
    onHeaderEditModeOff: React.PropTypes.func
};

const GroupWithDragAndDrop = withDragAndDrop(
    Group,
    { customizable: true }
);

export { Group, GroupWithDragAndDrop };
