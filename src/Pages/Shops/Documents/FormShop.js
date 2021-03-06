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
                serie: '001-010-000000001',
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

                // Retencion
                serie_retencion: '001-010-000000001',
                date_retention: date
            },
            providers: [],
            productinputs: [],
            productouts: [],
            taxes_request: [],
            taxes: [{ code: null, tax_code: null, base: null, porcentage: null, value: 0, editable_porcentage: false }],
            app_retention: false,
            redirect: false,
            hiddenreceived: true,
            series: {},
            edit: false
        }
    }

    selectDocXml = (xmlDoc, authorization) => {
        let date = this._getTag(xmlDoc, "fechaEmision")
        let date_v = date.split('/')
        date_v.reverse()
        let newdate = date_v.join('-')

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

        let iva = Number((base12 * .12).toFixed(2))
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
            } catch (error) { console.log(error) }
        } else {
            try {
                await clienteAxios.get('shops/create')
                    .then(res => {
                        let { data } = res
                        let { series } = data
                        this.setState({
                            taxes_request: data.taxes,
                            form: {
                                ...this.state.form,
                                serie_retencion: series.retention
                            },
                            series
                        })
                    })
            } catch (error) { console.log(error) }
        }
    }

    //Save sale
    submit = async (send) => {
        if (this.validate()) {
            let { form, productouts, taxes, app_retention } = this.state
            form.products = productouts.length > 0 ? productouts.filter(product => product.product_id !== 0) : []
            if (taxes.length > 0) {
                form.taxes = taxes.filter(tax => tax.tax_code !== null)
            }
            form.app_retention = app_retention
            form.send = send

            tokenAuth(this.props.token);
            if (form.id) {
                try {
                    document.getElementById("btn-save").disabled = true
                    document.getElementById("btn-save-send").disabled = true
                    await clienteAxios.put(`shops/${form.id}`, form)
                        .then(res => this.props.history.push('/compras/facturas'))
                } catch (error) { console.log(error) }
            } else {
                try {
                    document.getElementById("btn-save").disabled = true
                    document.getElementById("btn-save-send").disabled = true
                    await clienteAxios.post('shops', form)
                        .then(res => this.props.history.push('/compras/facturas'))
                } catch (error) {
                    if (error.response.data.message === 'RETENTION_EMITIDA') {
                        alert('Ya se ha emitido la retenci??n para la factura, si desea emitir de nuevo anule la anterior')
                    }
                    console.log(error)
                }
            }
        }
    }

    //Validate data to send save
    validate = () => {

        let { form, productouts, taxes, app_retention } = this.state

        // Validar que se la serie contenga 17 caracteres
        if (form.serie.trim().length < 17) {
            alert('La serie debe contener el siguiente formato 000-000-000000000')
            return
        }

        // Validar que se selecciono un proveedor
        if (form.provider_id === 0) {
            alert('Debe seleccionar el prvoeedor')
            return
        }

        // Validar la autorizaci??n
        if (Number(form.voucher_type) === 1 && (form.authorization === undefined || ![10, 49].includes(form.authorization.trim().length))) {
            alert('La autorizaci??n de la factura debe contener 10 o 49 d??gitos')
            return
        }

        // Si es liquidaci??n en compra validar los productos
        if (Number(form.voucher_type) === 3) {
            if (productouts.length === 0) {
                alert('Para registrar la liquidaci??n en compra debe contener productos')
                return
            }
            let i = 0
            // Products length siempre va ser mayor a cero por que se valido en la condicion anterior
            while (i < productouts.length) {
                if (productouts[i].product_id === 0) {
                    alert('No puedes dejar un item vacio')
                    return
                }
                if (productouts[i].quantity <= 0 || productouts[i].quantity === '') {
                    alert('La "Cantidad" debe ser mayor a cero')
                    return
                }
                if (productouts[i].price <= 0 || productouts[i].price === '') {
                    alert('El "Costo unitario" debe ser mayor a cero')
                    return
                }
                i++
            }
        }

        // En caso de aplicar la retencion validar los campos
        if (app_retention) {
            if (form.serie_retencion === undefined || form.serie_retencion.length < 17) {
                alert('La "Serie de la Retenci??n" debe contener el siguiente formato 000-000-000000000')
                return
            }
            let i = 0
            // retentions length siempre va ser mayor a cero por que se valido en la condicion anterior
            // Si aplica retencion obligar a seleccionar los item de los impuestos
            while (i < taxes.length) {
                if (taxes[i].code === null) {
                    alert('No puedes dejar un item vacio')
                    return
                }
                if (taxes[i].tax_code === null) {
                    alert('Debes seleccionar una retenci??n')
                    return
                }
                if (taxes[i].base <= 0 || taxes[i].base === '' || taxes[i].base === '') {
                    alert('La "Base Imponible" del impuesto debe ser mayor a cero')
                    return
                }
                i++
            }

            if (form.base12 === '') {
                alert('La base 12% no puede ser nulo')
                return
            }

            if (form.base0 === '') {
                alert('La base 0% no puede ser nulo')
                return
            }

            let sumb = 0
            i = 0
            // Verificar que las base de las retenciones sean igual a las bases de los totales
            while (i < taxes.length) {
                if (Number(taxes[i].code) === 1) {
                    sumb += Number(taxes[i].base)
                }

                i++ 
            }

            sumb = Number(sumb.toFixed(2))

            if (sumb !== Number((Number(form.base12) + Number(form.base0) + Number(form.no_iva)).toFixed(2))) {
                alert('La suma de las bases imponibles del impuesto a la rente debe ser igual a la suma del Subtotal 12% mas el Subtotal 0% mas No objeto de IVA')
                return
            }
        }

        return true
    }

    //Info sale handle
    handleChange = e => {

        let { name, value } = e.target

        if (name === 'voucher_type') {
            let voucher_type = Number(value)
            let { series } = this.state
            let serie = '000-010-000000001'

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

    onChangeNumber = e => {
        let { name, value } = e.target
        if (isNaN(value)) { return }

        let { form } = this.state
        form[name] = value
        form.iva = Number((Number(form.base12) * .12).toFixed(2))
        form.sub_total = Number(form.base12) + Number(form.base0) + Number(form.no_iva)
        form.total = Number(form.base12) + Number(form.base0) + Number(form.iva)
        this.setState({ form })
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
            let dis = item.discount > 0 ? Number((sub_total * item.discount * .01).toFixed(2)) : 0
            let total = sub_total - dis
            discount += dis
            switch (item.iva) {
                case 0: base0 += total; break;
                case 2: base12 += total; break;
                case 6: no_iva += total; break;
            }
        })

        let iva = Number((base12 * .12).toFixed(2))
        let sub_total = no_iva + base0 + base12
        let total = sub_total + iva

        this.setState({
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
        if (isNaN(value)) { return }
        taxes[index][name] = value
        taxes[index].value = (taxes[index].porcentage !== null && taxes[index].base !== null) ? taxes[index].porcentage * taxes[index].base * .01 : 0
        this.setState({ taxes })
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
        try {
            await clienteAxios.post('providers', provider)
                .then(res => {
                    let { id, identication, name } = res.data.provider
                    let providers = []

                    providers.push({ id, atts: { identication, name } })

                    this.setState({
                        providers,
                        form: {
                            ...this.state.form,
                            provider_id: id
                        }
                    })
                })
        } catch (error) {
            if (error.response.data.message === 'KEY_DUPLICATE') {

                let { id, identication, name } = error.response.data.provider
                let providers = []

                providers.push({ id, atts: { identication, name } })

                this.setState({
                    providers,
                    form: {
                        ...this.state.form,
                        provider_id: id
                    }
                })
            }
        }
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
                                            selectDocXml={this.selectDocXml}
                                            registerProvider={this.registerProvider}
                                        />

                                        <Row form className="my-3 pt-2" style={{ 'border-top': '1px solid #ced4da' }}>
                                            <div className="col-sm-6 text-left">
                                                <strong>Productos / Servicios</strong>
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
                                            <strong className='mt-2'>Retenci??n</strong>
                                        </Row>
                                        <Row hidden={Number(form.voucher_type) > 3}>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={app_retention} type="checkbox"
                                                            id="accounting" name="accounting" label="Aplicar retenci??n" />
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
                                            A??adir impuesto
                                        </Button>

                                        <Row form className="my-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                            {/* <strong className='mt-2'>Formas de pago</strong> */}
                                        </Row>

                                        <Description
                                            edit={edit}
                                            form={form}
                                            handleChange={this.handleChange}
                                        />
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
                                                        <td>Subtotal 12% ($)</td>
                                                        <td style={{ 'text-align': 'right' }}>
                                                            <input onChange={this.onChangeNumber} name="base12" value={form.base12} type="text" style={{ 'width': '7.5em', 'text-align': 'right' }} bsSize="sm" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Subtotal 0% ($)</td>
                                                        <td style={{ 'text-align': 'right' }}>
                                                            <input onChange={this.onChangeNumber} name="base0" value={form.base0} type="text" style={{ 'width': '7.5em', 'text-align': 'right' }} bsSize="sm" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Monto IVA</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.iva)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>No objeto de IVA ($)</td>
                                                        <td style={{ 'text-align': 'right' }}>
                                                            <input onChange={this.onChangeNumber} name="no_iva" value={form.no_iva} type="text" style={{ 'width': '7.5em', 'text-align': 'right' }} bsSize="sm" />
                                                        </td>
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