import CourseCtrl from './CourseCtrl';
import CategoryCtrl from './CategoryCtrl';
import Storage from './Storage';
import _ from 'lodash';
import EventServer from './EventServer';

function move(courseId, currentFieldId, targetFieldId) {
    if ( currentFieldId === 'sidebar') {
        if (targetFieldId === 'yearview') {
            CourseCtrl.add(courseId);
        } else {
            const courseTree = CourseCtrl.getTree(courseId);
            CourseCtrl._add(courseTree);
            const categoryTo = CategoryCtrl.get(targetFieldId);
            if (CourseCtrl.isAGroup(courseId)) {
                const courseIds = CourseCtrl
                    .flatten((course) => !CourseCtrl.isAGroup(course.id), courseTree, 'id')
                    .map(course => course.id);
                categoryTo.courses = _.union(categoryTo.courses, courseIds);
            } else {
                categoryTo.courses = _.union(categoryTo.courses, [courseId]);
            }
            Storage.save();
            EventServer.emit('course::added::*');
            EventServer.emit(`category::added::${targetFieldId}`, courseId);
        }
    } else if( targetFieldId === 'sidebar') {
        CourseCtrl.remove(courseId);
    } else {
        CategoryCtrl.move(courseId, currentFieldId, targetFieldId);
    }
}

export default {move};
