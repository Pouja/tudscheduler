import request from 'superagent';
import EventServer from './EventServer.js';
import DialogCtrl from './DialogCtrl.js';
const FacultyCtrl = {
    faculties: [],
    init() {
        request.get('http://localhost:8000/masters')
            .accept('application/json')
            .then(function(response) {
                FacultyCtrl.faculties = response.body;
                if (FacultyCtrl.selectedTrack() === undefined) {
                    DialogCtrl.open('TrackSelection', true);
                } else {
                    EventServer.emit('masters::loaded');
                }
            });
    },
    selectedFaculty() {
        return FacultyCtrl.faculties.find(function(faculty) {
            return faculty.masters.find(function(master) {
                return master.tracks.some(track => track.selected);
            });
        });
    },
    selectedMaster() {
        let master;
        FacultyCtrl.faculties.forEach(function(faculty) {
            master = faculty.masters.find(function(master) {
                return master.tracks.some(track => track.selected);
            });
        });
        return master;
    },
    selectedTrack() {
        let track;
        FacultyCtrl.faculties.some(function(faculty) {
            return faculty.masters.some(function(master) {
                track = master.tracks.find(track => track.selected);
                return track;
            });
        });
        return track;
    }
};
FacultyCtrl.init();
export
default FacultyCtrl;
