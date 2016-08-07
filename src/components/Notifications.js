import React from 'react';
import {Alert} from 'react-bootstrap';
import EventServer from '../models/EventServer.js';

/**
 * Renders the notifications to be shown based on the events that are trigged in the app.
 */
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
    /**
     * When the user clicks on the cross icon in the notifaction.
     * Removes the notifacation.
     */
    onDismiss(){
        this.setState({
            notification: null
        });
    },
    render(){
        const notification = this.state.notification;
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
