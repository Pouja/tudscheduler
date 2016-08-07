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
    getInitialState() {
        return {
            hide: this.props.hide,
            collapsed: false,
            isOver: false,
            filter: null,
            courses: this.props.category.courses
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            hide: nextProps.hide
        });
    },
    componentDidMount() {
        this.startListening();
    },
    /**
     * Starts listening to events for the given ISP Controller
     */
    startListening() {
        const id = this.props.category.id;
        EventServer.on(`isp.field.added::${id}`, this.updateCourses, `${id}body`);
        EventServer.on(`isp.field.removed::${id}`, this.updateCourses, `${id}body`);
        EventServer.on(`${id}.searching`, (filter) => this.setState({
            filter: filter
        }), `${id}body`);
    },
    updateCourses(){
        this.setState({
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
            .map((child) => <CourseDnD key={child.id} field={category.id} course={child}/>)
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
