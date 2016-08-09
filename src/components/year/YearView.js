import React,{PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import YearViewBody from './YearViewBody.js';
import YearViewHeader from './YearViewHeader.js';

export
default React.createClass({
    propTypes:{
        className: PropTypes.string
    },
    shouldComponentUpdate(){
        return false;
    },
    render() {
        return <div className={this.props.className}>
            <Paper>
            <YearViewHeader/>
            <YearViewBody/>
        </Paper></div>;
    }
});
