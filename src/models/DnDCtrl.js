import CourseCtrl from './CourseCtrl';
import CategoryCtrl from './CategoryCtrl';
import YearCtrl from './YearCtrl';
import Storage from './Storage';
import _ from 'lodash';
import EventServer from './EventServer';

function panelMove(target, targetObj, courseId) {
    const courseTree = CourseCtrl.getTree(courseId);
    if (CourseCtrl.isAGroup(courseId)) {
        const courseIds = CourseCtrl
            .flatten((course) => !CourseCtrl.isAGroup(course.id) && CourseCtrl.added.indexOf(course.id) === -1, courseTree, 'id')
            .map(course => course.id);
        targetObj.courses = _.union(targetObj.courses, courseIds);
    } else if (CourseCtrl.added.indexOf(courseId) === -1) {
        targetObj.courses = _.union(targetObj.courses, [courseId]);
    }
    CourseCtrl._add(courseTree);
    EventServer.emit('course::added::*');
    EventServer.emit(`${target.sort}::added::${target.id}`, courseId);
}

function move(courseId, currentFieldId, target) {
    if ( currentFieldId === 'sidebar') {
        if (target.sort === 'year') {
            panelMove(target, YearCtrl.get(target.id), courseId);
        } else {
            panelMove(target, CategoryCtrl.get(target.id), courseId);
        }
    } else if (target.id === 'sidebar') {
        CourseCtrl.remove(courseId);
    } else if (target.sort === 'category') {
        CategoryCtrl.move(courseId, currentFieldId, target.id);
    } else if (target.sort === 'year') {
        console.log(currentFieldId, target);
        const yearFrom = YearCtrl.get(currentFieldId);
        const yearTo = YearCtrl.get(target.id);
        yearFrom.courses = _.difference(yearFrom.courses, [courseId]);
        yearTo.courses.push(courseId);
        EventServer.emit(`year::removed::${yearFrom.year}`);
        EventServer.emit(`year::added::${yearTo.year}`);
        Storage.save();
    }
}

export default {move};
