import React, {PropTypes} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import DebounceInput from 'react-debounce-input';
import TrackSelection from './TrackSelection';
export default React.createClass({
    propTypes: {
        setFilter: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            searching: false,
            showSettings: false
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
    openSettings() {
        this.setState({
            showSettings: true
        });
    },
    closeSettings(){
        this.setState({
            showSettings: false
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
        const searchTooltip = <Tooltip id="show-search">Search</Tooltip>;
        const search = <OverlayTrigger placement="bottom" overlay={searchTooltip}>
            <i className='fa fa-search fa-lg' onClick={this.toggleSearch}/>
        </OverlayTrigger>;
        const settingsTooltip = <Tooltip id="show-settings">Change track</Tooltip>;
        const setting = <OverlayTrigger placement="bottom" overlay={settingsTooltip}>
            <i className='fa fa-cog fa-lg' onClick={this.openSettings}/>
        </OverlayTrigger>;
        return <div className='pull-right'>{search}{setting}</div>;
    },
    render(){
        return <div className='panel-heading'>
            <h3 className="panel-title">EWI \ Msc Computer Science{this.renderControl()}<br/>
            Track Software Technology</h3>
            {this.renderSearch()}
            <TrackSelection show={this.state.showSettings} closeModal={this.closeSettings}/>
        </div>;
    }
});
