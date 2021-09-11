import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

import PageTitle from '../../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import ListSales from './ListSales'
import { API_BASE_URL } from '../../../../config/config';

export default class CustomInvoices extends Component {

    constructor() {
        super()
        this.state = {
            sales: null
        }
    }

    componentWillMount() {
        this.getSales(this.props.match.params.id);
    }

    getSales = (id) => {
        fetch(API_BASE_URL + 'sales/' + id)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    sales: res,
                })
            });
    }

    render() {

        return (

            <Fragment>
                <PageTitle
                    heading="Cliente"
                    subheading="Lista de todas sus facturas."
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
                                    <CardTitle>Facturas</CardTitle>
                                    <ListSales sales={this.state.sales} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}