import React, { Component, Fragment } from 'react'
import {
    Row, Col, Card, CardBody, CardTitle, Form,
    FormGroup, Label, Input, Table, Button, CustomInput
} from 'reactstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import { API_BASE_URL } from '../../../config/config'

import ListProducts from './ListProducts'
import CustomerCard from './CustomerCard'

export default class CreateSale extends Component {

    constructor() {
        super()
        this.state = {
            serie: '001-001-000000001',
            date: new Date().toISOString().substring(0, 10),
            expiration_date: this.addDays(),
            no_iva: 0.00,
            base0: 0.00,
            base12: 0.00,
            iva: 0.00,
            sub_total: 0.00,
            discount: 0.00,
            total: 0.00,
            notes: '',
            products: [],
            redirect: false,
            custom: {},
            received: '0.00',
            hiddenreceived: true
        }
    }

    //Save sale
    addDays = () => {
        var date = new Date()
        date.setDate(date.getDate() + 30)
        return date.toISOString().substring(0, 10)
    }

    //Save sale
    onSubmit = () => {
        fetch(API_BASE_URL + 'sales', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        })
            .then(response => {
                if (response.ok) {
                    this.props.history.push('/inventarios/ventas')
                }
            })
            .catch(error => console.log(error))
    }

    //Load info custom
    addCustom = custom => this.setState({ custom })

    //Init generate serie
    componentDidMount() {
        fetch(API_BASE_URL + 'sales.generedserie')
            .then(response => response.json())
            .then(response => this.setState({ serie: response.serie }))
    }

    //Info sale handle
    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    //Info sale handle Pay Method
    handleChangePayMethod = e => {
        let { name, value } = e.target
        this.setState({
            [name]: value,
            hiddenreceived: value === 'crédito'
        })
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    //Sum quantity of product
    addQty = (elementIndex) => (event) => {
        let total1 = 0
        let p = {}  //Object product        
        let pric = 0.00 //Price
        let products = this.state.products.map((item, i) => {
            if (elementIndex !== i) return item
            else {
                //total1 value before change state
                total1 = this.round(item.quantity * item.price1, 2)
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
            total: state.total + pric + (p.iva == 2 ? this.round(pric * .12, 2) : 0)
        }))
    }

    //Add item product to products
    handleAddLineProduct = (product) => {
        const index = this.state.products.findIndex(data => data.id === product.id)
        if (index === -1) {//Verify exist product in products
            product.quantity = 1;
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

    //function round correct error decimal JavaScript 
    round = (base, precision) => {
        let m = Math.pow(10, precision)
        let a = Math.round(base * m) / m
        return a
    }

    //Delete product
    handleDeleteProduct = (index) => {
        this.setState(state => ({
            products: state.products.filter((product, i) => i !== index)
        }))
    }

    //Layout 
    render = () => {
        const { redirect } = this.state

        // if (redirect) {
        //     return <Redirect to='/inventarios/ventas'/>;
        // }
        return (
            <Fragment>
                <PageTitle
                    heading="Ventas"
                    subheading="Registrar una nueva venta"
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
                            addCustom={this.addCustom}
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
                                                    <Label >*Fecha</Label>
                                                    <Input onChange={this.handleChange} value={this.state.date} type="date"
                                                        id="date" name="date" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>*Número de serie</Label>
                                                    <Input onChange={this.handleChange} value={this.state.serie} type="text"
                                                        id="serie" name="serie" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>*Fecha de vencimiento</Label>
                                                    <Input onChange={this.handleChange} value={this.state.expiration_date} type="date"
                                                        id="expiration_date" name="expiration_date" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>*Notas</Label>
                                                    <Input onChange={this.handleChange} value={this.state.notes} type="text"
                                                        id="notes" name="notes" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label>*Forma de pago</Label>
                                                    <CustomInput onChange={this.handleChangePayMethod} value={this.state.pay_method} type="select"
                                                        id="pay_method" name="pay_method">
                                                        <option value="">Seleccione</option>
                                                        <option value="contado">Contado</option>
                                                        <option value="crédito">Crédito</option>
                                                    </CustomInput>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} hidden={this.state.hiddenreceived}>
                                                <FormGroup>
                                                    <Label>*Recibí</Label>
                                                    <Input onChange={this.handleChange} value={this.state.received} type="text"
                                                        id="received" name="received" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} hidden={this.state.hiddenreceived}>
                                                <strong>Vuelto: {this.state.received - this.state.total}</strong>
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
                        handleDeleteProduct={this.handleDeleteProduct}
                    />

                    <Row className="mt-4">
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle>Resultados</CardTitle>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td>Subtotal 12%</td>
                                                <td>${this.state.base12}</td>
                                            </tr>
                                            <tr>
                                                <td>Subtotal 0%</td>
                                                <td>${this.state.base0}</td>
                                            </tr>
                                            <tr>
                                                <td>IVA</td>
                                                <td>${this.state.iva}</td>
                                            </tr>
                                            <tr>
                                                <td>No objeto de IVA</td>
                                                <td>${this.state.no_iva}</td>
                                            </tr>
                                            <tr>
                                                <td>TOTAL</td>
                                                <td>${this.state.total}</td>
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