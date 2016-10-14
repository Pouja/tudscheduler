import EventServer from './EventServer.js';
import request from 'superagent';
import CategoryCtrl from './CategoryCtrl.js';
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
}, {
    key: 'trackId',
    value: 'track'
}];

const Storage = {
    /**
     * Saves the current state of the categories.
     * This should be called explicitly and it should not save an illegal state.
     * As in, make sure the state is legal and then call this function.
     * @return {Promise} empty resolve if the post succeeeds otherwise a reject with the error object.
     */
    save() {
        const trackId = FacultyCtrl.selectedTrack().trackId;
        return new Promise(function(resolve, reject) {
            request
                .post(`http://localhost:8000/categories/${trackId}`)
                .send(CategoryCtrl.categories)
                .accept('application/json')
                .then(function(response) {
                    Storage.errors = {};
                    response.body.forEach(Storage.emitError);
                    resolve();
                }, function(errors){
                    console.error(errors);
                    reject(errors);
                });
            });
    },
    getWarnings(type, id) {
        if (Storage.errors[type] && Storage.errors[type][id]) {
            return Storage.errors[type][id];
        }
        return [];
    },
    errors: {},
    /**
     * Called by Storage.save.
     * It emits the errors returned by POST /categories/:trackId
     * @param  {Array} err A array of key, value pairs. Where key is one of `errorMapping` and value is an array of what is wrong with it.
     */
    emitError(err) {
        const type = _.find(errorMapping, function(mapping) {
            return Object.keys(err).indexOf(mapping.key) !== -1;
        });
        if(type === undefined) {
            throw new Error(`An unknown type error was given with ${JSON.stringify(err)}.`);
        }
        if (!Storage.errors[type.value]) {
            Storage.errors[type.value] = {};
        }
        Storage.errors[type.value][err[type.key]] = err.errors;
        EventServer.emit(`${type.value}::warning::${err[type.key]}`, err.errors);
    }
};
export
default Storage;
