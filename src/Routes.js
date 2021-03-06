import React from 'react';
import {Router, Route, hashHistory, IndexRedirect} from 'react-router';
import SelectView from './components/select/SelectView.js';
import YearView from './components/year/YearView.js';
import Main from './Main.js';
/**
 * Defines the routes and which component should be loaded when that route is selected.
 */
export default React.createClass({
    render(){
        return <Router history={hashHistory}>
            <Route path="/" component={Main}>
                <IndexRedirect to="year"/>
                <Route path="year" component={YearView}/>
                <Route path="select" component={SelectView}/>
            </Route>
        </Router>;
    }
});
