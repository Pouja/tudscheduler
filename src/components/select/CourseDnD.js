import CourseCtrl from '../../models/CourseCtrl.js';
import React, {Component, PropTypes} from 'react';
import CourseTypes from '../../constants/CourseTypes.js';
import {DragSource} from 'react-dnd';
import ISPCtrl from '../../models/ISPCtrl.js';
import {ListItem} from 'material-ui/List';
import EditorDragHandle from 'material-ui/svg-icons/editor/drag-handle';
import AddRemoveMove from '../AddRemoveMove.js';

const courseSource = {
    /**
     * Called by react-dnd when a DragSource starts to being dragged.
     * Should return an object with the necessary values to make a drop and to identify this DragSource.
     * @param  {Object} props The props of the react component bind to the DragSource
     * @return {Object}       Object containing values to identify the DragSource.
     */
    beginDrag(props) {
        return {
            currentFieldId: props.field,
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
        ISPCtrl.move(item.course, item.currentFieldId, dropResult.id);
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
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        course: PropTypes.object.isRequired,
        field: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]),
        style: PropTypes.object
    };
    /**
     * Called when clicking on the undo element.
     * Moves the course back to 'unlisted'
     */
    undo() {
        ISPCtrl.move(this.props.course, this.props.field, 'unlisted');
    }
    /**
     * Renders the undo icon.
     * @return {React} A react component
     */
    renderUndo() {
        if (this.props.field !== 'unlisted') {
            return <i className='fa fa-undo fa-lg' onClick={this.undo.bind(this)}/>;
        }
        return null;
    }
    renderError() {
        return null;
    }
    renderList() {
        const course = CourseCtrl.get(this.props.course.id);
        const style = {
            root: Object.assign({}, this.props.style, {
                marginLeft: 0,
                cursor: 'grab'
            })
        };
        return <ListItem
                style={style.root}
                innerDivStyle={style.innerDiv}
                disableTouchRipple
                disableFocusRipple
                primaryText={`${course.name} ${course.courseName}`}
                rightIconButton={<AddRemoveMove move={true}
                    category={this.props.field}
                    style={style.AddRemoveMove} course={course}/>}
                leftIcon={<EditorDragHandle/>}/>;
    }
    render() {
        return this.props.connectDragSource(<div>{this.renderList()}</div>);
    }
}

export
default DragSource(CourseTypes.COMPULSORY, courseSource, collect)(CourseDnD); //eslint-disable-line new-cap
