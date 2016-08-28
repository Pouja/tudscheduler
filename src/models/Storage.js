import EventServer from './EventServer.js';
import request from 'superagent';
import ISPCtrl from './ISPCtrl.js';
import FacultyCtrl from './FacultyCtrl.js';
import _ from 'lodash';

const errorMapping = [{
    key: 'catId',
    value: 'category'
}, {
    key: 'courseId',
    value: 'course'
}, {
    key: 'masterId',
    value: 'master'
}];

const Storage = {
    init(){
        EventServer.on('category::removed::*', Storage.save, 'storage');
        EventServer.on('category::added::*', Storage.save, 'storage');
    },
    save() {
        const trackId = FacultyCtrl.selectedTrack().trackId;
        request
            .post(`http://localhost:8000/categories/${trackId}`)
            .send(ISPCtrl.categories)
            .accept('application/json')
            .then(function(response){
                response.body.forEach(Storage.emitError);
            }, console.error);
    },
    emitError(err) {
        const type = _.find(errorMapping, function(mapping){
            return Object.keys(err).indexOf(mapping.key) !== -1;
        });
        EventServer.emit(`${type.value}::error::${err[type.key]}`, err.errors);
    }
};
export default Storage;
