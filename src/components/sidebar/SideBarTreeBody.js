import React from 'react';
import {List} from 'material-ui/List';
import CourseCtrl from '../../models/CourseCtrl.js';
import _ from 'lodash';
import EventServer from '../../models/EventServer.js';
import FacultyCtrl from '../../models/FacultyCtrl.js';
import CourseTree from './CourseTree.js';

export default React.createClass({
    getInitialState() {
        return {
            tree: CourseCtrl.flatten(null, null, 'nr')
        };
    },
    componentDidMount() {
        EventServer.on('courses.loaded', ()=> this.setState({
            tree: CourseCtrl.flatten(null, null, 'nr')
        }));
    },
    render(){
        if(_.isEmpty(this.state.tree) && FacultyCtrl.selectedTrack()){
            return <div className='empty'>
                The selected track <strong>{FacultyCtrl.selectedTrack().name}</strong> has no courses.
            </div>;
        } else if(_.isEmpty(this.state.tree) && !FacultyCtrl.selectedTrack()){
            return <div className='empty'>
                No track selected. Click on the gear icon to select a track.
            </div>;
        }
        const rows = this.state.tree
            .map(function(child) {
                const visible = child.parent === 1;
                return <CourseTree key={child.nr}
                    filtering={false}
                    visible={visible}
                    course={child}/>;
            });

        return <List>
                {rows}
            </List>;
    }
});

