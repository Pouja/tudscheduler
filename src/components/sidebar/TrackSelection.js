import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FacultyCtrl from '../../models/FacultyCtrl.js';
import EventServer from '../../models/EventServer.js';
import _ from 'lodash';

/**
 * The component which enables the user to select a faculty/master/track.
 */
export
default React.createClass({
    propTypes: {
        close: React.PropTypes.func.isRequired,
        show: React.PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            show: this.props.show,
            selectedFaculty: '',
            selectedMaster: '',
            selectedTrack: ''
        };
    },
    componentDidMount() {
        EventServer.on('masters.loaded', () => this.init());
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show
        });
    },
    init() {
        this.setState({
            selectedFaculty: FacultyCtrl.selectedFaculty().facultyid,
            selectedMaster: FacultyCtrl.selectedMaster().masterid,
            selectedTrack: FacultyCtrl.selectedTrack().trackid
        });
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
                value: faculty.facultyid,
                label: faculty.name
            };
        });
    },
    getMasters() {
        if(this.shouldDisable('master')) {
            return [];
        }
        return FacultyCtrl.faculties
            .find((faculty) => faculty.facultyid === this.state.selectedFaculty)
            .masters.map(function(master) {
                return {
                    value: master.masterid,
                    label: master.name
                };
            });
    },
    getTracks() {
        if (this.shouldDisable('track')) {
            return [];
        }
        return FacultyCtrl.faculties
            .find((faculty) => faculty.facultyid === this.state.selectedFaculty)
            .masters.find(master => master.masterid === this.state.selectedMaster)
            .tracks.map(function(track) {
                return {
                    value: track.trackid,
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
        this.props.close();
    },
    renderMenuItem(selection, key) {
        return <MenuItem key={key} value={selection.value} primaryText={selection.label}/>;
    },
    render() {
        const actions = [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.props.close}/>,
            <FlatButton label="Save" primary={true} onTouchTap={this.save}
                disabled={this.state.selectedTrack === ''}/>
        ];
        return <Dialog
            autoDetectWindowHeight={false}
            autoScrollBodyContent={false}
            title="Select track"
            actions={actions}
            open={this.state.show}
            onRequestClose={this.props.close}>
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
