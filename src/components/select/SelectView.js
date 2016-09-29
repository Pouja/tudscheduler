import './SelectView.css';
import React from 'react';
import CategoryPanel from './CategoryPanel.js';
import CategoryCtrl from '../../models/CategoryCtrl.js';
import EventServer from '../../models/EventServer.js';
import GlobalTrack from './GlobalTrack.js';

/**
 * The select view, renders the isp categorys which are the drop targets for the CourseDnD.
 * Lets the user set up his isp form which should be printed/send.
 */
export default React.createClass({
    componentWillMount() {
        EventServer.on('categories::loaded', () => this.forceUpdate(), 'SelectView');
    },
    componentWillUnmount() {
        EventServer.remove('categories::loaded', 'SelectView');
    },
    render() {
        if(!CategoryCtrl.unlisted || CategoryCtrl.categories.length === 0){
            return null;
        }
        const style = {
            categories: {
                marginBottom: 10
            }
        };
        const unlistedOptions = {
            search: true,
            hideExpand: true,
            onEmpty: 'Add a course from the bar on the left to start creating your study planning',
            onHover: 'Drop'
        };
        const categoryOptions = {
            info: true,
            hideExpand: true,
            onEmpty: 'Drag \'n drop a course here',
            onHover: 'Drop'
        };
        return <div className="select-view">
            <CategoryPanel className="unlisted" key={1} category={CategoryCtrl.unlisted}
                options={unlistedOptions}>
            </CategoryPanel>
            <div className="categories">
                <GlobalTrack style={style.categories}/>
                {CategoryCtrl.categories.
                    filter(function(category){
                        return category.catId !== 'unlisted';
                    }).map(function(category, idx){
                    return <CategoryPanel key={idx} category={category}
                        style={style.categories}
                        options={categoryOptions}/>;
                })}
            </div>
        </div>;
    }
});
