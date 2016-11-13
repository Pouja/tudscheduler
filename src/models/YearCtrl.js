import EventServer from './EventServer';
import CourseCtrl from './CourseCtrl';
import Storage from './Storage';
import _ from 'lodash';
import DoneCtrl from './DoneCtrl';

const id = 'YearCtrl';
const YearCtrl = {
    years: [],
    // See YearSettings for the different modes.
    mode: 0,
    init(years) {
        YearCtrl.years = years;
        EventServer.on('course::added::*', YearCtrl.updateAdded, id);
        EventServer.on('course::removed::*', YearCtrl.updateRemoved, id);
    },
    add() {
        YearCtrl.years.push({
            year: _.maxBy(YearCtrl.years, 'year').year + 1,
            courses: []
        });
        EventServer.emit('years::changed');
    },
    get(yearId) {
        return YearCtrl.years.find(yearModel => yearModel.year === yearId);
    },
    /**
     * Called when one or more courses are added.
     * Constructs a list of courses which are not yet added in the year planner.
     * And adds them to the last year.
     */
    updateAdded() {
        const newCourses = CourseCtrl.added.filter(courseId => {
            return !YearCtrl.years.some(year => {
                return year.courses.indexOf(courseId) !== -1;
            });
        });
        if (newCourses.length > 0) {
            const maxYear = _.maxBy(YearCtrl.years, 'year');
            maxYear.courses = maxYear.courses.concat(newCourses);
            EventServer.emit(`year::added::${maxYear.year}`);
            Storage.save('yearctrl:updateadded');
        }
    },
    /**
     * Called when one or more courses are removed.
     * Removes the removed courses from the year planner.
     */
    updateRemoved() {
        const allCourses = CourseCtrl.added;
        let removed = false;
        YearCtrl.years.forEach(function(year) {
            const removeCourses = _.filter(year.courses, function(courseId) {
                return allCourses.indexOf(courseId) === -1;
            });
            if (removeCourses.length > 0) {
                removed = true;
                year.courses = _.difference(year.courses, removeCourses);
                EventServer.emit(`year::removed::${year.year}`);
            }
        });
        if (removed) {
            Storage.save('yearctrl:updateremoved');
        }
    },
    changeMode(modeId) {
        YearCtrl.mode = modeId;
        EventServer.emit('years::mode', modeId);
    },
    applyMode(courseIds, mode) {
        if (mode === 0) {
            return courseIds;
        } else if (mode === 1) {
            return courseIds.filter(DoneCtrl.isDone);
        }
        return courseIds.filter((courseId) => !DoneCtrl.isDone(courseId));
    }
};
export default YearCtrl;
