import './Index.css';
import React from 'react';
import {render} from 'react-dom';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from './Routes.js';
import Storage from './models/Storage';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#008cba',
        accent1Color: deepOrange500
    }
});

console.log(`Hi. Seems that you are interested in the internals of this project.
    If you have any feedback/improvement about the layout or the internals you can make an issues/pr at
    https://github.com/Pouja/tudscheduler. Have a nice day :).`);

Storage.init().then(() => {
    /**
     * Main entry point of React and the whole application
     * @type {React.element}
     */
    const App = <MuiThemeProvider muiTheme={muiTheme}><Routes/></MuiThemeProvider>;
    render(App, document.getElementById('react'));
});
