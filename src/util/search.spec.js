import {expect} from 'chai';
import SearchUtil from './search';

const courses = [
  {
    'name': 'CS4015',
    'id': 37826,
    'courseName': 'Behaviour Change Support Systems',
    'ects': '5',
    'Education Period': '2',
    'Start Education': '2'
  },
  {
    'name': 'CS4065',
    'id': 37836,
    'courseName': 'Multimedia Search and Recommendation',
    'ects': '5',
    'Education Period': '4',
    'Start Education': '4'
  },
  {
    'name': 'IN4073TU',
    'id': 35723,
    'courseName': 'Embedded Real-Time Systems',
    'ects': '6',
    'Education Period': '1',
    'Start Education': '1'
  },
  {
    'name': 'IN4085',
    'id': 35756,
    'courseName': 'Pattern Recognition',
    'ects': '6',
    'Education Period': '1,2',
    'Start Education': '1'
  },
  {
    'name': 'IN4150',
    'id': 36645,
    'courseName': 'Distributed Algorithms',
    'ects': '6',
    'Education Period': '3,4',
    'Start Education': '3'
  },
  {
    'name': 'IN4152',
    'id': 36692,
    'courseName': '3D Computer Graphics and Animation',
    'ects': '5',
    'Education Period': '3,4',
    'Start Education': '3'
  },
  {
    'name': 'IN4191',
    'id': 36694,
    'courseName': 'Security and Cryptography ',
    'ects': '5',
    'Education Period': '1',
    'Start Education': '1'
  },
  {
    'name': 'IN4252',
    'id': 34989,
    'courseName': 'Web Science & Engineering',
    'ects': '5',
    'Education Period': '1,2',
    'Start Education': '1'
  },
  {
    'name': 'IN4301',
    'id': 36664,
    'courseName': 'Advanced Algorithms',
    'ects': '3',
    'Education Period': '1,2',
    'Start Education': '1'
  },
  {
    'name': 'IN4303',
    'id': 36630,
    'courseName': 'Compiler Construction',
    'ects': '5',
    'Education Period': '1,2',
    'Start Education': '1'
  }
];

describe('Search', function() {
    describe('#tokenize', function(){
        it('should return everything as _', function(){
            expect(SearchUtil.tokenize('awesome')).to.have.property('_').to.equal('awesome');
        });
        it('should retrieve the ects', function(){
            expect(SearchUtil.tokenize('ec:3')).to.eql({
                _: '',
                ec: '3'
            });
        });
        it('should retrieve periods', function() {
            expect(SearchUtil.tokenize('period:1')).to.eql({
                _: '',
                period: '1'
            });
            expect(SearchUtil.tokenize('period:1,2,3')).to.eql({
                _: '',
                period: '1,2,3'
            });
        });
        it('should more advanced query', function(){
            expect(SearchUtil.tokenize('awesome period:1 ec:3')).to.eql({
                _: 'awesome',
                period: '1',
                ec: '3'
            });
        });
    });
    describe('#search', function() {
        it('should return all courses if the query string is empty, null or undefined', function(){
            expect(SearchUtil.search('', courses).length).to.equal(courses.length);
            expect(SearchUtil.search(null, courses).length).to.equal(courses.length);
            expect(SearchUtil.search(undefined, courses).length).to.equal(courses.length);
        });
        it('basic searching on coursename or name', function() { 
            const result = SearchUtil.search('compiler construction', courses);
            expect(result).lengthOf(1);
            expect(result[0])
                .to.have.property('name')
                .to.equal('IN4303');
        });
        it('basic searching, multiple results', function(){
            const result = SearchUtil.search('algori', courses);
            expect(result).lengthOf(2);
        });
        it('should get all courses with matching ects', function(){
            const result = SearchUtil.search('ec:3', courses);
            expect(result).lengthOf(1);
            expect(result[0]).to.have.property('name').to.equal('IN4301');
        });
        it('should do advance matching', function(){
            const result = SearchUtil.search('in ec:5', courses);
            expect(result).lengthOf(4);
        });
    });
});