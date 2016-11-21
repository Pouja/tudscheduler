import DnDCtrl from '../../models/DnDCtrl';
import {DragSource} from 'react-dnd';

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
            DnDCtrl.move(item.course.id, item.currentFieldId, dropResult);
        }
    };
}

/**
 * Defines which functions should be injected in the DragSource.
 * See http://gaearon.github.io/react-dnd/docs-drag-source.html and
 * @param {Object} connect http://gaearon.github.io/react-dnd/docs-overview.html#connectors
 * @param {Object} monitor http://gaearon.github.io/react-dnd/docs-overview.html#monitors
 * @return {Object} The DragSource The connectDragSource defines which node in the drag source is the clickable draggable node.
 * The isDragging function returns true if the source is dragging or not.
 */
export function defaultCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

/**
 * Creates a DragSource basically.
 * See http://gaearon.github.io/react-dnd/docs-drag-source.html for more info.
 * @param {Object} source Defines which lifecycle methods of a draggable source should be called.
 * @param {Object} collect The react dnd functions that should be injected in the DragSource.
 * @param {Element} component The react component which should be wrapped.
 * @return {Element} A react dnd drag source element.
 */
export function createDragSource(source, collect, component) {
    return DragSource('any', source, collect)(component);
}
