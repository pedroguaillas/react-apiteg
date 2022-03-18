import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';

//Products
import Products from "./Products";
import Kardex from "./Products/kardex";
import Movements from './Movements';
import CreateMovement from './Movements/CreateMovement';
import Categories from './Categories';
import CreateCategory from './Categories/CreateCategory';
import Unities from './Unities';
import CreateUnity from './Unities/CreateUnity';
import FormProduct from './Products/FormProduct';

const Inventories = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/productos`} component={Products} />
                    <Route path={`${match.url}/nuevoproducto`} component={FormProduct} />
                    <Route path={`${match.url}/producto/:id`} component={FormProduct} />
                    <Route path={`${match.url}/movimientos`} component={Movements} />
                    <Route path={`${match.url}/nuevomovimiento`} component={CreateMovement} />
                    <Route path={`${match.url}/categorias`} component={Categories} />
                    <Route path={`${match.url}/nuevacategoria`} component={CreateCategory} />
                    <Route path={`${match.url}/unidades`} component={Unities} />
                    <Route path={`${match.url}/nuevaunidad`} component={CreateUnity} />
                    <Route path={`${match.url}/kardex`} component={Kardex} />
                </div>
            </div>
        </div>
    </Fragment>
)

export default Inventories