import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import EventServer from '../../models/EventServer.js';
import ReactGridLayout, {WidthProvider} from 'react-grid-layout';
import {
    Panel, Badge
}
from 'react-bootstrap';
import CourseGridItem from './CourseGridItem.js';
const DecoratedReactGridLayout = WidthProvider(ReactGridLayout);

/**
 * Creates the grid properties for the course
 * @param  {Object} courseTree The course object, as seen in AllCourses.js
 * @return {Object} Grid properties
 */
var courseGrid = function(courseTree) {
    const course = CourseCtrl.get(courseTree.id);
    var start = course['Start Education'];
    var periods = course['Education Period'];
    var x = start ? parseInt(start, 10) - 1 : 0;
    var w = periods ? periods.split(',').length : 1;
    return {
        x: x,
        y: 0,
        w: w,
        h: 1
    };
};

export
default React.createClass({
    componentDidMount() {
        EventServer.on('added', () => this.forceUpdate(), 'main');
        EventServer.on('removed', () => this.forceUpdate(), 'main');
        EventServer.on('courses.loaded', () => this.forceUpdate(), 'main');
    },
    componentWillUnmount(){
        EventServer.remove('added', 'main');
        EventServer.remove('removed', 'main');
        EventServer.remove('courses.loaded', 'main');
    },
    render() {
        const panelHeader = <div className="row">
            <span className="col-xs-12">
                Total ects: {CourseCtrl.addedEcts()}
            </span>
            {[1, 2, 3, 4].map(function(index){
                var ects = CourseCtrl.periodEcts(index);
                return <span key={index} className="col-xs-3">
                    {'Q' + index + ' '}<Badge>EC {ects}</Badge>
                </span>;
            })}
        </div>;

        const gridItems = CourseCtrl.added.map(function(course, index) {
            return <CourseGridItem _grid={courseGrid(course, index)}
                key={course.id} course={course}/>;
        });

        let body;
        if(gridItems.length === 0) {
            body = <span className='empty'>
                    No courses added yet
                </span>;
        } else {
            body = <div className="row">
                <DecoratedReactGridLayout
                    isResizable={false}
                    isDraggable={false}
                    rowHeight={100}
                    cols={4}>
                    {gridItems}
                </DecoratedReactGridLayout>
            </div>;
        }
        return <div id="year-view">
            <Panel header={panelHeader}>
                {body}
            </Panel>
        </div>;
    }
});
