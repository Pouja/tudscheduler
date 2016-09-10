import React, {PropTypes} from 'react';
import CourseDnD from './CourseDnD.js';
import _ from 'lodash';
import EventServer from '../../models/EventServer.js';
import CourseList from '../CourseList.js';
import CourseCtrl from '../../models/CourseCtrl.js';

/**
 * Renders the isp panel body.
 */
export
default React.createClass({
    propTypes:{
        options: PropTypes.object.isRequired,
        className: PropTypes.string,
        category: PropTypes.object.isRequired,
        hide: PropTypes.bool.isRequired
    },
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState) ||
            _.difference(this.state.courses, nextState.courses).length > 0;
    },
    getInitialState() {
        return {
            collapsed: false,
            isOver: false,
            filter: '',
            courses: this.props.category.courses,
            catId: this.props.category.catId,
            id: `CategoryPanelBody::${this.props.category.catId}::${_.uniqueId()}`
        };
    },
    componentWillReceiveProps(nextProps){
        const shouldReset = this.state.catId !== nextProps.category.catId;
        this.setState({
            catId: nextProps.category.catId,
            courses: nextProps.category.courses
        }, () => {
            if(shouldReset) {
                this.stopListening();
                this.startListening();
            }
        });
    },
    componentWillUnmount(){
        this.stopListening();
    },
    componentDidMount() {
        this.startListening();
    },
    startListening() {
        const id = this.state.catId;
        EventServer.on(`category::added::${id}`, this.updateCourses, this.state.id);
        EventServer.on(`category::removed::${id}`, this.updateCourses, this.state.id);
        EventServer.on(`category::searching::${id}`, (filter) => this.setState({
            filter: filter
        }), this.state.id);
    },
    stopListening() {
        const id = this.state.catId;
        EventServer.remove(`category::added::${id}`, this.state.id);
        EventServer.remove(`category::removed::${id}`, this.state.id);
        EventServer.remove(`category::searching::${id}`, this.state.id);
    },
    updateCourses(){
        this.setState({
            // This now stores a reference to courses, potentional bug!!
            courses: this.props.category.courses
        });
    },
    createCourse(course) {
        const category = this.props.category;
        return <CourseDnD key={course.id} category={category.catId} course={course}/>;
    },
    render() {
        return <CourseList courses={this.state.courses.map(CourseCtrl.get)}
            hide={this.props.hide} filter={this.state.filter}
            onEmpty={this.props.options.onEmpty} createItem={this.createCourse}/>;
    }
});
