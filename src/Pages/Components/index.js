import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import ModalsExample from './Modal/';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Components = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    <Route path={`${match.url}/modals`} component={ModalsExample}/>

                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Components;