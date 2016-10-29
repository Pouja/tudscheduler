import _ from 'lodash';
import EventServer from './EventServer.js';
import request from 'superagent';
import FacultyCtrl from './FacultyCtrl.js';
import SearchUtil from '../util/search.js';

/**
 * The course controller.
 * An important distinction. The tree starts with a root node and each child has a
 * nr, id, depth and children. This tree object is passed through all components.
 * So when you see 'courseTree' then I mean the object in CourseCtrl.tree.
 * Otherwise I would refer it as 'course'.
 * @type {Object}
 */
const CourseCtrl = {
    // The tree of courses, each node consists of nr, id, depth and children
    tree: {},
    // The list of all courses, contains id, name, courseName, ects, Start Eduction
    courses: [],
    // The list of course ids added
    added: [],
    /**
     * Initialises the course controller.
     * Fetches the course tree and all the courses.
     * Sets the depth and numbers the tree
     */
    init() {
        const masterId = FacultyCtrl.selectedMaster().masterId;
        Promise.all([request.get(`http://localhost:8000/courseTree/${masterId}`)
            .accept('application/json'),
            request.get(`http://localhost:8000/courseData/${masterId}`)
            .accept('application/json')
        ])
            .then(function(responses) {
                CourseCtrl.tree = responses[0].body;
                CourseCtrl.courses = responses[1].body;
                CourseCtrl.setDepth(CourseCtrl.tree, 0);
                CourseCtrl.added = [];
                CourseCtrl.numberTree();
                EventServer.emit('courses::loaded');
            });
    },
    /**
     * In the view tree tree the courses are not unique.
     * Since course can fall under a research group as well under the common cores for example.
     * But for the view we need to distinquish between the same courses for example in toggling visibilities. That is why we number them here.
     */
    numberTree() {
        let nr = 0;
        (function number(node) {
            if (!_.isEmpty(node)) {
                nr++;
                node.nr = nr;
                if (node.children) {
                    node.children.forEach(child => {
                        child.parent = node.nr;
                        number(child);
                    });
                }
            }
        }(CourseCtrl.tree));
    },
    /**
     * Sets the depth of the current node in the tree, necessary for styling purposes.
     * @param {Object} node  A course object
     * @param {Number} depth The current depth
     */
    setDepth(node, depth) {
        if (!_.isEmpty(node)) {
            node.depth = depth;
            if (node.children) {
                node.children.forEach((child) => CourseCtrl.setDepth(child, depth + 1));
            }
        }
    },
    /**
     * @param  {String|Number} id The identifier of a course
     * @return {Object|undefined}    a course object iff a course exist with the given id.
     */
    get(id) {
        return CourseCtrl.courses.find((course) => course.id === id);
    },
    /**
     * Returns the course in CourseCtrl.tree
     * Usefull when you want to traverse the tree from a specific node.
     * @param  {String|Number} id   The identifier of the node to retrieve
     * @param  {Object|undefined} node The current parent node search from
     * @return {Object}      A course tree node, or undefined if not found
     */
    getTree(id, node) {
        const currentNode = node || CourseCtrl.tree;
        if(currentNode.id === id) {
            return currentNode;
        }
        let found;
        currentNode.children.some(function(child){
            found = CourseCtrl.getTree(id, child);
            return found;
        });
        return found;
    },
    /**
     * @param  {String|Number}  courseId The course id
     * @return {Boolean} true iff all the children of the course and the course
     * itself are added.
     */
    isAdded: function(courseId) {
        if (!CourseCtrl.isAGroup(courseId)) {
            return CourseCtrl.added.indexOf(courseId) !== -1;
        }
        return _(CourseCtrl.getTree(courseId).children)
            .map('id')
            .every(CourseCtrl.isAdded);
    },
    /**
     * @param  {String|Number}  courseId The course id
     * @return {Boolean} true iff all the children of the course and the course
     * itself are not added.
     */
    isNotAdded: function(courseId) {
        if (!CourseCtrl.isAGroup(courseId)) {
            return CourseCtrl.added.indexOf(courseId) === -1;
        }
        return _(CourseCtrl.getTree(courseId).children)
            .map('id')
            .every(CourseCtrl.isNotAdded);
    },
    /**
     * Checks if a course as the given needle.
     * @param  {Obect}  courseId A course identifier.
     * @param  {String}  needle     The search keyword to search for.
     * @return {Boolean}            true iff the course contains the needle.
     */
    hasNeedle(courseId, needle) {
        return SearchUtil.hasNeedle(needle, CourseCtrl.get(courseId));
    },
    /**
     * Creates a flatten representation of the course tree
     * @param  {Function} filter Additional filter to apply
     * @param  {Object} node   A course, default root of tree
     * @param  {String} unique Identifier which indicates the uniquenis, default 'id'
     * @return {Array}        Flatten representation of the course tree.
     */
    flatten(filter, node, unique) {
        const filterFn = filter || function(node) {
            return !_.isEmpty(node);
        };
        const uniqueId = unique || 'id';
        const currentNode = node || CourseCtrl.tree;
        const children = _(currentNode.children)
            .map(function(child) {
                return CourseCtrl.flatten(filterFn, child, uniqueId);
            })
            .filter(Boolean)
            .flatten()
            .uniqBy(uniqueId)
            .value();

        if (filterFn(currentNode)) {
            children.unshift(currentNode);
        }
        return children;
    },
    /**
     * Calculates the added ects for a certain quarter/period
     * @param  {Number} period The period/quarter
     * @param {Array | undefined} courses The list of courses to calculate the ects.
     * if set to undefined, it will use the added courses.
     * @return {Number}        The total ects
     */
    periodEcts(period, courses) {
        return _.sumBy(courses || CourseCtrl.added, function(courseId) {
            const course = CourseCtrl.get(courseId);
            const courseEcts = (course.ects === undefined) ? 0 : parseInt(course.ects, 10);
            const periods = course['Education Period'];
            const start = course['Start Education'] ? parseInt(course['Start Education'], 10) : 0;
            const nPeriods = (periods ? periods.split(',').length : 1);
            const end = start + nPeriods - 1;
            if (start <= period && end >= period) {
                return courseEcts / nPeriods;
            }
            return 0;
        });
    },
    /**
     * @param  {Object} course (Optional) defaults to root
     * @return {Number} The sum of all the ects of all the children and itself that
     * are added of the given course.
     */
    addedEcts(course) {
        const currentCourse = course || CourseCtrl.tree;
        const flatten = CourseCtrl.flatten(function(course) {
            return CourseCtrl.added.indexOf(course.id) !== -1;
        }, currentCourse, 'id');
        return _.sumBy(flatten, function(courseTree) {
            const course = CourseCtrl.get(courseTree.id);
            return (course.ects === undefined) ? 0 : parseInt(course.ects, 10);
        });
    },
    /**
     * @param  {Object} course (Optional) defaults to root
     * @return {Number} total ects of the course and all of his children
     */
    totalEcts(course) {
        const currentCourse = course || CourseCtrl.tree;
        const flatten = CourseCtrl.flatten(function() {
            return true;
        }, currentCourse, 'id');
        return _.sumBy(flatten, function(courseTree) {
            const course = CourseCtrl.get(courseTree.id);
            return (course.ects === undefined) ? 0 : parseInt(course.ects, 10);
        });
    },
    /**
     * Sums the ects of the given courses, it will not descend into the children or look at the parents.
     * @param  {Array} courses The course objects.
     * @return {Number}         The total sum of the ects of the given courses.
     */
    sumEcts(courses) {
        return _.sumBy(courses, function(courseTree) {
            const course = CourseCtrl.get(courseTree.id);
            return parseInt(course.ects, 10);
        });
    },
    /**
     * Adds the course and all the children to the added list
     * @param {String|Number} courseId The course id
     * @returns {void}
     */
    add(courseId) {
        CourseCtrl._add(CourseCtrl.getTree(courseId));
        EventServer.emit(`course::added::${courseId}`, courseId);
    },
    /**
     * Adds multiple courses at once.
     * It assumes that these courses or from CourseCtrl.courses
     * @param {Array} courses The courses to add.
     */
    addMultiple(courses) {
        courses.forEach(CourseCtrl._add);
        EventServer.emit('course::added::*');
    },
    _add(courseTree) {
        if (CourseCtrl.isAGroup(courseTree.id)) {
            courseTree.children.forEach(CourseCtrl._add);
        } else {
            if (CourseCtrl.added.indexOf(courseTree.id) === -1) {
                CourseCtrl.added.push(courseTree.id);
            }
        }
    },
    /**
     * Removes the course and all the chilren from added list
     * @param  {String|Number} courseId The course id
     */
    remove(courseId) {
        CourseCtrl._remove(CourseCtrl.getTree(courseId));
        EventServer.emit(`course::removed::${courseId}`);
    },
    _remove(courseTree) {
        if (CourseCtrl.isAGroup(courseTree.id)) {
            courseTree.children.forEach(CourseCtrl._remove);
        } else {
            CourseCtrl.added = _.without(CourseCtrl.added, courseTree.id);
        }
    },
    /**
     * @param  {String|Number}  courseId The id of the course to check
     * @return {Boolean}          true iff the course is a non-leaf/group
     */
    isAGroup(courseId) {
        const course = CourseCtrl.get(courseId);
        return course.ects === undefined || course.ects === null;
    },
    /**
     * Resets the added courses.
     */
    reset() {
        CourseCtrl.added = [];
        EventServer.emit('reset');
    }
};
EventServer.on('masters::loaded', CourseCtrl.init, 'CourseCtrl');

export
default CourseCtrl;
