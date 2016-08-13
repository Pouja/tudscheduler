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
            filter: '',
            hide: false
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            hide: nextProps.hide
        });
    },
    componentDidMount() {
        EventServer.on('courses::loaded', ()=> this.setState({
            courses: CourseCtrl.courses
        }), 'SideBarSearchBody');
        EventServer.on('course::searching', (nextFilter)=> this.setState({
            filter: (nextFilter.length >= 2) ? nextFilter : ''
        }), 'SideBarSearchBody');
    },
    componentWillUnmount(){
        EventServer.remove('course::loaded', 'SideBarSearchBody');
        EventServer.remove('course::searching', 'SideBarSearchBody');
    },
    render(){
        const filter = this.state.filter;
        if(filter.length < 2) {
            return <div className='empty'>Search on a course code or name, minimal 2 characters</div>;
        }
        const rows = _(CourseCtrl.courses)
            .filter(function(course){
                return course.id !== 'root'
                    && !CourseCtrl.isAGroup(course.id)
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
        const style = {
            root: {
                overflow: 'hidden',
                transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                opacity: this.state.hide ? 0 : 100,
                height: this.state.hide ? 0 : 'auto'
            }
        };
        return <List style={style.root}>
            {rows}
        </List>;
    }
});

