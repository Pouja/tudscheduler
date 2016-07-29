import React, {PropTypes} from 'react';
import DebounceInput from 'react-debounce-input';
import classnames from 'classnames';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import EventServer from '../../models/EventServer.js';
import _ from 'lodash';

/**
 * Renders the header of an ISPPanel
 */
export
default React.createClass({
    propTypes: {
        category: PropTypes.object.isRequired,
        toggleView: PropTypes.func.isRequired,
        className: PropTypes.string,
        setSearch: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            collapsed: false,
            showRules: false,
            search: false,
            searchValue: ''
        };
    },
    componentDidMount() {
        this.startListening();
    },
    /**
     * Starts listening to events for the given isp field.
     */
    startListening() {
        const id = this.props.category.id;
        EventServer.on('isp.field.error::' + id, () => this.forceUpdate(), id + 'header');
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
    /**
     * Toggles the visibility of the rules.
     */
    toggleSearch() {
        const search = !this.state.search;
        this.setState({
            search: !this.state.search
        }, () => {
            if (!search) {
                this.props.setSearch('');
            }
        });
    },
    /**
     * Called when the DebounceInput changes.
     * Sets the new search value.
     * @param  {Object} event The event object of the change event.
     */
    onChange(event) {
        this.props.setSearch(event.target.value);
    },
    /**
     * Renders the rules of an isp field.
     * @return {React} A react component
     */
    renderRules() {
        if (this.state.collapsed || !this.state.showRules) {
            return null;
        }
        const rules = this.props.category.infoMessages().map(function(line, index) {
            const classes = classnames({
                'text-danger': line.error,
                'text-success': !line.error
            });
            return <span key={index} className="col-xs-12 option">{line.info}
                <span className={classes}> {line.selected}</span>
            </span>;
        });
        return [<hr key={1}/>, <div className='row' key={2}>{rules}</div>];
    },
    /**
     * Renders the control buttons for an isp panel
     * @return {React} A react component
     */
    renderControl() {
        var overlayRules = null;
        var overlayMM = null;
        var search = null;

        if (this.state.collapsed) {
            const tooltip = <Tooltip id="show-all">Maximize</Tooltip>;
            overlayMM = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-plus-square-o fa-lg' onClick={this.toggleView}/>
            </OverlayTrigger>;
        } else {
            const tooltip = <Tooltip id="hide-all">Minimize</Tooltip>;
            overlayMM = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-minus-square-o fa-lg' onClick={this.toggleView}/>
            </OverlayTrigger>;
        }

        if (this.props.options.search) {
            const tooltip = <Tooltip id="show-search">Search</Tooltip>;
            search = <OverlayTrigger placement="top" overlay={tooltip}>
                <i className='fa fa-search fa-lg' onClick={this.toggleSearch}/>
            </OverlayTrigger>;
        }

        return <span className='pull-right'>{search}{overlayRules}{overlayMM}</span>;
    },
    /**
     * Renders the search input
     * @return {React} A react component
     */
    renderSearch() {
        if (this.state.search) {
            return <div><hr/>
            <DebounceInput
                    debounceTimeout={200}
                    type='text'
                    className='form-control'
                    placeholder='search on code or name'
                    onChange={this.onChange}/>
            </div>;
        }
        return null;
    },
    render() {
        const header = this.props.category.name;
        return <div className={classnames(this.props.className, 'panel-heading')}>
            <h3 className='panel-title'>{header}{this.renderControl()}</h3>
            {this.renderRules()}{this.renderSearch()}</div>;
    }
});
