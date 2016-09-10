import React, {PropTypes} from 'react';
import CourseCtrl from '../models/CourseCtrl.js';
import IconButton from 'material-ui/IconButton';
import {grey400} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import CategoryCtrl from '../models/CategoryCtrl.js';
import DialogCtrl from '../models/DialogCtrl.js';
import _ from 'lodash';
import EventServer from '../models/EventServer.js';

/**
 * Renders the add/remove, info and move button for a course.
 * @example
 * <AddRemove courseId={courseId} style={styleToOverwrite}/>
 * This renders a add/remove/info
 *
 * <AddRemove courseId={courseId} style={styleToOverwrite} move={true} category={categoryId}/>
 * Renders add/remove/info/move
 *
 */

export default React.createClass({
    propTypes:{
        style: PropTypes.object,
        courseId: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]).isRequired,
        move: PropTypes.bool,
        category: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    },
    getInitialState() {
        return {
            added: CourseCtrl.isAdded(this.props.courseId),
            nonAdded: CourseCtrl.isNotAdded(this.props.courseId),
            id: _.uniqueId(`AddRemoveMove::${this.props.courseId}::${_.uniqueId()}`)
        };
    },
    shouldComponentUpdate(nextProps, nextState){
        return this.state.added !== nextState.added;
    },
    componentWillMount(){
        EventServer.on('course::added::*', this.updateAdded, this.state.id);
        EventServer.on('course::removed::*', this.updateAdded, this.state.id);
    },
    componentWillUnmount(){
        EventServer.remove('course::removed::*', this.state.id);
        EventServer.remove('course::added::*', this.state.id);
    },
    updateAdded(){
        this.setState({
            added: CourseCtrl.isAdded(this.props.courseId),
            nonAdded: CourseCtrl.isNotAdded(this.props.courseId)
        });
    },
    /**
     * Opens the course detail modal
     */
    openModal(){
        DialogCtrl.open('CourseModal', this.props.courseId);
    },
    /**
     * Renders one of the menuitem to move the given course to a the given category
     * @param  {Object} category One of CategoryCtrl.categories
     * @param  {Number} idx      The key nr to be set
     * @return {React.element}   A material-ui/MenuItem component
     */
    renderMoveItem(category, idx) {
        return <MenuItem key={idx}
            primaryText={category.name}
            onTouchTap={() => CategoryCtrl.move(this.props.courseId, this.props.category,
                category.catId)}
            />;
    },
    /**
     * Renders the menu to move an item
     * @return {Array} A material-ui/MenuItem and a divider
     */
    renderMoveMenu() {
        return [<Divider key={5}/>,
            <MenuItem
                key={7}
                primaryText="Move to"
                rightIcon={<ArrowDropRight />}
                menuItems={CategoryCtrl.categories
                    .filter(category => category.catId !== this.props.category)
                    .map(this.renderMoveItem)}
        />];
    },
    renderAddRemoveGroup(style) {
        const courseId = this.props.courseId;
        return [<MenuItem key={1} disabled={this.state.nonAdded} style={style.menuItem}
            onTouchTap={() => CourseCtrl.remove(courseId)}>Remove all</MenuItem>,
            <MenuItem key={2} disabled={this.state.added} style={style.menuItem}
            onTouchTap={() => CourseCtrl.add(courseId)}>Add all</MenuItem>];
    },
    renderAddRemoveCourse(style) {
        const courseId = this.props.courseId;
        if(this.state.added) {
            return <MenuItem style={style.menuItem}
            onTouchTap={() => CourseCtrl.remove(courseId)}>Remove</MenuItem>;
        }
        return <MenuItem style={style.menuItem}
            onTouchTap={() => CourseCtrl.add(courseId)}>Add</MenuItem>;
    },
    render(){
        const courseId = this.props.courseId;
        const style = {
            root: Object.assign({}, this.props.style),
            menuItem: {
                cursor: 'pointer'
            }
        };

        const iconButtonElement = (
            <IconButton
                touch={true}>
                <MoreVertIcon color={grey400} />
            </IconButton>
        );

        return <IconMenu
            onTouchTap={(event) => event.stopPropagation()}
            useLayerForClickAway={true}
            style={style.root}
            iconButtonElement={iconButtonElement}>
            <MenuItem style={style.menuItem} onTouchTap={this.openModal}>Info</MenuItem>
            {CourseCtrl.isAGroup(courseId) ? this.renderAddRemoveGroup(style) :
                this.renderAddRemoveCourse(style)}
            {this.props.move ? this.renderMoveMenu() : null}
        </IconMenu>;
    }
});
