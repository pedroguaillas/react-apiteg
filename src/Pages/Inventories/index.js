import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

//Products
import Products from "./Products";
import CreateProduct from './Products/CreateProduct';
import EditProduct from './Products/EditProduct';
import Kardex from "./Products/kardex";
import Movements from './Movements';
import CreateMovement from './Movements/CreateMovement';
import Categories from './Categories';
import CreateCategory from './Categories/CreateCategory';
import Unities from './Unities';
import CreateUnity from './Unities/CreateUnity';

const Inventories = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/productos`} component={Products} />
                    <Route path={`${match.url}/nuevoproducto`} component={CreateProduct} />
                    <Route path={`${match.url}/producto/:id`} component={EditProduct} />
                    <Route path={`${match.url}/movimientos`} component={Movements} />
                    <Route path={`${match.url}/nuevomovimiento`} component={CreateMovement} />
                    <Route path={`${match.url}/categorias`} component={Categories} />
                    <Route path={`${match.url}/nuevacategoria`} component={CreateCategory} />
                    <Route path={`${match.url}/unidades`} component={Unities} />
                    <Route path={`${match.url}/nuevaunidad`} component={CreateUnity} />
                    <Route path={`${match.url}/kardex`} component={Kardex} />
                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
)

export default Inventories