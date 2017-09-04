import React from 'react';

import Caret from '../assets/Caret.svg';

const options = ['ADDED', 'CATEGORY'];

class GroupingModeDropDown extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false
        };

        this.buttonRefs = new Array(options.length);

        this.changeExpansion = this.changeExpansion.bind(this);
        this.changeModeAndClose = this.changeModeAndClose.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    changeExpansion (expand = !this.state.expanded, callback) {
        this.setState({expanded : expand}, callback);
    }

    changeModeAndClose (mode) {
        this.props.changeMode(mode);
        this.changeExpansion(false);
    }

    onKeyUp ({keyCode}) {
        var focusNextElement = () => {
            let focusedElement = document.activeElement;
            let buttonIdx = this.buttonRefs.indexOf(focusedElement);

            switch (keyCode) {
            case 38: //up
                buttonIdx--;
                break;
            case 40: // down
                buttonIdx++;
                break;
            }

            if (buttonIdx < 0) buttonIdx = this.buttonRefs.length - 1;
            if (buttonIdx >= this.buttonRefs.length) buttonIdx = 0;

            this.buttonRefs[buttonIdx].focus();
        };

        switch (keyCode) {
        case 38:
        case 40:
            if (!this.state.expanded) {
                this.changeExpansion(true, focusNextElement);
            } else {
                focusNextElement();
            }
            break;
        case 27:
            this.changeExpansion(false);
            break;
        }
    }

    render () {
        const optionElements = options.map((option, idx) => {
            return (
                <li key={option}>
                    <button
                        onClick={this.changeModeAndClose.bind(null, option)}
                        ref={(button) => { this.buttonRefs[idx] = button; }}
                    >
                        {option}
                    </button>
                </li>
            );
        });

        return (
            <div className='grouping-mode-dropdown' onKeyUp={this.onKeyUp}>
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
