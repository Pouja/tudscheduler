import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import EventServer from '../../models/EventServer.js';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import IconButton from 'material-ui/IconButton';
import ToolbarErrors from './ToolbarErrors.js';
import Storage from '../../models/Storage.js';

/**
 * Renders the header of an CategoryPanel
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
            searchValue: '',
            errors: Storage.getWarnings('category', this.props.category.catId),
            id: `CategoryPanelHeader::${this.props.category.catId}::${_.uniqueId()}`
        };
    },
    componentWillMount() {
        EventServer.on(`category::warning::${this.props.category.catId}`,
            (errors) =>this.setState({
                errors: errors
            }), this.state.id);
    },
    componentWillUnmount() {
        EventServer.remove(`category::warning::${this.props.category.catId}`, this.state.id);
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
        EventServer.emit(`category::searching::${this.props.category.catId}`, value);
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
        const style = {
            display: this.state.collapsed ? 'none' : 'flex'
        };
        return <ToolbarGroup style={style}>
            <TextField hintText="Search through the courses" fullWidth={true}
                onChange={_.debounce(this.onChange, 200)}/>
        </ToolbarGroup>;
    },
    renderErrors() {
        if(this.state.errors.length === 0 || this.state.collapsed) {
            return null;
        }
        return <ToolbarErrors errors={this.state.errors}/>;
    },
    renderTitle(){
        return this.props.category.name;
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
                    <ToolbarTitle text={this.renderTitle()}/>
                </ToolbarGroup>
                {this.renderCollapse()}
            </ToolbarGroup>
            {this.renderErrors()}
            {this.renderSearch()}
        </Toolbar>;
    }
});
