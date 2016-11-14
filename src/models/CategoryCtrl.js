import _ from 'lodash';
import EventServer from '../models/EventServer.js';
import CourseCtrl from './CourseCtrl.js';
import Storage from './Storage.js';
const id = 'CategoryCtrl';

/**
 * The ISP controller.
 * When changing an category it should be done through this class.
 * Since this class emits the events when a change happends in any category.
 * It also listens to the changes regarding adding/removing a course and reset/load events.
 * @type {Object}
 */
const CategoryCtrl = {
    unlisted: {},
    categories: [],
    /**
     * Returns a Category
     * @param  {String|Number} catId The category identifier.
     * @return {Object}         A category
     */
    get(catId) {
        return CategoryCtrl.categories.find(function(category) {
            return category.catId === catId;
        });
    },
    /**
     * Should be called when CategoryCtrl is being used for the first time.
     * Initialises the categories. And adds all the courses which are given in
     * the categories in CourseCtrl.added.
     * @param {Array} categories The categories.
     */
    init(categories) {
        // reset the listening
        CategoryCtrl.stopListening();
        CategoryCtrl.categories = categories;

        // Set the unlisted 'special' category
        CategoryCtrl.unlisted = categories.find(category => category.catId === 'unlisted');

        // Merge the added courses with the unlisted courses
        CategoryCtrl.unlisted.courses = _.union(CategoryCtrl.unlisted.courses,
            CourseCtrl.added.map(course => course.id));

        // Add the courses in all the categories to coursectrl.added
        CourseCtrl.addMultiple(_(CategoryCtrl.categories)
            .map('courses')
            .flatten()
            .map(CourseCtrl.get)
            .value());

        // (re)start listening
        CategoryCtrl.startListening();
    },
    /**
     * Called when a course is selected by an user.
     * Adds all the courses which are not currently in the selection to the unlisted category.
     */
    updateAdded() {
        CategoryCtrl.unlisted.courses = _(CourseCtrl.added)
            .filter(function(courseId) {
                return !CategoryCtrl.categories.some(function(category) {
                    return category.courses.indexOf(courseId) !== -1;
                });
            })
            .union(CategoryCtrl.unlisted.courses)
            .value();
        Storage.save('category::updateAdded');
        EventServer.emit('category::added::unlisted');
    },
    /**
     * Called when an user removes a course from the selection.
     * Removes the course in the category which currently holds it.
     */
    updateRemoved() {
        const allCourses = CourseCtrl.added;
        CategoryCtrl.categories.forEach(function(category) {
            const removeCourses = _.filter(category.courses, function(courseId) {
                return allCourses.indexOf(courseId) === -1;
            });
            if (removeCourses.length > 0) {
                category.courses = _.difference(category.courses, removeCourses);
                EventServer.emit(`category::removed::${category.catId}`);
            }
        });
        Storage.save('categoryctrl::updateRemoved');
    },
    stopListening() {
        EventServer.remove('course::added::*', id);
        EventServer.remove('course::removed::*', id);
    },
    startListening() {
        EventServer.on('course::added::*', CategoryCtrl.updateAdded, id);
        EventServer.on('course::removed::*', CategoryCtrl.updateRemoved, id);
    },
    /**
     * Moves a course from one category to another
     * @param  {String|Number} courseId  The course id
     * @param  {String} categoryIdFrom The category identifier from it is being moved.
     * @param  {String} categoryIdTo   The category to which is should be moved
     */
    move(courseId, categoryIdFrom, categoryIdTo) {
        const categoryFrom = (categoryIdFrom === 'unlisted') ? CategoryCtrl.unlisted :
            _.find(CategoryCtrl.categories, function(category) {
                return category.catId === categoryIdFrom;
            });
        const categoryTo = (categoryIdTo === 'unlisted') ? CategoryCtrl.unlisted : _.find(CategoryCtrl.categories, function(category) {
            return category.catId === categoryIdTo;
        });
        categoryTo.courses = _.union(categoryTo.courses, [courseId]);
        categoryFrom.courses = _.without(categoryFrom.courses, courseId);
        Storage.save('category::move');
        EventServer.emit(`category::added::${categoryIdTo}`, courseId);
        EventServer.emit(`category::removed::${categoryIdFrom}`, courseId);
    }
};
export
default CategoryCtrl;
