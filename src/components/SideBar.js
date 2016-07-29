import React, {
    PropTypes
}
from 'react';
import {
    ListGroup
}
from 'react-bootstrap';
import CourseCtrl from '../models/CourseCtrl.js';
import EventServer from '../models/EventServer.js';
import CourseTree from './CourseTree.js';
import SearchInput from './SearchInput.js';
import _ from 'lodash';

export
default React.createClass({
    propTypes: {
        className: PropTypes.string
    },
    getInitialState() {
        return {
            search: '',
            tree: []
        };
    },
    componentDidMount() {
        EventServer.on('courses.loaded', ()=> this.setState({
            tree: CourseCtrl.flatten(null, null, 'nr')
        }));
    },
    setSearch(nextSearch) {
        this.setState({
            search: nextSearch
        });
    },
    render() {
        var courses = this.state.tree;
        var search = this.state.search.toLowerCase();
        if (search.length > 0) {
            courses = _(courses)
                .filter(function(course) {
                    return CourseCtrl.hasNeedle(search, course);
                })
                .uniqBy(function(course) {
                    return course.id;
                })
                .value();
        }
        const rows = courses
            .map(function(child) {
                const visible = child.parent === 1;
                return <CourseTree key={child.nr}
                    search={search}
                    visible={visible}
                    course={child}/>;
            });
        const classes = [this.props.className, 'sidebar'].join(' ');
        return <div className={classes}>
                    <ListGroup>
                        <SearchInput setSearch={this.setSearch}/>
                        {rows}
                    </ListGroup></div>;
    }
});
