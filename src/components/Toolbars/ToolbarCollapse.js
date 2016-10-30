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
        collapsed: PropTypes.bool,
        toggleView: PropTypes.func.isRequired
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            collapsed: nextProps.collapsed
        });
    }
    toggle() {
        this.setState({
            collapsed: !this.state.collapsed
        }, () => this.props.toggleView(this.state.collapsed));
    }
    render() {
        let collapse;
        if(this.state.collapsed) {
            collapse = <IconButton onTouchTap={() => this.toggle()}
                tooltip="Show courses"
                tooltipPosition="bottom-center">
                <ExpandMore/>
            </IconButton>;
        } else {
            collapse = <IconButton onTouchTap={() => this.toggle()}
                tooltip="Hide courses"
                tooltipPosition="bottom-center">
                <ExpandLess/>
            </IconButton>;
        }
        return <ToolbarGroup>{collapse}</ToolbarGroup>;
    }
}
