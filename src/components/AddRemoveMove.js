import React, {PropTypes} from 'react';
import CourseCtrl from '../models/CourseCtrl.js';
import IconButton from 'material-ui/IconButton';
// import CourseModal from './CourseModal.js';
import {grey400} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import ISPCtrl from '../models/ISPCtrl.js';

/**
 * Renders the add/remove and info button for a course.
 */

export default React.createClass({
    propTypes:{
        style: PropTypes.object,
        course: PropTypes.object.isRequired,
        move: PropTypes.bool,
        category: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    },
    getInitialState(){
        return {
            showModal: false
        };
    },
    openModal(){
        this.setState({
            showModal: true
        });
    },
    closeModal(){
        this.setState({
            showModal: false
        });
    },
    renderMoveItem(category, idx) {
        return <MenuItem key={idx}
            primaryText={category.name}
            onTouchTap={() => ISPCtrl.move(this.props.course, this.props.category,
                category.catId)}
            />;
    },
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
        const course = this.props.course;
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

        // const modal = (this.state.showModal) ? <CourseModal show={this.state.showModal} closeModal={()=>this.closeModal()} course={course}/> : null;

        const menuItemRemove = <MenuItem style={style.menuItem}
            onTouchTap={() => CourseCtrl.remove(course)}>
            {CourseCtrl.isAGroup(course) ? 'Remove all' : 'Remove'}</MenuItem>;
        const menuItemAdd = <MenuItem style={style.menuItem}
            onTouchTap={() => CourseCtrl.add(course)}>
            {CourseCtrl.isAGroup(course) ? 'Add all' : 'Add'}</MenuItem>;

        return <IconMenu
            onTouchTap={(event) => event.stopPropagation()}
            useLayerForClickAway={true}
            style={style.root}
            iconButtonElement={iconButtonElement}>
            <MenuItem style={style.menuItem} onTouchTap={this.openModal}>Info</MenuItem>
            {CourseCtrl.isAdded(course) ? menuItemRemove : menuItemAdd}
            {this.props.move ? this.renderMoveMenu() : null}
        </IconMenu>;
    }
});
