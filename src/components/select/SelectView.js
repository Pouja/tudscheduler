import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ISPField from './ISPField.js';
import ISPCtrl from '../../models/ISPCtrl.js';
import EventServer from '../../models/EventServer.js';

/**
 * The select view, renders the isp fields which are the drop targets for the CourseDnD.
 * Lets the user set up his isp form which should be printed/send.
 */
const SelectView = React.createClass({
    componentWillMount() {
        EventServer.on('ispfields.loaded', () => this.forceUpdate());
    },
    render() {
        if(!ISPCtrl.unlisted || ISPCtrl.categories.length === 0){
            return null;
        }
        const style = {
            fields: {
                marginBottom: 10
            }
        };
        const unlistedOptions = {
            search: true,
            hideExpand: true,
            onEmpty: 'Add a course from the bar on the left to start creating your ISP',
            onHover: 'Drop'
        };
        const fieldOptions = {
            info: true,
            hideExpand: true,
            onEmpty: 'Drag \'n drop a course here',
            onHover: 'Drop'
        };
        return <div className="select-view">
            <ISPField className="unlisted" category={ISPCtrl.unlisted}
                options={unlistedOptions}>
            </ISPField>
            <div className="fields">
                {ISPCtrl.categories.
                    filter(function(category){
                        return category.id !== 'unlisted';
                    }).map(function(category, index){
                    return <ISPField key={index} category={category}
                        style={style.fields}
                        options={fieldOptions}/>;
                })}
            </div>
        </div>;
    }
});

module.exports = DragDropContext(HTML5Backend)(SelectView);//eslint-disable-line new-cap
