import React, {PropTypes} from 'react';
import {red500} from 'material-ui/styles/colors';
import {ToolbarGroup} from 'material-ui/Toolbar';

/**
 * Renders errors to be shown in a Toolbar
 * @example
 * <ToolbarErrors errors={['error1','another long error!!!']}/>
 */

export default React.createClass({
    propTypes: {
        errors: PropTypes.arrayOf(PropTypes.string).isRequired
    },
    getInitialState() {
        return {
            errors: this.props.errors.map(id => id)
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            errors: nextProps.errors.map(id => id)
        });
    },
    render() {
        const style = {
            root: {
                flexDirection: 'column',
                marginBottom: 5,
                display: 'flex'
            },
            line: {
                lineHeight: '1.5em',
                color: red500
            }
        };
        return <ToolbarGroup style={style.root}>
            {this.state.errors.map((err, idx) => <span key={idx}
                style={style.line}>{err}</span>)}
        </ToolbarGroup>;
    }
});
