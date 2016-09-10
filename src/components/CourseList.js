import React, {PropTypes} from 'react';
import CourseCtrl from '../models/CourseCtrl.js';
import _ from 'lodash';
import {List} from 'material-ui/List';
export default React.createClass({
    propTypes: {
        hide: PropTypes.bool.isRequired,
        courseIds: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string, PropTypes.number])).isRequired,
        filter: PropTypes.string.isRequired,
        createItem: PropTypes.func.isRequired,
        onEmpty: PropTypes.string.isRequired
    },
    getInitialState() {
        return {
            courseIds: this.props.courseIds,
            filter: this.props.filter,
            hide: this.props.hide
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            courseIds: nextProps.courseIds.map(id => id),
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
        const rows = _(this.state.courseIds)
            .filter((courseId) => CourseCtrl.hasNeedle(courseId, this.state.filter))
            .map(CourseCtrl.get)
            .orderBy(['name','courseName'],['asc','asc'])
            .map(this.props.createItem)
            .value();
        if(this.state.filter.length > 0 && rows.length === 0){
            return <span style={style.root} className='empty'>
                No matching course found
            </span>;
        } else if(rows.length > 0) {
            return <List style={style.root}>{rows}</List>;
        }
        return <span style={style.root} className='empty'>
            {(this.state.isOver) ? 'Drop here' : this.props.onEmpty}
        </span>;
    }
});
