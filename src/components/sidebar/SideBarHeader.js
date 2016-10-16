import React, {PropTypes} from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import EventServer from '../../models/EventServer.js';
import FacultyCtrl from '../../models/FacultyCtrl.js';
import DialogCtrl from '../../models/DialogCtrl.js';
import _ from 'lodash';
import ToolbarSearch from '../Toolbars/ToolbarSearch';
import ToolbarCollapse from '../Toolbars/ToolbarCollapse';

export default React.createClass({
    propTypes: {
        toggleView: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            collapsed: false,
            searching: false,
            showSettings: false,
            faculty: '',
            master: '',
            track: ''
        };
    },
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    },
    componentDidMount(){
        this.setTitle();
        this.startListening();
    },
    componentWillUnmount() {
        EventServer.remove('masters::loaded', 'SideBarHeader');
    },
    startListening(){
        EventServer.on('masters::loaded', this.setTitle, 'SideBarHeader');
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
     * Called when the TextField changes.
     * Sets the new search value.
     * @param  {Object} event The event object of the change event.
     * @param {String} value The input value
     */
    onChange(event, value) {
        EventServer.emit('course::searching', value);
    },
    openSettings() {
        DialogCtrl.open('TrackSelection');
    },
    toggleView() {
        const collapsed = !this.state.collapsed;
        this.setState({
            collapsed: collapsed
        }, () => {
            this.props.toggleView(collapsed);
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
    renderSearch(){
        const style = {
            display: this.state.collapsed ? 'none' : 'flex'
        };
        return <ToolbarSearch style={style}
            placeholder="Search, ex algorithm ec:4 period:3"
            onChange={this.onChange}/>;
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
                display: 'block',
                flexBasis: '70%'
            },
            title: {
                fontSize: '20px',
                color: 'rgba(0,0,0, 0.4)'
            },
            subTitle: {
                fontSize: '16px',
                color: 'rgba(0,0,0, 0.4)'
            },
            control: {
                marginRight: 10
            }
        };
        return <Toolbar style={style.root}>
            <ToolbarGroup>
                <ToolbarGroup style={style.control}>
                    {this.renderControl()}
                </ToolbarGroup>
                <ToolbarGroup style={style.titleGroup}>
                    <span style={style.subTitle}>{this.state.faculty} \ {this.state.master}</span><br/>
                    <span style={style.title}>{this.state.track}</span>
                </ToolbarGroup>
                <ToolbarCollapse toggleView={this.toggleView} collapsed={this.state.collapsed}/>
            </ToolbarGroup>
            {this.renderSearch()}
        </Toolbar>;
    }
});
