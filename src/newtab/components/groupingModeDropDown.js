import React from 'react';

import Caret from '../assets/Caret.svg';

const options = ['ADDED', 'CATEGORY'];

class GroupingModeDropDown extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false
        };

        this.changeExpansion = this.changeExpansion.bind(this);
        this.changeModeAndClose = this.changeModeAndClose.bind(this);
    }

    changeExpansion (expand = !this.state.expanded) {
        this.setState({expanded : expand});
    }

    changeModeAndClose (mode) {
        this.props.changeMode(mode);
        this.changeExpansion(false);
    }

    render () {
        const optionElements = options.map((option) => {
            return (
                <li key={option} onClick={this.changeModeAndClose.bind(null, option)}>
                    {option}
                </li>
            );
        });

        return (
            <div className='grouping-mode-dropdown'>
                <button onClick={() => this.changeExpansion()}>{this.props.mode}<Caret className="caret"/></button>
                {this.state.expanded ?
                    <ul>
                        {optionElements}
                    </ul> :
                    ''
                }
            </div>
        );
    }
}

GroupingModeDropDown.propTypes = {
    mode: React.PropTypes.string,
    changeMode: React.PropTypes.func
};

export default GroupingModeDropDown;
