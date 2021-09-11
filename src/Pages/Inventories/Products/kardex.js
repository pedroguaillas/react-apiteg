import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, CardTitle, Table } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import '../../../assets/css/table.css'

export default class Products extends Component {

    state = {
        loading: false,
        saleitems: []
    }

    componentDidMount() {
        this.getItem();
    }

    getItem = () => {
        // this.setState({ loading: true });
        // fetch(API_BASE_URL + 'saleitems')
        //     .then(res => res.json())
        //     .then(res => {
        //         this.setState({
        //             saleitems: res,
        //             url: res.next,
        //             loading: false
        //         })
        //     });
    }

    render() {
        let available = 0, pt = 0, pb = 0;
        return (
            <Fragment>
                <PageTitle
                    heading="Kardex"
                    subheading="Kardex del Smarphone"
                    icon="pe-7s-car icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <Row>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Kardex</CardTitle>

                                    <Table className="mb-0 table table-bordered">
                                        <thead>
                                            <tr className="textCenter">
                                                <th className="verticalAlign" rowspan="2">Fecha</th>
                                                <th className="verticalAlign" rowspan="2">Descuento</th>
                                                <th colspan="3">Entrada</th>
                                                <th colspan="3">Salida</th>
                                                <th colspan="3">Disponible</th>
                                            </tr>
                                            <tr>
                                                <th>Cantidad</th>
                                                <th>P. Unitario</th>
                                                <th>P. Total</th>
                                                <th>Cantidad</th>
                                                <th>P. Unitario</th>
                                                <th>P. Total</th>
                                                <th>Cantidad</th>
                                                <th>P. Unitario</th>
                                                <th>P. Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (!this.state.loading)?this.state.saleitems.map(saleitem => (
                                                    <tr>
                                                        <td>{saleitem.updated_at.substring(0,10)}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>{saleitem.quantity}</td>
                                                        <td>${parseFloat(saleitem.price).toFixed(2)}</td>
                                                        <td>${parseFloat(saleitem.price * saleitem.quantity).toFixed(2)}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                )
                                                ):<p>Cargando</p>
                                            }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}