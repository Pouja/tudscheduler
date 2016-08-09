const listeners = [];

/**
 * Usefull to control a dialog.
 * This allows you to only have one dialog for each type of dialog.
 */

export default {
    /**
     * Add a hook
     * @param  {Function} func The callback called
     * @param  {String} name The identifier
     */
    onOpen(func, name){
        if(typeof func !== 'function') {
            throw new Error(`DialogCtrl::onOpen inproper argument supplied expected function as first argument but got ${typeof func}`);
        }
        listeners[name] = func;
    },
    /**
     * Opens a dialog
     * @param  {String}    name   The name of the dialog to open
     * @param  {Any} values The arguments to pass
     */
    open(name, ...values){
        if(listeners[name]) {
            listeners[name](...values);
        }
    },
    /**
     * Removes a dialog
     * @param  {String} name The identifier to remove
     */
    remove(name) {
        delete listeners[name];
    }
};
