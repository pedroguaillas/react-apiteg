import React, { Suspense, lazy, Fragment } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './PrivateRoute';

const Login = lazy(() => import('../../Pages/Auth/Login'));
const NuevaCuenta = lazy(() => import('../../Pages/Auth/NuevaCuenta'));

const Dashboard = lazy(() => import('../../Pages/Dashboard'));
const Business = lazy(() => import('../../Pages/Business'));
const Inventories = lazy(() => import('../../Pages/Inventories'));
const Orders = lazy(() => import('../../Pages/Orders'));
const Shops = lazy(() => import('../../Pages/Shops'));
const Contacts = lazy(() => import('../../Pages/Contacts'));
const ReferralGuides = lazy(() => import('../../Pages/ReferralGuides'));

const Components = lazy(() => import('../../Pages/Components'));


const AppMain = () => {

    return (
        <Fragment>

            {/* Dashboard */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Espere
                            <small>Se encuetra cargando ...!</small>
                        </h6>
                    </div>
                </div>
            }>
                <PrivateRoute path="/dashboard" component={Dashboard} />
            </Suspense>

            {/* Profile */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Espere
                            <small>Se encuetra cargando ...!</small>
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
                            Espere
                            <small>Se encuetra cargando ...!</small>
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
                            Espere
                            <small>Se encuetra cargando ...!</small>
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
                            Espere
                            <small>Se encuetra cargando ...!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/compras" component={Shops} />
            </Suspense>

            {/* Invoices */}
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Espere
                            <small>Se encuetra cargando ...!</small>
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/guiasremision" component={ReferralGuides} />
            </Suspense>

            {/* Contacts */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Espere
                            <small>Se encuetra cargando ...!</small>
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
                            Espere
                            <small>Se encuetra cargando ...!</small>
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
                            Espere
                            <small>Se encuetra cargando ...!</small>
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
                            Espere
                            <small>Se encuetra cargando ...!</small>
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
                            Espere
                            <small>Se encuetra cargando ...!</small>
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