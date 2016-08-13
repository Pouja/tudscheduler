import React, {PropTypes} from 'react';
import CourseCtrl from '../models/CourseCtrl.js';
import IconButton from 'material-ui/IconButton';
import {grey400} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import ISPCtrl from '../models/ISPCtrl.js';
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
            id: _.uniqueId(`AddRemoveMove::${this.props.courseId}::${_.uniqueId()}`)
        };
    },
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    },
    componentWillMount(){
        EventServer.on('added', this.updateAdded, this.state.id);
        EventServer.on('removed', this.updateAdded, this.state.id);
    },
    componentWillUnmount(){
        EventServer.remove('removed', this.state.id);
        EventServer.remove('added', this.state.id);
    },
    updateAdded(){
        this.setState({
            added: CourseCtrl.isAdded(this.props.courseId)
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
     * @param  {Object} category One of ISPCtrl.categories
     * @param  {Number} idx      The key nr to be set
     * @return {React.element}   A material-ui/MenuItem component
     */
    renderMoveItem(category, idx) {
        return <MenuItem key={idx}
            primaryText={category.name}
            onTouchTap={() => ISPCtrl.move(this.props.courseId, this.props.category,
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
                menuItems={ISPCtrl.categories
                    .filter(category => category.catId !== this.props.category)
                    .map(this.renderMoveItem)}
        />];
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

        const menuItemRemove = <MenuItem style={style.menuItem}
            onTouchTap={() => CourseCtrl.remove(courseId)}>
            {CourseCtrl.isAGroup(courseId) ? 'Remove all' : 'Remove'}</MenuItem>;
        const menuItemAdd = <MenuItem style={style.menuItem}
            onTouchTap={() => CourseCtrl.add(courseId)}>
            {CourseCtrl.isAGroup(courseId) ? 'Add all' : 'Add'}</MenuItem>;

        return <IconMenu
            onTouchTap={(event) => event.stopPropagation()}
            useLayerForClickAway={true}
            style={style.root}
            iconButtonElement={iconButtonElement}>
            <MenuItem style={style.menuItem} onTouchTap={this.openModal}>Info</MenuItem>
            {CourseCtrl.isAdded(courseId) ? menuItemRemove : menuItemAdd}
            {this.props.move ? this.renderMoveMenu() : null}
        </IconMenu>;
    }
});
