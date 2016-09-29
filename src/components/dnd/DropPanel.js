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
        return {id: props.id};
    }
};

@DropTarget(CourseTypes.COMPULSORY, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class DropPanel extends Component {
    static propTypes = {
        isOver: PropTypes.bool.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
