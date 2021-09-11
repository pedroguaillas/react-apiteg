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

class Documents extends Component {

    state = {
        vouchers: null,
        dropdowns: []
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('vouchers')
                .then(res => this.setState({ vouchers: res.data.vouchers }))
        } catch (error) {
            console.log(error)
        }
    }

    addDocument = () => this.props.history.push('/facturacion/registrardocumento')

    viewInvoicePdf = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('voucherspdf/' + id, { responseType: 'blob' })
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

    downloadXml = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('xmldownload/' + id)
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

    sendRetention = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('xml_retention/' + id)
                .then(res => console.log(res.data))
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

    renderproccess = ({ movement_id, state, type, voucher_type, extra_detail }) => (
        (type === 2) ?
            (voucher_type === 1 || voucher_type === 4 || voucher_type === 5) ?
                <DropdownItem onClick={() =>
                ((state === 'CREADO' || state === 'DEVUELTA') ? this.generateSign(movement_id) :
                    (state === 'FIRMADO' ? this.sendToSri(movement_id) :
                        ((state === 'ENVIADO' || state === 'RECIBIDO') ? this.autorizedFromSri(movement_id) : null)))
                }>{this.renderSwith(state)}</DropdownItem>
                : null
            :
            (voucher_type === 3) ?
                <DropdownItem onClick={() =>
                ((state === 'CREADO' || state === 'DEVUELTA') ? this.generateSign(movement_id) :
                    (state === 'FIRMADO' ? this.sendToSri(movement_id) :
                        ((state === 'ENVIADO' || state === 'RECIBIDO') ? this.autorizedFromSri(movement_id) : null)))
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
            await clienteAxios.get('xml/' + id)
                .then(res => console.log(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    sendToSri = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('sendsri/' + id)
                .then(res => console.log(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    autorizedFromSri = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get(`authorizevoucher/${id}`)
                .then(res => this.setState({ vouchers: res.data.vouchers }))
        } catch (error) {
            console.log(error)
        }
    }

    //Layout
    render = () => {

        let { vouchers, dropdowns } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-document', action: this.addDocument, icon: 'plus', msmTooltip: 'Agregar documento', color: 'primary' },
                    ]}
                    heading="Documentos"
                    subheading="Todos los comprobantes registrados"
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
                        (vouchers === null) ? (<p>Cargando ...</p>) :
                            (vouchers.length === 0) ? (<p>No existe documentos registrados</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>Emisión</th>
                                                            <th>Documento</th>
                                                            <th>Persona</th>
                                                            <th>Tipo</th>
                                                            <th>Estado</th>
                                                            <th>Total</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            vouchers.map((voucher, index) => (
                                                                <tr key={index}>
                                                                    <td>{voucher.date}</td>
                                                                    <td>
                                                                        <Link to={'/facturacion/documento/' + voucher.movement_id}>
                                                                            {`${this.cal_prefix(voucher.voucher_type)} ${voucher.serie}`}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{voucher.company}</td>
                                                                    <td>{voucher.type === 1 ? 'Compra' : 'Venta'}</td>
                                                                    <td>{voucher.state}</td>
                                                                    <td>${voucher.total}</td>
                                                                    <td>
                                                                        <ButtonDropdown direction="left" isOpen={dropdowns[index]} toggle={() => this.handleDrops(index)}>
                                                                            <DropdownToggle caret>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem onClick={() => this.viewInvoicePdf(voucher.movement_id)}>Ver Pdf</DropdownItem>
                                                                                {this.renderproccess(voucher)}
                                                                                {
                                                                                    voucher.xml ?
                                                                                        <DropdownItem onClick={() => this.downloadXml(voucher.movement_id)}>Descargar XML</DropdownItem>
                                                                                        : null
                                                                                }
                                                                            </DropdownMenu>
                                                                        </ButtonDropdown>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
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

export default connect(mapStateToProps)(Documents);