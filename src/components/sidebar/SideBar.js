import React, {PropTypes} from 'react';
import SideBarHeader from './SideBarHeader.js';
import SideBarBody from './SideBarBody.js';

export
default React.createClass({
    propTypes: {
        className: PropTypes.string
    },
    getInitialState() {
        return {
            filter: ''
        };
    },
    setFilter(nextFilter) {
        this.setState({
            filter: nextFilter
        });
    },
    render() {
        return <div className={this.props.className + ' sidebar'}>
                <div className='panel panel-default'>
                    <SideBarHeader setFilter={this.setFilter}/>
                    <SideBarBody filter={this.state.filter}/>
                </div>
            </div>;
    }
});
