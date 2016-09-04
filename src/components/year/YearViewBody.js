import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import EventServer from '../../models/EventServer.js';
import ReactGridLayout, {
    WidthProvider
}
from 'react-grid-layout';
import CourseGridItem from './CourseGridItem.js';
import _ from 'lodash';
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

const breakPoints = [{
    windowWidth: 768,
    rowHeight: 160
}, {
    windowWidth: 1200,
    rowHeight: 100
}, {
    windowWidth: 996,
    rowHeight: 160
}, {
    windowWidth: 480,
    rowHeight: 160
}];

const id = 'YearViewBody';
export
default React.createClass({
    getInitialState() {
        return {
            courses: CourseCtrl.added.map((id)=>id),
            windowWidth: window.innerWidth
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return isDifferent(this.state.courses, nextState.courses);
    },
    componentDidMount() {
        EventServer.on('course::added::*', () => this.updateCourses(), id);
        EventServer.on('course::removed::*', () => this.updateCourses(), id);
        EventServer.on('courses::loaded', () => this.updateCourses(), id);
        window.addEventListener('resize', this.handleResize);

    },
    handleResize: function() {
        this.setState({windowWidth: window.innerWidth});
    },
    componentWillUnmount() {
        EventServer.remove('course::added::*', id);
        EventServer.remove('course::removed::*', id);
        EventServer.remove('courses::loaded', id);
    },
    updateCourses() {
        this.setState({
            // Make a copy of the list, otherwise it will assign a pointer
            courses: CourseCtrl.added.map((id)=>id)
        });
    },
    getRowHeight(){
        const windowWidth = this.state.windowWidth;
        return _.reduce(breakPoints, function(result, value){
                if(_.isEmpty(result)){
                    return value;
                }
                const diff = windowWidth - value.windowWidth;
                if(diff > 0 && diff < windowWidth - result.windowWidth) {
                    return value;
                }
                return result;
            },{});
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
            rowHeight={this.getRowHeight().rowHeight}
            cols={4}>
            {gridItems}
        </DecoratedReactGridLayout>;
    }
});
