import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FacultyCtrl from '../../models/FacultyCtrl.js';
import DialogCtrl from '../../models/DialogCtrl.js';
import _ from 'lodash';

/**
 * The component which enables the user to select a faculty/master/track.
 */
export
default React.createClass({
    getInitialState() {
        return {
            show: false,
            force: false,
            selectedFaculty: '',
            selectedMaster: '',
            selectedTrack: ''
        };
    },
    componentDidMount() {
        DialogCtrl.onOpen((force) => this.init(force), 'TrackSelection');
    },
    init(force) {
        if(force) {
            this.setState({
                show: true,
                force: true,
                selectedFaculty: FacultyCtrl.faculties[0].facultyId,
                selectedMaster: FacultyCtrl.faculties[0].masters[0].masterId,
                selectedTrack: FacultyCtrl.faculties[0].masters[0].tracks[0].trackId
            });
        } else {
            this.setState({
                show: true,
                force: false,
                selectedFaculty: FacultyCtrl.selectedFaculty().facultyId,
                selectedMaster: FacultyCtrl.selectedMaster().masterId,
                selectedTrack: FacultyCtrl.selectedTrack().trackId
            });
        }
    },
    updateFaculty(event, index, value) {
        this.setState({
            selectedFaculty: value,
            selectedMaster: '',
            selectedTrack: ''
        });
    },
    updateMaster(event, index, value) {
        this.setState({
            selectedMaster: value,
            selectedTrack: ''
        });
    },
    updateTrack(event, index, value) {
        this.setState({
            selectedTrack: value
        });
    },
    getFaculties() {
        return FacultyCtrl.faculties.map(function(faculty) {
            return {
                value: faculty.facultyId,
                label: faculty.name
            };
        });
    },
    getMasters() {
        if(this.shouldDisable('master')) {
            return [];
        }
        return FacultyCtrl.faculties
            .find((faculty) => faculty.facultyId === this.state.selectedFaculty)
            .masters.map(function(master) {
                return {
                    value: master.masterId,
                    label: master.name
                };
            });
    },
    getTracks() {
        if (this.shouldDisable('track')) {
            return [];
        }
        return FacultyCtrl.faculties
            .find((faculty) => faculty.facultyId === this.state.selectedFaculty)
            .masters.find(master => master.masterId === this.state.selectedMaster)
            .tracks.map(function(track) {
                return {
                    value: track.trackId,
                    label: `${track.year} - ${track.name}`
                };
            });
    },
    order(options) {
        return _.orderBy(options, 'label');
    },
    shouldDisable(type) {
        if (type === 'master') {
            return this.state.selectedFaculty === '';
        } else if (type === 'track') {
            return this.state.selectedMaster === '';
        }
        return true;
    },
    save(){
        FacultyCtrl.selectTrack(this.state.selectedTrack);
        this.close();
    },
    close() {
        this.setState({
            show: false
        });
    },
    renderMenuItem(selection, key) {
        return <MenuItem key={key} value={selection.value} primaryText={selection.label}/>;
    },
    render() {
        const actions = [
            <FlatButton label="Cancel" disabled={this.state.force}
                primary={true} onTouchTap={this.close}/>,
            <FlatButton label="Save" primary={true} onTouchTap={this.save}
                disabled={this.state.selectedTrack === ''}/>
        ];
        return <Dialog
            autoDetectWindowHeight={false}
            autoScrollBodyContent={false}
            title="Select track"
            actions={actions}
            modal={this.state.force}
            open={this.state.show}
            onRequestClose={this.close}>
                <SelectField value={this.state.selectedFaculty}
                    floatingLabelText="Select faculty"
                    fullWidth={true}
                    onChange={this.updateFaculty}>
                    {this.order(this.getFaculties()).map(this.renderMenuItem)}
                </SelectField>
                <SelectField value={this.state.selectedMaster}
                    floatingLabelText="Select education type"
                    fullWidth={true}
                    disabled={this.shouldDisable('master')}
                    onChange={this.updateMaster}>
                    {this.order(this.getMasters()).map(this.renderMenuItem)}
                </SelectField><SelectField value={this.state.selectedTrack}
                    floatingLabelText="Select track"
                    fullWidth={true}
                    disabled={this.shouldDisable('track')}
                    onChange={this.updateTrack}>
                    {this.order(this.getTracks()).map(this.renderMenuItem)}
                </SelectField>
        </Dialog>;
    }
});
