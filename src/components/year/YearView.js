import React,{PropTypes} from 'react';
import YearViewBody from './YearViewBody.js';
import YearViewHeader from './YearViewHeader.js';
import DropPanel from '../dnd/DropPanel.js';
import YearCtrl from '../../models/YearCtrl';
import EventServer from '../../models/EventServer';

export
default React.createClass({
    getInitialState() {
        return {
            loaded: false
        };
    },
    propTypes:{
        className: PropTypes.string
    },
    shouldComponentUpdate(nextState){
        return this.state.loaded !== nextState.loaded;
    },
    componentWillMount() {
        EventServer.on('years::loaded', () => {
            this.setState({
                loaded: true
            });
        }, 'YearView');
    },
    renderYear(yearModel) {
        const style = {
            dropPanel: {
                minWidth: 500,
                marginBottom: 10
            }
        };
        return <DropPanel key={yearModel.year}
            id='yearview' style={style.dropPanel} className={this.props.className} >
            <YearViewHeader year={yearModel.year}/>
            <YearViewBody year={yearModel.year}/>
        </DropPanel>;
    },
    render() {
        if (this.state.loaded) {
            return <div>{YearCtrl.years.map(this.renderYear)}</div>;
        }
        return null;
    }
});
