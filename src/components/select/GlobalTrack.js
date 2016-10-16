import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import React, {PropTypes} from 'react';
import FacultyCtrl from '../../models/FacultyCtrl.js';
import EventServer from '../../models/EventServer.js';
import Storage from '../../models/Storage.js';
import ToolbarErrors from '../Toolbars/ToolbarErrors.js';

/**
 * An unique component which will only be rendered one.
 * It shows the current selected track and the master/track errors that correspond with it.
 * @example
 * <GlobalTrack style={overridemystyle}/>
 */

export default React.createClass({
    propTypes: {
        style: PropTypes.object
    },
    getInitialState(){
        return {
            trackId: FacultyCtrl.selectedTrack().trackId,
            masterId: FacultyCtrl.selectedMaster().masterId,
            trackErrors: Storage.getWarnings('track', FacultyCtrl.selectedTrack().trackId),
            masterErrors: Storage.getWarnings('master', FacultyCtrl.selectedMaster().masterId),
            title: FacultyCtrl.selectedTrack().name
        };
    },
    componentDidMount(){
        EventServer.on('masters::loaded', this.updateTitle, 'GlobalTrack');
        this.startListening();
    },
    componentWillUnmount() {
        EventServer.remove('masters::loaded', 'GlobalTrack');
        this.stopListening();
    },
    startListening() {
        EventServer.on(`track::warning::${this.state.trackId}`,
            (errors) => this.updateErrors(errors,'track'), 'GlobalTrack');
        EventServer.on(`master::warning::${this.state.masterId}`,
            (errors) => this.updateErrors(errors,'master'), 'GlobalTrack');
    },
    stopListening() {
        EventServer.remove(`master::warning::${this.state.masterId}`, 'GlobalTrack');
        EventServer.remove(`track::warning::${this.state.trackId}`, 'GlobalTrack');
    },
    updateTitle() {
        this.stopListening();
        this.setState({
            title: FacultyCtrl.selectedTrack().name,
            trackId: FacultyCtrl.selectedTrack().trackId,
            masterId: FacultyCtrl.selectedMaster().masterId
        }, () => this.startListening());
    },
    updateErrors(errors, type) {
        this.setState({
            [`${type}Errors`]: errors.map(id => id)
        });
    },
    render() {
        const style = {
            root: {
                display: 'flex',
                flexDirection: 'column',
                height: 'auto'
            }
        };
        return <Paper style={this.props.style}><Toolbar style={style.root}>
            <ToolbarGroup>
                <ToolbarTitle text={this.state.title}/>
            </ToolbarGroup>
            <ToolbarErrors errors={this.state.masterErrors.concat(this.state.trackErrors)}/>
        </Toolbar>
        </Paper>;
    }
});
