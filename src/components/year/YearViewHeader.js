import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Badge from '../Badge.js';
import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import YearCtrl from '../../models/YearCtrl';
import EventServer from '../../models/EventServer.js';
import ToolbarCollapse from '../Toolbars/ToolbarCollapse';
import _ from 'lodash';

export default React.createClass({
    propTypes: {
        year: React.PropTypes.number.isRequired,
        toggleView: React.PropTypes.func.isRequired
    },
    getInitialState(){
        return Object.assign(this.calcEcts(),
            {id: `YearViewHeader::${this.props.year}`
        });
    },
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    },
    componentDidMount() {
        EventServer.on('years::loaded', () => this.updateEcts(), this.state.id);
        EventServer.on('year::added::*', () => this.updateEcts(), this.state.id);
        EventServer.on('year::removed::*', () => this.updateEcts(), this.state.id);
    },
    componentWillUnmount(){
        EventServer.remove('years::loaded', this.state.id);
        EventServer.remove('year::added::*', this.state.id);
        EventServer.remove('year::removed::*', this.state.id);
    },
    updateEcts() {
        this.setState(this.calcEcts());
    },
    calcEcts() {
        const yearModel = YearCtrl.get(this.props.year);
        if (yearModel) {
            return {
                ects: [1,2,3,4].map((index) =>
                    _.round(CourseCtrl.periodEcts(index, yearModel.courses), 1)),
                yearEcts: CourseCtrl.sumEcts(yearModel.courses.map(id => {
                    return {id: id};
                })) || 0,
                totalEcts: CourseCtrl.addedEcts() || 0
            };
        }
        return {
            ects: [0,0,0,0],
            totalEcts: 0,
            yearEcts: 0
        };
    },
    render(){
        const style = {
            root: {
                height: 'auto',
                display: 'flex',
                padding: 5,
                flexDirection: 'column',
                color: 'rgba(0,0,0,0.4)'
            },
            title: {
                flexBasis: '100%'
            },
            ects: {
                justifyContent: 'space-around'
            }
        };
        return <Toolbar style={style.root}>
            <ToolbarGroup style={style.totalEcts}>
                <ToolbarGroup>
                    {`Total ects: ${this.state.yearEcts}/${this.state.totalEcts}`}<br/>
                    {this.props.year}/{this.props.year + 1}
                </ToolbarGroup>
                <ToolbarCollapse toggleView={this.props.toggleView}/>
            </ToolbarGroup>
            <ToolbarGroup style={style.ects}>
            {this.state.ects.map(function(ects, index){
                const qBadge = `Q${index + 1}`;
                return <span key={index}>
                    {`${qBadge} `}<Badge>EC {ects}</Badge>
                </span>;
            })}
            </ToolbarGroup>
        </Toolbar>;
    }
});
