import CourseCtrl from '../../models/CourseCtrl.js';
import React, {PropTypes} from 'react';
import EventServer from '../../models/EventServer.js';
import AddRemoveMove from './../AddRemoveMove.js';
import {ListItem} from 'material-ui/List';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import Check from 'material-ui/svg-icons/navigation/check';
import {green500} from 'material-ui/styles/colors';
import Badge from '../Badge.js';
import _ from 'lodash';
/**
 * A list group item for in the sidebar.
 * Shows the course id, name, ects and optional control functions
 * It renders a chevron when filtering set to false and the course is a group.
 */
export default React.createClass({
    propTypes:{
        style: PropTypes.object,
        course: PropTypes.object.isRequired,
        visible: PropTypes.bool.isRequired,
        filtering: PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            ects: CourseCtrl.addedEcts(this.props.course),
            childVisible: false,
            isAdded: CourseCtrl.isAdded(this.props.course.id),
            filtering: this.props.filtering,
            filter: '',
            visible: this.props.visible
        };
    },
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    },
    componentWillUnmount(){
        this.stopListening();
    },
    componentWillReceiveProps(nextProps){
        if(nextProps.filtering || nextProps.visible) {
            this.startListening();
        } else {
            this.stopListening();
        }
        this.setState({
            filtering: nextProps.filtering,
            visible: nextProps.visible
        });
    },
    /**
     * Called by React when it is mounted in the DOM
     * Starts listening to events if it is visible.
     */
    componentDidMount() {
        if(this.props.visible || this.props.filtering){
            this.startListening();
        }

        EventServer.on(`visible::${this.props.course.parent}`, (toggle) => {
            let nextState = {
                visible: toggle
            };
            if (!toggle) {
                this.stopListening();
                EventServer.emit(`visible::${this.props.course.nr}`, toggle);
                nextState.childVisible = false;
            } else {
                this.startListening();
                this.update();
            }
            this.setState(nextState);
        }, this.getID());
    },
    /**
     * @return {String} The identifier of this component
     */
    getID() {
        const id = _.isNil(this.props.course.nr) ? this.props.course.id :
            this.props.course.nr;
        return `CourseTree::${id}`;
    },
    /**
     * Toggle the visibility of the children
     */
    toggle() {
        const nextVisibility = !this.state.childVisible;
        this.setState({
            childVisible: nextVisibility
        });
        EventServer.emit(`visible::${this.props.course.nr}`, nextVisibility);
    },
    /**
     * Start listening to events.
     */
    startListening() {
        EventServer.on('added', () => this.update(), this.getID());
        EventServer.on('removed', () => this.update(), this.getID());
    },
    /**
     * Stops listening to events. Should be called when it is not visible or
     * when it is removed from the dom.
     */
    stopListening() {
        EventServer.remove('added', this.getID());
        EventServer.remove('removed', this.getID());
    },
    /**
     * Called when the ects or isAdded should be updated
     */
    update() {
        this.setState({
            ects: CourseCtrl.addedEcts(this.props.course),
            isAdded: CourseCtrl.isAdded(this.props.course.id)
        });
    },
    /**
     * Renders the chevron
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderChevron() {
        if (this.state.filtering || !CourseCtrl.isAGroup(this.props.course.id)) {
            return null;
        }
        const style = {
            top: 3
        };
        return (this.state.childVisible) ? <ExpandLess style={style}/> :
            <ExpandMore style={style}/>;
    },
    /**
     * Renders the periods in which the course is being held.
     * @return {React}     A react component
     */
    renderQBadge(){
        const periods = CourseCtrl.get(this.props.course.id)['Education Period'];
        if(periods === undefined){
            return null;
        }
        return (<Badge>Q{periods}</Badge>);
    },
    /**
     * Renders the ects of the course.
     * If it is a parent node, it will list the ects selected from all its children compared to the total.
     * @param  {String|Number} key The key to identify the element.
     * @return {React}     A react component
     */
    renderECBadge() {
        const course = this.props.course;
        const totalEcts = CourseCtrl.totalEcts(course);
        const subEcts = this.state.ects;
        const style = {
            marginRight: 4
        };
        if (!CourseCtrl.isAGroup(course.id)) {
            return (<Badge style={style}>EC {totalEcts}</Badge>);
        }
        return (<Badge style={style}>EC {subEcts}/{totalEcts}</Badge>);
    },
    render() {
        if (!this.state.visible && !this.state.filtering) {
            return null;
        }
        const course = CourseCtrl.get(this.props.course.id);
        const style = {
            root: Object.assign({}, this.props.style, {
                marginLeft: 0
            }),
            innerDiv: {
                paddingTop: 6,
                paddingBottom: 6
            },
            AddRemoveMove: {
                top: 0
            },
            secondaryText: {
                height: 22
            },
            check:{
                display: this.state.isAdded ? 'inline-block' : 'none',
                position: 'absolute',
                right: 40,
                top: 11,
                color: green500
            }
        };
        if (!this.state.filtering && this.props.course.depth > 1) {
            style.root.marginLeft = (this.props.course.depth - 1) * 10 +
                (!CourseCtrl.isAGroup(course.id) * 45);
        }
        return <ListItem
            onTouchTap={this.toggle}
            primaryText={<span>{course.name} {course.courseName}
                {<Check style={style.check}/>}</span>}
            secondaryText={<div style={style.secondaryText}>
                {this.renderECBadge()}{this.renderQBadge()}
            </div>}
            leftIcon={this.renderChevron()}
            rightIconButton={<AddRemoveMove courseId={this.props.course.id} style={style.AddRemoveMove}/>}
            innerDivStyle={style.innerDiv}
            key={course.nr || course.id}
            style={style.root}/>;
    }
});

