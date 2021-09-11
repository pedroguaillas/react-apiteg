import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import PageTitle from '../../../../../Layout/AppMain/PageTitle';
import ListCollections from './ListCollections';
import FormCollection from './FormCollection'
import { API_BASE_URL } from '../../../../../config/config';

export default class CustomInvoices extends Component {

    state = {
        form: {
            date: new Date().toISOString().substring(0, 10),
            sale_id: this.props.match.params.id,
        },
        collections: null,
        first: null
    }

    componentWillMount() {
        this.getCollections();
    }

    getCollections = () => {
        fetch(API_BASE_URL + 'collections/' + this.props.match.params.id)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    first: res.total,
                    collections: res.collections
                })
            });
    }

    addvalue = (e) => {
        const { form } = this.state
        const target = e.target
        form[target.name] = target.value
        this.setState({
            form
        })
    }

    addCollection = (e) => {
        e.preventDefault();
        fetch(API_BASE_URL + 'collections', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.form)
        })
            .then(response => {
                if (response.ok) {
                    this.setState(prev => ({
                        collections: [...prev.collections, this.state.form]
                    }))
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {

        return (

            <Fragment>
                <PageTitle
                    heading="Cobro de factura"
                    subheading="Lista de todos los pagos."
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
                        <Col lg="5">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle className="text-center">Registro de cobro</CardTitle>
                                    <FormCollection
                                        form={this.state.form}
                                        addvalue={this.addvalue}
                                        submit={this.addCollection} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="7">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle className="text-center">Cobros</CardTitle>
                                    <ListCollections
                                        collections={this.state.collections}
                                        first={this.state.first} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}