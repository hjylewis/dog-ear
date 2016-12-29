import React from 'react';
import classNames from 'classnames';

import List from './list';

class OpenTabs extends React.Component {
    render () {
        return (
            <div className="open-tabs">
                <List
                    groups={[{
                        group: 'Open Tabs (' + this.props.openTabs.length + ')',
                        tabs: this.props.openTabs
                    }]}
                    select={this.props.select}
                    selection={this.props.selection}
                />
                <button
                    className={classNames({
                        'save-btn': true,
                        'active': Object.keys(this.props.selection).length > 0
                    })}
                    onClick={this.props.onClick}
                    >
                    Dog Ear
                </button>
            </div>
        );
    }
}

OpenTabs.propTypes = {
    openTabs: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired,
    selection: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired
};

export default OpenTabs;
