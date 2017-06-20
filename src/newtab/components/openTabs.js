import React from 'react';
import classNames from 'classnames';

import List from './list';

class OpenTabs extends React.Component {
    constructor (props) {
        super(props);

        this.state  = {
            selection: {}
        };

        this.select = this.select.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    select (tab, force) {
        var selection = this.state.selection;

        if ((tab.url in selection && force === undefined) ||
            force === false) {
            delete selection[tab.url];
        } else {
            selection[tab.url] = tab;
        }

        this.setState({
            selection: selection
        });
    }

    onClick () {
        var selection = Object.keys(this.state.selection).map((url) => {
            return this.state.selection[url];
        });

        this.props.saveTabs(selection);
    }

    render () {
        return (
            <div className="open-tabs">
                <List
                    groups={[{
                        group: 'Open Tabs (' + this.props.openTabs.length + ')',
                        tabs: this.props.openTabs
                    }]}
                    select={this.select}
                    selection={this.state.selection}
                />
                <button
                    className={classNames({
                        'btn': true,
                        'btn--save': true,
                        'active': Object.keys(this.state.selection).length > 0
                    })}
                    onClick={this.onClick}
                >
                    Dog Ear
                </button>
            </div>
        );
    }
}

OpenTabs.propTypes = {
    openTabs: React.PropTypes.array.isRequired,
    saveTabs: React.PropTypes.func.isRequired
};

export default OpenTabs;
