import Storage from './Storage';
import EventServer from './EventServer';
import _ from 'lodash';

const DoneCtrl = {
    done: [],
    init(done) {
        DoneCtrl.done = done.map(id => id);
    },
    addDone(courseId) {
        if(!DoneCtrl.done.find(dId => dId === courseId)) {
            DoneCtrl.done.push(courseId);
            EventServer.emit(`done::added::${courseId}`);
            EventServer.emit(`done::changed::${courseId}`);
            Storage.save();
        }
    },
    removeDone(courseId) {
        if(DoneCtrl.done.find(dId => dId === courseId)) {
            DoneCtrl.done = _.without(DoneCtrl.done, courseId);
            EventServer.emit(`done::removed::${courseId}`);
            EventServer.emit(`done::changed::${courseId}`);
            Storage.save();
        }
    },
    isDone(courseId) {
        return !!DoneCtrl.done.find(dId => dId === courseId);
    }
};

export default DoneCtrl;
