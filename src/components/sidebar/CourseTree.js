import CourseCtrl from '../../models/CourseCtrl.js';
import React, {PropTypes} from 'react';
import EventServer from '../../models/EventServer.js';
import AddRemoveMove from './../AddRemoveMove.js';
import {ListItem} from 'material-ui/List';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import Badge from '../Badge.js';
import _ from 'lodash';
/**
 * A list group item for in the sidebar.
 * Shows the course id, name, ects and optional control functions
 */
export default React.createClass({
    propTypes:{
        style: PropTypes.object,
        course: PropTypes.object.isRequired,
        visible: PropTypes.bool.isRequired,
        filtering: PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            ects: 0,
            childVisible: false,
            filtering: this.props.filtering,
            filter: '',
            visible: this.props.visible
        };
    },
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    },
    componentWillUnmount(){
        this.stopListening();
    },
    /**
     * Called by React when it is mounted in the DOM
     * Starts listening to events if it is visible.
     */
    componentDidMount() {
        if(this.props.visible || this.props.filtering){
            this.startListening();
        }

        EventServer.on(`visible::${this.props.course.parent}`, (toggle) => {
            let nextState = {
                visible: toggle
            };
            if (!toggle) {
                this.stopListening();
                EventServer.emit(`visible::${this.props.course.nr}`, toggle);
                nextState.childVisible = false;
            } else {
                this.startListening();
            }
            this.setState(nextState);
        }, this.getID());
    },
    getID() {
        return `course::${this.props.course.nr}`;
    },
    /**
     * Toggle the visibility of the children
     */
    toggle() {
        const nextVisibility = !this.state.childVisible;
        this.setState({
            childVisible: nextVisibility
        });
        EventServer.emit(`visible::${this.props.course.nr}`, nextVisibility);
    },
    /**
     * Start listening to events.
     */
    startListening() {
        EventServer.on('added', () => this.updateEcts(), this.getID());
        EventServer.on('removed', () => this.updateEcts(), this.getID());
    },
    /**
     * Stops listening to events. Should be called when it is not visible or
     * when it is removed from the dom.
     */
    stopListening() {
        EventServer.remove('added', this.getID());
        EventServer.remove('removed', this.getID());
    },
    updateEcts() {
        this.setState({
            ects: CourseCtrl.addedEcts(this.props.course)
        });
    },
    /**
     * Renders the chevron
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderChevron() {
        if (this.state.filtering || !CourseCtrl.isAGroup(this.props.course)) {
            return null;
        }
        const style = {
            top: 3
        };
        return (this.state.childVisible) ? <ExpandLess style={style}/> :
            <ExpandMore style={style}/>;
    },
    /**
     * Renders the periods in which the course is being held.
     * @return {React}     A react component
     */
    renderQBadge(){
        const periods = CourseCtrl.get(this.props.course.id)['Education Period'];
        if(periods === undefined){
            return null;
        }
        return (<Badge>Q{periods}</Badge>);
    },
    /**
     * Renders the ects of the course.
     * If it is a parent node, it will list the ects selected from all its children compared to the total.
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderECBadge() {
        const course = this.props.course;
        const totalEcts = CourseCtrl.totalEcts(course);
        const subEcts = this.state.ects;
        const style = {
            marginRight: 4
        };
        if (!CourseCtrl.isAGroup(course)) {
            return (<Badge style={style}>EC {totalEcts}</Badge>);
        }
        return (<Badge style={style}>EC {subEcts}/{totalEcts}</Badge>);
    },
    render() {
        if (!this.state.visible && !this.state.filtering) {
            return null;
        }
        const course = CourseCtrl.get(this.props.course.id);
        const style = {
            root: Object.assign({}, this.props.style, {
                marginLeft: 0
            }),
            innerDiv: {
                paddingTop: 6,
                paddingBottom: 6
            },
            AddRemoveMove: {
                top: 0
            },
            secondaryText: {
                height: 22
            }
        };
        if (!this.state.filtering && this.props.course.depth > 1) {
            style.root.marginLeft = (this.props.course.depth - 1) * 10 +
                (!CourseCtrl.isAGroup(course) * 45);
        }
        return <ListItem
            onTouchTap={this.toggle}
            primaryText={<span>{course.name} {course.courseName}</span>}
            secondaryText={<div style={style.secondaryText}>
                {this.renderECBadge()}{this.renderQBadge()}
            </div>}
            leftIcon={this.renderChevron()}
            rightIconButton={<AddRemoveMove course={this.props.course} style={style.AddRemoveMove}/>}
            innerDivStyle={style.innerDiv}
            key={course.nr}
            style={style.root}/>;
    }
});

