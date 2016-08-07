import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import EventServer from '../../models/EventServer.js';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import IconButton from 'material-ui/IconButton';

/**
 * Renders the header of an ISPPanel
 */
export
default React.createClass({
    propTypes: {
        category: PropTypes.object.isRequired,
        toggleView: PropTypes.func.isRequired,
        className: PropTypes.string,
        options: PropTypes.object.isRequired,
        'options.search': PropTypes.bool
    },
    getInitialState() {
        return {
            collapsed: false,
            search: false,
            searchValue: ''
        };
    },
    /**
     * Toggles the panel body visibility
     */
    toggleView() {
        const collapsed = !this.state.collapsed;
        this.setState({
            collapsed: collapsed
        }, () => this.props.toggleView(collapsed));
    },
    onChange(event, value) {
        EventServer.emit(`${this.props.category.catId}.searching`, value);
    },
    renderCollapse() {
        let collapse;
        if(this.state.collapsed) {
            collapse = <IconButton onTouchTap={this.toggleView}
                tooltip="Show courses"
                tooltipPosition="top-left">
                <ExpandMore/>
            </IconButton>;
        } else {
            collapse = <IconButton onTouchTap={this.toggleView}
                tooltip="Hide courses"
                tooltipPosition="top-left">
                <ExpandLess/>
            </IconButton>;
        }
        return <ToolbarGroup>{collapse}</ToolbarGroup>;
    },
    renderSearch() {
        if(!this.props.options.search) {
            return null;
        }
        return <ToolbarGroup>
            <TextField hintText="Search through the courses" fullWidth={true}
                onChange={_.debounce(this.onChange, 200)}/>
        </ToolbarGroup>;
    },
    render() {
        const style = {
            root: {
                display: 'flex',
                flexDirection: 'column',
                height: 'auto'
            }
        };
        return <Toolbar style={style.root}>
            <ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarTitle text={this.props.category.name}/>
                </ToolbarGroup>
                    {this.renderCollapse()}
            </ToolbarGroup>
            {this.renderSearch()}
        </Toolbar>;
    }
});
