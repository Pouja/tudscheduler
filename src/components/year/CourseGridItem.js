import React, {PropTypes} from 'react';
import Badge from '../Badge.js';
import AddRemoveMove from '../AddRemoveMove.js';
import CourseCtrl from '../../models/CourseCtrl.js';
import Paper from 'material-ui/Paper';
import {grey100} from 'material-ui/styles/colors.js';
/**
 * Used by YearView to render a course.
 */
export default React.createClass({
    propTypes: {
        courseId: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]).isRequired,
        style: React.PropTypes.object
    },
    render(){
        const style = {
            root: Object.assign({
                backgroundColor: grey100
            }, this.props.style),
            inner: {
                padding: 8
            },
            AddRemoveMove: {
                position: 'absolute',
                bottom: 0,
                right: 0,
                top: 'initial'
            }
        };
        const course = CourseCtrl.get(this.props.courseId);
        return <Paper zDepth={1} style={style.root}>
            <div style={style.inner}>
                {course.name} {course.courseName}
                <Badge>EC {course.ects}</Badge>
                <AddRemoveMove courseId={this.props.courseId} style={style.AddRemoveMove}/>
            </div>
        </Paper>;
    }
});
