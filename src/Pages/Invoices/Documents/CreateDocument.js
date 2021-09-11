import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Table, Form, Button, FormGroup, Label, CustomInput, Input
} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import ListProducts from './ListProducts';
import RetentionForm from './RetentionForm';
import ListRetention from './ListRetention';
import InfoDocument from './InfoDocument';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import Description from './Description';

class CreateDocument extends Component {

    constructor() {
        super()
        this.state = {
            form: {
                serie: '001-001-000000001',
                date: new Date().toISOString().substring(0, 10),
                type: 2, // 1-Compra || 2-Venta
                expiration_days: 0,
                voucher_type: 1,
                no_iva: 0,
                base0: 0,
                base12: 0,
                iva: 0,
                sub_total: 0,
                discount: 0,
                total: 0,
                description: null,
                contact_id: 0,
                received: 0,
                doc_realeted: 0
            },
            contacts: [],
            productinputs: [],
            productouts: [
                { product_id: 0, price: 0, quantity: 1, stock: 1, discount: 0, inventory_account_id: null }
            ],
            form_retention: {
                serie: '001-001-000000001',
                date: new Date().toISOString().substring(0, 10)
            },
            taxes_request: [],
            taxes: [{ code: null, tax_code: null, base: null, porcentage: null, value: 0, editable_porcentage: false }],
            pay_methods: [
                { code: '01', value: '', term: 0, unit_time: '' }
            ],
            app_retention: false,
            redirect: false,
            hiddenreceived: true,
            series: {},
            edit: false
        }
    }

    selectDocXml = xmlDoc => {
        let date = this._getTag(xmlDoc, "fechaEmision")
        let newdate = new Date(parseInt(date.substring(6)), parseInt(date.substring(3, 5)), parseInt(date.substring(0, 2))).toISOString().substring(0, 10)
        this.setState({
            form: {
                ...this.state.form,
                serie: this._getTag(xmlDoc, "estab") + '-' + this._getTag(xmlDoc, "ptoEmi") + '-' + this._getTag(xmlDoc, "secuencial"),
                date: newdate
            }
        })
    }

    _getTag = (xmlDoc, tag) => xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue

