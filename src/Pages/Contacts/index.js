import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';

//Products
import Carriers from "./Carriers";
import Customers from "./Customers";
import Providers from "./Providers";
import FormProvider from './Providers/FormProvider';
import FormCustomer from './Customers/FormCustomer';
import FormCarrier from './Carriers/FormCarrier';

const Contacts = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">

                    <Route path={`${match.url}/clientes`} component={Customers} />
                    <Route path={`${match.url}/nuevocliente`} component={FormCustomer} />
                    <Route path={`${match.url}/cliente/:id`} component={FormCustomer} />

                    <Route path={`${match.url}/proveedores`} component={Providers} />
                    <Route path={`${match.url}/nuevoproveedor`} component={FormProvider} />
                    <Route path={`${match.url}/proveedor/:id`} component={FormProvider} />

                    <Route path={`${match.url}/transportistas`} component={Carriers} />
                    <Route path={`${match.url}/nuevotransportista`} component={FormCarrier} />
                    <Route path={`${match.url}/transportista/:id`} component={FormCarrier} />

                </div>
            </div>
        </div>
    </Fragment>
);

export default Contacts;