import React, {PropTypes} from 'react';
import ISPPanelBody from './ISPPanelBody.js';
import ISPPanelHeader from './ISPPanelHeader.js';
import Paper from 'material-ui/Paper';
import {grey400} from 'material-ui/styles/colors';

export
default React.createClass({
    propTypes:{
        category: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired,
        style: PropTypes.object
    },
    getInitialState() {
        return {
            collapsed: false,
            isOver: false
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            isOver: nextProps.isOver
        });
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
    render() {
        const isOver = {
            border: `2px dashed ${grey400}`
        };
        const style = Object.assign({}, this.props.style, this.state.isOver ? isOver : {});
        const header = <ISPPanelHeader
            category={this.props.category}
            options={this.props.options}
            toggleView={this.toggleView}/>;
        return <Paper style={style} transitionEnabled={false}>
            {header}
            <ISPPanelBody hide={this.state.collapsed}
                category={this.props.category}
                isOver={this.state.isOver}
                options={this.props.options}/>
        </Paper>;
    }
});
