import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

//Import Local
import Invoices from './Invoices';
import CreateInvoice from './Invoices/CreateInvoice/index';

const ReferralGuides = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/*Load table facturas*/}
                    <Route path={`${match.url}/index`} component={Invoices} />
                    <Route path={`${match.url}/nuevo`} component={CreateInvoice} />
                    <Route path={`${match.url}/editar/:id`} component={CreateInvoice} />
                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
)

export default ReferralGuides