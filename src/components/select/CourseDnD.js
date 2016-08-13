import CourseCtrl from '../../models/CourseCtrl.js';
import React, {Component, PropTypes} from 'react';
import CourseTypes from '../../constants/CourseTypes.js';
import {DragSource} from 'react-dnd';
import ISPCtrl from '../../models/ISPCtrl.js';
import {ListItem} from 'material-ui/List';
import EditorDragHandle from 'material-ui/svg-icons/editor/drag-handle';
import AddRemoveMove from '../AddRemoveMove.js';
import WarningPopup from '../WarningPopup.js';
import EventServer from '../../models/EventServer.js';
import _ from 'lodash';

const courseSource = {
    /**
     * Called by react-dnd when a DragSource starts to being dragged.
     * Should return an object with the necessary values to make a drop and to identify this DragSource.
     * @param  {Object} props The props of the react component bind to the DragSource
     * @return {Object}       Object containing values to identify the DragSource.
     */
    beginDrag(props) {
        return {
            currentFieldId: props.category,
            course: props.course
        };
    },
    /**
     * Called by react-dnd when a DragSource stops being dragged by the user.
     * Handles the drop if it is not dropped already.
     * It moves the course to another ISPField.
     * @param  {Object} props   The props of the react component binded to the DragSource
     * @param  {Object} monitor The monitor object retuned by react-dnd. See react-dnd for more info.
     */
    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        if (!monitor.didDrop() || item.currentFieldId === dropResult.id) {
            return;
        }
        ISPCtrl.move(item.course.id, item.currentFieldId, dropResult.id);
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
 * The drag and drop list item in the select view.
 */
class CourseDnD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            warnings: [],
            id: `CourseDndD::${this.props.course.id}::${_.uniqueId()}`
        };
    }
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        course: PropTypes.object.isRequired,
        category: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]),
        style: PropTypes.object
    };
    componentWillMount(){
        // Oke. Usually you will remove the event when unmounting, makes sense right?
        // Except... react dnd first mounts the dragged element and then unmounts the prev element
        EventServer.on(`course::error::${this.props.course.id}`, (warnings) => this.setState({
            warnings: warnings.map(id => id)
        }), this.state.id);
    }
    componentWillUnmount(){
        EventServer.remove(`course::error::${this.props.course.id}`, this.state.id);
    }
    renderList() {
        const course = CourseCtrl.get(this.props.course.id);
        const style = {
            root: Object.assign({}, this.props.style, {
                marginLeft: 0,
                cursor: 'grab'
            }),
            reportProblem: {
                root: {
                    position: 'absolute',
                    right: 40,
                    top: 0
                }
            }
        };
        return <ListItem
                style={style.root}
                innerDivStyle={style.innerDiv}
                disableTouchRipple
                disableFocusRipple
                primaryText={<div>{course.name} {course.courseName}
                    <WarningPopup warnings={this.state.warnings}
                        style={style.reportProblem}/></div>}
                rightIconButton={<AddRemoveMove move={true}
                    category={this.props.category}
                    style={style.AddRemoveMove} courseId={course.id}/>}
                leftIcon={<EditorDragHandle/>}/>;
    }
    render() {
        return this.props.connectDragSource(<div key={`coursednd.${this.props.course.id}`}>
            {this.renderList()}</div>);
    }
}

export
default DragSource(CourseTypes.COMPULSORY, courseSource, collect)(CourseDnD); //eslint-disable-line new-cap