    async componentDidMount() {
        tokenAuth(this.props.token)
        try {
            await clienteAxios.get('voucherscreate')
                .then(res => {
                    let { data } = res
                    let { series } = data
                    this.setState({
                        productinputs: data.products,
                        contacts: data.contacts,
                        taxes_request: data.taxes,
                        form: {
                            ...this.state.form,
                            serie: series.invoice
                        },
                        form_retention: {
                            ...this.state.form_retention,
                            serie: series.retention
                        },
                        series
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    //Save sale
    submit = async (send) => {
        if (this.validate()) {
            let { form, productouts, form_retention, taxes, pay_methods } = this.state
            form.products = productouts.length > 0 ? productouts.filter(product => product.product_id !== 0) : []
            if (taxes.length > 0) {
                form.form_retention = form_retention
                form.taxes = taxes.filter(tax => tax.tax_code !== null)
            }
            form.pay_methods = pay_methods
            form.send = send

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

        // Validar que se la serie contenga 17 caracteres
        if (form.contact_id === 0) {
            alert('La seriel de la factura debe tener 15 digitos')
            valid = false
        }

        // Validar que se selecciono un contacto
        if (form.contact_id === 0) {
            alert('Debe seleccionar un contacto')
            valid = false
        }
        if (valid) {
            // Validar que se registren productos solo cuando es una venta
            if (form.type === 2 && productouts.length === 0) {
                alert('Debe seleccionar almenos un producto')
                valid = false
            }
        }

        // Validar que se registren productos solo cuando es una venta
        if (valid && form.type === 2) {
            let i = 0
            // Products length siempre va ser mayor a cero por que se valido en la condicion anterior
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
                valid = (t.tax_code !== null && t.base !== null && t.porcentage !== null) ||
                    (t.tax_code === null && t.base === null && t.porcentage === null)
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
        let { name, value } = e.target
        if (name === 'type') {
            this.setState(state => ({
                form: {
                    ...this.state.form,
                    type: value,
                    serie: (Number(value) === 1) ? state.series.set_purchase : state.series.invoice,
                    voucher_type: (Number(value) === 1) ? 3 : 1
                }
            }))
        } else if (name === 'voucher_type') {
            let voucher_type = Number(value)
            let { type } = this.state.form
            let { series } = this.state
            let serie = '000-000-000000000'

            if (type === 2) {
                switch (voucher_type) {
                    case 1: serie = series.invoice
                        break
                    case 4: serie = series.cn
                        break
                    case 5: serie = series.dn
                        break
                }
            } else if (voucher_type === 3) {
                serie = series.set_purchase
            }
            this.setState({
                form: {
                    ...this.state.form,
                    serie,
                    voucher_type
                }
            })
        }
        else {
            this.setState({
                form: {
                    ...this.state.form,
                    [name]: value
                }
            })
        }
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
        productouts.push({ product_id: 0, price: 0, quantity: 1, stock: 1, discount: 0, inventory_account_id: null })
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
                item.inventory_account_id = product.inventory_account_id
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
        taxes.push({ code: null, tax_code: null, base: null, porcentage: null, value: 0, editable_porcentage: false });
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

    // handle change first column retention
    handleChangeTax = (index) => (e) => {
        let { taxes } = this.state
        // Change from taxes attr code the next line
        taxes[index].code = Number(e.target.value)
        // taxes[index].tax_code = null
        this.setState({ taxes })
    }

    selectRetention = (retention, index) => {
        let { taxes } = this.state
        taxes[index].tax_code = retention.code
        taxes[index].porcentage = retention.porcentage
        taxes[index].editable_porcentage = retention.porcentage === null
        taxes[index].value = (taxes[index].porcentage !== null && taxes[index].base !== null) ? taxes[index].porcentage * taxes[index].base * .01 : 0
        this.setState({ taxes })
    }

    handleChangeOthersTax = (index) => (e) => {
        let { taxes } = this.state
        let { name, value } = e.target
        taxes[index][name] = Number(value)
        taxes[index].value = (taxes[index].porcentage !== null && taxes[index].base !== null) ? taxes[index].porcentage * taxes[index].base * .01 : 0
        this.setState({ taxes })
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

    selectDocRelated = (item) => {
        this.setState({
            form: {
                ...this.state.form,
                doc_realeted: item.movement_id
            }
        })
    }

    importFromCsv = () => document.getElementById('file_csv').click()

    handleSelectFile = e => {
        let input = e.target

        let reader = new FileReader()
        reader.onload = () => this.uploadCsv(reader.result)
        reader.readAsText(input.files[0])
    }

    uploadCsv = csv => {
        let lines = csv.split(/\r\n|\n/)
        let { productinputs } = this.state
        let productouts = []
        let i = 0

        for (let line in lines) {
            if (i > 0 && lines[line].length > 0) {
                let words = lines[line].split(';')
                let code = words[0].trim()
                let product_search = productinputs.filter(p => p.code === code)[0]
                let product = {
                    product_id: product_search.id,
                    price: words[1].trim() === "" ? product_search.price1 : words[1].trim(),
                    quantity: words[2].trim() === "" ? 1 : words[2].trim(),
                    stock: words[2].trim() === "" ? 1 : words[2].trim(),
                    iva: product_search.iva,
                    discount: 0,
                    inventory_account_id: null
                }
                productouts.push(product)
            }
            i++
        }
        this.recalculate(productouts)
    }

    //...............Layout
    render = () => {

        let { form, edit } = this.state

        return (
            <Fragment>
                <PageTitle
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

                    <Input onChange={this.handleSelectFile} style={{ 'display': 'none' }} type="file" name="contactscsv" id="file_csv" accept=".csv" />
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
                                            edit={edit}
                                            form={form}
                                            handleChange={this.handleChange}
                                            contacts={this.state.contacts}
                                            selectContact={this.selectContact}
                                            selectDocRelated={this.selectDocRelated}
                                            selectDocXml={this.selectDocXml}
                                        />

                                        <Row form className="my-3 pt-2" style={{ 'border-top': '1px solid #ced4da' }}>
                                            <div className="col-sm-1 text-left">
                                                <strong>Productos</strong>
                                            </div>
                                            <div className="col-sm-11">
                                                <Button onClick={this.importFromCsv}>Importar</Button>
                                            </div>
                                        </Row>

                                        <ListProducts
                                            edit={edit}
                                            productinputs={this.state.productinputs}
                                            productouts={this.state.productouts}
                                            addProduct={this.addProduct}
                                            selectProduct={this.selectProduct}
                                            deleteProduct={this.deleteProduct}
                                            handleChangeItem={this.handleChangeItem}
                                        />

                                        <Row hidden={Number(form.voucher_type) > 3} form className="my-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Retención</strong>
                                        </Row>
                                        <Row hidden={Number(form.voucher_type) > 3}>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={this.state.app_retention} type="checkbox"
                                                            id="accounting" name="accounting" label="Aplicar retención" />
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
                                                edit={edit}
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
                                            {/* <strong className='mt-2'>Formas de pago</strong> */}
                                        </Row>

                                        <Description
                                            edit={edit}
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
                                                        <th style={{ 'text-align': 'center' }}>Resultados</th>
                                                        <th style={{ 'text-align': 'center' }}>Monto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Subtotal 12%</td>
                                                        <td style={{ 'text-align': 'right' }}>${form.base12.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Subtotal 0%</td>
                                                        <td style={{ 'text-align': 'right' }}>${form.base0.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>IVA</td>
                                                        <td style={{ 'text-align': 'right' }}>${form.iva.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>No objeto de IVA</td>
                                                        <td style={{ 'text-align': 'right' }}>${form.no_iva.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Descuento</td>
                                                        <td style={{ 'text-align': 'right' }}>${form.discount.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ 'text-align': 'center' }}>TOTAL</th>
                                                        <th style={{ 'text-align': 'right' }}>${form.total.toFixed(2)}</th>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <Button color="secondary" onClick={() => this.submit(false)} className="mr-2 btn-transition">Guardar</Button>
                                            <Button color="success" onClick={() => this.submit(true)} className="mr-2 btn-transition">Guardar y enviar</Button>
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