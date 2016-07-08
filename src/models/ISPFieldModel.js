import _ from 'lodash';
import CourseCtrl from './CourseCtrl.js';
/**
 * ISPFieldModel to describe a field in the ISP
 * Should not be used directly. When whishing to add/remove, then it should be done through ISPCtrl.
 * @param {Object} options The options
 * @param {Number} options.maxEC The maximum amount of EC allowed
 * @param {Number} options.minEC The minimum amount of EC
 * @param {Number} options.maxCourses The maximum amount of courses allowed
 * @param {Number} options.minCourses The minimum amount of courses
 * @param {String|Number} id The identifier of the field.
 * @returns {Object} [description]
 */
function ISPFieldModel(options, id) {
    var courses = []
    var model = {};
    const modelOptions = options;
    const modelId = id;

    model.getCourses = function() {
        return courses;
    }

    model.getOptions = function() {
        return modelOptions;
    }

    model.getID = function() {
        return modelId;
    }
    model.reset = function() {
        courses = []
    }
    /**
     * Removes a single course
     * @param  {Object} course The course to be removed
     */
    model.remove = function remove(course) {
        _.remove(courses, {
            id: course.id
        });
    }
    /**
     * Adds a course if it is not present already.
     * @param {Object} course The course object
     * @return {Boolean} true iff a course is added.
     */
    model.add = function add(course) {
        if (!courses.some(function(c) {
            return c.id === course.id
        })) {
            courses.push(course);
            return true;
        }
        return false;
    }
    /**
     * Returns all the errors indicating which rules are not met.
     * @return {Array} A list of constraints which are not met.
     */
    model.getErrors = function getErrors() {
        var errors = [];
        if (courses.length === 0) {
            return errors;
        }
        if (_.isNumber(options.maxEC) &&
            _.sumBy(courses, function(course) {
                return parseInt(course.ects, 10);
            }) > modelOptions.maxEC) {
            errors.push('maxEC');
        }
        if (_.isNumber(modelOptions.minEC) &&
            _.sumBy(courses, function(course) {
                return parseInt(course.ects, 10);
            }) < modelOptions.minEC) {
            errors.push('minEC');
        }
        if (_.isNumber(modelOptions.maxCourses) &&
            courses.length > modelOptions.maxCourses) {
            errors.push('maxCourses');
        }
        if (_.isNumber(modelOptions.minCourses) &&
            courses.length < modelOptions.minCourses) {
            errors.push('minCourses');
        }

        return errors;
    }
    model.infoMessages = function() {
        const errors = model.getErrors();
        const selectedCourses = courses.length;
        const totalEcts = CourseCtrl.sumEcts(courses);
        let pretty = [];
        if (options.minCourses === options.maxCourses && _.isNumber(options.maxCourses)) {
            pretty.push({
                info: `Exact ${options.minCourses} courses needed`,
                selected: `(${selectedCourses} selected)`,
                error: errors.indexOf('maxCourses') !== -1 || errors.indexOf('minCourses') !== -1
            });
        } else if (_.isNumber(modelOptions.minCourses)) {
            pretty.push({
                info: `At least ${options.minCourses} courses needed`,
                selected: `(${selectedCourses} selected)`,
                error: errors.indexOf('minCourses') !== -1
            });
        } else if (_.isNumber(modelOptions.maxCourses)) {
            pretty.push({
                info: `At most ${options.maxCourses} courses needed`,
                selected: `(${selectedCourses} selected)`,
                error: errors.indexOf('maxCourses') !== -1
            });
        }
        if (options.minEC === options.maxEC && _.isNumber(options.maxEC)) {
            pretty.push({
                info: `Exact ${options.maxEC} EC needed`,
                selected: `(${totalEcts}EC selected)`,
                error: errors.indexOf('minEC') !== -1 || errors.indexOf('maxEC') !== -1
            });
        } else if (_.isNumber(options.minEC)) {
            pretty.push({
                info: `At least ${options.minEC} EC needed`,
                selected: `(${totalEcts}EC selected)`,
                error: errors.indexOf('minEC') !== -1
            });
        } else if (_.isNumber(options.maxEC)) {
            pretty.push({
                info: `At most ${options.maxEC} EC needed`,
                selected: `(${totalEcts}EC selected)`,
                error: errors.indexOf('maxEC') !== -1
            });
        }
        return pretty;
    }
    /**
     * Checks if with the given courses all the constraints are met.
     * @return {Boolean} iff all the constraints are met.
     */
    model.isValid = function isValid() {
        return model.getErrors().length === 0;
    }
    return model;
}

export
default ISPFieldModel;
