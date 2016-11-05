const FacultyCtrl = {
    faculties: [],
    init(faculties) {
        FacultyCtrl.faculties = faculties;
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
export
default FacultyCtrl;
