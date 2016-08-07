import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Badge from '../Badge.js';
import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import EventServer from '../../models/EventServer.js';
const id = 'YearViewHeader';

export default React.createClass({
    getInitialState(){
        return {
            ects: [0,0,0,0],
            totalEcts: 0
        };
    },
    componentDidMount() {
        EventServer.on('added', () => this.updateEcts(), id);
        EventServer.on('removed', () => this.updateEcts(), id);
        EventServer.on('courses.loaded', () => this.updateEcts(), id);
    },
    componentWillUnmount(){
        EventServer.remove('added', id);
        EventServer.remove('removed', id);
        EventServer.remove('courses.loaded', id);
    },
    updateEcts() {
        this.setState({
            ects: this.state.ects.map((v, index) => Math.floor(CourseCtrl.periodEcts(index))),
            totalEcts: CourseCtrl.addedEcts()
        });
    },
    render(){
        const style = {
            root: {
            padding: 10,
            flexDirection: 'column',
            color: 'rgba(0,0,0,0.4)'},
            totalEcts: {
                flexBasis: '100%'
            },
            ects: {
                justifyContent: 'space-around'
            }
        };
        return <Toolbar style={style.root}>
            <ToolbarGroup>
                <span style={style.totalEcts}>Total ects: {this.state.totalEcts}</span>
            </ToolbarGroup>
            <ToolbarGroup style={style.ects}>
            {this.state.ects.map(function(ects, index){
                return <span key={index}>
                    {`Q${index + 1} `}<Badge>EC {ects}</Badge>
                </span>;
            })}
            </ToolbarGroup>
        </Toolbar>;
    }
});
