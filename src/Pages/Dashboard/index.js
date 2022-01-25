import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import Charts from './Charts';

const Dashboard = ({ match }) => {
    return (
        <Fragment>
            <AppHeader />
            <div className="app-main">
                <AppSidebar />
                <div className="app-main__outer">
                    <div className="app-main__inner">

                        <Route path={`${match.url}/dashboard`} component={Charts} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Dashboard;