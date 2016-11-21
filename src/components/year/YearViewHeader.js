import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Badge from '../Badge.js';
import React from 'react';
import CourseCtrl from '../../models/CourseCtrl.js';
import YearCtrl from '../../models/YearCtrl';
import EventServer from '../../models/EventServer.js';
import ToolbarCollapse from '../Toolbars/ToolbarCollapse';
import _ from 'lodash';
import YearSettings from './YearSettings';

/**
 * Shows the year, settings and the total ects over all the years, for this year and per quarter.
 * @example
 * <YearViewHeader year={2016}/>
 */
export default React.createClass({
    propTypes: {
        year: React.PropTypes.number.isRequired,
        toggleView: React.PropTypes.func.isRequired
    },
    getInitialState(){
        return Object.assign(this.calcEcts(),
            {
                id: `YearViewHeader::${this.props.year}`,
                mode: YearCtrl.mode
            }
        );
    },
    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    },
    componentDidMount() {
        EventServer.on('year::added::*', () => this.setState(this.calcEcts()), this.state.id);
        EventServer.on('year::removed::*', () =>this.setState(this.calcEcts()), this.state.id);
        EventServer.on('years::mode', (mode) => this.setState(this.calcEcts(mode)), this.state.id);
    },
    componentWillUnmount(){
        EventServer.remove('year::added::*', this.state.id);
        EventServer.remove('year::removed::*', this.state.id);
        EventServer.remove('years::mode', this.state.id);
    },
    /**
     * Calculates the ects for each quarter and total for this year filtered on the user selected mode.
     * @param {number} mode The mode to apply to filter the courses for calculating the ects. See YearSettings for which modes there are.
     * @return {Object} the ects.
     */
    calcEcts(mode) {
        const yearModel = YearCtrl.get(this.props.year);
        const courses = YearCtrl.applyMode(yearModel.courses, mode);
        if (yearModel) {
            return {
                ects: [1,2,3,4].map((index) =>
                    _.round(CourseCtrl.periodEcts(index, courses), 1)),
                yearEcts: CourseCtrl.sumEcts(courses.map(id => {
                    return {id: id};
                })) || 0,
                totalEcts: CourseCtrl.addedEcts() || 0
            };
        }
        return {
            // Ects for each quarter filtered based on the user selected mode.
            ects: [0,0,0,0],
            // The total ects over all the years
            totalEcts: 0,
            // The total ects for this year filtered base on the user selected mode.
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
                    <YearSettings year={this.props.year}/>
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
