import React from 'react';
import {Alert} from 'react-bootstrap';
import EventServer from '../models/EventServer.js';

export default React.createClass({
    getInitialState(){
        return {
            notification: null
        };
    },
    componentDidMount(){
        EventServer.on('saved', () => this.setState({
            notification: {
                msg: 'Saved to your local storage',
                style: 'success'
            }
        }));
        EventServer.on('load.error.nosave', () => this.setState({
            notification: {
                msg: 'No save found.',
                style: 'danger'
            }
        }));
    },
    onDismiss(){
        this.setState({
            notification: null
        });
    },
    render(){
        var notification = this.state.notification;
        if (notification !== null){
            return <div className="alerts">
                <Alert
                    bsSize="medium"
                    bsStyle={notification.style}
                    onDismiss={this.onDismiss}>
                    <p>{notification.msg}</p>
                </Alert>
            </div>;
        }
        return null;
    }
});
