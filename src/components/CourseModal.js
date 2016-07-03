import React from 'react';
import {Modal} from 'react-bootstrap';

/**
 * Renders the detailed information of a course.
 */
export default React.createClass({
    propTypes:{
        closeModal: React.PropTypes.func.isRequired
    },
    getInitialState(){
        return {
            show: this.props.show
        };
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            show: nextProps.show
        });
    },
    render(){
        var course = this.props.course;

        // Filter which attributes we dont want to show
        var filterKeys = ['depth', 'nr', 'parent', 'children', 'id'];

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
