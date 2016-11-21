import Storage from './Storage';
import EventServer from './EventServer';
import _ from 'lodash';

/**
 * Keeps track of all the courses which are marked complete aka done aka finished
 */
const DoneCtrl = {
    done: [],
    init(done) {
        DoneCtrl.done = done.map(id => id);
    },
    /**
     * Marks the course as done if it is not already marked.
     * @param {String} courseId The course id.
     */
    addDone(courseId) {
        if(!DoneCtrl.done.find(dId => dId === courseId)) {
            DoneCtrl.done.push(courseId);
            EventServer.emit(`done::added::${courseId}`);
            EventServer.emit(`done::changed::${courseId}`);
            Storage.save('donectrl::addone');
        }
    },
    /**
     * Removes the mark of the course.
     * @param {String} courseId The course id.
     */
    removeDone(courseId) {
        if(DoneCtrl.done.find(dId => dId === courseId)) {
            DoneCtrl.done = _.without(DoneCtrl.done, courseId);
            EventServer.emit(`done::removed::${courseId}`);
            EventServer.emit(`done::changed::${courseId}`);
            Storage.save('donectrl::remove');
        }
    },
    isDone(courseId) {
        return !!DoneCtrl.done.find(dId => dId === courseId);
    }
};

export default DoneCtrl;
