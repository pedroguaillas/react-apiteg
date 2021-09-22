import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import MetisMenu from 'react-metismenu';

import {
    ProfileNav, InventoriesNav, InvoicesNav, ContactsNav, AccountingNav, OrdersNav, ShopsNav,
} from './NavItems';

class Nav extends Component {

    state = {};

    render() {
        return (
            <Fragment>
                {/* <h5 className="app-sidebar__heading">PRO VERSION</h5>
                <div className="metismenu vertical-nav-menu">
                    <ul className="metismenu-container">
                        <li className="metismenu-item">
                            <a className="metismenu-link" href="https://dashboardpack.com/theme-details/architectui-dashboard-react-pro" target="_blank">
                                <i className="metismenu-icon pe-7s-diamond"></i>
                                Upgrade to PRO
                            </a>
                        </li>
                    </ul>
                </div> */}


                <MetisMenu content={ProfileNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" />
                {/* <h5 className="app-sidebar__heading">Inventario</h5> */}
                <MetisMenu content={InventoriesNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" />
                {/* <h5 className="app-sidebar__heading">Facturación</h5> */}
                <MetisMenu content={OrdersNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" />
                {/* <h5 className="app-sidebar__heading">Facturación</h5> */}
                <MetisMenu content={ShopsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" />
                {/* <h5 className="app-sidebar__heading">Facturación</h5> */}
                {/* <MetisMenu content={InvoicesNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" /> */}
                {/* <h5 className="app-sidebar__heading">Contactos</h5> */}
                <MetisMenu content={ContactsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" />
                {/* <h5 className="app-sidebar__heading">Contabilidad</h5> */}
                {/* <MetisMenu content={AccountingNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" /> */}
                {/* <h5 className="app-sidebar__heading">Tributación</h5> */}
                {/* <MetisMenu content={TaxationNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down" /> */}
            </Fragment>
        );
    }

    isPathActive(path) {
        return this.props.location.pathname.startsWith(path);
    }
}

export default withRouter(Nav);