import _ from 'lodash';
import EventServer from '../models/EventServer.js';
import CourseCtrl from './CourseCtrl.js';
import request from 'superagent';
import FacultyCtrl from './FacultyCtrl.js';
const id = 'ISPCtrl';

/**
 * The ISP controller.
 * When changing an category it should be done through this class.
 * Since this class emits the events when a change happends in any category.
 * It also listens to the changes regarding adding/removing a course and reset/load events.
 * @type {Object}
 */
var ISPCtrl = {
    unlisted: {},
    categories: [],
    /**
     * Returns a Category
     * @param  {String|Number} fieldId The category identifier.
     * @return {Object}         A category
     */
    get(fieldId) {
        return ISPCtrl.categories.find(function(field) {
            return field.id === fieldId;
        });
    },
    fetch() {
        return new Promise(function(resolve, reject) {
            request.get('http://localhost:8000/categories')
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
            ISPCtrl.categories = categories;
            ISPCtrl.unlisted = categories.find(category => category.id === 'unlisted');
            ISPCtrl.unlisted.courses = _.union(ISPCtrl.unlisted.courses,
                CourseCtrl.added.map(course => course.id));
            ISPCtrl.startListening();
            EventServer.emit('ispfields.loaded');
        });
    },
    /**
     * Called when a course is selected by an user.
     * Adds all the courses which are not currently in the selection to the unlisted category.
     */
    updateAdded() {
        ISPCtrl.unlisted.courses = _(CourseCtrl.added)
            .filter(function(course) {
                return !ISPCtrl.categories.some(function(ispCtrl) {
                    return _.find(ispCtrl.courses, {
                        id: course.id
                    });
                });
            })
            .map(course => course.id)
            .union(ISPCtrl.unlisted.courses)
            .value();
        EventServer.emit('isp.field.added::unlisted');
    },
    /**
     * Called when an user removes a course from the selection.
     * Removes the course in the category which currently holds it.
     */
    updateRemoved() {
        const allCourses = CourseCtrl.added;
        ISPCtrl.categories.forEach(function(field) {
            var removeCourses = _.filter(field.courses, function(courseId) {
                return !_.find(allCourses, {
                    id: courseId
                });
            });
            if (removeCourses.length > 0) {
                field.courses = _.pullAll(field.courses, removeCourses);
                EventServer.emit('isp.field.removed::' + field.id);
            }
        });
    },
    /**
     * Called when reset event is emitted.
     * Resets all the categories.
     */
    reset() {
        ISPCtrl.categories.forEach(function(field) {
            field.reset();
            EventServer.emit('isp.field.added::' + field.catid);
        });
    },
    stopListening() {
        EventServer.remove('added', id);
        EventServer.remove('removed', id);
        EventServer.remove('reset', id);
        EventServer.remove('loaded', id);
    },
    startListening() {
        EventServer.on('added', ISPCtrl.updateAdded, id);
        EventServer.on('removed', ISPCtrl.updateRemoved, id);
        EventServer.on('reset', ISPCtrl.reset, id);
        EventServer.on('loaded', () => {
            ISPCtrl.reset();
            ISPCtrl.updateAdded();
        }, id);
    },
    /**
     * Moves a course from one category to another
     * @param  {Object} course      The course object
     * @param  {String} categoryIdFrom The category identifier from it is being moved.
     * @param  {String} categoryIdTo   The category to which is should be moved
     */
    move(course, categoryIdFrom, categoryIdTo) {
        var categoryFrom = (categoryIdFrom === 'unlisted') ? ISPCtrl.unlisted :
            _.find(ISPCtrl.categories, function(field) {
                return field.id === categoryIdFrom;
            });
        var categoryTo = (categoryIdTo === 'unlisted') ? ISPCtrl.unlisted : _.find(ISPCtrl.categories, function(field) {
            return field.id === categoryIdTo;
        });
        categoryTo.courses = _.union(categoryTo.courses, [course.id]);
        EventServer.emit('isp.field.added::' + categoryIdTo, course.id);

        categoryFrom.courses = _.without(categoryFrom.courses, course.id);
        EventServer.emit('isp.field.removed::' + categoryIdFrom, course.id);
    }
};
EventServer.on('courses.loaded', ISPCtrl.init);
export
default ISPCtrl;
