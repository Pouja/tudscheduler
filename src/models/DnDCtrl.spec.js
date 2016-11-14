import {expect} from 'chai';
import sinon from 'sinon';
import DnDCtrl from './DnDCtrl';
import CourseCtrl from './CourseCtrl';
import CategoryCtrl from './CategoryCtrl';
import Storage from './Storage';

describe('DnDCtrl', function() {
    before(function(done) {
        Storage.init().then(function() {
            CourseCtrl.added.forEach(CourseCtrl.remove);
            done();
        });
    });
    describe('sidebar -> panel', function() {
        it('should add only the single course if it a leaf course', function() {
            const course = CourseCtrl.courses[4];
            const category = CategoryCtrl.categories[0];
            DnDCtrl.move(course.id, 'sidebar', {
                sort: 'category',
                id: category.catId
            });
            expect(category.courses.length).to.eql(1);
            expect(category.courses[0]).to.eql(course.id);
        });
        it('should add all the courses under the parent course', function() {
            const category = CategoryCtrl.categories[0];
            const researchGroup = CourseCtrl.getTree('32cdfd94-74be-4557-a4d5-417077b48753'); // Software engineering
            DnDCtrl.move(researchGroup.id, 'sidebar', {
                sort: 'category',
                id: category.catId
            });
            expect(category.courses.length).to.eql(researchGroup.children.length + 1);
            researchGroup.children.forEach((child) => expect(category.courses.indexOf(child.id)).to.be.above(-1));
        });
    });
    describe('sidebar <- any', function() {
        it('should remove the courses', function() {
            sinon.stub(CourseCtrl, 'remove');
            DnDCtrl.move('delete me', null, {
                id:'sidebar'
            });
            expect(CourseCtrl.remove.called).to.be.true;
            expect(CourseCtrl.remove.calledWith('delete me')).to.be.true;
            CourseCtrl.remove.restore();
        });
    });
    describe('category <-> category', function() {
        it('should let CategoryCtrl handle this situation', function() {
            sinon.stub(CategoryCtrl, 'move');
            DnDCtrl.move('course', 'category1', {
                sort: 'category',
                id: 'category2'
            });
            expect(CategoryCtrl.move.called).to.be.true;
            expect(CategoryCtrl.move.calledWith('course', 'category1', 'category2')).to.be.true;
            CategoryCtrl.move.restore();
        });
    });
});
