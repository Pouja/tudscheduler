import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
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
    getInitialState() {
        return {
            loaded: false
        };
    },
    componentWillMount() {
        EventServer.on('ispfields.loaded', () => this.setState({
            loaded: true
        }));
    },
    render() {
        if(!this.state.loaded) {
            return null;
        }
        const unlistedOptions = {
            search: true,
            hideExpand: true,
            onEmpty: 'Add a course from the bar on the left to start creating your ISP',
            onHover: 'Drop'
        };
        const fieldOptions = {
            info: true,
            hideExpand: true,
            onEmpty: 'Drag \'n 2drop a course here',
            onHover: 'Drop'
        };
        return <div id="select-view">
            <ISPField className="col-xs-12 col-md-6" category={ISPCtrl.unlisted}
                options={unlistedOptions}>
            </ISPField>
            <div className="col-xs-12 col-md-6">
                {ISPCtrl.categories.
                    filter(function(category){
                        return category.id !== 'unlisted';
                    }).map(function(category, index){
                    return <ISPField key={index} category={category} options={fieldOptions}></ISPField>;
                })}
            </div>
        </div>;
    }
});

module.exports = DragDropContext(HTML5Backend)(SelectView);
