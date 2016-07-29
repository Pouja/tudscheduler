import React, {PropTypes} from 'react';
import CourseDnD from './CourseDnD.js';
import _ from 'lodash';
import classnames from 'classnames';
import EventServer from '../../models/EventServer.js';
import CourseCtrl from '../../models/CourseCtrl.js';

/**
 * Renders the isp panel body.
 */
export
default React.createClass({
    propTypes:{
        isOver: PropTypes.bool.isRequired,
        filter: PropTypes.string.isRequired,
        options: PropTypes.object.isRequired,
        className: PropTypes.string,
        category: PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            collapsed: false,
            isOver: false,
            filter: null
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            isOver: nextProps.isOver,
            filter: nextProps.filter
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
        EventServer.on('isp.field.added::' + id, () => this.forceUpdate(), id + 'body');
        EventServer.on('isp.field.removed::' + id, () => this.forceUpdate(), id + 'body');
    },
    render() {
        const category = this.props.category;
        const classes = classnames(this.props.className, 'panel-body');
        const rows = _(category.courses)
            .map(CourseCtrl.get)
            .orderBy('name')
            .filter((child) => CourseCtrl.hasNeedle(child, this.state.filter))
            .map(function(child) {
                return <CourseDnD key={child.id} field={category.id} course={child}/>;
            })
            .value();
        if(this.state.filter && rows.length === 0){
            return <span className={classnames(classes, 'empty')}>
                No matching course found
            </span>;
        } else if(rows.length > 0) {
            return <div className={classes}>{rows}</div>;
        }
        return <span className={classnames(classes, 'empty')}>
            {(this.state.isOver) ? this.props.options.onHover : this.props.options.onEmpty}
        </span>;
    }
});
