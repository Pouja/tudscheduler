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
            catId: this.props.category.catId,
            id: `ISPPanelBody::${this.props.category.catId}::${_.uniqueId()}`
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
    render() {
        const style = {
            root: {
                overflow: 'hidden',
                transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                opacity: this.state.hide ? 0 : 100,
                height: this.state.hide ? 0 : 'auto'
            }
        };
        const category = this.props.category;
        const rows = _(this.state.courses)
            .map(CourseCtrl.get)
            .orderBy(['name','courseName'],['asc','asc'])
            .filter((child) => CourseCtrl.hasNeedle(child, this.state.filter))
            .map((child) => <CourseDnD key={child.id} category={category.catId} course={child}/>)
            .value();
        if(this.state.filter && rows.length === 0){
            return <span style={style.root} className='empty'>
                No matching course found
            </span>;
        } else if(rows.length > 0) {
            return <List style={style.root} >{rows}</List>;
        }
        return <span style={style.root} className='empty'>
            {(this.state.isOver) ? this.props.options.onHover : this.props.options.onEmpty}
        </span>;
    }
});
