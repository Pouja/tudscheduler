import React, {PropTypes} from 'react';
import TrackSelection from './TrackSelection';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import TextField from 'material-ui/TextField';
import EventServer from '../../models/EventServer.js';
import FacultyCtrl from '../../models/FacultyCtrl.js';

import _ from 'lodash';

export default React.createClass({
    propTypes: {
        setFilter: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            searching: false,
            showSettings: false,
            faculty: '',
            master: '',
            track: ''
        };
    },
    componentDidMount(){
        this.setTitle();
        this.startListening();
    },
    startListening(){
        EventServer.on('masters.loaded', this.setTitle);
    },
    setTitle(){
        if(FacultyCtrl.selectedTrack() === undefined) {
            this.setState({
                faculty: '',
                master: '',
                track: ''
            });
        } else {
            this.setState({
                faculty: FacultyCtrl.selectedFaculty().name,
                master: FacultyCtrl.selectedMaster().name,
                track: FacultyCtrl.selectedTrack().name
            });
        }
    },
    /**
     * Called when the DebounceInput changes.
     * Sets the new search value.
     * @param  {Object} event The event object of the change event.
     * @param {String} value The input value
     */
    onChange(event, value) {
        this.props.setFilter(value.length > 0);
        EventServer.emit('course.searching', value);
    },
    openSettings() {
        this.setState({
            showSettings: true
        });
    },
    closeSettings(){
        this.setState({
            showSettings: false
        });
    },
    renderControl(){
        const style = {
            margin: '7px 0px 7px 2px'
        };
        const setting = <FloatingActionButton style={style}
            zDepth={1} mini={true} onTouchTap={this.openSettings}>
            <ActionSettings/></FloatingActionButton>;
        return <div>{setting}</div>;
    },
    render(){
        const style = {
            root: {
                display: 'flex',
                flexDirection: 'column',
                height: 'auto'
            },
            titleGroup: {
                lineHeight: '26px',
                display: 'block'
            },
            title: {
                fontSize: '20px',
                color: 'rgba(0,0,0, 0.4)'
            },
            subTitle: {
                fontSize: '16px',
                color: 'rgba(0,0,0, 0.4)'
            }
        };
        return <Toolbar style={style.root}>
            <ToolbarGroup>
                <ToolbarGroup style={style.titleGroup}>
                    <span style={style.subTitle}>{this.state.faculty} \ {this.state.master}</span><br/>
                    <span style={style.title}>{this.state.track}</span>
                    </ToolbarGroup>
                <ToolbarGroup>
                    {this.renderControl()}
                    <TrackSelection close={this.closeSettings}
                        show={this.state.showSettings}/>
                </ToolbarGroup>
            </ToolbarGroup>
            <ToolbarGroup>
                <TextField hintText="Search through the courses" fullWidth={true}
                    onChange={_.debounce(this.onChange, 200)}/>
            </ToolbarGroup>
        </Toolbar>;
    }
});
