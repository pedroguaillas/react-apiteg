import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Input, Form, InputGroup } from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Link } from 'react-router-dom';
import Paginate from '../../Components/Paginate/Index';
import api from '../../../services/api';

class Carriers extends Component {

    state = {
        carriers: null,
        links: null,
        meta: null,
        search: ''
    }

    async componentDidMount() {
        let { search } = this.state
        try {
            await api.post('carrierlist', { search })
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        carriers: data,
                        links,
                        meta,
                    })
                })
        } catch (error) { console.log(error) }
    }

    reqNewPage = async (e, page) => {
        e.preventDefault();

        if (page !== null) {
            let { search } = this.state
            try {
                await api.post(`carrierlist?page=${page.substring((page.indexOf('=')) + 1)}`, { search })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            carriers: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) { console.log(error) }
        }
    }

    onChangeSearch = async (e) => {
        let {
            value
        } = e.target

        try {
            await api.post('carrierlist', { search: value })
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        search: value,
                        carriers: data,
                        links,
                        meta,
                    })
                })
        } catch (error) { console.log(error) }
    }

    importContacts = () => document.getElementById('file_csv').click()

    handleSelectFile = e => {
        let input = e.target;

        let reader = new FileReader();
        reader.onload = () => this.uploadCsv(reader.result)
        reader.readAsText(input.files[0])
    }

    uploadCsv = csv => {
        let lines = csv.split(/\r\n|\n/)
        let carriers = []
        let i = 0

        for (let line in lines) {
            if (i > 0 && lines[line].length > 0) {
                let words = lines[line].split(';')
                let object = {
                    type_identication: words[0].trim(),
                    identication: words[0].trim(),
                    name: words[2].trim(),
                    address: words[3].trim()
                }
                carriers.push(object)
            }
            i++
        }
        this.saveContactsFromCsv(carriers)
    }

    saveContactsFromCsv = async (carriers) => {

        let data = { carriers }

        try {
            await api.post('carriers_import', data)
                .then(res => this.setState({ carriers: res.data.carriers }))
        } catch (error) {
            alert('Por mal')
        }
    }

    addCarrier = () => this.props.history.push("/contactos/nuevotransportista")

    render() {

        let { carriers, links, meta, search } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-import-contact', action: this.importContacts, icon: 'import', msmTooltip: 'Importar contactos', color: 'success' },
                        { type: 'button', id: 'tooltip-add-contact', action: this.addCarrier, icon: 'plus', msmTooltip: 'Agregar cliente', color: 'primary' }
                    ]}
                    heading="Transportistas"
                    subheading="Lista de transportistas"
                    icon="pe-7s-users icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <Row>
                        <Col lg="12" className="mb-4">
                            <Card>
                                <div className="card-header">Busqueda
                                    <div className="btn-actions-pane-right">
                                        <Form className="text-right">
                                            <InputGroup size="sm">
                                                <Input value={search} onChange={this.onChangeSearch} placeholder="Buscar" className="search-input" />
                                            </InputGroup>
                                        </Form>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Input onChange={this.handleSelectFile} style={{ 'display': 'none' }} type="file" name="contactscsv" id="file_csv" accept=".csv" />

                    {
                        (carriers === null) ? (<p>Cargando ...</p>) :
                            (carriers.length < 1) ? (<p>No existe registro de transportistas</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped size="sm" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Identificación</th>
                                                            <th>Nombre</th>
                                                            <th>Placa</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            carriers.map((carrier, index) => (
                                                                <tr key={index}>
                                                                    <td>{carrier.atts.identication}</td>
                                                                    <td>{carrier.atts.name}</td>
                                                                    <td>{carrier.atts.license_plate}</td>
                                                                    <td>
                                                                        <Link to={'/contactos/transportista/' + carrier.id}>
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

export default Carriers;