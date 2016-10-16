import {expect} from 'chai';
import sinon from 'sinon';
import DnDCtrl from './DnDCtrl';
import EventServer from './EventServer';
import CourseCtrl from './CourseCtrl';
import CategoryCtrl from './CategoryCtrl';
import FacutlyCtrl from './FacultyCtrl';

describe('DnDCtrl', () => {
    beforeEach((done) => {
        EventServer.remove('categories::loaded', 'dndctrl.spec');
        FacutlyCtrl.init();
        EventServer.on('categories::loaded', () => {
            CourseCtrl.added.forEach(CourseCtrl.remove);
            done();
        }, 'dndctrl.spec');
    });
    describe('sidebar -> yearview', () => {
        it('should just call CourseCtrl.add', () => {
            sinon.stub(CourseCtrl, 'add');
            DnDCtrl.move('add me', 'sidebar', 'yearview');
            expect(CourseCtrl.add.called).to.be.true;
            expect(CourseCtrl.add.calledWith('add me'));
            CourseCtrl.add.restore();
        });
    });
    describe('sidebar -> category', () => {
        it('should add only the single course if it a leaf course', () => {
            const course = CourseCtrl.courses[4];
            const category = CategoryCtrl.categories[0];
            DnDCtrl.move(course.id, 'sidebar', category.catId);
            expect(category.courses.length).to.eql(1);
            expect(category.courses[0]).to.eql(course.id);
        });
        it('should add all the courses under the parent course', () => {
            const category = CategoryCtrl.categories[0];
            const researchGroup = CourseCtrl.getTree(16607); // Software engineering
            DnDCtrl.move(researchGroup.id, 'sidebar', category.catId);
            expect(category.courses.length).to.eql(researchGroup.children.length);
            researchGroup.children.forEach((child) => expect(category.courses.indexOf(child.id)).to.be.above(-1));
        });
    });
    describe('sidebar <- any', () => {
        it('should remove the courses', () => {
            sinon.stub(CourseCtrl, 'remove');
            DnDCtrl.move('delete me', null, 'sidebar');
            expect(CourseCtrl.remove.called).to.be.true;
            expect(CourseCtrl.remove.calledWith('delete me')).to.be.true;
            CourseCtrl.remove.restore();
        });
    });
    describe('category <-> category', () => {
        it('should let CategoryCtrl handle this situation', () => {
            sinon.stub(CategoryCtrl, 'move');
            DnDCtrl.move('course', 'category1', 'category2');
            expect(CategoryCtrl.move.called).to.be.true;
            expect(CategoryCtrl.move.calledWith('course', 'category1', 'category2')).to.be.true;
            CategoryCtrl.move.restore();
        });
    });
});
