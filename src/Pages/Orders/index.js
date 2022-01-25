import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';

//Import Local
import Invoices from './Invoices';
import CreateInvoice from './Invoices/CreateInvoice/index';

const Orders = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/*Load table facturas*/}
                    <Route path={`${match.url}/facturas`} component={Invoices} />
                    <Route path={`${match.url}/registrarfactura`} component={CreateInvoice} />
                    <Route path={`${match.url}/factura/:id`} component={CreateInvoice} />
                </div>
            </div>
        </div>
    </Fragment>
)

export default Orders