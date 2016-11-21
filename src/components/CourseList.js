import React, {PropTypes} from 'react';
import CourseCtrl from '../models/CourseCtrl.js';
import _ from 'lodash';
import {List} from 'material-ui/List';

/**
 * Renders a list of courses based on the filter and the given courses.
 * @example
 * <CourseList
 *  courseIds={yourCoursIds}
 *  filter={'CS4093'}
 *  createItem={(course) => <CourseTree course={course}}
 *  hide={false}/>
 */
export
default React.createClass({
    propTypes: {
        // If true, it will display nothing
        hide: PropTypes.bool.isRequired,
        // All the courses to be rendered, should match how a course looks in GET /courseData
        courses: PropTypes.arrayOf(PropTypes.object).isRequired,
        // The filter string to be applied. Can consist of tokens. See search.js for more info.
        filter: PropTypes.string.isRequired,
        // How to render a single course.
        createItem: PropTypes.func.isRequired,
        // What to display if there are no courses matching the filter. Or if there is any course passed.
        onEmpty: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.element.isRequired]).isRequired,
        // If true, it will sort on 'nr' and otherwise on 'name' and 'courseName'
        tree: PropTypes.bool
    },
    getInitialState() {
        return {
            courses: this.props.courses,
            filter: this.props.filter,
            hide: this.props.hide,
            tree: this.props.tree
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            tree: nextProps.tree,
            courses: nextProps.courses.map(id => id),
            filter: nextProps.filter,
            hide: nextProps.hide
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
        let rows;
        if (this.state.tree) {
            rows = _(this.state.courses)
                .map(this.props.createItem)
                .value();
        } else {
            rows = _(this.state.courses)
                .filter((course) => CourseCtrl.hasNeedle(course.id, this.state.filter))
                .orderBy(['name', 'courseName'], ['asc', 'asc'])
                .map(this.props.createItem)
                .value();
        }

        if (this.state.filter.length > 0 && rows.length === 0) {
            return <span style={style.root} className='empty'>
                No matching course found
            </span>;
        } else if (rows.length > 0) {
            return <List style={style.root}>{rows}</List>;
        }
        return <span style={style.root} className='empty'>
            {(this.state.isOver) ? 'Drop here' : this.props.onEmpty}
        </span>;
    }
});
