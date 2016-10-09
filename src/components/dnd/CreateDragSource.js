import DnDCtrl from '../../models/DnDCtrl';
import {DragSource} from 'react-dnd';
import CourseTypes from '../../constants/CourseTypes.js';

export function createSource(getCurrentFieldId, getCourse) {
    return {
        /**
         * Called by react-dnd when a DragSource starts to being dragged.
         * Should return an object with the necessary values to make a drop and to identify this DragSource.
         * @param  {Object} props The props of the react component bind to the DragSource
         * @return {Object}       Object containing values to identify the DragSource.
         */
        beginDrag(props) {
            return {
                currentFieldId: getCurrentFieldId(props),
                course: (getCourse) ? getCourse(props) : props.course
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
}

export function defaultCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

export function createDragSource(source, collect, component) {
    return DragSource(CourseTypes.COMPULSORY, source, collect)(component);
}
