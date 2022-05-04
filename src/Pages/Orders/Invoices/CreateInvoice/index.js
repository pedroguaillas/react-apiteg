import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Table, Form, Button, Input
} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageTitle from '../../../../Layout/AppMain/PageTitle';

import ListProducts from './ListProducts';
import InfoDocument from './InfoDocument';

import clienteAxios from '../../../../config/axios';
import tokenAuth from '../../../../config/token';
import Aditionals from './Aditionals';

class CreateInvoice extends Component {

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
                no_iva: 0,
                base0: 0,
                base12: 0,
                iva: 0,
                sub_total: 0,
                discount: 0,
                total: 0,
                description: null,
                customer_id: 0,
                received: 0,
                doc_realeted: 0,
                voucher_type: 1
            },
            customers: [],
            productinputs: [],
            productouts: [
                { product_id: 0, price: 0, quantity: 1, stock: 1, discount: 0 }
            ],
            taxes_request: [],
            taxes: [{ code: null, tax_code: null, base: null, porcentage: null, value: 0, editable_porcentage: false }],
            aditionals: [],
            app_retention: false,
            redirect: false,
            hiddenreceived: true,
            series: {},
            edit: true
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
        const { match: { params } } = this.props
        if (params.id) {
            try {
                await clienteAxios.get(`orders/${params.id}`)
                    .then(res => {
                        let { data } = res
                        let { series } = data
                        this.setState({
                            productinputs: data.products,
                            productouts: data.order_items,
                            customers: data.customers,
                            aditionals: data.order_aditionals,
                            form: data.order,
                            series
                        })
                    })
            } catch (error) { console.log(error) }
        } else {
            try {
                await clienteAxios.get('orders/create')
                    .then(res => {
                        let { data } = res
                        let { series } = data
                        this.setState({
                            form: {
                                ...this.state.form,
                                serie: series.invoice
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
            let { form, productouts, aditionals } = this.state
            form.products = productouts.length > 0 ? productouts.filter(product => product.product_id !== 0) : []

            form.send = send
            form.aditionals = aditionals

            tokenAuth(this.props.token);
            try {
                document.getElementById("btn-save").disabled = true
                document.getElementById("btn-save-send").disabled = true

                if (form.id) {
                    await clienteAxios.put(`orders/${form.id}`, form)
                        .then(res => this.props.history.push('/ventas/facturas'))
                } else {
                    await clienteAxios.post('orders', form)
                        .then(res => this.props.history.push('/ventas/facturas'))
                }
            } catch (error) { console.log(error) }
        }
    }

    //Validate data to send save
    validate = () => {

        let { form, productouts, aditionals } = this.state

        // Validar que la serie contenga 17 caracteres
        if (form.serie === undefined || form.serie.length < 17) {
            alert('El "Numero de Serie" debe contener el siguiente formato 000-000-000000000')
            return
        }

        // Validar que se selecciono un cliente
        if (form.customer_id === 0) {
            alert('Seleccione el cliente')
            return
        }

        // Validar cuando es factura
        if (form.voucher_type === 1) {
            if (form.guia && form.guia.length < 17) {
                alert('La "Guia de Remisión" debe contener el siguiente formato 000-000-000000000')
                return
            }
        } else {
            // Validar 3 campos que no sean nulos cuando es N/C
            if (form.date_order === undefined) {
                alert('Es obligatorio la "Emisión factura" para Nota de Crédito')
                return
            }
            if (form.serie_order === undefined || form.serie_order.length < 17) {
                alert('Es obligatorio la "Serie factura" y debe tener el siguiente formato 000-000-000000000')
                return
            }
            if (form.reason === undefined || form.reason.length < 3) {
                alert('Es obligatorio el "Motivo" y debe contener almenos 3 caracteres')
                return
            }
        }

        // Validar que se registren productos
        if (productouts.length === 0) {
            alert('Debe seleccionar almenos un producto')
            return
        }

        let i = 0
        // Products length siempre va ser mayor a cero por que se valido en la condicion anterior
        while (i < productouts.length) {
            if (productouts[i].product_id === 0) {
                alert('No puedes dejar un item vacio de los productos')
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

        // if (aditionals.length > 0) {
        //     let i = 0
        //     // Products length siempre va ser mayor a cero por que se valido en la condicion anterior
        //     while (i < aditionals.length) {
        //         if (aditionals[i].name === undefined || aditionals[i].name.trim() === '' || productouts[i].description === undefined || productouts[i].description.trim() === '') {
        //             alert('Los campos de la "Información Adicional" no pueden ser nulos')
        //             return
        //         }
        //         i++
        //     }
        // }

        return true
    }

    //Info sale handle
    handleChange = e => {
        let { name, value } = e.target
        if (name === 'voucher_type') {
            let voucher_type = Number(value)
            let { series } = this.state
            let serie = '000-000-000000000'

            switch (voucher_type) {
                case 1: serie = series.invoice
                    break
                case 4: serie = series.cn
                    break
                case 5: serie = series.dn
                    break
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

    //Add customer
    selectCustomer = (customer_id) => {
        this.setState({
            form: {
                ...this.state.form,
                customer_id
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
        if (this.state.productouts.find(p => p.product_id === product.id) === undefined) {
            let productouts = this.state.productouts.map((item, i) => {
                if (index === i) {
                    item.product_id = product.id
                    item.price = product.atts.price1
                    item.quantity = 1
                    item.iva = product.atts.iva
                    item.stock = product.stock > 0 ? product.stock : 1
                }
                return item
            })

            this.recalculate(productouts)
        } else {
            alert('Ya esta el producto en la lista')
        }
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
            let sub_total = parseFloat(item.quantity) * parseFloat(item.price)
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

        // Extraer los codigos
        // Enviar a traer solo esos productos
        // Actualizar esos productos

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

    // Agregar Informacion Adicional
    addAditional = () => {
        let { aditionals } = this.state
        aditionals.push({ name: '', description: '' })
        this.setState({ aditionals })
    }

    //Delete Informacion Adicional
    deleteAditional = (index) => {
        let aditionals = this.state.aditionals.filter((aditional, i) => i !== index)
        this.setState({ aditionals })
    }

    onChangeAditional = (index) => (e) => {
        let { aditionals } = this.state
        let { name, value } = e.target
        aditionals[index][name] = value
        this.setState({ aditionals })
    }

    // Create our number formatter.
    formatter = new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',

        //     // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
    })

    //...............Layout
    render = () => {

        let { form, aditionals } = this.state

        let { format } = this.formatter

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

                    <Input onChange={this.handleSelectFile} style={{ 'display': 'none' }} type="file" name="customerscsv" id="file_csv" accept=".csv" />
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
                                            customers={this.state.customers}
                                            selectCustomer={this.selectCustomer}
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
                                            productinputs={this.state.productinputs}
                                            productouts={this.state.productouts}
                                            addProduct={this.addProduct}
                                            selectProduct={this.selectProduct}
                                            deleteProduct={this.deleteProduct}
                                            handleChangeItem={this.handleChangeItem}
                                            format={format}
                                        />
                                    </Form>

                                    <Row form className="my-3" style={{ 'border-top': '1px solid #ced4da' }}>
                                    </Row>
                                    <Row>
                                        <Col lg={8}>
                                            <Aditionals
                                                aditionals={aditionals}
                                                addAditional={this.addAditional}
                                                deleteAditional={this.deleteAditional}
                                                onChangeAditional={this.onChangeAditional}
                                            />
                                        </Col>
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
                                                        <td>IVA</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.iva)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>No objeto de IVA</td>
                                                        <td style={{ 'text-align': 'right' }}>{format(form.no_iva)}</td>
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

export default connect(mapStateToProps)(CreateInvoice);