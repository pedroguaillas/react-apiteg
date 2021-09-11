import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

//Import Local
import Documents from './Documents';
import CreateDocument from './Documents/CreateDocument'
import EditDocument from './Documents/EditDocument'

const Invoices = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/*Load table products*/}
                    <Route path={`${match.url}/documentos`} component={Documents} />
                    <Route path={`${match.url}/registrardocumento`} component={CreateDocument} />
                    <Route path={`${match.url}/documento/:id`} component={EditDocument} />

                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
)

export default Invoices