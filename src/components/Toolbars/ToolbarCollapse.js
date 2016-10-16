import React, {Component, PropTypes} from 'react';
import {ToolbarGroup} from 'material-ui/Toolbar';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import IconButton from 'material-ui/IconButton';

/**
 * Renders a button to minimize and maximize a panel.
 * @example
 * <Panel hide={this.state.collapsed}>
 *  <Toolbar>
 *   <ToolbarCollapse collapsed={this.state.collapsed} toggleView={this.toggleView}/>
 *  </Toolbar>
 * <Panel>
 */
export default class ToolbarCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: props.collapsed
        };
    }
    static propTypes = {
        collapsed: PropTypes.bool.isRequired,
        toggleView: PropTypes.func.isRequired
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            collapsed: nextProps.collapsed
        });
    }
    render() {
        let collapse;
        if(this.state.collapsed) {
            collapse = <IconButton onTouchTap={this.props.toggleView}
                tooltip="Show courses"
                tooltipPosition="bottom">
                <ExpandMore/>
            </IconButton>;
        } else {
            collapse = <IconButton onTouchTap={this.props.toggleView}
                tooltip="Hide courses"
                tooltipPosition="bottom">
                <ExpandLess/>
            </IconButton>;
        }
        return <ToolbarGroup>{collapse}</ToolbarGroup>;
    }
}
