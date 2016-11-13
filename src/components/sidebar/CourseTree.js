import CourseCtrl from '../../models/CourseCtrl.js';
import React, {PropTypes} from 'react';
import EventServer from '../../models/EventServer.js';
import AddRemoveMove from './../AddRemoveMove.js';
import {ListItem} from 'material-ui/List';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import Badge from '../Badge.js';
import _ from 'lodash';
import EditorDragHandle from 'material-ui/svg-icons/editor/drag-handle';
import {createSource, defaultCollect, createDragSource} from '../dnd/CreateDragSource';
import DoneCtrl from '../../models/DoneCtrl';
import Mark from '../Mark';

/**
 * A list group item for in the sidebar.
 * Shows the course id, name, ects and optional control functions
 * It renders a chevron when the course is a group.
 */
const CourseTree = React.createClass({
    propTypes:{
        // Can override the root style of the CourseTree
        style: PropTypes.object,
        // The course object, should atleast have the course id.
        course: PropTypes.object.isRequired,
        // The initial visibility state
        visible: PropTypes.bool.isRequired,
        connectDragSource: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            // The total ects from all the child courses that are added
            ects: CourseCtrl.addedEcts(this.props.course),
            // Used by the chevron to display the visibility state of the children
            childVisible: false,
            isAdded: CourseCtrl.isAdded(this.props.course.id),
            // Changed when the visibility of the parent is changed
            visible: this.props.visible,
            // The unique identifier of this CourseTree instant
            id: `CourseTree::${this.props.course.id}::${_.uniqueId()}`,
            isDone: DoneCtrl.isDone(this.props.course.id)
        };
    },
    /**
     * Only update when the state is mutated.
     * @param {Object} nextProps The next set of props to be set.
     * @param {Object} nextState The next state of the CourseTree.
     * @return {boolean} true iff the state deep differs from the next state.
     */
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    },
    componentWillUnmount(){
        EventServer.remove(`CourseTree::visible::${this.props.course.parent}`, this.state.id);
        this.stopListening();
    },
    /**
     * Will start/stop listening to course changes depending on the course state.
     */
    componentDidMount() {
        if(this.state.visible){
            this.startListening();
        }
        EventServer.on(`CourseTree::visible::${this.props.course.parent}`, this.onVisible, this.state.id);
    },
    /**
     * Called when the parent visibility changes.
     * If the parent is not visible any more it will emit that this comp will also hide.
     * Furthermore it will stop listening to changes to increase performance
     * (No need to update things which are not visible).
     * If the parent has become visible, start listening to changes.
     * @param {bool} toggle The visibility state of the parent.
     */
    onVisible(toggle) {
        let nextState = {
            visible: toggle
        };
        if (!toggle) {
            this.stopListening();
            EventServer.emit(`CourseTree::visible::${this.props.course.nr}`, toggle);
            nextState.childVisible = false;
        } else {
            this.startListening();
            this.update();
        }
        this.setState(nextState);
    },
    /**
     * Toggle the visibility of the children
     */
    toggle() {
        const nextVisibility = !this.state.childVisible;
        this.setState({
            childVisible: nextVisibility
        });
        EventServer.emit(`CourseTree::visible::${this.props.course.nr}`, nextVisibility);
    },
    /**
     * Start listening to course changes.
     */
    startListening() {
        EventServer.on('course::added::*', () => this.update(), this.state.id);
        EventServer.on('course::removed::*', () => this.update(), this.state.id);
        EventServer.on(`done::changed::${this.props.course.id}`, () => this.update(), this.state.id);
    },
    /**
     * Stops listening to events. Should be called when it is not visible or
     * when it is removed from the dom.
     */
    stopListening() {
        EventServer.remove('course::added::*', this.state.id);
        EventServer.remove('course::removed::*', this.state.id);
        EventServer.remove(`done::changed::${this.props.course.id}`, this.state.id);
    },
    /**
     * Called when the ects or isAdded should be updated
     */
    update() {
        this.setState({
            ects: CourseCtrl.addedEcts(this.props.course),
            isAdded: CourseCtrl.isAdded(this.props.course.id),
            isDone: DoneCtrl.isDone(this.props.course.id)
        });
    },
    /**
     * Renders the chevron
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderChevron() {
        const style = {
            top: 3
        };
        if (!CourseCtrl.isAGroup(this.props.course.id)) {
            return <EditorDragHandle style={style}/>;
        }
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
        if (!CourseCtrl.isAGroup(course.id)) {
            return (<Badge style={style}>EC {totalEcts}</Badge>);
        }
        return (<Badge style={style}>EC {subEcts}/{totalEcts}</Badge>);
    },
    renderListItem() {
        if (!this.state.visible) {
            return null;
        }
        const course = CourseCtrl.get(this.props.course.id);
        const style = {
            root: Object.assign({}, this.props.style, {
                paddingLeft: (this.props.course.depth - 1) * 10
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
        if (this.state.isDone) {
            style.root.backgroundColor = 'rgba(104, 159, 56, 0.3)';
        }
        return <ListItem
            disableTouchRipple
            disableFocusRipple
            onTouchTap={this.toggle}
            primaryText={<span>
                    <Mark display={this.state.isAdded}/>
                    {course.name} {course.courseName}
                </span>}
            secondaryText={<div style={style.secondaryText}>
                {this.renderECBadge()}{this.renderQBadge()}
            </div>}
            leftIcon={this.renderChevron()}
            rightIconButton={<AddRemoveMove courseId={this.props.course.id} style={style.AddRemoveMove}/>}
            innerDivStyle={style.innerDiv}
            key={course.nr || course.id}
            style={style.root}/>;
    },
    render() {
        return this.props.connectDragSource(<div key={`coursednd.${this.props.course.id}`}>
            {this.renderListItem()}</div>);
    }
});
export default createDragSource(createSource(() => 'sidebar'), defaultCollect, CourseTree);
