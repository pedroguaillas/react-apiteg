import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Table, Form, Button, FormGroup, Label, CustomInput
} from 'reactstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import PageTitle from '../../../Layout/AppMain/PageTitle';

import ListProducts from './ListProducts';
import RetentionForm from './RetentionForm';
import ListRetention from './ListRetention';
import PayMethod from './PayMethod';
import InfoDocument from './InfoDocument';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import TypeVoucher from './TypeVoucher';

class CreateDocument extends Component {

    constructor() {
        super()
        this.state = {
            form: {
                serie: '001-001-000000001',
                date: new Date().toISOString().substring(0, 10),
                type: 2,
                expiration_date: this.addDays(),
                voucher_type: 1,
                no_iva: 0,
                base0: 0,
                base12: 0,
                iva: 0,
                sub_total: 0,
                discount: 0,
                total: 0,
                description: '',
                contact_id: 0,
                received: 0,
            },
            contacts: [],
            productinputs: [],
            productouts: [
                { product_id: 0, price: 0, quantity: 1, stock: 1, discount: 0 }
            ],
            form_retention: {
                serie: '001-001-000000001',
                date: new Date().toISOString().substring(0, 10)
            },
            taxes_request: [],
            taxes: [{ code: '', tax_code: '', base: '', porcentage: '', value: 0 }],
            pay_methods: [
                { code: '01', value: '', term: 0, unit_time: '' }
            ],
            app_retention: false,
            redirect: false,
            hiddenreceived: true,
            activeTab: '1',
            serie_sale: '',
            serie_retention: ''
        }
    }

