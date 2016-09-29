import React, {PropTypes} from 'react';
import CategoryPanelBody from './CategoryPanelBody.js';
import CategoryPanelHeader from './CategoryPanelHeader.js';
import DropPanel from '../dnd/DropPanel';

export
default React.createClass({
    propTypes:{
        category: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired,
        style: PropTypes.object,
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
    render() {
        return <DropPanel id={this.props.category.catId} className={this.props.className} style={this.props.style}>
            <CategoryPanelHeader
            category={this.props.category}
            options={this.props.options}
            toggleView={this.toggleView}/>
            <CategoryPanelBody collapse={this.state.collapsed}
                category={this.props.category}
                isOver={this.state.isOver}
                options={this.props.options}/>
        </DropPanel>;
    }
});
