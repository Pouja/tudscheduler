import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import {grey400} from 'material-ui/styles/colors';
import {DropTarget} from 'react-dnd';
import CourseTypes from '../../constants/CourseTypes.js';

/**
 * Required by react-dnd, contains the functionality which is used by other react-dnd components to interect.
 * @type {Object}
 */
const target = {
    /**
     * Called when a DragSource aka CourseDnD is dropped on the container.
     * Returns the id of the category for this DropTarget component.
     * @param  {Object} props The properties of SimpleDropTarget
     * @return {Object}       Object which identifies the DropTarget.
     */
    drop(props) {
        return {id: props.id, sort: props.sort};
    }
};

/**
 * Creates a wrapper around a native element to make a drop container.
 * Creates a Material-ui/Paper and wraps it with connectDropTarget of react-dnd.
 * Sets a 2px dashed border when an draggable component is hovering of the instance.
 * @example
 * <DropPanel id={myIdentifier} sort="example" className="col-xs-12" style={overrideStyle}>
 *  <div> A container </div>
 * </DropPanel
 */
@DropTarget(CourseTypes.COMPULSORY, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class DropPanel extends Component {
    static propTypes = {
        // Set by React-DnD, true if a draggable component is allowed to drop on this panel
        isOver: PropTypes.bool.isRequired,
        // Set by React-DnD, the wrapper function to create a droppable container/panel
        connectDropTarget: PropTypes.func.isRequired,
        // The id and sort combined are the identifiers of this instance
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        sort: PropTypes.string.isRequired,
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.element).isRequired
    }
    render() {
        const isOver = {
            border: `2px dashed ${grey400}`
        };
        const {connectDropTarget } = this.props;
        const style = Object.assign({}, this.props.style, this.props.isOver ? isOver : {});
        return connectDropTarget(<div className={this.props.className}>
            <Paper style={style} transitionEnabled={false}>
                {this.props.children}
            </Paper>
        </div>);
    }
}
