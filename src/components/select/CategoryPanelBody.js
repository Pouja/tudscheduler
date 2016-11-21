import React, {PropTypes} from 'react';
import CourseDnD from './CourseDnD.js';
import _ from 'lodash';
import EventServer from '../../models/EventServer.js';
import CourseList from '../CourseList.js';
import CourseCtrl from '../../models/CourseCtrl.js';

/**
 * The body of the category.
 * Renders all the courses.
 * @example
 * <CategoryPanelBody options={{onEmpty:'No courses :('}} category={categoryId} collapse={false}/>
 */
export
default React.createClass({
    propTypes:{
        options: PropTypes.object.isRequired,
        className: PropTypes.string,
        category: PropTypes.object.isRequired,
        collapse: PropTypes.bool.isRequired
    },
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState) ||
            _.difference(this.state.courses, nextState.courses).length > 0;
    },
    getInitialState() {
        return {
            collapsed: this.props.collapse,
            isOver: false,
            filter: '',
            courses: this.props.category.courses,
            catId: this.props.category.catId,
            id: `CategoryPanelBody::${this.props.category.catId}::${_.uniqueId()}`
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            collapsed: nextProps.collapse,
            catId: nextProps.category.catId,
            courses: nextProps.category.courses
        });
    },
    componentWillUnmount(){
        const id = this.state.catId;
        EventServer.remove(`category::added::${id}`, id);
        EventServer.remove(`category::removed::${id}`, id);
        EventServer.remove(`category::searching::${id}`, id);
    },
    componentDidMount() {
        const id = this.state.catId;
        EventServer.on(`category::added::${id}`, this.updateCourses, id);
        EventServer.on(`category::removed::${id}`, this.updateCourses, id);
        EventServer.on(`category::searching::${id}`, (filter) => this.setState({
            filter: filter
        }), id);
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
            hide={this.state.collapsed} filter={this.state.filter}
            onEmpty={this.props.options.onEmpty} createItem={this.createCourse}/>;
    }
});
