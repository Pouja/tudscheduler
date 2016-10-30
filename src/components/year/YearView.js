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
            loaded: YearCtrl.years.length
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
                loaded: YearCtrl.years.length
            });
        }, 'YearView');
    },
    componentWillUnmount() {
        EventServer.remove('years::loaded', 'YearView');
    },
    renderYear(yearModel) {
        return <YearViewPanel className={this.props.className} key={yearModel.year} year={yearModel.year}/>;
    },
    render() {
        const style = {
            display: 'flex',
            justifyContent: 'space-around'
        };
        if (this.state.loaded > 0) {
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
