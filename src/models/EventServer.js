import _ from 'lodash';

let listeners = {};
let currentListeners = [];
/**
 * A simple EventListeners.
 * There are other modules that have the exact functionality and are tested.
 * But since it is trivial and I need to profile the performance (which was hard or impossible in other modules) I created my one.
 * @type {Object}
 */
const EventListener = {
    flush() {
        listeners = {};
        currentListeners = [];
    },
    /**
     * Will call fn when 'name' event is emitted.
     * @param  {String}   name The name of the event to listen on.
     * @param  {Function} fn   The function to be invoked.
     * @param {String} id An identifier for debugging purposes.
     * @returns {void}
     */
    on(name, fn, id) {
        if(_.isEmpty(id)) {
            throw new Error('All event listeners must supply an unique id');
        }
        if(_.find(currentListeners, {id: id, name: name}) !== undefined) {
            throw new Error(`Duplicate listener added: ${id}`);
        }
        if (!_.isFunction(fn)) {
            throw new Error(`EventServer expected a function as second argument but got ${typeof fn} with id ${id}`);
        }
        if (!listeners.hasOwnProperty(name)) {
            listeners[name] = [];
        }
        listeners[name].push({
            id: id,
            fn: fn
        });
        currentListeners.push({id:id, name:name});
    },
    /**
     * Emit the event.
     * Invokes all the listeners which name matches the event name or partially matches the event name.
     * See getWildCardFn on how partially matching works.
     * @param  {String}    name   The name of the event.
     * @param  {Array} values The values that should be sent with the emit.
     * @returns {void}
     */
    emit(name, ...values) {
        // console.log(`emitting ${name}`);
        _.uniq(EventListener.getWildCardFn(name)
            .concat(listeners[name])
            .filter(Boolean))
            .forEach(function(listener) {
                if (_.find(currentListeners, {id: listener.id}) !== undefined) {
                    // console.log(`invoking ${listener.id} for event ${name}`);
                    listener.fn(...values);
                    // console.log(`done ${listener.id} for event ${name}`);
                }
            });
    },
    /**
     * Removes the listener
     * @param  {String} name The name of the event
     * @param  {String} id   The identifier which was used to add the event listener
     * @return {void}
     */
    remove(name, id) {
        if(_.isEmpty(id)) {
            throw new Error('Second argument \'id\' is not set.');
        }
        if (listeners.hasOwnProperty(name)) {
            _.remove(listeners[name], {
                id: id
            });
            _.remove(currentListeners, {id:id, name:name});
        }
    },
    /**
     * Retrieves a list of functions where the event which they listen on partially matches
     * the event that is emitted.
     * @example
     * server.on('foo::*', func) // will be called
     * server.emit('foo::bar')
     * @example
     * server.on('bar::*', func) // will not be called
     * server.emit('foo::bar')
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getWildCardFn(name) {
        return Object.keys(listeners)
        .filter(function(key) {
            const split = key.split('*');
            return (split.length === 2 && name.slice(0, split[0].length) === split[0]);
        }).map(function(key) {
            return listeners[key];
        }).reduce(function(current, next){
            return current.concat(next);
        }, []) || [];
    }
};

export
default EventListener;
