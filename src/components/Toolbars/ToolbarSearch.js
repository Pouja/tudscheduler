import React, {Component, PropTypes} from 'react';
import {ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import debounce from 'lodash/debounce';

/**
 * Renders a seach input to be rendered inside a Toolbar.
 * The onChange will be called debounced.
 * @example
 * <Toolbar>
 *  <ToolbarSearch placeholder="search me" onChange={this.onChangeInput}/>
 * <Toolbar>
 */
export default class ToolbarSearch extends Component {
    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.object
    }
    render() {
        return <ToolbarGroup style={this.props.style}>
            <TextField hintText={this.props.placeholder} fullWidth={true}
                onChange={debounce(this.props.onChange, 200)}/>
        </ToolbarGroup>;
    }
}
