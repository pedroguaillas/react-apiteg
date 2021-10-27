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

class FormShop extends Component {

    constructor() {
        super()

        let date = new Date()
        date.setHours(date.getHours() - 5)
        date = date.toISOString().substring(0, 10)

        this.state = {
            form: {
                serie: '001-001-000000001',
                date,
                expiration_days: 0,
                voucher_type: 1,
                no_iva: 0,
                base0: 0,
                base12: 0,
                iva: 0,
                sub_total: 0,
                discount: 0,
                ice: 0,
                total: 0,
                description: null,
                provider_id: 0,
                doc_realeted: 0,

                // Retencion
                serie_retencion: '001-001-000000001',
                date_retention: date
            },
            providers: [],
            productinputs: [],
            productouts: [
                { product_id: 0, price: 0, quantity: 1, stock: 1, discount: 0, inventory_account_id: null }
            ],
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

    selectDocXml = (xmlDoc, authorization) => {
        let date = this._getTag(xmlDoc, "fechaEmision")
        let newdate = new Date(parseInt(date.substring(6)), parseInt(date.substring(3, 5)), parseInt(date.substring(0, 2))).toISOString().substring(0, 10)

        let no_iva = 0
        let base0 = 0
        let base12 = 0
        let ice = 0
        let discount = parseFloat(this._getTag(xmlDoc, 'totalDescuento'))

        let impuestos = xmlDoc.getElementsByTagName('totalImpuesto')

        for (let i = 0; i < impuestos.length; i++) {
            switch (parseInt(this._getTag(impuestos[i], 'codigoPorcentaje'))) {
                case 0: base0 += parseFloat(this._getTag(impuestos[i], 'baseImponible')); break;
                case 2: base12 += parseFloat(this._getTag(impuestos[i], 'baseImponible')); break;
                case 3: base12 += parseFloat(this._getTag(impuestos[i], 'baseImponible')); break;
                case 6: no_iva += parseFloat(this._getTag(impuestos[i], 'baseImponible')); break;
                default: if (parseInt(this._getTag(impuestos[i], 'codigo')) === 3) {
                    ice += parseFloat(this._getTag(impuestos[i], 'valor'))
                }
            }
        }

        let iva = base12 * .12
        let sub_total = no_iva + base0 + base12
        let total = parseFloat(this._getTag(xmlDoc, 'importeTotal'))

        this.setState({
            form: {
                ...this.state.form,
                serie: this._getTag(xmlDoc, "estab") + '-' + this._getTag(xmlDoc, "ptoEmi") + '-' + this._getTag(xmlDoc, "secuencial"),
                date: newdate,
                authorization,
                no_iva, base0, base12, iva, sub_total, discount, ice, total
            }
        })
    }

    _getTag = (xmlDoc, tag) => xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue

    async componentDidMount() {
        tokenAuth(this.props.token)
        const { match: { params } } = this.props
        if (params.id) {
            try {
                await clienteAxios.get(`shops/${params.id}`)
                    .then(res => {
                        let { data } = res
                        let { series } = data
                        this.setState({
                            productinputs: data.products,
                            productouts: data.shopitems,
                            taxes_request: data.taxes,
                            taxes: data.shopretentionitems,
                            providers: data.providers,
                            form: data.shop,
                            series,
                            app_retention: data.taxes.length > 0
                        })
                    })
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                await clienteAxios.get('shops/create')
                    .then(res => {
                        let { data } = res
                        let { series } = data
                        this.setState({
                            productinputs: data.products,
                            providers: data.providers,
                            taxes_request: data.taxes,
                            form: {
                                ...this.state.form,
                                serie_retencion: series.retention
                            },
                            series
                        })
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    //Save sale
    submit = async (send) => {
        if (this.validate()) {
            let { form, productouts, taxes, pay_methods, app_retention } = this.state
            // form.products = productouts.length > 0 ? productouts.filter(product => product.product_id !== 0) : []
            if (taxes.length > 0) {
                form.taxes = taxes.filter(tax => tax.tax_code !== null)
            }
            form.pay_methods = pay_methods
            form.app_retention = app_retention
            form.send = send

            tokenAuth(this.props.token);
            if (form.id) {
                try {
                    document.getElementById("btn-save").disabled = true
                    document.getElementById("btn-save-send").disabled = true
                    await clienteAxios.put(`shops/${form.id}`, form)
                        .then(res => this.props.history.push('/compras/facturas'))
                } catch (error) {
                    console.log(error)
                }
            } else {
                try {
                    await clienteAxios.post('shops', form)
                        .then(res => this.props.history.push('/compras/facturas'))
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    //Validate data to send save
    validate = () => {

        let { form, productouts, taxes } = this.state
        let valid = true

        // Validar que se selecciono un contacto
        if (form.provider_id === 0) {
            alert('Debe seleccionar el prvoeedor')
            valid = false
        }

        // Validar que se registren productos solo cuando es una venta
        if (valid) {
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

        if (name === 'voucher_type') {
            let voucher_type = Number(value)
            let { series } = this.state
            let serie = '000-000-000000000'

            if (voucher_type === 3) {
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
    selectProvider = (provider_id) => {
        this.setState({
            form: {
                ...this.state.form,
                provider_id
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

    // Create our number formatter.
    formatter = new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',

        //     // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
    })

    registerProvider = async (provider) => {
        await clienteAxios.post('providers', provider)
            .then(res => {
                let { provider } = res.data
                let { providers } = this.state

                providers.push(provider)

                this.setState({ providers })
                this.setState({
                    form: {
                        ...this.state.form,
                        provider_id: provider.id
                    }
                })
            })
    }

    //...............Layout
    render = () => {

        let { form, providers, edit, app_retention } = this.state

        let { format } = this.formatter

        return (
            <Fragment>
                <PageTitle
                    heading="Factura"
                    subheading="Registrar una nueva factura"
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
                                            providers={providers}
                                            selectProvider={this.selectProvider}
                                            selectDocRelated={this.selectDocRelated}
                                            selectDocXml={this.selectDocXml}
                                            registerProvider={this.registerProvider}
                                        />

                                        <Row form className="my-3 pt-2" style={{ 'border-top': '1px solid #ced4da' }}>
                                            <div className="col-sm-6 text-left">
                                                <strong>Productos / Servicios</strong>
                                            </div>
                                            <div className="col-sm-6">
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
                                                        <CustomInput onChange={this.handleChangeCheck} checked={app_retention} type="checkbox"
                                                            id="accounting" name="accounting" label="Aplicar retención" />
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form hidden={!app_retention || Number(form.voucher_type) > 3}>
                                            <RetentionForm
                                                form={form}
                                                handleChange={this.handleChange}
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
                                        <Button hidden={!app_retention || Number(form.voucher_type) > 3} color="primary" onClick={this.addTax} className="mr-2 btn-transition">
                                            Añadir impuesto
                                        </Button>

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
                                                        <td style={{ 'text-align': 'right' }}>{format(form.base12)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Subtotal 0%</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.base0)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Monto IVA</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.iva)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>No objeto de IVA</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.no_iva)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Monto ICE</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.ice)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Descuento</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.discount)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ 'text-align': 'center' }}>TOTAL</th>
                                                        <th style={{ 'text-align': 'right' }}>{format(form.total)}</th>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <Button color="secondary" id="btn-save" onClick={() => this.submit(false)} className="mr-2 btn-transition" disable>Guardar</Button>
                                            <Button color="success" id="btn-save-send" onClick={() => this.submit(true)} className="mr-2 btn-transition">Guardar y procesar</Button>
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

export default connect(mapStateToProps)(FormShop);