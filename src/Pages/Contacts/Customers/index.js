import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table, Button, Input } from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Link } from 'react-router-dom';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import Paginate from '../../Components/Paginate/Index';

class Customers extends Component {

    state = {
        customers: null,
        links: null,
        meta: null
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('customers')
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        customers: data,
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
                await clienteAxios.get(`customers?page=${page.substring((page.indexOf('=')) + 1)}`)
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            customers: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) {
                console.log(error)
            }
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
                    address: words[3].trim()
                }
                customers.push(object)
            }
            i++
        }
        this.saveContactsFromCsv(customers)
    }

    saveContactsFromCsv = async (customers) => {

        let data = { customers }

        tokenAuth(this.props.token)
        try {
            await clienteAxios.post('customers_import_csv', data)
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        customers: data,
                        links,
                        meta,
                    })
                })
        } catch (error) {
            alert('Por mal')
        }
    }

    addCustomer = () => this.props.history.push("/contactos/nuevocliente")

    render() {

        let { customers, links, meta } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-import-contact', action: this.importContacts, icon: 'import', msmTooltip: 'Importar contactos', color: 'success' },
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

                    <Input onChange={this.handleSelectFile} style={{ 'display': 'none' }} type="file" name="contactscsv" id="file_csv" accept=".csv" />
                    {
                        (customers === null) ? (<p>Cargando ...</p>) :
                            (customers.length < 1) ? (<p>No existe registro de documentos</p>) :
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

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(Customers);