import React, {PropTypes} from 'react';
import {grey500} from 'material-ui/styles/colors';
export default React.createClass({
    propTypes: {
        style: PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },
    render(){
        const style = Object.assign({
            backgroundColor: grey500,
            fontSize: '12px',
            borderRadius: '0.25em',
            display: 'inline-block',
            padding: '3px 7px',
            fontWeight: 'bold',
            color: '#fff',
            lineHeight: 1,
            verticalAlign: 'middle',
            whiteSpace: 'nowrap',
            textAlign: 'center'
        }, this.props.style);
        return <div style={style}>{this.props.children}</div>;
    }
});
