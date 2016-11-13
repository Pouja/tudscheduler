import React, {PropTypes} from 'react';
import {grey400} from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';
import YearCtrl from '../../models/YearCtrl';
import EventServer from '../../models/EventServer';

const modes = [{
    state: 'showAll',
    text: 'Show all',
    id: 0
}, {
    state: 'onlyFinished',
    text: 'Show only completed courses',
    id: 1
}, {
    state: 'onlyNotFinished',
    text: 'Show only uncompleted courses',
    id: 2
}];

export default React.createClass({
    propTypes: {
        style: PropTypes.object
    },
    getInitialState() {
        return Object.assign({
            id: `YearSettings::${_.uniqueId()}`
        }, _(modes).map('state').zipObject([true]).value());
    },
    componentWillMount() {
        EventServer.on('years::mode', (modeId) => this.updateMode(modeId), this.state.id);
    },
    componentWillUnmount() {
        EventServer.remove('years::mode', this.state.id);
    },
    changeMode(mode) {
        YearCtrl.changeMode(mode.id);
    },
    updateMode(modeId) {
        const states = _.map(modes, 'state');
        const values = _.map(modes, (_mode) => _mode.id === modeId);
        this.setState(_.zipObject(states, values));
    },
    createMenuItem(mode, idx) {
        const style ={
            cursor: 'pointer'
        };
        return <MenuItem
            key={idx}
            style={style}
            disabled={this.state[mode.state]}
            onTouchTap={() => this.changeMode(mode)}>{mode.text}</MenuItem>;
    },
    render() {
        const style = Object.assign({}, this.props.style);
        const iconButtonElement = (
            <IconButton touch={true}>
                <ActionSettings color={grey400} />
            </IconButton>
        );
        return <IconMenu
            onTouchTap={(event) => event.stopPropagation()}
            style={style}
            iconButtonElement={iconButtonElement}>
            {modes.map(this.createMenuItem)}
            </IconMenu>;
    }
});
