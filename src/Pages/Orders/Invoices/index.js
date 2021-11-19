import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col, Card, CardBody, Table,
    ButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import Paginate from '../../Components/Paginate/Index';

class Invoices extends Component {

    state = {
        dropdowns: [],
        orders: null,
        links: null,
        meta: null
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('orders')
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        orders: data,
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

        if (page !== null) {
            tokenAuth(this.props.token);
            try {
                await clienteAxios.get(`orders?page=${page.substring((page.indexOf('=')) + 1)}`)
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            orders: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    reloadPage = async () => {
        let { current_page } = this.state.meta
        if (current_page !== null) {
            tokenAuth(this.props.token);
            try {
                await clienteAxios.get(`orders?page=${current_page}`)
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            orders: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    addDocument = () => this.props.history.push('/ventas/registrarfactura')

    viewInvoicePdf = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get(`orders/${id}/pdf`, { responseType: 'blob' })
                .then(res => {
                    //Create a Blob from the PDF Stream
                    const file = new Blob([res.data], { type: 'application/pdf' });
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(file);
                    //Open the URL on new Window
                    window.open(fileURL);
                })
        } catch (error) {
            console.log(error)
        }
    }

    handleDrops = (index) => {
        let { dropdowns } = this.state
        dropdowns[index] = !dropdowns[index]
        this.setState({ dropdowns })
    }

    cal_prefix = (type) => {
        let prefix = null
        switch (Number(type)) {
            case 1: prefix = 'FAC'; break;
            case 3: prefix = 'L/C'; break;
            case 4: prefix = 'N/C'; break;
            case 5: prefix = 'N/D'; break;
        }
        return prefix
    }

    renderproccess = ({ id, atts: { state, voucher_type } }) => (
        (voucher_type === 1 || voucher_type === 4 || voucher_type === 5) ?
            <DropdownItem onClick={() =>
            ((state === 'CREADO' || state === 'DEVUELTA') ? this.generateSign(id) :
                (state === 'FIRMADO' ? this.sendToSri(id) :
                    ((state === 'ENVIADO' || state === 'RECIBIDO') ? this.autorizedFromSri(id) : null)))
            }>{this.renderSwith(state)}</DropdownItem>
            : null
    )

    renderSwith = (state) => {
        switch (state) {
            case 'CREADO': return 'Firmar enviar y procesar'
            case 'FIRMADO': return 'Enviar y procesar'
            case 'ENVIADO': return 'Autorizar'
            case 'RECIBIDO': return 'Autorizar'
            case 'DEVUELTA': return 'Volver a procesar'
        }
    }

    generateSign = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('orders/xml/' + id)
                .then(res => this.reloadPage())
        } catch (error) {
            console.log(error)
        }
    }

    sendToSri = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('orders/sendsri/' + id)
                .then(res => this.reloadPage())
        } catch (error) {
            console.log(error)
        }
    }

    autorizedFromSri = async (id) => {
        tokenAuth(this.props.token);
        // Recargar la pagina actual .......................
        try {
            await clienteAxios.get(`orders/authorize/${id}`)
                .then(res => this.reloadPage())
        } catch (error) {
            console.log(error)
        }
    }

    downloadXml = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('orders/download/' + id)
                .then(res => {
                    var a = document.createElement("a"); //Create <a>
                    a.href = "data:text/xml;base64," + res.data.xml; //Image Base64 Goes here
                    a.download = "Factura.xml"; //File name Here
                    a.click(); //Downloaded file
                })
        } catch (error) {
            console.log(error)
        }
    }

    //Layout
    render = () => {

        let { orders, dropdowns, links, meta } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-document', action: this.addDocument, icon: 'plus', msmTooltip: 'Agregar documento', color: 'primary' },
                    ]}
                    heading="Facturas"
                    subheading="Todas las facturas registrados"
                    icon="pe-7s-repeat icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    {
                        (orders === null) ? (<p>Cargando ...</p>) :
                            (orders.length === 0) ? (<p>No existe facturas registradas</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '7em' }}>Emisión</th>
                                                            <th>Documento</th>
                                                            <th>Cliente / Razón social</th>
                                                            <th>Estado</th>
                                                            <th>Total</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            orders.map((order, index) => (
                                                                <tr key={index}>
                                                                    <td>{order.atts.date}</td>
                                                                    <td>
                                                                        <Link to={'/ventas/factura/' + order.id}>
                                                                            {`${this.cal_prefix(order.atts.voucher_type)} ${order.atts.serie}`}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{order.customer.name}</td>
                                                                    <td>{order.atts.state}</td>
                                                                    <td>${order.atts.total}</td>
                                                                    <td>
                                                                        <ButtonDropdown direction="left" isOpen={dropdowns[index]} toggle={() => this.handleDrops(index)}>
                                                                            <DropdownToggle caret>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem onClick={() => this.viewInvoicePdf(order.id)}>Ver Pdf</DropdownItem>
                                                                                {this.renderproccess(order)}
                                                                                {
                                                                                    order.atts.xml ?
                                                                                        <DropdownItem onClick={() => this.downloadXml(order.id)}>Descargar XML</DropdownItem>
                                                                                        :
                                                                                        null
                                                                                }
                                                                            </DropdownMenu>
                                                                        </ButtonDropdown>
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
                                </Row>)
                    }
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(Invoices);