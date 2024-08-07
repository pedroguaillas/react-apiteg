import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Input, Form, InputGroup } from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Link } from 'react-router-dom';

import Paginate from '../../Components/Paginate/Index';
import api from '../../../services/api';

class Customers extends Component {

    state = {
        customers: null,
        links: null,
        meta: null,
        search: '',
        searching: false
    }

    async componentDidMount() {
        let { search } = this.state
        try {
            await api.post('customerlist', { search })
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        customers: data,
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
                await api.post(`customerlist?page=${page.substring((page.indexOf('=')) + 1)}`, { search })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            customers: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) { console.log(error) }
        }
    }

    onChangeSearch = async (e) => {
        let { value } = e.target

        this.setState({ search: value })

        if (!this.state.searching) {
            try {
                // Agregado Inicio
                this.setState({ searching: true })
                // Agregado Fin
                await api.post('customerlist', { search: value })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            // Eliminado
                            // search: value,
                            customers: data,
                            links,
                            meta,
                            searching: false
                        })
                    })
            } catch (error) { console.log(error) }
        }
    }

    importContacts = () => document.getElementById('file_csv').click()

    handleSelectFile = e => {
        let input = e.target;

        let reader = new FileReader();
        reader.onload = () => this.uploadCsv(reader.result)
        reader.readAsText(input.files[0], 'ISO-8859-1')
    }

    uploadCsv = csv => {
        let lines = csv.split(/\r\n|\n/)
        let customers = []
        let i = 0
        
        for (let line in lines) {
            if (i > 0 && lines[line].length > 0) {
                let words = lines[line].split(';')
                let object = {
                    type_identification: words[0].trim(),
                    identication: words[1].trim(),
                    name: words[2].trim(),
                    address: words[3].trim(),
                    email: words[4].trim(),
                    phone: words[5].trim(),
                }
                customers.push(object)
            }
            i++
        }
        this.saveContactsFromCsv(customers)
    }

    saveContactsFromCsv = async (customers) => {

        let data = { customers }

        try {
            await api.post('customers_import_csv', data)
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        customers: data,
                        links,
                        meta,
                    })
                })
        } catch (error) { console.log(error) }
    }

    exportCustomers = async () => {
        try {
            await api
                .get(`customers/export`, { responseType: 'blob' })
                .then(({ data }) => {
                    var blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
                    })
                    var a = document.createElement('a') //Create <a>
                    a.href = URL.createObjectURL(blob) //Image Base64 Goes here
                    a.download = `Clientes.xlsx` //File name Here
                    a.click() //Downloaded file
                })
        } catch (error) {
            console.log(error)
        }
    }

    addCustomer = () => this.props.history.push("/contactos/nuevocliente")

    render() {

        let { customers, links, meta, search } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-import-contact', action: this.importContacts, icon: 'import', msmTooltip: 'Importar contactos', color: 'success' },
                        {
                            type: 'button',
                            id: 'tooltip-export-customers',
                            action: this.exportCustomers,
                            icon: 'export',
                            msmTooltip: 'Exportar clientes',
                            color: 'info'
                        },
                        { type: 'button', id: 'tooltip-add-contact', action: this.addCustomer, icon: 'plus', msmTooltip: 'Agregar cliente', color: 'primary' }
                    ]}
                    heading="Clientes"
                    subheading="Lista de clientes"
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
                        (customers === null) ? (<p>Cargando ...</p>) :
                            (customers.length < 1) ? (<p>No existe registro de clientes</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped size="sm" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Identificación</th>
                                                            <th>Nombre</th>
                                                            <th>Dirección</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            customers.map((customer, index) => (
                                                                <tr key={index}>
                                                                    <td>{customer.atts.identication}</td>
                                                                    <td>{customer.atts.name}</td>
                                                                    <td>{customer.atts.address}</td>
                                                                    <td>
                                                                        <Link to={'/contactos/cliente/' + customer.id}>
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

export default Customers;