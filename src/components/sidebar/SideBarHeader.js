import React, {PropTypes} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import DebounceInput from 'react-debounce-input';

export default React.createClass({
    propTypes: {
        setFilter: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            searching: false
        };
    },
    /**
     * Called when the DebounceInput changes.
     * Sets the new search value.
     * @param  {Object} event The event object of the change event.
     */
    onChange(event) {
        this.props.setFilter(event.target.value);
    },
    /**
     * Toggles the visibility of the rules.
     */
    toggleSearch() {
        const searching = !this.state.searching;
        this.setState({
            searching: !this.state.searching
        }, () => {
            if (!searching) {
                this.props.setFilter('');
            }
        });
    },
    /**
     * Renders the search input
     * @return {React} A react component
     */
    renderSearch() {
        if (this.state.searching) {
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
    renderControl(){
        const tooltip = <Tooltip id="show-search">Search</Tooltip>;
        return <OverlayTrigger placement="top" overlay={tooltip}>
            <i className='fa fa-search fa-lg pull-right' onClick={this.toggleSearch}/>
        </OverlayTrigger>;
    },
    render(){
        return <div className='panel-heading'>
            <h3 className="panel-title">EWI \ Msc Computer Science{this.renderControl()}<br/>
            Track Software Technology</h3>
            {this.renderSearch()}
        </div>;
    }
});
