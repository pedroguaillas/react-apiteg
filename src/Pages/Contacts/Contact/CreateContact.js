import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, CardTitle,
    Form, FormGroup, Label, Input, CustomInput
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import SelectAccount from '../../Components/Modal/SelectAccount';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class CreateContact extends Component {

    state = {
        form: {
            id: 0,
            state: 1,
            special: false,
            accounting: false
        },
        accounts: null
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('contactscreate')
                .then(response => this.setState({
                    accounts: response.data.accounts
                }))
        } catch (error) {
            console.log(error)
        }
    }

    submit = async () => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.post('contacts', this.state.form)
                .then(res => this.props.history.push('/contactos/contactos'))
        } catch (error) {
            console.log(error)
        }
    }

    //Change data in to input form
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

    selectAccount = (account, attribute) => {
        this.setState({
            form: {
                ...this.state.form,
                [attribute]: account.id
            }
        })
    }

    render() {

        let { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-save-contact', action: this.submit, icon: 'save', msmTooltip: 'Guardar contacto', color: 'primary' },
                    ]}
                    heading="Contacto"
                    subheading="Registro de un nuevo contacto."
                    icon="pe-7s-add-user icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <Row>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <Form className="text-right">
                                        <Row form>
                                            <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                                        </Row>
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Datos generales</strong>
                                        </Row>
                                        <FormGroup className="mb-1" row>
                                            <Label for="state" sm={4}>Estado</Label>
                                            <Col sm={6}>
                                                <CustomInput bsSize="sm" onChange={this.handleChange} value={form.state}
                                                    type="select" id="state" name="state">
                                                    <option value="1">Activo</option>
                                                    <option value="2">Inactivo</option>
                                                </CustomInput>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="special" sm={4}>Contribuyente especial</Label>
                                            <Col sm={6}>
                                                <CustomInput className="text-left mt-2" onChange={this.handleChangeCheck} checked={form.special} type="checkbox"
                                                    id="special" name="special" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="ruc" sm={4}>RUC</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.ruc}
                                                    type="text" id="ruc" name="ruc" maxlength="13" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="identication_card" sm={4}>Cedula</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.identication_card}
                                                    type="text" id="identication_card" name="identication_card" maxlength={10} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="company" sm={4}>Nombre *</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.company} type="text"
                                                    id="company" name="company" pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+{3,100}"
                                                    title="El nombre solo debe tener letras" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="name" sm={4}>Nombre comercial</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.name} type="text"
                                                    id="name" name="name" pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+{3,100}"
                                                    title="El nombre solo debe tener letras" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="address" sm={4}>Dirección *</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.address} type="text"
                                                    id="address" name="address" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="phone" sm={4}>Teléfono</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.phone} type="text"
                                                    id="phone" name="phone" maxlength={13} pattern="[0-9]{10,15}"
                                                    title="Teléfono ejemplo 0939649714" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-0" row>
                                            <Label for="email" sm={4}>Correo electrónico</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.email} type="email"
                                                    id="email" name="email" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="accounting" sm={4}>Obligado llevar contabilidad</Label>
                                            <Col sm={6}>
                                                <CustomInput className="text-left mt-2" onChange={this.handleChangeCheck} checked={form.accounting} type="checkbox"
                                                    id="accounting" name="accounting" />
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardBody>
                                    <CardTitle>Roles</CardTitle>
                                    <Form className="text-right">
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Cliente</strong>
                                        </Row>
                                        <FormGroup className="mb-1" row>
                                            <Label for="receive_account_id" sm={4}>Cuentas por cobrar</Label>
                                            <Col sm={6}>
                                                <SelectAccount
                                                    value="receive_account_id"
                                                    id={form.receive_account_id}
                                                    filter='1.1.2.2'
                                                    accounts={this.state.accounts}
                                                    selectAccount={this.selectAccount}
                                                />
                                            </Col>
                                        </FormGroup>
                                        {/* <FormGroup row>
                                            <Label for="discount" sm={4}>Descuento (%)</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.discount} type="text"
                                                    id="discount" name="discount" />
                                            </Col>
                                        </FormGroup> */}
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Proveedor</strong>
                                        </Row>
                                        <FormGroup className="mb-1" row>
                                            <Label for="pay_account_id" sm={4}>Cuentas por pagar</Label>
                                            <Col sm={6}>
                                                <SelectAccount
                                                    value="pay_account_id"
                                                    id={form.pay_account_id}
                                                    filter='2.1.2'
                                                    accounts={this.state.accounts}
                                                    selectAccount={this.selectAccount}
                                                />
                                            </Col>
                                        </FormGroup>
                                        {/* <FormGroup className="mb-1" row>
                                            <Label for="rent_retention" sm={4}>Retención a la renta (%)</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.rent_retention} type="text"
                                                    id="rent_retention" name="rent_retention" />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label for="iva_retention" sm={4}>Retención al IVA (%)</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.iva_retention} type="text"
                                                    id="iva_retention" name="iva_retention" />
                                            </Col>
                                        </FormGroup> */}
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

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateContact);