import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Label, Form,
    FormGroup, Input, CustomInput, Button
} from 'reactstrap';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import SelectAccount from '../../Components/Modal/SelectAccount';
import SelectCategory from '../../Components/Modal/SelectCategory';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class CreateProduct extends Component {

    state = {
        unities: [],
        categories: [],
        accounts: [],
        form: { code: null, type_product: null, name: null, unity_id: null, iva: null },
        entry: false,
        active: false,
        inventory: false,
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('productscreate')
                .then(res => {
                    let { unities, accounts, categories } = res.data
                    this.setState({ unities, accounts, categories })
                })
        } catch (error) {
            console.log(error)
        }
    }

    submit = async () => {
        if (this.validate()) {
            tokenAuth(this.props.token);
            try {
                await clienteAxios.post('products', this.state.form)
                    .then(res => this.props.history.push('/inventarios/productos'))
            } catch (error) {
                if (error.response.data.message === 'KEY_DUPLICATE') {
                    alert('Ya existe un producto con ese código')
                }
                console.log(error)
            }
        }
    }

    validate = () => {
        let result = true
        let { code, type_product, name, iva } = this.state.form
        let obj = { code, type_product, name, iva }
        for (let o in obj) {
            if (obj[o].length === 0) {
                console.log(obj[o])
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

    handleChangeCheck = (e) => this.setState({ [e.target.name]: e.target.checked })

    selectAccount = (account, attribute) => {
        this.setState({
            form: {
                ...this.state.form,
                [attribute]: account.id
            }
        })
    }

    selectCategory = (id) => {
        this.setState({
            form: {
                ...this.state.form,
                category_id: id
            }
        })
    }

    render() {

        var { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    heading="Producto"
                    subheading="Registro de producto"
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
                                                    <Label for="code" sm={4}>Código *</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.code} type="text"
                                                            name="code" id="code" maxLength="20" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="type_product" sm={4}>Tipo *</Label>
                                                    <Col sm={6}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={form.type_product}
                                                            type="select" name="type_product" id="type_product" >
                                                            <option value="">Seleccione</option>
                                                            <option value={1}>Producto</option>
                                                            <option value={2}>Servicio</option>
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="name" sm={4}>Nombre *</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.name} type="text"
                                                            name="name" id="name" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="name" sm={4}>Categoria</Label>
                                                    <Col sm={6}>
                                                        <SelectCategory
                                                            id={form.category_id}
                                                            categories={this.state.categories}
                                                            selectCategory={this.selectCategory}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label for="unity_id" sm={4}>Unidad</Label>
                                                    <Col sm={6}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={form.unity_id}
                                                            name="unity_id" type="select" id="unity_id" >
                                                            <option value="">Seleccione</option>
                                                            {this.state.unities === null ? '' :
                                                                this.state.unities.map((unity, index) => (
                                                                    <option key={index} value={unity.id}>{unity.unity}</option>
                                                                ))
                                                            }
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="price1" sm={4}>Precio venta</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.price1} type="text"
                                                            name="price1" id="price1" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="price2" sm={4}>Precio compra</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.price2} type="text"
                                                            name="price2" id="price2" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="price3" sm={4}>Precio alternativo</Label>
                                                    <Col sm={6}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.price3} type="text"
                                                            name="price3" id="price3" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Impuestos</strong>
                                        </Row>
                                        <Row form>
                                            <Col md={4}>
                                                <FormGroup row>
                                                    <Label for="iva" sm={4}>Imp. al IVA *</Label>
                                                    <Col sm={7}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={form.iva}
                                                            type="select" name="iva" id="iva" >
                                                            <option value="">Seleccione</option>
                                                            <option value={2}>Iva 12%</option>
                                                            <option value={0}>Iva 0%</option>
                                                            <option value={6}>No objeto de Iva</option>
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup row>
                                                    <Label for="ice" sm={4}>Imp. al Cons Esp</Label>
                                                    <Col sm={7}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={form.ice}
                                                            type="select" id="ice" name="ice">
                                                            <option value="">Seleccione</option>
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup row>
                                                    <Label for="irbpnr" sm={4}>IRBPNR</Label>
                                                    <Col sm={7}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={form.irbpnr}
                                                            type="select" name="irbpnr" id="irbpnr" >
                                                            <option value="">Seleccione</option>
                                                            <option value={5001}>Botellas plasticas no retornables</option>
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Contabilidad</strong>
                                        </Row>
                                        <Row form>
                                            <Col md={1}></Col>
                                            <Col md={6}>
                                                <FormGroup className="mb-1" row>
                                                    <Label className="text-left" for="entry" sm={2}>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={this.state.entry} type="checkbox"
                                                            id="entry" name="entry" label="Ingreso" />
                                                    </Label>
                                                    <Col sm={10} hidden={!(this.state.entry)}>
                                                        <SelectAccount
                                                            value="entry_account_id"
                                                            id={form.active_account_id}
                                                            filter='4'
                                                            accounts={this.state.accounts}
                                                            selectAccount={this.selectAccount}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label className="text-left" for="active" sm={2}>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={this.state.active} type="checkbox"
                                                            id="active" name="active" label="Activo" />
                                                    </Label>
                                                    <Col sm={10} hidden={!(this.state.active)}>
                                                        <SelectAccount
                                                            value="active_account_id"
                                                            id={form.active_account_id}
                                                            filter='1'
                                                            accounts={this.state.accounts}
                                                            selectAccount={this.selectAccount}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label className="text-left" for="inventory" sm={2}>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={this.state.inventory} type="checkbox"
                                                            id="inventory" name="inventory" label="Invetario" />
                                                    </Label>
                                                    <Col sm={10} hidden={!(this.state.inventory)}>
                                                        <SelectAccount
                                                            value="inventory_account_id"
                                                            id={form.inventory_account_id}
                                                            filter='1.1.3'
                                                            accounts={this.state.accounts}
                                                            selectAccount={this.selectAccount}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={3}>
                                                <FormGroup row hidden={!(this.state.inventory)}>
                                                    <Label for="stock" sm={5}>Stock mínimo *</Label>
                                                    <Col sm={7}>
                                                        <Input bsSize="sm" onChange={this.handleChange} value={form.stock} type="text"
                                                            name="stock" id="stock" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button onClick={this.submit} color="primary" type="button">Agregar producto</Button>
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

export default connect(mapStateToProps)(CreateProduct);