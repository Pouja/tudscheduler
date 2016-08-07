import React, {PropTypes} from 'react';
import classnames from 'classnames';
import ISPPanelBody from './ISPPanelBody.js';
import ISPPanelHeader from './ISPPanelHeader.js';
import Paper from 'material-ui/Paper';

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
        const bodyClasses = classnames({'hide':this.state.collapsed});
        const header = <ISPPanelHeader
            category={this.props.category}
            options={this.props.options}
            toggleView={this.toggleView}/>;
        return <Paper style={this.props.style}>
            {header}
            <ISPPanelBody hide={this.state.collapsed}
                className={bodyClasses}
                category={this.props.category}
                isOver={this.state.isOver}
                options={this.props.options}/>
        </Paper>;
    }
});
