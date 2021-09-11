import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

//Products
import ListContact from "./Contact";
import Customers from "./Customers";
import CreateCustomer from './Customers/CreateCustomer';
import Providers from "./Providers";
import Transportistas from "./Dispatcher";
import CreateContact from './Contact/CreateContact';
import EditContact from './Contact/EditContact';
import EditCustomer from './Customers/EditCustomer';

const Contacts = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/*Load table products*/}
                    <Route path={`${match.url}/contactos`} component={ListContact} />
                    <Route path={`${match.url}/nuevocontacto`} component={CreateContact} />
                    <Route path={`${match.url}/contacto/:id`} component={EditContact} />

                    <Route path={`${match.url}/clientes`} component={Customers} />
                    <Route path={`${match.url}/nuevocliente`} component={CreateCustomer} />
                    <Route path={`${match.url}/cliente/:id`} component={EditCustomer} />
                    <Route path={`${match.url}/proveedores`} component={Providers} />
                    <Route path={`${match.url}/transportistas`} component={Transportistas} />
                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
);

export default Contacts;