import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import YearCtrl from '../../models/YearCtrl';
import EventServer from '../../models/EventServer.js';
import ReactGridLayout, {WidthProvider} from 'react-grid-layout';
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

export
default React.createClass({
    listener: null,
    propTypes: {
        year: React.PropTypes.number.isRequired,
        collapse: React.PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            courses: YearCtrl.get(this.props.year).courses.map((id)=>id),
            windowWidth: window.innerWidth,
            id: `YearViewBody::${this.props.year}`
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            collapse: nextProps.collapse
        });
    },
    shouldComponentUpdate(nextProps, nextState) {
        return isDifferent(this.state.courses, nextState.courses) || this.state.collapse !== nextState.collapse;
    },
    componentDidMount() {
        EventServer.on('years::loaded', () => this.updateCourses(), this.state.id);
        EventServer.on(`year::added::${this.props.year}`, () => this.updateCourses(), this.state.id);
        EventServer.on(`year::removed::${this.props.year}`, () => this.updateCourses(), this.state.id);
        this.listener = window.addEventListener('resize', this.handleResize);
    },
    handleResize: function() {
        this.setState({windowWidth: window.innerWidth});
    },
    componentWillUnmount() {
        EventServer.remove('years::loaded', this.state.id);
        EventServer.remove(`year::added::${this.props.year}`, this.state.id);
        EventServer.remove(`year::removed::${this.props.year}`, this.state.id);
        window.removeEventListener('resize', this.listener);
    },
    updateCourses() {
        this.setState({
            // Make a copy of the list, otherwise it will assign a pointer
            courses: YearCtrl.get(this.props.year).courses.map((id)=>id)
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
        if (this.state.collapse) {
            return null;
        }
        if (this.state.courses.length === 0) {
            return <span className='empty'>
                No courses added yet
            </span>;
        }

        const gridItems = this.state.courses.map((courseId, index) => {
            return <CourseGridItem
                year={this.props.year}
                data-grid={courseGrid(courseId, index)}
                key={courseId}
                courseId={courseId}/>;
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
