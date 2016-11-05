import EventServer from './EventServer.js';
import request from 'superagent';
import CategoryCtrl from './CategoryCtrl.js';
import FacultyCtrl from './FacultyCtrl.js';
import YearCtrl from './YearCtrl';
import CourseCtrl from './CourseCtrl';
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

/**
 * Checks if the application is in a legal state befores it saves.
 * @return {boolean} true iff the number courses add equals to all the courses in the year planner
 * and in the categories.
 */
function invariant() {
    return CourseCtrl.added.length ===
        _.sumBy(YearCtrl.years, 'courses.length') &&
        CourseCtrl.added.length ===
        _.sumBy(CategoryCtrl.categories, 'courses.length');
}

const Storage = {
    fetchFaculties(){
        return request.get('http://localhost:8000/masters')
            .accept('application/json');
    },
    fetchCourses(){
        const masterId = FacultyCtrl.selectedMaster().masterId;
        return Promise.all([request.get(`http://localhost:8000/courseTree/${masterId}`)
            .accept('application/json'),
            request.get(`http://localhost:8000/courseData/${masterId}`)
            .accept('application/json')
        ]);
    },
    fetchCategories() {
        const trackId = FacultyCtrl.selectedTrack().trackId;
        return request.get(`http://localhost:8000/categories/${trackId}`)
                .accept('application/json');
    },
    init() {
        return new Promise((resolve, reject) => {
            Storage.fetchFaculties()
                .then(function(response) {
                    FacultyCtrl.init(response.body);
                    return Storage.fetchCourses();
                })
                .then(function(responses) {
                    CourseCtrl.init(responses[0].body, responses[1].body);
                    return Storage.fetchCategories();
                })
                .then(function(response) {
                    CategoryCtrl.init(response.body.categories);
                    YearCtrl.init(response.body.years);
                    return Storage.save();
                })
                .then(function(){
                    resolve();
                }, function(err) {
                    console.error(err);
                    reject(err);
                });
        });
    },
    /**
     * Saves the current state of the categories.
     * Only if the invariant holds!
     * This should be called explicitly and it should not save an illegal state.
     * As in, make sure the state is legal and then call this function.
     * @return {Promise} empty resolve if the post succeeeds otherwise a reject with the error object.
     */
    save() {
        if (!invariant()) {
            return new Promise((resolve) => resolve());
        }
        const trackId = FacultyCtrl.selectedTrack().trackId;
        return new Promise(function(resolve, reject) {
            request
                .post(`http://localhost:8000/categories/${trackId}`)
                .send({
                    categories: CategoryCtrl.categories,
                    years: YearCtrl.years
                })
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
