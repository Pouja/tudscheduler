import _ from 'lodash';
import EventServer from './EventServer.js';
import request from 'superagent';
import FacultyCtrl from './FacultyCtrl.js';

/**
 * The course controller.
 * An important distinction. The tree starts with a root node and each child has a
 * nr, id, depth and children. This tree object is passed through all components.
 * So when you see 'courseTree' then I mean the object in CourseCtrl.tree.
 * Otherwise I would refer it as 'course'.
 * @type {Object}
 */
const CourseCtrl = {
    tree: {},
    courses: [],
    added: [],
    /**
     * Initialises the course controller.
     * Fetches the course tree and all the courses.
     * Sets the depth and numbers the ree
     */
    init() {
        const masterId = FacultyCtrl.selectedMaster().masterid;
        Promise.all([request.get(`http://localhost:8000/courseTree/${masterId}`)
            .accept('application/json'),
            request.get(`http://localhost:8000/courses/${masterId}`)
            .accept('application/json')
        ])
            .then(function(responses) {
                CourseCtrl.tree = responses[0].body;
                CourseCtrl.courses = responses[1].body;
                CourseCtrl.setDepth(CourseCtrl.tree, 0);
                CourseCtrl.added = [];
                CourseCtrl.numberTree();
                EventServer.emit('courses.loaded');
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
     * @param  {Object}  course See AllCourses.js
     * @return {Boolean} true iff all the children of the course and the course
     * itself are added.
     */
    isAdded: function(course) {
        if (!CourseCtrl.isAGroup(course)) {
            return _.find(CourseCtrl.added, {
                id: course.id
            });
        }
        return _.every(course.children, CourseCtrl.isAdded);
    },
    /**
     * Checks if a course as the given needle.
     * @param  {Obect}  courseTree A course tree object.
     * @param  {String}  needle     The search keyword to search for.
     * @return {Boolean}            true iff the course contains the needle.
     */
    hasNeedle(courseTree, needle) {
        if (!needle || needle.length === 0 || !courseTree) {
            return true;
        }
        const lowerNeedle = needle.toLowerCase();
        const course = CourseCtrl.get(courseTree.id);
        return course.name.toLowerCase().indexOf(lowerNeedle) !== -1 ||
            (!!course.courseName &&
                course.courseName.toLowerCase().indexOf(lowerNeedle) !== -1);
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
     * @return {Number}        The total ects
     */
    periodEcts(period) {
        return _.sumBy(CourseCtrl.added, function(courseTree) {
            const course = CourseCtrl.get(courseTree.id);
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
            return _.find(CourseCtrl.added, {
                id: course.id
            });
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
     * @param {Object} course, See AllCourses.js
     * @returns {void}
     */
    add(course) {
        EventServer.emit('added', course);
        CourseCtrl._add(course);
    },
    addMultiple(courses) {
        EventServer.emit('added');
        courses.forEach(CourseCtrl._add);
    },
    _add(course) {
        if (CourseCtrl.isAGroup(course)) {
            course.children.forEach(CourseCtrl._add);
        } else {
            if (_.find(CourseCtrl.added, {
                id: course.id
            }) === undefined) {
                CourseCtrl.added.push(course);
            }
        }
    },
    /**
     * Removes the course and all the chilren from added list
     * @param  {Object} course, See AllCourses.js
     */
    remove(course) {
        EventServer.emit('removed', course);
        CourseCtrl._remove(course);
    },
    _remove(course) {
        if (CourseCtrl.isAGroup(course)) {
            course.children.forEach(CourseCtrl._remove);
        } else {
            _.remove(CourseCtrl.added, {
                id: course.id
            });
        }
    },
    isAGroup(courseTree) {
        const course = CourseCtrl.get(courseTree.id);
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
EventServer.on('masters.loaded', CourseCtrl.init);

export
default CourseCtrl;
