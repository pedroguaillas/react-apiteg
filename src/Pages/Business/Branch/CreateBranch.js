import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Form, Button, FormGroup, Label, CustomInput, Input
} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import api from '../../../services/api';

class CreateBranch extends Component {

    constructor() {
        super()
        this.state = {
            form: {
                store: '001',
                address: null,
                name: null,
                type: 'matriz'
            }
        }
    }

    submit = async () => {
        if (this.validate()) {
            // tokenAuth(this.props.token);
            let { form } = this.state
            form.store = parseInt(form.store)
            try {
                // await clienteAxios.post('branches', form)
                await api.post('branches', form)
                    .then(res => this.props.history.push('/empresa/establecimientos'))
            } catch (error) {
                if (error.response.data.message === 'KEY_DUPLICATE') {
                    alert('Ya existe un producto con ese código')
                }
            }
        } else {
            alert('Llenar los campos marcados con *')
        }
    }

    validate = () => {
        let result = true
        let { store, address, type } = this.state.form
        let obj = { store, address, type }
        for (let o in obj) {
            if (obj[o] === null || obj[o].length === 0) {
                result = false
            }
        }
        return result
    }

    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    //...............Layout
    render = () => {

        let { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    heading="Establecimiento"
                    subheading="Registrar un nuevo establecimiento"
                    icon="pe-7s-news-paper icon-gradient bg-mean-fruit"
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
                                            <p className='mt-2'>
                                                <strong>Nota:</strong> Los campos marcados con * son obligatorios
                                            </p>
                                        </Row>
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Datos generales</strong>
                                        </Row>
                                        <Row form>
                                            <Col sm={6}>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="store" sm={4}>Establecimiento *</Label>
                                                    <Col sm={2}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.store} type="text"
                                                            name="store" id="store" maxLength="3" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="name" sm={4}>Nombre Comercial</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.name} type="text"
                                                            name="name" id="name" maxLength="300" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="address" sm={4}>Direccion *</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.address} type="text"
                                                            name="address" id="address" maxLength="300" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="iva" sm={4}>Type *</Label>
                                                    <Col sm={3}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={form.type}
                                                            type="select" name="type" id="type" >
                                                            <option value="">Seleccione</option>
                                                            <option value="matriz">Matriz</option>
                                                            <option value="sucursal">Sucursal</option>
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button onClick={this.submit} color="primary" type="button">Agregar Establecimiento</Button>
                                    </Form>
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

// export default connect(mapStateToProps)(CreateBranch);
export default CreateBranch;