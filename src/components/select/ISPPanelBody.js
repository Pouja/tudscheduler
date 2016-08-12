import React, {PropTypes} from 'react';
import CourseDnD from './CourseDnD.js';
import _ from 'lodash';
import EventServer from '../../models/EventServer.js';
import CourseCtrl from '../../models/CourseCtrl.js';
import {List} from 'material-ui/List';

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
            hide: this.props.hide,
            collapsed: false,
            isOver: false,
            filter: null,
            courses: this.props.category.courses,
            catId: this.props.category.catId
        };
    },
    componentWillReceiveProps(nextProps){
        const shouldReset = this.state.catId !== nextProps.category.catId;
        this.setState({
            hide: nextProps.hide,
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
        EventServer.on(`category.added::${id}`, this.updateCourses, `${id}body`);
        EventServer.on(`category.removed::${id}`, this.updateCourses, `${id}body`);
        EventServer.on(`${id}.searching`, (filter) => this.setState({
            filter: filter
        }), `${id}body`);
    },
    stopListening() {
        const id = this.state.catId;
        EventServer.remove(`category.added::${id}`, `${id}body`);
        EventServer.remove(`category.removed::${id}`, `${id}body`);
        EventServer.remove(`${id}.searching`, `${id}body`);
    },
    updateCourses(){
        this.setState({
            // This now stores a reference to courses, potentional bug!!
            courses: this.props.category.courses
        });
    },
    render() {
        const style = {
            display: this.state.hide ? 'none' : ''
        };
        const category = this.props.category;
        const rows = _(this.state.courses)
            .map(CourseCtrl.get)
            .orderBy(['name','courseName'],['asc','asc'])
            .filter((child) => CourseCtrl.hasNeedle(child, this.state.filter))
            .map((child) => <CourseDnD key={child.id} category={category.catId} course={child}/>)
            .value();
        if(this.state.filter && rows.length === 0){
            return <span style={style} className='empty'>
                No matching course found
            </span>;
        } else if(rows.length > 0) {
            return <List style={style} >{rows}</List>;
        }
        return <span style={style} className='empty'>
            {(this.state.isOver) ? this.props.options.onHover : this.props.options.onEmpty}
        </span>;
    }
});
