import _ from 'lodash';
import EventServer from './EventServer.js';
import request from 'superagent';

var CourseCtrl = {
    tree: [],
    courses: [],
    added: [],
    init() {
        Promise.all([request.get('http://localhost:8000/courseTree/3')
            .set('Accept', 'application/json'),
            request.get('http://localhost:8000/courses/3')
            .set('Accept', 'application/json')
        ])
            .then(function(responses) {
                CourseCtrl.tree = responses[0].body;
                CourseCtrl.courses = responses[1].body;
                CourseCtrl.setDepth(CourseCtrl.tree, 0);
                CourseCtrl.numberTree();
                EventServer.emit('courses.loaded');
            });
    },
    /**
     * In the view tree tree the courses are not unique.
     * Since course can fall under a research group as well under the common cores for example.
     * But for the view we need to distinquish between the same courses for example in toggling visibilities.
     */
    numberTree() {
        let nr = 0;
        let number = (function number(node) {
            nr++;
            node.nr = nr;
            node.children.forEach(child => {
                child.parent = node.nr;
                number(child);
            });
        }(CourseCtrl.tree));
    },
    /**
     * Sets the depth of the current node in the tree, necessary for styling purposes.
     * @param {Object} node  A course object
     * @param {Number} depth The current depth
     */
    setDepth(node, depth) {
        node.depth = depth;
        node.children.forEach((child) => CourseCtrl.setDepth(child, depth + 1));
    },
    get(id) {
        return CourseCtrl.courses.find((course) => course.id === id);
    },
    /**
     * @param  {Object}  course See AllCourses.js
     * @return {Boolean} true iff all the children of the course and the course
     * itself are added.
     */
    isAdded: function(course) {
        if (course.children.length === 0) {
            return _.find(CourseCtrl.added, {
                id: course.id
            });
        }
        return _.every(course.children, CourseCtrl.isAdded);
    },
    hasNeedle(courseTree, needle) {
        const course = CourseCtrl.get(courseTree.id);
        if (!needle || needle.length === 0) {
            return true;
        }
        return course.name.toLowerCase().indexOf(needle) !== -1 || (!!course.courseName &&
            course.courseName.toLowerCase().indexOf(needle) !== -1);
    },
    /**
     * Creates a flatten representation of the course tree
     * @param  {Function} filter Additional filter to apply
     * @param  {Object} node   A course, default root of tree
     * @param  {String} unique Identifier which indicates the uniquenis, default 'id'
     * @return {Array}        Flatten representation of the course tree.
     */
    flatten(filter, node, unique) {
        const filterFn = filter || function() {
            return true;
        };
        const uniqueId = unique || 'id';
        const currentNode = node || CourseCtrl.tree;
        var children = _(currentNode.children)
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
            var courseEcts = (course.ects === undefined) ? 0 : parseInt(course.ects, 10);
            var periods = course['Education Period'];
            var start = course['Start Education'] ? parseInt(course['Start Education'], 10) : 0;
            var nPeriods = (periods ? periods.split(',').length : 1);
            var end = start + nPeriods - 1;
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
    _add(course) {
        if (course.children.length !== 0) {
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
        if (course.children.length !== 0) {
            course.children.forEach(CourseCtrl._remove);
        } else {
            _.remove(CourseCtrl.added, {
                id: course.id
            });
        }
    },
    /**
     * Resets the added courses.
     */
    reset() {
        CourseCtrl.added = [];
        EventServer.emit('reset');
    }
};

export
default CourseCtrl;
