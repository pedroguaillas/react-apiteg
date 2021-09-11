import React, { Component, Fragment } from 'react'
import { Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Table, Button } from 'reactstrap'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import PageTitle from '../../../Layout/AppMain/PageTitle'
import { API_BASE_URL } from "../../../config/config"

import ListProducts from './ListProducts'
import CustomerCard from './CustomerCard'

export default class EditSale extends Component {

    state = {
        custom: {},
        products: []
    }

    addCustom = custom => this.setState({ custom })

    componentDidMount() {
        this.getSale()
    }

    getSale = () => {
        const { match: { params } } = this.props
        fetch(API_BASE_URL + 'sales/' + params.id)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    custom: response.sale,
                    products: response.saleitems
                })
            });
    }

    addValue = (e) => this.setState({ [e.target.name]: e.target.value })

    //function round correct error decimal JavaScript 
    round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)

    //Sum quantity of product
    addQty = (elementIndex) => (event) => {
        let total1 = 0
        let p = {}  //Object product        
        let pric = 0.00 //Object product
        let products = this.state.products.map((item, i) => {
            if (elementIndex !== i) return item
            else {
                //total1 value before change state
                total1 = this.round(item.qty * item.price1, 2)
                //Value after change to add in state
                pric = this.round(event.target.value * item.price1, 2)
                //Diference before & after
                pric -= total1
                //Object product
                p = item
                return { ...item, [event.target.name]: event.target.value }
            }
        })
        this.setState(state => ({
            products,
            base0: state.base0 + (p.iva == 0 ? pric : 0),
            base12: state.base12 + (p.iva == 2 ? pric : 0),
            iva: state.iva + (p.iva == 2 ? this.round((pric) * .12, 2) : 0),
            no_iva: state.no_iva + (p.iva == 6 ? pric : 0),
            total: state.total + pric + (p.iva == 2 ? this.round((pric) * .12, 2) : 0)
        }))
    }

    //Add item product to products
    handleAddLineProduct = (product) => {
        const index = this.state.products.findIndex(data => data.id === product.id)
        if (index === -1) {//Verify exist product in products
            product.qty = 1;
            this.setState(state => ({
                // use optimistic in a production app this could be a database id
                products: state.products.concat([product]),
                base0: state.base0 + (product.iva == 0 ? parseFloat(product.price1) : 0),
                base12: state.base12 + (product.iva == 2 ? parseFloat(product.price1) : 0),
                iva: state.iva + (product.iva == 2 ? this.round(product.price1 * .12, 2) : 0),
                no_iva: state.no_iva + (product.iva == 6 ? parseFloat(product.price1) : 0),
                total: state.total + parseFloat(product.price1) + (product.iva == 2 ? this.round(product.price1 * .12, 2) : 0)
            }))
        }
    }

    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {
        const { custom } = this.state

        // if (redirect) {
        //     return <Redirect to='/inventarios/ventas'/>;
        // }

        if (custom == null) {
            return <div>Cargando...</div>
        } else
            return (
                <Fragment>
                    <PageTitle
                        heading="Ventas"
                        subheading="Editar venta"
                        icon="pe-7s-car icon-gradient bg-mean-fruit"
                    />

                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="TabsAnimation"
                        transitionAppear={true}
                        transitionAppearTimeout={0}
                        transitionEnter={false}
                        transitionLeave={false}>

                        <Button color="primary" className="mb-4" onClick={this.onSubmit}>Guardar</Button>
                        <Row>

                            <CustomerCard
                                custom={this.state.custom}
                                customer={this.addCustom}
                            />

                            <Col lg="6">
                                <Card>
                                    <CardBody>
                                        <CardTitle>Datos de ventas</CardTitle>
                                        <p>* Campos obligatorios</p>
                                        <Form>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="date">*Fecha</Label>
                                                        <Input onChange={this.addValue} value={custom.date} type="date"
                                                            name="date" id="date" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="serie">*Número de serie</Label>
                                                        <Input onChange={this.addValue} value={custom.serie} type="text"
                                                            name="serie" id="serie" />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="expiration_date">*Fecha de vencimiento</Label>
                                                        <Input onChange={this.addValue} value={custom.expiration_date}
                                                            type="date" name="expiration_date" id="expiration_date" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="notes">*Notas</Label>
                                                        <Input onChange={this.addValue} value={custom.notes} type="text"
                                                            name="notes" id="notes" />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <ListProducts
                            products={this.state.products}
                            round={this.round}
                            addQty={this.addQty}
                            handleAddLineProduct={this.handleAddLineProduct}
                        />

                        <Row className="mt-4">
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <CardTitle> Resultados</CardTitle>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td>Subtotal 0%</td>
                                                    <td>${parseFloat(custom.base0).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Subtotal 12%</td>
                                                    <td>${parseFloat(custom.base12).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>IVA</td>
                                                    <td>${parseFloat(custom.iva).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>No objeto de IVA</td>
                                                    <td>${parseFloat(custom.no_iva).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>TOTAL</td>
                                                    <td>${parseFloat(custom.total).toFixed(2)}</td>
                                                </tr>
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