import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import EventServer from '../../models/EventServer.js';
import ReactGridLayout, {
    WidthProvider
}
from 'react-grid-layout';
import CourseGridItem from './CourseGridItem.js';
const DecoratedReactGridLayout = WidthProvider(ReactGridLayout); //eslint-disable-line new-cap

/**
 * Creates the grid properties for the course
 * @param  {Object} courseId The course id
 * @return {Object} Grid properties
 */
const courseGrid = function(courseId) {
    const course = CourseCtrl.get(courseId);
    const start = course['Start Education'];
    const periods = course['Education Period'];
    const x = start ? parseInt(start, 10) - 1 : 0;
    const w = periods ? periods.split(',').length : 1;
    return {
        i: `${course.id}`,
        x: x,
        y: 0,
        w: w,
        h: 1
    };
};

/**
 * Checks if two arrays are different in values and in length
 * @param  {Array}  left  The left array
 * @param  {Array}  right The right array
 * @return {Boolean}       true iff the length are different or if atleast one element differs
 */
function isDifferent(left, right) {
    if(left.length !== right.length) {
        return true;
    }
    return left.some((el) => right.indexOf(el) === -1);
}

const id = 'YearViewBody';
export
default React.createClass({
    getInitialState() {
        return {
            courses: CourseCtrl.added.map((id)=>id)
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return isDifferent(this.state.courses, nextState.courses);
    },
    componentDidMount() {
        EventServer.on('added', () => this.updateCourses(), id);
        EventServer.on('removed', () => this.updateCourses(), id);
        EventServer.on('courses.loaded', () => this.updateCourses(), id);
    },
    componentWillUnmount() {
        EventServer.remove('added', id);
        EventServer.remove('removed', id);
        EventServer.remove('courses.loaded', id);
    },
    updateCourses() {
        this.setState({
            // Make a copy of the list, otherwise it will assign a pointer
            courses: CourseCtrl.added.map((id)=>id)
        });
    },
    render() {
        if (this.state.courses.length === 0) {
            return <span className='empty'>
                No courses added yet
            </span>;
        }

        const gridItems = this.state.courses.map(function(courseId, index) {
            return <CourseGridItem data-grid={courseGrid(courseId, index)}
                key={courseId} courseId={courseId}/>;
        });

        return <DecoratedReactGridLayout
            isResizable={false}
            isDraggable={false}
            rowHeight={120}
            cols={4}>
            {gridItems}
        </DecoratedReactGridLayout>;
    }
});
