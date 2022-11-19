import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Label,
    Form, FormGroup, Input, CustomInput, Button
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import ListProducts from './ListProducts';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import api from '../../../services/api';

class CreateMovement extends Component {

    state = {
        unities: [],
        productinputs: [],
        productouts: [
            { product_id: 0, price: 0, quantity: 1, stock: 1 }
        ],
        form: {
            id: 0,
            date: new Date().toISOString().substring(0, 10),
            seat_generate: false
        },
        total: 0
    }

    async componentDidMount() {
        // tokenAuth(this.props.token);
        try {
            // await clienteAxios.get('movementscreate')
            await api.get('movementscreate')
                .then(response => this.setState({
                    productinputs: response.data.products
                }))
        } catch (error) {
            console.log(error)
        }
    }

    submit = async () => {
        let { form, productouts, total } = this.state
        form.products = productouts.filter(product => product.product_id > 0)
        form.sub_total = total
        // tokenAuth(this.props.token);
        try {
            // await clienteAxios.post('movements', form)
            await api.post('movements', form)
                .then(res => this.props.history.push("/inventarios/movimientos"))
        } catch (error) {
            console.log(error)
        }
    }

    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    handleChangeCheck = (e) => {
        let { name, checked } = e.target
        this.setState(state => ({
            form: {
                ...state.form,
                [name]: checked
            }
        }))
    }

    //Only add line for add product
    addProduct = () => {
        let { productouts } = this.state
        productouts.push({ product_id: 0, price: 0, quantity: 1, stock: 1 })
        this.setState({ productouts })
    }

    //add product when select product from de list modal
    selectProduct = (product, index) => {
        let productouts = this.state.productouts.map((item, i) => {
            if (index === i) {
                item.product_id = product.id
                item.price = product.price1
                item.quantity = 1
                item.iva = product.iva
                item.stock = product.stock > 0 ? product.stock : 1
            }
            return item
        })

        this.recalculate(productouts)
    }

    //Delete product
    deleteProduct = (index) => {
        let productouts = this.state.productouts.filter((product, i) => i !== index)
        this.recalculate(productouts)
    }

    //add quatity to product
    handleChangeItem = (index) => (event) => {
        let { productouts } = this.state
        productouts[index][event.target.name] = event.target.value
        this.recalculate(productouts)
    }

    //Method caculate totals & modify state all.
    recalculate = (productouts) => {
        let total = 0

        productouts.forEach(item => {
            total += item.quantity * parseFloat(item.price)
        })

        this.setState({ productouts, total })
    }

    render() {

        let { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    heading="Movimiento de inventario"
                    subheading="Registro de un movimiento de inventario."
                    icon="pe-7s-note2 icon-gradient bg-mean-fruit"
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
                                    <Form className="text-right">
                                        <Row form>
                                            <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                                        </Row>
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2 mb-2'>Datos del movimiento de inventario</strong>
                                        </Row>
                                        <Row form>
                                            <Col sm={6}>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="date" sm={4}>Fecha *</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.date} type="date"
                                                            name="date" id="date" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="type" sm={4}>Tipo *</Label>
                                                    <Col sm={6}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={form.type}
                                                            type="select" name="type" id="type" >
                                                            <option value="">Seleccione</option>
                                                            <option value={1}>Compra</option>
                                                            <option value={2}>Venta</option>
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="description" sm={4}>Descripción</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.description} type="textarea"
                                                            name="description" id="description" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label for="seat_generate" sm={4}>Generar asiento contable:</Label>
                                                    <Col sm={6}>
                                                        <CustomInput className="text-left mt-2" onChange={this.handleChangeCheck} checked={form.seat_generate} type="checkbox"
                                                            id="seat_generate" name="seat_generate" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                        <strong className='mt-2 mb-2'>Productos</strong>
                                    </Row>
                                    <ListProducts
                                        productinputs={this.state.productinputs}
                                        productouts={this.state.productouts}
                                        addProduct={this.addProduct}
                                        selectProduct={this.selectProduct}
                                        deleteProduct={this.deleteProduct}
                                        handleChangeItem={this.handleChangeItem}
                                    />
                                    <Row form className="mt-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                        <strong className='mt-2 mb-2'>Guardar</strong>
                                    </Row>
                                    <div className="text-center">
                                        <Button color="success" onClick={this.submit} className="mr-2 btn-transition btn-primary">Agregar movimiento</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

// const mapStateToProps = state => ({
//     token: state.AuthReducer.token
// });

// export default connect(mapStateToProps)(CreateMovement);
export default CreateMovement;