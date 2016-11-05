import React,{PropTypes} from 'react';
import YearCtrl from '../../models/YearCtrl';
import EventServer from '../../models/EventServer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import YearViewPanel from './YearViewPanel';
export
default React.createClass({
    getInitialState() {
        return {
            nrYears: YearCtrl.years.length
        };
    },
    propTypes:{
        className: PropTypes.string
    },
    shouldComponentUpdate(nextState){
        return this.state.nrYears !== nextState.nrYears;
    },
    componentWillMount() {
        EventServer.on('years::changed', () => {
            this.setState({
                nrYears: YearCtrl.years.length
            });
        }, 'YearView');
    },
    componentWillUnmount() {
        EventServer.remove('years::changed', 'YearView');
    },
    renderYear(yearModel) {
        return <YearViewPanel className={this.props.className} key={yearModel.year} year={yearModel.year}/>;
    },
    render() {
        const style = {
            display: 'flex',
            justifyContent: 'space-around'
        };
        if (this.state.nrYears > 0) {
            return <div>
                {YearCtrl.years.map(this.renderYear)}
                <div style={style}>
                    <FloatingActionButton onTouchTap={YearCtrl.add}>
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
            </div>;
        }
        return null;
    }
});
