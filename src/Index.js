import './Index.css';
import Storage from './models/Storage.js';
import React from 'react';
import {render} from 'react-dom';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './Routes.js';
// Init the storage to start listening on change events
Storage.init();

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500
    }
});

/**
 * Main entry point of React and the whole application
 * @type {React.element}
 */
const App = <MuiThemeProvider muiTheme={muiTheme}><Routes/></MuiThemeProvider>;
render(App, document.getElementById('react'));
