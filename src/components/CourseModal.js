import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import request from 'superagent';
import CourseCtrl from '../models/CourseCtrl.js';
import DialogCtrl from '../models/DialogCtrl.js';
import _ from 'lodash';

/**
 * Renders the detailed information of a course.
 */
export
default React.createClass({
    getInitialState() {
        return {
            show: false,
            course: null
        };
    },
    componentWillMount() {
        DialogCtrl.onOpen((courseId) => this.setCourse(courseId), 'CourseModal');
    },
    setCourse(courseId) {
        if (CourseCtrl.isAGroup(courseId)) {
            this.setState({
                show: true,
                course: CourseCtrl.get(courseId)
            });
        } else {
            request.get(`http://localhost:8000/courseDetail/${courseId}`)
                .accept('application/json')
                .end((err, res) => {
                    this.setState({
                        course: res.body,
                        show: true
                    });
                });
        }
    },
    close() {
        this.setState({
            show: false
        });
    },
    render() {
        if(!this.state.show || !this.state.course){
            return null;
        }
        const course = this.state.course;

        // Filter which attributes we dont want to show
        const filterKeys = ['courseName', 'depth', 'nr', 'parent', 'children', 'id'];

        const actions = [
            <FlatButton label="Close" primary={true} onTouchTap={this.close}/>
        ];
        const style = {
            root: {
                margin: '10px 0'
            },
            p: {
                margin: '10px 0'
            },
            header: {
                fontWeight: 'bold',
                width: '100%',
                marginRight: 10
            }
        };
        return <Dialog
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            title={course.courseName || course.name}
            actions={actions}
            open={this.state.show}
            onRequestClose={this.close}>
                <div style={style.root}>
                {Object.keys(course)
                    .filter(key => filterKeys.indexOf(key) === -1)
                    .map(function(key, idx){
                        return <p style={style.p} key={idx}>
                            <span style={style.header}>{_.upperFirst(key)}</span><br/>
                            <span>{course[key]}</span>
                        </p>;
                    })
                }
                </div>
        </Dialog>;
    }
});
