import CourseCtrl from '../../models/CourseCtrl.js';
import React, {Component, PropTypes} from 'react';
import {ListItem} from 'material-ui/List';
import EditorDragHandle from 'material-ui/svg-icons/editor/drag-handle';
import AddRemoveMove from '../AddRemoveMove.js';
import WarningPopup from '../WarningPopup.js';
import EventServer from '../../models/EventServer.js';
import _ from 'lodash';
import Storage from '../../models/Storage.js';
import {createSource, defaultCollect, createDragSource} from '../dnd/CreateDragSource';

/**
 * The drag and drop list item in the select view.
 * Assumes it is used in the Category context.
 * @example
 * <CourseDndD course={courseObject} warnings={['warning1','warning2']} />
 */
class CourseDnD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            warnings: Storage.getErrors('course', this.props.course.id),
            // The unique identifier of this specifiek instant CourseDnD
            id: `CourseDndD::${this.props.course.id}::${_.uniqueId()}`
        };
    }
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        course: PropTypes.object.isRequired,
        category: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]),
        style: PropTypes.object
    };
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }
    /**
     * Will start listening to course errors to display
     */
    componentWillMount(){
        EventServer.on(`course::error::${this.props.course.id}`, (warnings) => this.setState({
            warnings: warnings.map(warning => warning)
        }), this.state.id);
    }
    componentWillUnmount(){
        EventServer.remove(`course::error::${this.props.course.id}`, this.state.id);
    }
    renderList() {
        const course = CourseCtrl.get(this.props.course.id);
        const style = {
            root: Object.assign({}, this.props.style, {
                marginLeft: 0,
                cursor: 'grab'
            }),
            reportProblem: {
                root: {
                    position: 'absolute',
                    right: 40,
                    top: 0
                }
            }
        };
        return <ListItem
                style={style.root}
                innerDivStyle={style.innerDiv}
                disableTouchRipple
                disableFocusRipple
                primaryText={<div>{course.name} {course.courseName}
                    <WarningPopup warnings={this.state.warnings}
                        style={style.reportProblem}/></div>}
                rightIconButton={<AddRemoveMove move={true}
                    category={this.props.category}
                    style={style.AddRemoveMove} courseId={course.id}/>}
                leftIcon={<EditorDragHandle/>}/>;
    }
    render() {
        // ReactDnD only accepts native elements
        return this.props.connectDragSource(<div key={`coursednd.${this.props.course.id}`}>
            {this.renderList()}</div>);
    }
}

export
default createDragSource(createSource(props => props.category), defaultCollect, CourseDnD);
