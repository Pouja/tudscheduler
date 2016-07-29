import React, {PropTypes} from 'react';
import DebounceInput from 'react-debounce-input';
import classnames from 'classnames';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import EventServer from '../../models/EventServer.js';
import _ from 'lodash';
import CourseCtrl from '../../models/CourseCtrl';

/**
 * Checks if a given option field contains an error
 * @param  {Object}  mapping One of the optionMapping values
 * @param  {Object}  errors  The errors returned by ISPField::getErrors
 * @return {Boolean}         true iff the mapping attribute is present in the errors.
 */
let hasError = function hasError(mapping, errors) {
    return errors.indexOf(mapping.attribute) !== -1;
};

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
        EventServer.on('isp.field.added::' + id, () => this.forceUpdate(), id + 'header');
        EventServer.on('isp.field.removed::' + id, () => this.forceUpdate(), id + 'header');
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
    toggleRules() {
        this.setState({
            showRules: !this.state.showRules
        });
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
        const nextSearch = event.target.value;
        this.setState({
            searchValue: nextSearch
        }, this.props.setSearch(nextSearch));
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
     * TODO merge this into SearchInput.js
     * @return {React} A react component
     */
    renderSearch() {
        if (this.state.search) {
            return <div><hr/>
            <DebounceInput
                    minLength={2}
                    debounceTimeout={200}
                    type='text'
                    value={this.state.searchValue}
                    className='form-control'
                    placeholder='search on code or name, atleast 2 characters'
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
