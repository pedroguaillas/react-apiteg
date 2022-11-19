import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col } from 'reactstrap';

import OrdersByMonths from './OrdersByMonths';
import Alert from 'reactstrap/lib/Alert';
import api from '../../../services/api';

class Charts extends React.Component {

    state = {
        active: false,
        expired: null,
        orders: null,
        shops: null,
        count_orders: 0,
        count_shops: 0,
        count_customers: 0,
        count_providers: 0,
    }

    async componentDidMount() {
        try {
            await api.get('dashboard')
            // await setup.get('dashboard')
                .then(res => {
                    let { active, expired, orders, shops, count_orders, count_shops, count_customers, count_providers } = res.data
                    this.setState({ active, expired, orders, shops, count_orders, count_shops, count_customers, count_providers })
                })
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        let { active, expired, orders, shops, count_orders, count_shops, count_customers, count_providers } = this.state

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    {
                        active === 0 ?
                            <Row>
                                <Col>
                                    <Alert color="danger">
                                        Tu suscripción mensual ha expirado el {expired}, motivo por el cual <strong>no se procesaran sus comprobantes electrónicos</strong>
                                    </Alert>
                                </Col>
                            </Row>
                            : null
                    }

                    <Row>
                        <Col md="3">
                            <div className="card mb-3 bg-arielle-smile widget-chart text-white card-border">
                                <div className="icon-wrapper rounded-circle">
                                    <div className="icon-wrapper-bg bg-white opacity-4" />
                                    <i className="lnr-file-add" />
                                </div>
                                <div className="widget-numbers">
                                    {count_orders}
                                </div>
                                <div className="widget-subheading">
                                    Ventas
                                </div>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="card mb-3 bg-midnight-bloom widget-chart text-white card-border">
                                <div className="icon-wrapper rounded-circle">
                                    <div className="icon-wrapper-bg bg-white opacity-4" />
                                    <i className="lnr-cart" />
                                </div>
                                <div className="widget-numbers">
                                    {count_shops}
                                </div>
                                <div className="widget-subheading">
                                    Compras
                                </div>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="card mb-3 bg-grow-early widget-chart text-white card-border">
                                <div className="icon-wrapper rounded-circle">
                                    <div className="icon-wrapper-bg bg-white opacity-4" />
                                    <i className="lnr-users" />
                                </div>
                                <div className="widget-numbers">
                                    {count_customers}
                                </div>
                                <div className="widget-subheading">
                                    Clientes
                                </div>
                            </div>
                        </Col>
                        <Col md="3">
                            <div className="card mb-3 bg-love-kiss widget-chart card-border">
                                <div className="widget-chart-content text-white">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-white opacity-4" />
                                        <i className="lnr-bus" />
                                    </div>
                                    <div className="widget-numbers">
                                        {count_providers}
                                    </div>
                                    <div className="widget-subheading">
                                        Proveedores
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <OrdersByMonths items={orders} color="#4e4376" title="Ventas" />
                        <OrdersByMonths items={shops} color="#2FA4E7" title="Compras" />
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

export default Charts;