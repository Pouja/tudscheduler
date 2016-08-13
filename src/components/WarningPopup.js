import React, {PropTypes} from 'react';
import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import {yellow500, red500} from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';

/**
 * Can be used to display warnings.
 * It renders the ReportProblem google icon as a menu where each menu item is a warning.
 * You can override the styles of the menu, icon and warnings
 * @example
 * <WarningPopup warnings={['first warning', 'another warning']} style={overrideMyStyle}/>
 */

const WarningPopup = React.createClass({
    propTypes: {
        warnings: PropTypes.array.isRequired,
        style: PropTypes.shape({
            root: PropTypes.object,
            icon: PropTypes.object,
            warning: PropTypes.object
        })
    },
    getInitialState(){
        return {
            warnings: []
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            warnings: nextProps.warnings
        });
    },
    render(){
        const overrideStyle = this.props.style || {
            root: {},
            icon: {},
            warning: {}
        };
        const style = {
            root: Object.assign({
                display: this.state.warnings.length ? '' : 'none'
            }, overrideStyle.root),
            icon: Object.assign({
                color: yellow500
            }, overrideStyle.icon),
            warning: Object.assign({
                display: 'block',
                color: red500,
                padding: 10
            }, overrideStyle.warning)
        };
        return <IconMenu
            onTouchTap={(event) => event.stopPropagation()}
            useLayerForClickAway={true}
            style={style.root}
            autoWidth={true}
            iconButtonElement={<IconButton iconStyle={style.icon}><ReportProblem/></IconButton>}>
            {this.state.warnings.map((warning, idx) => <span key={idx} style={style.warning}>
                {warning}</span>)}
        </IconMenu>;
    }
});

export default WarningPopup;
