import React from 'react';
import {List} from 'material-ui/List';
import CourseCtrl from '../../models/CourseCtrl.js';
import _ from 'lodash';
import EventServer from '../../models/EventServer.js';
import CourseTree from './CourseTree.js';

export default React.createClass({
    getInitialState() {
        return {
            courses: [],
            filter: ''
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    },
    componentDidMount() {
        EventServer.on('courses.loaded', ()=> this.setState({
            courses: CourseCtrl.courses
        }), 'sidebar2');
        EventServer.on('course.searching', (nextFilter)=> this.setState({
            filter: (nextFilter.length >= 2) ? nextFilter : ''
        }), 'sidebar2');
    },
    componentWillUnmount(){
        EventServer.remove('course.loaded', 'sidebar2');
        EventServer.remove('course.searching', 'sidebar2');
    },
    render(){
        const filter = this.state.filter;
        if(filter.length < 2) {
            return <div className='empty'>Search on a course code or name, minimal 2 characters</div>;
        }
        const rows = _(CourseCtrl.courses)
            .filter(function(course){
                return course.id !== 'root'
                    && !CourseCtrl.isAGroup(course)
                    && CourseCtrl.hasNeedle(course, filter);
            })
            .orderBy(['name', 'courseName'], ['asc','asc'])
            .map(function(course){
                return <CourseTree key={course.id} filtering={false} visible={true}
                    course={course}/>;
            })
            .value();
        if(rows.length === 0) {
            return <div className='empty'>No course found</div>;
        }
        return <List>
            {rows}
        </List>;
    }
});

