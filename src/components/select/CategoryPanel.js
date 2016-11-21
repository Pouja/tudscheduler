import React, {PropTypes} from 'react';
import CategoryPanelBody from './CategoryPanelBody.js';
import CategoryPanelHeader from './CategoryPanelHeader.js';
import DropPanel from '../dnd/DropPanel';

/**
 * The main panel of a category.
 * Renders the header and the body.
 * The options let you specify if in the header the search bar should be rendere or not.
 * And which text should be displayed when empty.
 *
 * @example
 * <Category category={categoryId} options={catOptions}/>
 */
export
default React.createClass({
    propTypes:{
        category: PropTypes.object.isRequired,
        options: PropTypes.object.isRequired,
        // Lets you override the root style
        style: PropTypes.object,
        // All classnames passed will be added
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
        return <DropPanel
                id={this.props.category.catId}
                sort="category"
                className={this.props.className}
                style={this.props.style}>
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
