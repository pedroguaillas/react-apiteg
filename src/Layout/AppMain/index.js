import React, { Suspense, lazy, Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Shops from '../../Pages/Shops';
import PrivateRoute from './PrivateRoute';

const Login = lazy(() => import('../../Pages/Auth/Login'));
const NuevaCuenta = lazy(() => import('../../Pages/Auth/NuevaCuenta'));

const Business = lazy(() => import('../../Pages/Business'));
const Inventories = lazy(() => import('../../Pages/Inventories'));
const Orders = lazy(() => import('../../Pages/Orders'));
const Invoices = lazy(() => import('../../Pages/Invoices'));
const Contacts = lazy(() => import('../../Pages/Contacts'));
const Accounting = lazy(() => import('../../Pages/Accounting'));

const Components = lazy(() => import('../../Pages/Components'));


const AppMain = () => {

    return (
        <Fragment>

            {/* Profile */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <PrivateRoute path="/empresa" component={Business} />
            </Suspense>

            {/* Inventories */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/inventarios" component={Inventories} />
            </Suspense>

            {/* Orders */}
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/ventas" component={Orders} />
            </Suspense>

            {/* Shops */}
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/compras" component={Shops} />
            </Suspense>

            {/* Invoices */}
            {/* <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/facturacion" component={Invoices} />
            </Suspense> */}

            {/* Contacts */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/contactos" component={Contacts} />
            </Suspense>

            {/* ChartOfAccountsNav */}

            {/* <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/contabilidad" component={Accounting} />
            </Suspense> */}

            {/* Components */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components examples
                            <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/components" component={Components} />
            </Suspense>

            {/* Login */}
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Dashboards examples
                            <small>Because this is a demonstration, we load at once all the Dashboards examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/login" component={Login} />
            </Suspense>

            {/* Login */}
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Dashboards examples
                            <small>Because this is a demonstration, we load at once all the Dashboards examples. This wouldn't happen in a real live app!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/nueva-cuenta" component={NuevaCuenta} />
            </Suspense>

            <Route exact path="/" render={() => (
                <Redirect to="/login" />
                // <Redirect to="/dashboards/basic" />
            )} />
            <ToastContainer />
        </Fragment>
    )
};

export default AppMain;