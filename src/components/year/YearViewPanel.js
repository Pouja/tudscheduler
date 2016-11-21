import React, {PropTypes} from 'react';
import YearViewBody from './YearViewBody.js';
import YearViewHeader from './YearViewHeader.js';
import DropPanel from '../dnd/DropPanel.js';

/**
 * Renders a single year view.
 */
export default React.createClass({
    getInitialState() {
        return {
            collapsed: false
        };
    },
    toggleView(nextState) {
        this.setState({
            collapsed: nextState
        });
    },
    propTypes: {
        year: PropTypes.number.isRequired,
        className: PropTypes.string
    },
    render() {
        const style = {
            dropPanel: {
                minWidth: 500,
                marginBottom: 10
            }
        };
        const year = this.props.year;
        return <DropPanel sort='year' id={year} style={style.dropPanel} className={this.props.className} >
            <YearViewHeader toggleView={this.toggleView} year={year}/>
            <YearViewBody collapse={this.state.collapsed} year={year}/>
        </DropPanel>;
    }
});
