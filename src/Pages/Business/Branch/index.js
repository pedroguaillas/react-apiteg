import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import api from '../../../services/api';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import ModalFormBranch from './ModalFormBranch';

class Branches extends Component {

    state = {
        branches: null,
        modal: false,
        branch: {}
    }

    async componentDidMount() {
        this.load()
    }

    load = async () => {
        try {
            await api.get('branches')
                .then(({ data: { branches } }) => this.setState({ branches }))
        } catch (error) {
            console.log(error)
        }
    }

    addBranch = () => {

        let branch = { store: 0, address: null, name: null, type: 'matriz' }

        // Solo cuando va crear la primera sucursar permitir crear el consumidor fimal
        if (this.state.branches.length === 0) branch.cf = false

        this.setState({ branch })

        this.toggle()
    }

    editBranch = (branch) => {
        this.setState({ branch })
        this.toggle()
    }

    toggle = () => {
        this.setState(state => ({ modal: !state.modal }))
    }


    submit = async () => {
        if (this.validate()) {
            let { branch } = this.state
            if (branch.id) {
                try {
                    await api.put('branch/update/' + branch.id, branch)
                        .then(() => {
                            this.toggle()
                            this.load()
                        })
                } catch (error) {
                    if (error.response.data.message === 'KEY_DUPLICATE') {
                        alert('Ya existe un establecimiento con ese número')
                    }
                }
            } else {
                try {
                    await api.post('branches', branch)
                        .then(() => {
                            this.toggle()
                            this.load()
                        })
                } catch (error) {
                    if (error.response.data.message === 'KEY_DUPLICATE') {
                        alert('Ya existe un establecimiento con ese número')
                    }
                }
            }
        }
    }

    validate = () => {

        let result = true
        let { branch: { store, address, type }, branches } = this.state
        let obj = { store, address, type }

        for (let o in obj) {
            if (obj[o] === null || obj[o].length === 0) {
                result = false
            }
        }

        if (!result) {
            alert('Llenar todos los campos marcardo con (*)')
            return
        }

        // Validar
        if (type === 'matriz' && branches.filter(b => b.type === 'matriz').length > 0) {
            alert('No se puede tener dos establecimientos MATRIZ')
            return
        }

        return result
    }

    handleChange = e => {

        let { name, value } = e.target

        if (name === 'store' && isNaN(value)) return

        this.setState({
            branch: {
                ...this.state.branch,
                [name]: value
            }
        })
    }

    handleChangeCheck = () => {
        this.setState(state => ({
            branch: {
                ...state.branch,
                cf: !state.branch.cf
            }
        }))
    }

    render() {

        let { branches, branch, modal } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-branch', action: this.addBranch, icon: 'plus', msmTooltip: 'Agregar Establecimiento', color: 'primary' },
                    ]}
                    heading="Establecimientos"
                    subheading="Surcursales de la empresa"
                    icon="pe-7s-id icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <ModalFormBranch
                        form={branch}
                        branches={branches}
                        isOpen={modal}
                        toggle={this.toggle}
                        handleChange={this.handleChange}
                        handleChangeCheck={this.handleChangeCheck}
                        submit={this.submit}
                    />

                    {
                        (branches === null) ? (<p>Cargando ...</p>) :
                            (branches.length < 1) ? (<p>No existe registro de sucursales</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped size="sm" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>N° Estab</th>
                                                            <th>Nombre</th>
                                                            <th>Dirección</th>
                                                            <th>Tipo</th>
                                                            <th style={{ width: '10em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            branches.map((branch, index) => (
                                                                <tr key={`branch${index}`}>
                                                                    <td>{(branch.store + '').padStart(3, '0')}</td>
                                                                    <td>{branch.name}</td>
                                                                    <td>{branch.address}</td>
                                                                    <td>{branch.type}</td>
                                                                    <td>
                                                                        <Link
                                                                            to={'/empresa/establecimiento/' + branch.id}
                                                                        >
                                                                            <Button color="success">Pts emisión</Button>
                                                                        </Link>
                                                                        <Button onClick={() => this.editBranch(branch)} className='ml-1' size='sm' color="primary">
                                                                            <i className='nav-link-icon lnr-pencil'></i>
                                                                        </Button>
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

export default Branches;