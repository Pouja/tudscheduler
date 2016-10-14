import {expect} from 'chai';
import sinon from 'sinon';
import EventServer from './EventServer';

describe('EventServer', function() {
    beforeEach(() => {
        EventServer.flush();
    });
    describe('#on', function() {
        it('should throw an error if id is not specified', () => {
            expect(() => EventServer.on(null, null, null)).to.throw(Error, /unique id/);
        });
        it('should throw an error if there is already a listener with the same id and name', () => {
            const fn = () => EventServer.on('name', () => {}, 'id');
            fn();
            expect(fn).to.throw(Error, /duplicate/i);
        });
        it('should throw an error if the fn is not a function (2nd argument)', () => {
            expect(() => EventServer.on('name', null, 'id')).to.throw(Error, /a function/);
        });
    });
    describe('#remove', () => {
        it('should throw an error because id is not passed', () => {
            expect(() => EventServer.remove(null)).to.throw(Error, /is not set/);
        });
    });
    describe('#getWildCardFn', () => {
        it('should retrieve nothing if the root does not match', () => {
            EventServer.on('root::*', () => {}, 'id');
            const listeners = EventServer.getWildCardFn('base');
            expect(listeners).to.be.empty
        });
        it('should retrieve nothing if only a word matches', () => {
            EventServer.on('root::base::*', () => {}, 'id');
            const listeners = EventServer.getWildCardFn('base');
            expect(listeners).to.be.empty
        });
        it('should not match if no wildcard was given', () => {
            EventServer.on('root::base', () => {}, 'id');
            const listeners = EventServer.getWildCardFn('root');
            expect(listeners).to.be.empty
        });
        it('should match', () => {
            EventServer.on('root::*', () => {}, 'id');
            const listeners = EventServer.getWildCardFn('root::base');
            expect(listeners.length).not.to.be.empty;
        });
    });
    describe('#emit', () => {
        it('should call all matching events', () => {
            let spy = sinon.spy();
            EventServer.on('callme', spy, 'comp1');
            EventServer.on('callme', spy, 'comp2');
            EventServer.emit('callme');
            expect(spy.callCount).to.eql(2);
        });
        it('should call with wildcard with one level not matching', () => {
            let spy = sinon.spy();
            EventServer.on('callme::*', spy, 'comp1');
            EventServer.on('callme::second::*', spy, 'comp1');
            EventServer.emit('callme::smh');
            expect(spy.callCount).to.eql(1);
        });
        it('should call with wildcard', () => {
            let spy = sinon.spy();
            EventServer.on('callme::*', spy, 'comp1');
            EventServer.on('callme::second::*', spy, 'comp1');
            EventServer.emit('callme::second::last');
            expect(spy.callCount).to.eql(2);
        });
        it('should not call a listener who was removed during the emit', () => {
            let calls = 0;
            EventServer.on('callme', () => {
                calls++;
                EventServer.remove('callme', 'comp2');
            }, 'comp1');
            EventServer.on('callme', () => {
                calls++;
                EventServer.remove('callme', 'comp1');
            }, 'comp2');
            EventServer.emit('callme');
            expect(calls).to.eql(1);
        });
    });
});
