import React from 'react';
import {
    Modal, Button
}
from 'react-bootstrap';
import Select from 'react-select';
import FacultyCtrl from '../../models/FacultyCtrl.js';
import EventServer from '../../models/EventServer.js';
import _ from 'lodash';

/**
 * The component which enables the user to select a faculty/master/track.
 */
export
default React.createClass({
    propTypes: {
        closeModal: React.PropTypes.func.isRequired
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
    updateFaculty(newValue) {
        this.setState({
            selectedFaculty: newValue,
            selectedMaster: '',
            selectedTrack: ''
        });
    },
    updateMaster(newValue) {
        this.setState({
            selectedMaster: newValue,
            selectedTrack: ''
        });
    },
    updateTrack(newValue) {
        this.setState({
            selectedTrack: newValue
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
        this.props.closeModal();
    },
    render() {
        return <Modal show={this.state.show} onHide={this.props.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Change track</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select ref="stateSelect" autofocus options={this.order(this.getFaculties())}
                    simpleValue clearable={true} name="selected-state"
                    value={this.state.selectedFaculty}
                    onChange={this.updateFaculty}
                    placeholder='Select faculty'
                    searchable={true} />
                <Select ref="stateSelect" options={this.order(this.getMasters())}
                    simpleValue clearable={true} name="selected-state"
                    value={this.state.selectedMaster}
                    onChange={this.updateMaster}
                    disabled={this.shouldDisable('master')}
                    placeholder='Select education type'
                    searchable={true} />
                <Select ref="stateSelect" options={this.order(this.getTracks())}
                    simpleValue clearable={true} name="selected-state"
                    value={this.state.selectedTrack}
                    onChange={this.updateTrack}
                    disabled={this.shouldDisable('track')}
                    placeholder='Select track and year'
                    searchable={true} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.props.closeModal}>Cancel</Button>
                <Button bsStyle="primary" disabled={this.state.selectedTrack === ''}
                    onClick={this.save}>Save</Button>
            </Modal.Footer>
        </Modal>;
    }
});
