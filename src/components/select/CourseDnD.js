import CourseCtrl from '../../models/CourseCtrl.js';
import React, {
    Component, PropTypes
}
from 'react';
import CourseTypes from '../../constants/CourseTypes.js';
import {
    DragSource
}
from 'react-dnd';
import {
    ListGroupItem
}
from 'react-bootstrap';
import ISPCtrl from '../../models/ISPCtrl.js';
import classnames from 'classnames';
import {
    OverlayTrigger, Tooltip
}
from 'react-bootstrap';
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
        var item = monitor.getItem();
        var dropResult = monitor.getDropResult();
        if (!monitor.didDrop() || item.currentFieldId === dropResult.id) {
            return;
        }
        ISPCtrl.move(item.course, item.currentFieldId, dropResult.id);
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

/**
 * The drag and drop list item in the select view.
 */
class CourseDnD extends Component {
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
        const category = ISPCtrl.get(this.props.field);
        const course = CourseCtrl.get(this.props.course.id);
        // if (category.getErrors().indexOf('group') > -1 && !category.isInGroups(course)) {
        //     const msg = category.groupErrMsg(course, category);
        //     const compMsg = (msg.length > 1) ? <ul className="compact">
        //         {msg.map(function(msg, index){return <li key={index}>{msg}</li>})}
        //     </ul> : msg[0];
        //     const tooltip = <Tooltip id={`dnd-${course.id}`}>{compMsg}</Tooltip>;
        //     return <OverlayTrigger placement='left' overlay={tooltip}>
        //         <i className='fa fa-exclamation-triangle fa-lg'/>
        //     </OverlayTrigger>;
        // }
        return null;
    }
    renderControls(){
        return <div className='pull-right'>{this.renderError()}{this.renderUndo()}</div> ;
    }
    render() {
        const course = CourseCtrl.get(this.props.course.id);
        const {
            connectDragSource, isDragging
        } = this.props;
        const classes = classnames('list-item', {
            'is-dragging': isDragging
        });
        return connectDragSource(
            <div className={classes}>
            <i className="fa fa-grip"/> {course.name} {course.courseName} {this.renderControls()}
        </div>
        );
    }
}

/**
 * The expected prop types of CourseDnD.
 * @type {Object}
 */
CourseDnD.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

export
default DragSource(CourseTypes.COMPULSORY, courseSource, collect)(CourseDnD);
