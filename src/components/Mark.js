import React from 'react';
import {green500} from 'material-ui/styles/colors';

/**
 * Creates a green dot
 * @example
 * <Mark></Mark>
 */
export default React.createClass({
    propTypes: {
        display: React.PropTypes.bool
    },
    render() {
        const style = {
            root: {
                height: 24,
                width: 24,
                display: this.props.display ? 'inline-flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center'
            },
            inner: {
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: green500
            }
        };
        return <div style={style.root}><div style={style.inner}></div></div>;
    }
});