    async componentDidMount() {
        const { match: { params } } = this.props
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('vouchers/' + params.id)
                .then(response => {
                    this.setState({
                        form: response.data.movement,
                        contacts: response.data.contacts,
                        productouts: response.data.movement_items,
                        productinputs: response.data.products,
                        taxes_request: response.data.taxes
                    })
                    if (response.data.retentionitems !== null) {
                        this.setState({
                            form_retention: response.data.retention,
                            taxes: response.data.retentionitems,
                            app_retention: true
                        })
                    }
                    if (response.data.paymethods.length > 0) {
                        this.setState({
                            pay_methods: response.data.paymethods
                        })
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }

    //Init date
    addDays = () => {
        var date = new Date()
        date.setDate(date.getDate() + 30)
        return date.toISOString().substring(0, 10)
    }

    //Save sale
    submit = async () => {
        let { form, productouts, form_retention, taxes, pay_methods } = this.state
        if (this.validate) {
            form.products = productouts.filter(product => product.product_id !== 0)
            if (taxes.length > 0) {
                form.form_retention = form_retention
                form.taxes = taxes.filter(tax => tax.tax_code.length > 0)
            }
            form.pay_methods = pay_methods
            tokenAuth(this.props.token);
            try {
                await clienteAxios.post('vouchers', form)
                    .then(res => this.props.history.push('/facturacion/documentos'))
            } catch (error) {
                console.log(error)
            }
        }
    }

    //Validate data to send save
    validate = () => {
        let { form, productouts, taxes } = this.state
        let valid = true
        if (form.contact_id === 0) {
            alert('Debe seleccionar un contacto')
            valid = false
        }
        if (valid && productouts.length === 0) {
            alert('Debe seleccionar almenos un producto')
            valid = false
        }

        if (valid) {
            let i = 0
            while (i < productouts.length && valid) {
                let p = productouts[i]
                valid = (p.product_id === 0 && p.price === 0) || (p.product_id > 0 && p.price > 0)
                i++
            }
            if (!valid) {
                alert('Si seleccionas un producto debes aplicar el costo unitario')
            }
        }

        if (valid) {
            let i = 0
            while (i < taxes.length && valid) {
                let t = taxes[i]
                valid = (t.tax_code !== '' && t.base !== '' && t.porcentage !== '') ||
                    (t.tax_code === '' && t.base === '' && t.porcentage === '')
                i++
            }
            if (!valid) {
                alert('Si seleccionas una retención debes aplicar el porcentaje y la base imponible')
            }
        }

        return valid
    }

    //Info sale handle
    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    //Info sale handle Pay Method
    handleChangePayMethod = e => {
        let { name, value } = e.target
        this.setState({
            form: {
                ...this.state.form,
                [name]: value,
            },
            hiddenreceived: value === 'crédito'
        })
    }

    //Add Contact
    selectContact = (contact_id) => {
        this.setState({
            form: {
                ...this.state.form,
                contact_id
            }
        })
    }

    //................Products
    //Only add line for add product
    addProduct = () => {
        let { productouts } = this.state
        productouts.push({ product_id: 0, price: 0, quantity: 1, stock: 1, discount: 0 })
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
    handleChangeItem = (index) => (e) => {
        let { productouts } = this.state
        let { name, value } = e.target
        if (!isNaN(value)) {
            switch (name) {
                case 'quantity':
                    productouts[index].quantity = value > 0 ? value : productouts[index].quantity
                    break
                case 'price':
                    productouts[index].price = value >= 0 ? value : productouts[index].price
                    break
                case 'discount':
                    productouts[index].discount = (value >= 0 && value <= 10) ? value : productouts[index].discount
                    break
            }
            this.recalculate(productouts)
        }
    }

    //Method caculate totals & modify state all.
    recalculate = (productouts) => {
        let no_iva = 0
        let base0 = 0
        let base12 = 0
        let discount = 0

        productouts.forEach(item => {
            let sub_total = item.quantity * parseFloat(item.price)
            let dis = item.discount > 0 ? sub_total * item.discount * .01 : 0
            let total = sub_total - dis
            discount += dis
            switch (item.iva) {
                case 0: base0 += total; break;
                case 2: base12 += total; break;
                case 6: no_iva += total; break;
            }
        })

        let iva = base12 * .12
        let sub_total = no_iva + base0 + base12
        let total = sub_total + iva

        let { pay_methods } = this.state
        if (pay_methods.length === 1) {
            pay_methods[0].value = total
        }

        this.setState({
            pay_methods,
            productouts,
            form: {
                ...this.state.form,
                no_iva, base0, base12, iva, sub_total, discount, total
            }
        })
    }

    //.................Retentions
    //Info retention (serie, date) handle
    handleChangeRetention = e => {
        this.setState({
            form_retention: {
                ...this.state.form_retention,
                [e.target.name]: e.target.value
            }
        })
    }

    addTax = () => {
        let { taxes } = this.state
        taxes.push({ code: '', tax_code: '', base: '', porcentage: '', value: '' });
        this.setState({ taxes })
    }

    deleteTax = (index) => {
        this.setState(prevState => ({
            taxes: prevState.taxes.filter((tax, i) => i !== index)
        }))
    }

    //Retention successs
    handleChangeCheck = (e) => {
        this.setState(state => ({ app_retention: !state.app_retention }))
    }

    handleChangeTax = (index) => (e) => {
        let { taxes } = this.state
        let { name, value } = e.target
        taxes[index][name] = value
        taxes[index].tax_code = ''
        this.setState({ taxes })
    }

    selectRetention = (retention, index) => {
        let { taxes } = this.state
        taxes[index].tax_code = retention.code
        taxes[index].porcentage = !isNaN(retention.porcentage) ? retention.porcentage : ''
        taxes[index].value = (taxes[index].porcentage > 0 && taxes[index].base > 0) ? taxes[index].porcentage * taxes[index].base * .01 : 0
        this.setState({ taxes })
    }

    handleChangeOthersTax = (index) => (e) => {
        let { taxes } = this.state
        let { name, value } = e.target
        if (!isNaN(value) && value >= 0) {
            taxes[index][name] = value
            taxes[index].value = (taxes[index].porcentage > 0 && taxes[index].base > 0) ? taxes[index].porcentage * taxes[index].base * .01 : 0
            this.setState({ taxes })
        }
    }

    //.................Pay Methods
    handleChangePay = (index, e) => {
        let { pay_methods } = this.state
        let { name, value } = e.target
        pay_methods[index][name] = value
        this.setState({ pay_methods })
    }

    handleDeletePay = (index) => {
        let { pay_methods } = this.state
        pay_methods = pay_methods.filter((pay, i) => i !== index)
        this.setState({ pay_methods })
    }

    handleAddPay = () => {
        let { pay_methods } = this.state
        pay_methods.push({ code: '01', value: '', term: 0, unit_time: '' })
        this.setState({ pay_methods })
    }

    //...............Layout
    render = () => {

        let { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    // options={[
                    //     { type: 'button', id: 'tooltip-save-document', action: this.submit, icon: 'save', msmTooltip: 'Guardar documento', color: 'success' },
                    // ]}
                    heading="Documento"
                    subheading="Registrar un nuevo documento"
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
                                            <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                                        </Row>

                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Datos generales</strong>
                                        </Row>
                                        <InfoDocument
                                            form={form}
                                            handleChange={this.handleChange}
                                            contacts={this.state.contacts}
                                            selectContact={this.selectContact}
                                        />

                                        <Row form className="my-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Productos</strong>
                                        </Row>
                                        <ListProducts
                                            productinputs={this.state.productinputs}
                                            productouts={this.state.productouts}
                                            addProduct={this.addProduct}
                                            selectProduct={this.selectProduct}
                                            deleteProduct={this.deleteProduct}
                                            handleChangeItem={this.handleChangeItem}
                                        />

                                        <Row form className="my-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Retención</strong>
                                        </Row>
                                        <Row>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={this.state.app_retention} type="checkbox"
                                                            id="accounting" name="accounting" label="Aplicar retención a la factura" />
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form hidden={!this.state.app_retention}>
                                            <RetentionForm
                                                form={this.state.form_retention}
                                                handleChangeRetention={this.handleChangeRetention}
                                            />
                                            <ListRetention
                                                taxes={this.state.taxes}
                                                deleteTax={this.deleteTax}
                                                handleChangeTax={this.handleChangeTax}
                                                retentions={this.state.taxes_request}
                                                selectRetention={this.selectRetention}
                                                handleChangeOthersTax={this.handleChangeOthersTax}
                                            />
                                        </Row>
                                        <Button hidden={!this.state.app_retention} color="primary" onClick={this.addTax} className="mr-2 btn-transition">Añadir impuesto</Button>

                                        <Row form className="my-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Formas de pago</strong>
                                        </Row>
                                        <TypeVoucher
                                            form={form}
                                            handleChange={this.handleChange}
                                        />
                                        {/* <PayMethod
                                            pay_methods={this.state.pay_methods}
                                            handleChangePay={this.handleChangePay}
                                            handleDeletePay={this.handleDeletePay}
                                            handleAddPay={this.handleAddPay}
                                        /> */}
                                    </Form>

                                    <Row form className="my-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                    </Row>
                                    <Row>
                                        <Col lg={8}></Col>
                                        <Col lg={4}>
                                            <Table bordered>
                                                <thead>
                                                    <tr>
                                                        <th>Resultados</th>
                                                        <th>Monto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Subtotal 12%</td>
                                                        <td>${form.base12}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Subtotal 0%</td>
                                                        <td>${form.base0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>IVA</td>
                                                        <td>${form.iva}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>No objeto de IVA</td>
                                                        <td>${form.no_iva}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Descuento</td>
                                                        <td>${form.discount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>TOTAL</td>
                                                        <td>${form.total}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <Button color="secondary" onClick={this.submit} className="mr-2 btn-transition">Guardar</Button>
                                            <Button color="success" onClick={this.submit} className="mr-2 btn-transition">Guardar y enviar</Button>
                                        </Col>
                                    </Row>
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

export default connect(mapStateToProps)(CreateDocument);