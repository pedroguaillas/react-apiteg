import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, Table, Button, Input } from 'reactstrap';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import Paginate from '../../Components/Paginate/Index';

class Products extends Component {

    state = {
        products: null,
        links: null,
        meta: null,
        search: ''
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('products')
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        products: data,
                        links,
                        meta,
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    reqNewPage = async (e, page) => {
        e.preventDefault();

        let { search } = this.state

        if (page !== null) {
            tokenAuth(this.props.token);
            try {
                // await clienteAxios.get(`products?page=${page.substring((page.indexOf('=')) + 1)}${search === '' ? null : '&search=' + search}`)
                await clienteAxios.get(`products?page=${page.substring((page.indexOf('=')) + 1)}`)
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            ...this.state,
                            products: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    importProducts = () => document.getElementById('file_csv').click()

    handleSelectFile = e => {
        let input = e.target

        let reader = new FileReader()
        reader.onload = () => this.uploadCsv(reader.result)
        reader.readAsText(input.files[0], 'ISO-8859-1')
    }

    uploadCsv = csv => {
        let lines = csv.split(/\r\n|\n/)
        let products = []
        let i = 0
        for (let line in lines) {
            if (i > 0 && lines[line].length > 0) {
                let words = lines[line].split(';')
                let object = {
                    code: words[0].trim(),
                    type_product: words[1].trim(),
                    name: words[2].trim(),
                    unity_id: words[3].trim(),
                    price1: words[4].trim(),
                    price2: words[5].trim(),
                    price3: words[6].trim(),
                    iva: words[7].trim()
                }
                products.push(object)
            }
            i++
        }
        this.saveProductsFromCsv(products)
    }

    saveProductsFromCsv = async (products) => {

        let data = { products }

        tokenAuth(this.props.token)
        try {
            await clienteAxios.post('products_import', data)
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        products: data,
                        links,
                        meta,
                    })
                })
        } catch (error) {
            alert('Por mal')
        }
    }

    onChangeSearch = async (e) => {
        tokenAuth(this.props.token)
        let {
            value
        } = e.target

        try {
            await clienteAxios.get(`products/search/${value}`)
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        search: value,
                        products: data,
                        links,
                        meta,
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    addProduct = () => this.props.history.push("/inventarios/nuevoproducto")

    render() {

        let { products, links, meta, search } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-import-contact', action: this.importProducts, icon: 'import', msmTooltip: 'Importar productos', color: 'success' },
                        { type: 'button', id: 'tooltip-add-product', action: this.addProduct, icon: 'plus', msmTooltip: 'Agregar producto', color: 'primary' },
                    ]}
                    heading="Productos"
                    subheading="Lista de todos los productos"
                    icon="pe-7s-note2 icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <Input onChange={this.handleSelectFile} style={{ 'display': 'none' }} type="file" name="contactscsv" id="file_csv" accept=".csv" />

                    {
                        (products === null) ? (<p>Cargando ...</p>) :
                            (products.length < 1) ? (<p>No existe productos empiece por agregar el primer producto</p>) :
                                (
                                    <Row>

                                        {/* <Col lg="12" className="mb-4">
                                            <Card>
                                                <CardBody>
                                                    <CardTitle>Filtros</CardTitle>
                                                    <Form className="text-right">
                                                        <InputGroup size="sm">
                                                            <Input value={search} onChange={this.onChangeSearch} placeholder="..." />
                                                            <InputGroupAddon addonType="append">
                                                                <Button color="secondary" onClick={this.toggle}>
                                                                    <i className='nav-link-icon lnr-magnifier'></i>
                                                                </Button>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </Form>
                                                </CardBody>
                                            </Card>
                                        </Col> */}

                                        <Col lg="12">
                                            <Card className="main-card mb-3">
                                                <CardBody>
                                                    <Table striped size="sm" responsive>
                                                        <thead>
                                                            <tr>
                                                                <th>Código</th>
                                                                <th>Nombre</th>
                                                                {/* <th>Categoría</th> */}
                                                                {/* <th>Unidad</th> */}
                                                                <th>Precio</th>
                                                                <th>iva</th>
                                                                <th style={{ width: '1em' }}></th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {
                                                                products.map((product, index) => (
                                                                    <tr key={index}>
                                                                        <td>{product.atts.code}</td>
                                                                        <td>{product.atts.name}</td>
                                                                        {/* <td>{product.category.category}</td> */}
                                                                        {/* <td>{product.unity.unity}</td> */}
                                                                        <td>${Number(product.atts.price1 !== null ? product.atts.price1 : 0).toFixed(2)}</td>
                                                                        <td>{product.atts.iva == 0 ? '0%' : (product.atts.iva == 2 ? '12%' : 'no iva')}</td>
                                                                        <td>
                                                                            <Link to={'/inventarios/producto/' + product.id}>
                                                                                <Button size='sm' color="primary">
                                                                                    <i className='nav-link-icon lnr-pencil'></i>
                                                                                </Button>
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </Table>

                                                    <Paginate
                                                        links={links}
                                                        meta={meta}
                                                        reqNewPage={this.reqNewPage}
                                                    />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                )
                    }
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(Products);