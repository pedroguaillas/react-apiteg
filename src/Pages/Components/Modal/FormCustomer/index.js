import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table,
    Card, Form, Row, Col, ListGroup, ListGroupItem
} from 'reactstrap'

import clientAxios from '../../../../config/axios';
import tokenAuth from '../../../../config/token';

class FormCustomer extends Component {

    state = {
        customer: [],
        modal: false
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {

        let { customer } = this.state

        return (
            <Fragment>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={this.toggle}>Seleccionar cliente</ModalHeader>
                    <ModalBody>
                        <Form className="text-right">
                            <Row form>
                                <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                            </Row>
                            <FormGroup className="mb-1" row>
                                <Label for="type_identification" sm={4}>Tipo de identicatión *</Label>
                                <Col sm={6}>
                                    <CustomInput bsSize="sm" onChange={this.handleChange} value={customer.type_identification}
                                        type="select" id="type_identification" name="type_identification" requiered>
                                        <option value="cédula">Cédula</option>
                                        <option value="ruc">RUC</option>
                                        <option value="pasaporte">Pasaporte</option>
                                    </CustomInput>
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="identication" sm={4}>Identificación *</Label>
                                <Col sm={6}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={customer.identication}
                                        type="text" id="identication" name="identication" maxlength="13" requiered />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="name" sm={4}>Nombre *</Label>
                                <Col sm={6}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={customer.name}
                                        type="text" id="name" name="name" maxlength={300} requiered />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="address" sm={4}>Dirección</Label>
                                <Col sm={6}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={customer.address}
                                        type="text" id="address" name="address" />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="phone" sm={4}>Teléfono</Label>
                                <Col sm={6}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={customer.phone} type="text"
                                        id="phone" name="phone" maxlength={13} pattern="[0-9]{10,15}"
                                        title="Teléfono ejemplo 0939649714" />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-0" row>
                                <Label for="email" sm={4}>Correo electrónico</Label>
                                <Col sm={6}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={customer.email} type="email"
                                        id="email" name="email" />
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(FormCustomer);