import React, {PropTypes} from 'react';
import CourseDnD from './CourseDnD.js';
import classnames from 'classnames';
import ISPPanelBody from './ISPPanelBody.js';
import ISPPanelHeader from './ISPPanelHeader.js';

export
default React.createClass({
    propTypes:{
        category: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            collapsed: false,
            searchValue: '',
            isOver: false
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            isOver: nextProps.isOver
        });
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
    /**
     * Sets the search Value
     * @param {String} searchValue The search value
     */
    setSearch(searchValue){
        this.setState({
            searchValue: searchValue
        });
    },
    render() {
        const category = this.props.category;
        const bodyClasses = classnames({'hide':this.state.collapsed});
        const header = <ISPPanelHeader
            category={this.props.category}
            options={this.props.options}
            setSearch={this.setSearch}
            toggleView={this.toggleView}/>;
        return <div className='panel panel-default'>
            {header}
            <ISPPanelBody className={bodyClasses}
                category={this.props.category}
                isOver={this.state.isOver}
                options={this.props.options}
                filter={this.state.searchValue}/>
        </div>;
    }
});
