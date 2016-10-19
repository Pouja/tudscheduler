import React, {PropTypes} from 'react';
import SideBar from './components/sidebar/SideBar.js';
import { withRouter } from 'react-router';
import CourseModal from './components/CourseModal.js';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './Main.css';

/**
 * Renders sidebar and the main component (yearview/selectview)
 */
const Main = React.createClass({
    shouldComponentUpdate(nextProps){
        return this.props.children !== nextProps.children;
    },
    propTypes: {
        children: PropTypes.element.isRequired,
        router: PropTypes.shape({
            push: PropTypes.func.isRequired,
            listen: PropTypes.func.isRequired
        }).isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    },
    handleChange(value) {
        this.props.router.push(value);
    },
    render(){
        return (<div>
            <CourseModal/>
            <div className="app">
                <SideBar className="sidebar"/>
                <div className="main">
                    {this.props.children}
                </div>
            </div>
        </div>);
    }
});
module.exports = DragDropContext(HTML5Backend)(withRouter(Main)); // eslint-disable-line new-cap
