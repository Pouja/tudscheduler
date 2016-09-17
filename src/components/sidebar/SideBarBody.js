import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import EventServer from '../../models/EventServer.js';
import FacultyCtrl from '../../models/FacultyCtrl.js';
import CourseTree from './CourseTree.js';
import CourseList from '../CourseList.js';
export
default React.createClass({
    getInitialState() {
        return {
            tree: CourseCtrl.flatten(null, null, 'nr'),
            courses: CourseCtrl.courses.map(id => id),
            hide: false,
            id: 'SideBarTreeBody',
            filter: ''
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            hide: nextProps.hide
        });
    },
    componentDidMount() {
        EventServer.on('courses::loaded', () => this.setState({
            tree: CourseCtrl.flatten(null, null, 'nr'),
            courses: CourseCtrl.courses.map(id => id)
        }), this.state.id);
        EventServer.on('course::searching', (nextFilter) => this.setState({
            filter: nextFilter
        }), this.state.id);
    },
    componentWillUnmount() {
        EventServer.remove('courses::loaded', this.state.id);
        EventServer.remove('course::searching', this.state.id);
    },
    createCourse(course) {
        return <CourseTree key={course.id} visible={true}
                    course={course}/>;
    },
    createTreeCourse(courseTree) {
        return <CourseTree key={courseTree.nr} visible={courseTree.parent === 1}
            course={courseTree}/>;
    },
    render() {
        if (FacultyCtrl.selectedTrack() === undefined) {
            return <div className="empty">No track was selected. Please select a track first.</div>;
        }
        if (this.state.filter.length > 0) {
            return <CourseList courses={this.state.courses
                .filter(course => !CourseCtrl.isAGroup(course.id))}
                hide={this.state.hide}
                filter={this.state.filter}
                onEmpty="Search on a course code or name, minimal 2 characters"
                createItem={this.createCourse}/>;
        }
        const onEmpty = <div>The selected track <strong>{FacultyCtrl.selectedTrack().name}</strong> has no courses.</div>;
        return <CourseList courses={this.state.tree}
            hide={this.state.hide}
            tree={true}
            filter={this.state.filter}
            onEmpty={onEmpty}
            createItem={this.createTreeCourse}/>;
    }
});
