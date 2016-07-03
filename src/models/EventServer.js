import _ from 'lodash';

var listeners = {};
/**
 * A simple EventListeners.
 * There are other modules that have the exact functionality and are tested.
 * But since it is trivial and I need to profile the performance (which was hard or impossible in other modules) I created my one.
 * @type {Object}
 */
var EventListener = {
    flush() {
        listeners = {};
    },
    /**
     * Will call fn when 'name' event is emitted.
     * @param  {String}   name The name of the event to listen on.
     * @param  {Function} fn   The function to be invoked.
     * @param {String} id An identifier for debugging purposes.
     * @returns {void}
     */
    on(name, fn, id) {
        if (!listeners.hasOwnProperty(name)) {
            listeners[name] = [];
        }
        if(!_.isFunction(fn)){
            throw new Error(`EventServer expected a function as second argument but got ${typeof fn} with id ${id}`);
        }
        listeners[name].push({
            id: id,
            fn: fn
        });
    },
    /**
     * Emit the event
     * @param  {String}    name   The name of the event.
     * @param  {Array} values The values that should be sent with the emit.
     * @returns {void}
     */
    emit(name, ...values) {
        if (listeners.hasOwnProperty(name)) {
            listeners[name].forEach(function(listener) {
                setTimeout(function() {
                    if (listener === null || listener === undefined) {
                        console.error(`EventServer supposed to invoke a listener ${name} for id ${listener.id}. But the listener got removed.`);
                    } else {
                        // console.log(`invoking ${listener.id} for event ${name}`);
                        listener.fn(...values);
                        // console.log(`done ${listener.id} for event ${name}`);
                    }
                });
            });
        }
    },
    /**
     * Removes the listener
     * @param  {String} name The name of the event
     * @param  {String} id   The identifier which was used to add the event listener
     * @return {void}
     */
    remove(name, id) {
        if (listeners.hasOwnProperty(name)) {
            _.remove(listeners[name], {
                id: id
            });
        }
    },
    /**
     * Partial call emit, this is usefull when you want to emit this when a dom event occurs.
     * For example: onClick(EventListener.partialEmit('click', 'some', 'values')).
     * @param  {String}    name   The name of the event.
     * @param  {Array} values     The values that should be sent with the emit.
     * @return {Function}         A partial function of EventListener.emit
     */
    partialEmit(name, ...values) {
        return _.partial(EventListener.emit, name, ...values);
    }
};

export
default EventListener;
