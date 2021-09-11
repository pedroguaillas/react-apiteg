import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table, Button, Input } from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Link } from 'react-router-dom';

import Pagination from './Pagination'
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class ListContacts extends Component {

    state = { contacts: null }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('contacts')
                .then(res => this.setState({ contacts: res.data.contacts }))
        } catch (error) {
            console.log(error)
        }
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
        let contacts = []
        let i = 0

        for (let line in lines) {
            if (i > 0 && lines[line].length > 0) {
                let words = lines[line].split(';')
                let object = {
                    identication_card: words[0].trim(),
                    ruc: words[1].trim(),
                    company: words[2].trim(),
                    address: words[3].trim()
                }
                contacts.push(object)
            }
            i++
        }
        this.saveContactsFromCsv(contacts)
    }

    saveContactsFromCsv = async (contacts) => {

        let data = { contacts }

        tokenAuth(this.props.token)
        try {
            await clienteAxios.post('contacts_import', data)
                .then(res => this.setState({ contacts: res.data.contacts }))
            // .then(res => this.props.history.push('/facturacion/documentos'))
        } catch (error) {
            alert('Por mal')
        }
    }

    addContact = () => this.props.history.push("/contactos/nuevocontacto")

    render() {

        let { contacts } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-import-contact', action: this.importContacts, icon: 'import', msmTooltip: 'Importar contactos', color: 'success' },
                        { type: 'button', id: 'tooltip-add-contact', action: this.addContact, icon: 'plus', msmTooltip: 'Agregar contacto', color: 'primary' }
                    ]}
                    heading="Contactos"
                    subheading="Lista de todos los contactos"
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
                        (contacts === null) ? (<p>Cargando ...</p>) :
                            (contacts.length < 1) ? (<p>No existe registro de documentos</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>Identificación</th>
                                                            <th>Nombre</th>
                                                            <th>Nombre comercial</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            contacts.map((contact, index) => (
                                                                <tr key={index}>
                                                                    <td>{contact.ruc ? contact.ruc : contact.identication_card}</td>
                                                                    <td>{contact.company}</td>
                                                                    <td>{contact.name}</td>
                                                                    <td>
                                                                        <Link to={'/contactos/contacto/' + contact.id}>
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

                                                {/* <Pagination
                                                    len={contacts.length}
                                                /> */}
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

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ListContacts);