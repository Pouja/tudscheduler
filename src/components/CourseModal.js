import React from 'react';
import {Modal} from 'react-bootstrap';
import request from 'superagent';
import CourseCtrl from '../models/CourseCtrl.js';

/**
 * Renders the detailed information of a course.
 */
export default React.createClass({
    propTypes:{
        closeModal: React.PropTypes.func.isRequired,
        show: React.PropTypes.bool.isRequired,
        course: React.PropTypes.object.isRequired,
        'course.children': React.PropTypes.array
    },
    getInitialState(){
        return {
            show: this.props.show,
            course: {}
        };
    },
    componentWillMount(){
        if(this.props.course.children.length > 0) {
            this.setState({
                course: CourseCtrl.get(this.props.course.id)
            });
        } else {
            request.get(`src/data/course-${this.props.course.id}.json`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                this.setState({
                    course: res.body
                });
            });
        }

    },
    componentWillReceiveProps(nextProps){
        this.setState({
            show: nextProps.show
        });
    },
    render(){
        const course = this.state.course;

        // Filter which attributes we dont want to show
        const filterKeys = ['courseName', 'depth', 'nr', 'parent', 'children', 'id'];

        return <Modal show={this.state.show} onHide={this.props.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>{course.name} {course.courseName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <dl>
                {Object.keys(course).map(function(key){
                    if (filterKeys.indexOf(key) !== -1){
                        return null;
                    }
                    return [<dt>{key}</dt>, <dd>{course[key]}</dd>];
                })}
                </dl>
            </Modal.Body>
        </Modal>;
    }
});
