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
            filtering: false
        };
    },
    setFilter(nextFilter) {
        this.setState({
            filtering: nextFilter
        });
    },
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.filtering !== nextState.filtering;
    },
    render() {
        const body = this.state.filtering ? <SideBarSearchBody/> : <SideBarTreeBody/>;
        return <div className={this.props.className}>
                <Paper>
                    <SideBarHeader setFilter={this.setFilter}/>
                    {body}
                </Paper>
            </div>;
    }
});
