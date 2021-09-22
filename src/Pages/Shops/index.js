import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';

//Import Local
import Documents from './Documents';
import FormShop from './Documents/FormShop';

const Shops = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/*Load table products*/}
                    <Route path={`${match.url}/facturas`} component={Documents} />
                    <Route path={`${match.url}/registrardocumento`} component={FormShop} />
                    <Route path={`${match.url}/documento/:id`} component={FormShop} />

                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
)

export default Shops