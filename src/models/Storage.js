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
    /**
     * Saves the current state of the categories.
     * This should be called explicitly and it should not save an illegal state.
     * As in, make sure the state is legal and then call this function.
     */
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
    /**
     * Called by Storage.save.
     * It emits the errors returned by POST /categories/:trackId
     * @param  {Array} err A array of key, value pairs. Where key is one of `errorMapping` and value is an array of what is wrong with it.
     */
    emitError(err) {
        const type = _.find(errorMapping, function(mapping){
            return Object.keys(err).indexOf(mapping.key) !== -1;
        });
        EventServer.emit(`${type.value}::error::${err[type.key]}`, err.errors);
    }
};
export default Storage;
