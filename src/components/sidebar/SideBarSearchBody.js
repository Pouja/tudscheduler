import React, {PropTypes} from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import _ from 'lodash';
import EventServer from '../../models/EventServer.js';
import CourseTree from './CourseTree.js';
import CourseList from '../CourseList.js';

/**
 * Renders the sidebar when the user is searching for something.
 */

export default React.createClass({
    propTypes: {
        hide: PropTypes.bool
    },
    getInitialState() {
        return {
            courses: CourseCtrl.courses,
            filter: ''
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState) || this.props.hide !== nextProps.hide;
    },
    componentDidMount() {
        EventServer.on('courses::loaded', ()=> this.setState({
            courses: CourseCtrl.courses
        }), 'SideBarSearchBody');
        EventServer.on('course::searching', (nextFilter)=> this.setState({
            filter: nextFilter
        }), 'SideBarSearchBody');
    },
    componentWillUnmount(){
        EventServer.remove('course::loaded', 'SideBarSearchBody');
        EventServer.remove('course::searching', 'SideBarSearchBody');
    },
    createCourse(course) {
        return <CourseTree key={course.id} filtering={false} visible={true}
                    course={course}/>;
    },
    render(){
        return <CourseList courseIds={this.state.courses
            .map(course => course.id)
            .filter(id => !CourseCtrl.isAGroup(id))}
            hide={this.props.hide}
            filter={this.state.filter}
            onEmpty="Search on a course code or name, minimal 2 characters"
            createItem={this.createCourse}/>;
    }
});

