import EventServer from './EventServer';

const YearCtrl = {
    years: [],
    init(years) {
        YearCtrl.years = years;
        EventServer.emit('years::loaded');
    },
    get(yearId) {
        return YearCtrl.years.find(yearModel => yearModel.year === yearId);
    }
};
export default YearCtrl;
