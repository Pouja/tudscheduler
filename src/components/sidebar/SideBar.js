import React, {PropTypes} from 'react';
import SideBarHeader from './SideBarHeader.js';
import SideBarTreeBody from './SideBarTreeBody.js';
import SideBarSearchBody from './SideBarSearchBody.js';
import Paper from 'material-ui/Paper';
export
default React.createClass({
    propTypes: {
        className: PropTypes.string
    },
    getInitialState() {
        return {
            filtering: false,
            collapsed: false
        };
    },
    /**
     * Toggles if the panel body should be shown or not
     * @param  {Bool} nextState Value to be set
     */
    toggleView(nextState) {
        this.setState({
            collapsed: nextState
        });
    },
    setFilter(nextFilter) {
        this.setState({
            filtering: nextFilter
        });
    },
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.filtering !== nextState.filtering ||
            this.state.collapsed !== nextState.collapsed;
    },
    render() {
        const body = this.state.filtering ? <SideBarSearchBody hide={this.state.collapsed}/> :
            <SideBarTreeBody hide={this.state.collapsed}/>;
        return <div className={this.props.className}>
                <Paper>
                    <SideBarHeader setFilter={this.setFilter} toggleView={this.toggleView}/>
                    {body}
                </Paper>
            </div>;
    }
});
