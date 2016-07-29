import CourseCtrl from '../../models/CourseCtrl.js';
import React, {PropTypes} from 'react';
import {
    ListGroupItem, Badge
}
from 'react-bootstrap';
import EventServer from '../../models/EventServer.js';
import AddRemove from './../AddRemove.js';

/**
 * A list group item for in the sidebar.
 * Shows the course id, name, ects and optional control functions
 */
export default React.createClass({
    propTypes:{
        course: PropTypes.object.isRequired,
        visible: PropTypes.bool.isRequired,
        filter: PropTypes.string.isRequired
    },
    getInitialState() {
        return {
            childVisible: false,
            visible: this.props.visible
        };
    },
    componentWillUnmount(){
        this.stopListening();
    },
    /**
     * Called by React when it is mounted in the DOM
     * Starts listening to events if it is visible.
     */
    componentDidMount() {
        const compId = 'course::' + this.props.course.nr;
        if(this.props.visible || this.isSearching()){
            this.startListening();
        }

        EventServer.on('visible::' + this.props.course.parent, (toggle) => {
            var nextState = {
                visible: toggle
            };
            if (!toggle) {
                this.stopListening();
                EventServer.emit('visible::' + this.props.course.nr, toggle);
                nextState.childVisible = false;
            } else {
                this.startListening();
            }
            this.setState(nextState);
        }, compId);
    },
    isSearching(){
        return this.props.filter.length > 0;
    },
    isLeaf(){
        return !this.props.course.children || this.props.course.children.length === 0;
    },
    /**
     * Toggle the visibility of the children
     */
    toggle() {
        var nextVisibility = !this.state.childVisible;
        this.setState({
            childVisible: nextVisibility
        });
        EventServer.emit('visible::' + this.props.course.nr, nextVisibility);
    },
    /**
     * Start listening to events.
     */
    startListening() {
        var id = 'course::' + this.props.course.nr;
        EventServer.on('added', () => this.forceUpdate(), id);
        EventServer.on('removed', () => this.forceUpdate(), id);
        EventServer.on('reset', () => this.forceUpdate(), id);
        EventServer.on('loaded', () => this.forceUpdate(), id);
    },
    /**
     * Stops listening to events. Should be called when it is not visible or
     * when it is removed from the dom.
     */
    stopListening() {
        var id = 'course::' + this.props.course.nr;
        EventServer.remove('added', id);
        EventServer.remove('removed', id);
        EventServer.remove('reset', id);
        EventServer.remove('loaded', id);
    },
    /**
     * Renders the chevron
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderChevron(key) {
        if (this.isSearching() || this.props.course.children.length === 0) {
            return null;
        }
        const chevronClass = 'fa fa-chevron-' + ((this.state.childVisible) ? 'down' : 'right');
        return <i key={key} className={chevronClass}/>;
    },
    /**
     * Renders the periods in which the course is being held.
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderQBadge(key){
        var periods = CourseCtrl.get(this.props.course.id)['Education Period'];
        if(periods === undefined){
            return null;
        }
        return (<Badge key={key}>Q{periods}</Badge>);
    },
    /**
     * Renders the ects of the course.
     * If it is a parent node, it will list the ects selected from all its children compared to the total.
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderECBadge(key) {
        const course = this.props.course;
        const totalEcts = CourseCtrl.totalEcts(course);
        const subEcts = CourseCtrl.addedEcts(course);
        if (course.children.length === 0) {
            return (<Badge key={key}>EC {totalEcts}</Badge>);
        }
        return (<Badge key={key}>EC {subEcts}/{totalEcts}</Badge>);
    },
    render() {
        if (!this.state.visible && !this.isSearching()) {
            return null;
        }
        const course = CourseCtrl.get(this.props.course.id);
        const style = {
            marginLeft: (this.isSearching()) ? 0 : (this.props.course.depth - 1) * 10
        };

        return <ListGroupItem className='row' key={course.nr} style={style}>
            <span key={4} onClick={this.toggle} className='col-xs-10'>
                {this.renderChevron(1)} {course.name} {course.courseName}
                {this.isLeaf() ? <br/> : null}
                {this.renderECBadge(2)} {this.renderQBadge(3)}
            </span>
            <AddRemove key={5} course={this.props.course} className='pull-right'/></ListGroupItem>;
    }
});
