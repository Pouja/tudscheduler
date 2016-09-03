import _ from 'lodash';
import EventServer from '../models/EventServer.js';
import CourseCtrl from './CourseCtrl.js';
import request from 'superagent';
import FacultyCtrl from './FacultyCtrl.js';
import Storage from './Storage.js';
const id = 'ISPCtrl';

/**
 * The ISP controller.
 * When changing an category it should be done through this class.
 * Since this class emits the events when a change happends in any category.
 * It also listens to the changes regarding adding/removing a course and reset/load events.
 * @type {Object}
 */
const ISPCtrl = {
    unlisted: {},
    categories: [],
    /**
     * Returns a Category
     * @param  {String|Number} catId The category identifier.
     * @return {Object}         A category
     */
    get(catId) {
        return ISPCtrl.categories.find(function(category) {
            return category.catId === catId;
        });
    },
    fetch() {
        const trackId = FacultyCtrl.selectedTrack().trackId;
        return new Promise(function(resolve, reject) {
            request.get(`http://localhost:8000/categories/${trackId}`)
                .accept('application/json')
                .then(function(response) {
                    resolve(response.body);
                }, reject);
        });
    },
    /**
     * Should be called when ISPCtrl is being used for the first time.
     */
    init() {
        ISPCtrl.fetch().then(function(categories) {
            // reset the listening
            ISPCtrl.stopListening();
            ISPCtrl.categories = categories;

            // Set the unlisted 'special' category
            ISPCtrl.unlisted = categories.find(category => category.catId === 'unlisted');

            // Merge the added courses with the unlisted courses
            ISPCtrl.unlisted.courses = _.union(ISPCtrl.unlisted.courses,
                CourseCtrl.added.map(course => course.id));

            // Add the courses in all the categories to coursectrl.added
            CourseCtrl.addMultiple(_(ISPCtrl.categories)
                .map('courses')
                .flatten()
                .map(CourseCtrl.get)
                .value());

            // (re)start listening
            ISPCtrl.startListening();
            EventServer.emit('categories::loaded');
            Storage.save();
        });
    },
    /**
     * Called when a course is selected by an user.
     * Adds all the courses which are not currently in the selection to the unlisted category.
     */
    updateAdded() {
        ISPCtrl.unlisted.courses = _(CourseCtrl.added)
            .filter(function(courseId) {
                return !ISPCtrl.categories.some(function(category) {
                    return category.courses.indexOf(courseId) !== -1;
                });
            })
            .union(ISPCtrl.unlisted.courses)
            .value();
        Storage.save();
        EventServer.emit('category::added::unlisted');
    },
    /**
     * Called when an user removes a course from the selection.
     * Removes the course in the category which currently holds it.
     */
    updateRemoved() {
        const allCourses = CourseCtrl.added;
        ISPCtrl.categories.forEach(function(category) {
            const removeCourses = _.filter(category.courses, function(courseId) {
                return allCourses.indexOf(courseId) === -1;
            });
            if (removeCourses.length > 0) {
                category.courses = _.difference(category.courses, removeCourses);
                EventServer.emit(`category::removed::${category.catId}`);
            }
        });
        Storage.save();
    },
    /**
     * Called when reset event is emitted.
     * Resets all the categories.
     */
    reset() {
        ISPCtrl.categories.forEach(function(category) {
            category.reset();
            EventServer.emit(`category::added::${category.catId}`);
        });
    },
    stopListening() {
        EventServer.remove('course::added::*', id);
        EventServer.remove('course::removed::*', id);
    },
    startListening() {
        EventServer.on('course::added::*', ISPCtrl.updateAdded, id);
        EventServer.on('course::removed::*', ISPCtrl.updateRemoved, id);
    },
    /**
     * Moves a course from one category to another
     * @param  {String|Number} courseId  The course id
     * @param  {String} categoryIdFrom The category identifier from it is being moved.
     * @param  {String} categoryIdTo   The category to which is should be moved
     */
    move(courseId, categoryIdFrom, categoryIdTo) {
        const categoryFrom = (categoryIdFrom === 'unlisted') ? ISPCtrl.unlisted :
            _.find(ISPCtrl.categories, function(category) {
                return category.catId === categoryIdFrom;
            });
        const categoryTo = (categoryIdTo === 'unlisted') ? ISPCtrl.unlisted : _.find(ISPCtrl.categories, function(category) {
            return category.catId === categoryIdTo;
        });
        categoryTo.courses = _.union(categoryTo.courses, [courseId]);
        categoryFrom.courses = _.without(categoryFrom.courses, courseId);
        Storage.save();
        EventServer.emit(`category::added::${categoryIdTo}`, courseId);
        EventServer.emit(`category::removed::${categoryIdFrom}`, courseId);
    }
};
EventServer.on('courses::loaded', ISPCtrl.init, 'ISPCtrl');
export
default ISPCtrl;
