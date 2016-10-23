import React, {PropTypes} from 'react';
import Badge from '../Badge.js';
import AddRemoveMove from '../AddRemoveMove.js';
import CourseCtrl from '../../models/CourseCtrl.js';
import Paper from 'material-ui/Paper';
import {grey100} from 'material-ui/styles/colors.js';
import {createSource, defaultCollect, createDragSource} from '../dnd/CreateDragSource';

/**
 * Used by YearView to render a course in the grid layout.
 */
const CourseGridItem = React.createClass({
    propTypes: {
        courseId: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]).isRequired,
        year: PropTypes.number.isRequired,
        style: React.PropTypes.object,
        connectDragSource: PropTypes.func.isRequired
    },
    render(){
        const style = {
            root: Object.assign({
                backgroundColor: grey100
            }, this.props.style),
            inner: {
                padding: 8,
                cursor: 'move',
                height: '80%',
                width: '80%'
            },
            AddRemoveMove: {
                position: 'absolute',
                bottom: 0,
                right: 0,
                top: 'initial'
            },
            badge: {
                position: 'absolute',
                bottom: 15
            },
            text: {
                fontSize: 15,
                wordWrap: 'break-word'
            }
        };
        const course = CourseCtrl.get(this.props.courseId);
        return <Paper zDepth={1} style={style.root}>
            {this.props.connectDragSource(<div style={style.inner}>
                <div style={style.text}>{course.name} {course.courseName}</div>
                <Badge style={style.badge}>EC {course.ects}</Badge>
                <AddRemoveMove courseId={this.props.courseId} style={style.AddRemoveMove}/>
            </div>)}
        </Paper>;
    }
});
export default createDragSource(createSource((props) => props.year, (props) => { return {
    id: props.courseId
};}), defaultCollect, CourseGridItem);
