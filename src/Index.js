import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, IndexRedirect} from 'react-router';
import SideBar from './components/sidebar/SideBar.js';
import YearView from './components/year/YearView.js';
import Notifications from './components/Notifications.js';
import SelectView from './components/select/SelectView.js';

window.React = React;
// window.Perf = React.addons.Perf;

const App = React.createClass({
    render() {
        return (<div className="row">
            <Notifications/>
            <SideBar className="col-xs-12 col-md-5 col-lg-4"/>
            <div className="col-xs-12 col-md-7 col-lg-8">
                {this.props.children}
            </div>
        </div>);
    }
});

const routes = <Router history={hashHistory}>
    <Route path="/" component={App}>
        <IndexRedirect to="/year"/>
        <Route path="year" component={YearView}/>
        <Route path="select" component={SelectView}/>
    </Route>
</Router>;

render(routes, document.getElementById('react'));
