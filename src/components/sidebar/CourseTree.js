import CourseCtrl from '../../models/CourseCtrl.js';
import React, {PropTypes} from 'react';
import EventServer from '../../models/EventServer.js';
import AddRemoveMove from './../AddRemoveMove.js';
import {ListItem} from 'material-ui/List';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import Check from 'material-ui/svg-icons/navigation/check';
import {green500} from 'material-ui/styles/colors';
import Badge from '../Badge.js';
import _ from 'lodash';
import {DragSource} from 'react-dnd';
import CourseTypes from '../../constants/CourseTypes.js';
import EditorDragHandle from 'material-ui/svg-icons/editor/drag-handle';
import DnDCtrl from '../../models/DnDCtrl.js';

const courseSource = {
    /**
     * Called by react-dnd when a DragSource starts to being dragged.
     * Should return an object with the necessary values to make a drop and to identify this DragSource.
     * @param  {Object} props The props of the react component bind to the DragSource
     * @return {Object}       Object containing values to identify the DragSource.
     */
    beginDrag(props) {
        return {
            course: props.course,
            currentFieldId: 'sidebar'
        };
    },
    /**
     * Called by react-dnd when a DragSource stops being dragged by the user.
     * Handles the drop if it is not dropped already.
     * It moves the course to another Category.
     * @param  {Object} props   The props of the react component binded to the DragSource
     * @param  {Object} monitor The monitor object retuned by react-dnd. See react-dnd for more info.
     */
    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        if (!monitor.didDrop() || item.currentFieldId === dropResult.id) {
            return;
        }
        DnDCtrl.move(item.course.id, item.currentFieldId, dropResult.id);
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

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
        connectDragSource: PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
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
            id: `CourseTree::${this.props.course.id}::${_.uniqueId()}`
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

        EventServer.on(`CourseTree::visible::${this.props.course.parent}`, (toggle) => {
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
        }, this.state.id);
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
    },
    /**
     * Stops listening to events. Should be called when it is not visible or
     * when it is removed from the dom.
     */
    stopListening() {
        EventServer.remove('course::added::*', this.state.id);
        EventServer.remove('course::removed::*', this.state.id);
    },
    /**
     * Called when the ects or isAdded should be updated
     */
    update() {
        this.setState({
            ects: CourseCtrl.addedEcts(this.props.course),
            isAdded: CourseCtrl.isAdded(this.props.course.id)
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
                marginLeft: (this.props.course.depth - 1) * 10
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
            },
            check:{
                display: this.state.isAdded ? 'inline-block' : 'none',
                position: 'absolute',
                right: 40,
                top: 11,
                color: green500
            }
        };
        return <ListItem
            disableTouchRipple
            disableFocusRipple
            onTouchTap={this.toggle}
            primaryText={<span>{course.name} {course.courseName}
                {<Check style={style.check}/>}</span>}
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

export
default DragSource(CourseTypes.COMPULSORY, courseSource, collect)(CourseTree); //eslint-disable-line new-cap
