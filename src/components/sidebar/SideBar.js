import React, {PropTypes} from 'react';
import SideBarHeader from './SideBarHeader.js';
import SideBarBody from './SideBarBody.js';
import DropPanel from '../dnd/DropPanel';

export
default React.createClass({
    propTypes: {
        className: PropTypes.string
    },
    getInitialState() {
        return {
            collapsed: false
        };
    },
    /**
     * Toggles if the panel body should be shown or not
     * @param  {Bool} nextState Value to be set
     */
    toggleView(nextState) {
        this.setState({
            collapsed: nextState
        });
    },
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.filtering !== nextState.filtering ||
            this.state.collapsed !== nextState.collapsed;
    },
    render() {
        return <DropPanel id='sidebar' className='sidebar'>
            <SideBarHeader toggleView={this.toggleView}/>
            <SideBarBody hide={this.state.collapsed}/>
        </DropPanel>;
    }
});
