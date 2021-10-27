import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col, Card, CardBody, Table, Input,
    ButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import Paginate from '../../Components/Paginate/Index';

class Documents extends Component {

    state = {
        dropdowns: [],
        shops: null,
        links: null,
        meta: null
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('shops')
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        shops: data,
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
                await clienteAxios.get(`shops?page=${page.substring((page.indexOf('=')) + 1)}`)
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            shops: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    addDocument = () => this.props.history.push('/compras/registrardocumento')

    duplicate = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('shops/duplicate/' + id)
                .then(res => {
                    // let { data, links, meta } = res.data
                    this.setState({
                        shops: res.data.shops
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    viewInvoicePdf = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('retentions/pdf/' + id, { responseType: 'blob' })
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

    renderproccess = ({ id, state_retencion, voucher_type, serie_retencion }) => (
        (voucher_type < 4 && serie_retencion) ?
            <DropdownItem onClick={() =>
            ((state_retencion === null || state_retencion === 'CREADO' || state_retencion === 'DEVUELTA') ? this.generateSignRetention(id) :
                (state_retencion === 'FIRMADO' ? this.sendToSriRetention(id) :
                    ((state_retencion === 'ENVIADO' || state_retencion === 'RECIBIDO') ? this.autorizedFromSriRetention(id) : null)))
            }>{this.renderSwith(state_retencion)}</DropdownItem>
            : null
    )

    renderSwith = (state) => {
        switch (state) {
            case null: return 'Firmar enviar y procesar'
            case 'CREADO': return 'Firmar enviar y procesar'
            case 'FIRMADO': return 'Enviar y procesar'
            case 'EN_PROCESO': return 'Autorizar'
            case 'ENVIADO': return 'Autorizar'
            case 'RECIBIDO': return 'Autorizar'
            case 'DEVUELTA': return 'Volver a procesar'
        }
    }

    downloadXmlRetention = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('retentions/download/' + id)
                .then(res => {
                    var a = document.createElement("a"); //Create <a>
                    a.href = "data:text/xml;base64," + res.data.xml; //Image Base64 Goes here
                    a.download = "Retención.xml"; //File name Here
                    a.click(); //Downloaded file
                })
        } catch (error) {
            console.log(error)
        }
    }

    generateSignRetention = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('retentions/xml/' + id)
                .then(res => console.log(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    sendToSriRetention = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('retentions/sendsri/' + id)
                .then(res => console.log(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    autorizedFromSriRetention = async (id) => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get(`retentions/authorize/${id}`)
                .then(res => console.log(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    importFromTxt = () => document.getElementById('file_txt').click()

    handleSelectFile = e => {
        let input = e.target;

        let reader = new FileReader();
        reader.onload = () => this.uploadTxtReport(reader.result)
        reader.readAsText(input.files[0])
    }

    uploadTxtReport = txt => {
        let lines = txt.split(/\r\n|\n/)
        let codekeys = []
        let i = 0

        for (let line in lines) {
            if (i > 0 && i % 2 === 0 && i < lines.length - 1) {
                let words = lines[line].split('\t')
                if (words[9].length === 49 || words[9].length === 13) {
                    codekeys.push(words[words[9].length === 49 ? 9 : 10])
                }
            }
            i++
        }
        this.saveFromTxt(codekeys)
    }

    saveFromTxt = async (codekeys) => {
        let data = { clave_accs: codekeys }
        tokenAuth(this.props.token)
        try {
            await clienteAxios.post('shops/import', data)
                .then(res => console.log(res))
        } catch (error) {
            alert('Por mal')
        }
    }

    //Layout
    render = () => {

        let { shops, links, meta, dropdowns } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-import-contact', action: this.importFromTxt, icon: 'import', msmTooltip: 'Importar desde .txt reporte SRI', color: 'success' },
                        { type: 'button', id: 'tooltip-add-document', action: this.addDocument, icon: 'plus', msmTooltip: 'Agregar documento', color: 'primary' },
                    ]}
                    heading="Compras"
                    subheading="Lista de todas las compras"
                    icon="pe-7s-repeat icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>


                    <Input onChange={this.handleSelectFile} style={{ 'display': 'none' }} type="file" name="invoicestxt" id="file_txt" accept=".txt" />
                    {
                        (shops === null) ? (<p>Cargando ...</p>) :
                            (shops.length === 0) ? (<p>No existe documentos registrados</p>) :
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
                                                            <th>Estado Ret Elec</th>
                                                            <th>Total</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            shops.map((voucher, index) => (
                                                                <tr key={index}>
                                                                    <td>{voucher.atts.date}</td>
                                                                    <td>
                                                                        <Link to={'/compras/documento/' + voucher.id}>
                                                                            {`${this.cal_prefix(voucher.atts.voucher_type)} ${voucher.atts.serie}`}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{voucher.provider.name}</td>
                                                                    <td>{voucher.atts.state_retencion}</td>
                                                                    <td>${voucher.atts.total}</td>
                                                                    <td>
                                                                        <ButtonDropdown direction="left" isOpen={dropdowns[index]} toggle={() => this.handleDrops(index)}>
                                                                            <DropdownToggle caret>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem onClick={() => this.viewInvoicePdf(voucher.id)}>Ver Pdf</DropdownItem>
                                                                                {this.renderproccess(voucher)}
                                                                                {
                                                                                    voucher.atts.xml_retention ?
                                                                                        <DropdownItem onClick={() => this.downloadXmlRetention(voucher.id)}>Descargar XML</DropdownItem>
                                                                                        : null
                                                                                }
                                                                                <DropdownItem onClick={() => this.duplicate(voucher.id)}>Duplicar</DropdownItem>
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

export default connect(mapStateToProps)(Documents);