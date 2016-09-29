import React,{PropTypes} from 'react';
import YearViewBody from './YearViewBody.js';
import YearViewHeader from './YearViewHeader.js';
import DropPanel from '../dnd/DropPanel.js';

export
default React.createClass({
    propTypes:{
        className: PropTypes.string
    },
    shouldComponentUpdate(){
        return false;
    },
    render() {
        return <DropPanel id='yearview' style={{minWidth:500}} className={this.props.className} >
            <YearViewHeader/>
            <YearViewBody/>
        </DropPanel>;
    }
});
