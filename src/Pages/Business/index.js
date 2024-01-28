import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';

import Profile from "./Profile";
import Branch from "./Branch";
import Point from "./Branch/Point";

const Business = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/perfil`} component={Profile} />
                    <Route path={`${match.url}/establecimientos`} component={Branch} />
                    <Route path={`${match.url}/establecimiento/:id`} component={Point} />
                </div>
            </div>
        </div>
    </Fragment>
);

export default Business;