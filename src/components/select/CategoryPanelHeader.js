import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import EventServer from '../../models/EventServer.js';
import ToolbarErrors from '../Toolbars/ToolbarErrors.js';
import Storage from '../../models/Storage.js';
import ToolbarSearch from '../Toolbars/ToolbarSearch';
import ToolbarCollapse from '../Toolbars/ToolbarCollapse';

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
    toggleView() {
        const collapsed = !this.state.collapsed;
        this.setState({
            collapsed: collapsed
        }, () => this.props.toggleView(collapsed));
    },
    onChange(event, value) {
        EventServer.emit(`category::searching::${this.props.category.catId}`, value);
    },
    renderSearch() {
        if(!this.props.options.search) {
            return null;
        }
        const style = {
            display: this.state.collapsed ? 'none' : 'flex'
        };
        return <ToolbarSearch
            placeholder="Search through the selected courses"
            style={style}
            onChange={this.onChange}/>;
    },
    renderErrors() {
        if(this.state.errors.length === 0 || this.state.collapsed) {
            return null;
        }
        return <ToolbarErrors errors={this.state.errors}/>;
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
                <ToolbarCollapse collapsed={this.state.collapsed}
                    toggleView={this.toggleView}/>
            </ToolbarGroup>
            {this.renderErrors()}
            {this.renderSearch()}
        </Toolbar>;
    }
});
