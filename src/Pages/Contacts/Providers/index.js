import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table, Button, Input } from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Link } from 'react-router-dom';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class Providers extends Component {

    state = { providers: null }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('providers')
                .then(res => this.setState({ providers: res.data.providers }))
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
        let providers = []
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
                providers.push(object)
            }
            i++
        }
        this.saveContactsFromCsv(providers)
    }

    saveContactsFromCsv = async (providers) => {

        let data = { providers }

        tokenAuth(this.props.token)
        try {
            await clienteAxios.post('providers_import', data)
                .then(res => this.setState({ providers: res.data.providers }))
        } catch (error) {
            alert('Por mal')
        }
    }

    addProvider = () => this.props.history.push("/contactos/nuevoproveedor")

    render() {

        let { providers } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-import-contact', action: this.importContacts, icon: 'import', msmTooltip: 'Importar contactos', color: 'success' },
                        { type: 'button', id: 'tooltip-add-contact', action: this.addProvider, icon: 'plus', msmTooltip: 'Agregar cliente', color: 'primary' }
                    ]}
                    heading="Proveedores"
                    subheading="Lista de proveedores"
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
                        (providers === null) ? (<p>Cargando ...</p>) :
                            (providers.length < 1) ? (<p>No existe registro de proveedores</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>Identificación</th>
                                                            <th>Razon social</th>
                                                            <th>Dirección</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            providers.map((provider, index) => (
                                                                <tr key={index}>
                                                                    <td>{provider.identication}</td>
                                                                    <td>{provider.name}</td>
                                                                    <td>{provider.address}</td>
                                                                    <td>
                                                                        <Link to={'/contactos/proveedor/' + provider.id}>
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

export default connect(mapStateToProps)(Providers);