import React, { Component, Fragment } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table,
    Card, Form, Row, Col, ListGroup, ListGroupItem,
    FormGroup, Label, CustomInput, ModalFooter,
    Alert
} from 'reactstrap'
import Paginate from '../../Paginate/Index';
import api from '../../../../services/api';

class SelectProvider extends Component {

    state = {
        providers: [],
        suggestions: [],
        modal: false,
        modalnewprov: false,
        provider: {
            'type_identification': 'ruc'
        },
        links: null,
        meta: null,
        search: '',
        error: null,
    }

    componentDidUpdate(prevProps) {

        if (this.props.id !== prevProps.id && this.props.id > 0) {

            // Se actualiza el nombre del proveedor una vez termine cargar la pagina
            // Este se utiliza solo cuando va ver un registro
            if (this.props.providers !== prevProps.providers && this.props.providers.length === 1) {

                this.setState((state, props) => ({
                    item: props.providers[0].atts.name,
                }))
            } else {
                let { providers, suggestions } = this.state

                if (providers.length > 0 || suggestions.length > 0) {
                    let items = suggestions.length !== 0 ? suggestions : providers
                    this.setState((state, props) => ({
                        item: (items.length !== 0) ? items.filter(provider => provider.id === props.id)[0].atts.name : '',
                        providers: [],
                        suggestions: [],
                    }))
                }
            }
        }
    }

    selectProvider = (item) => {
        this.props.selectProvider(item.id)
        this.toggle()
    }

    //Show & hidden modal
    toggleNewProvider = () => this.setState(state => ({ modalnewprov: !state.modalnewprov }))

    handleChange = e => {
        this.setState({
            provider: {
                ...this.state.provider,
                [e.target.name]: e.target.value
            }
        })
    }

    handleChangeIdentification = async e => {
        let { name, value } = e.target
        this.setState({
            provider: {
                ...this.state.provider,
                [name]: value
            }
        })

        if (value.length === 13 && this.state.provider.type_identification === 'ruc') {
            try {
                await api.get(`providers/searchByRuc/${value}`).then((res) => {
                    if (res.data.provider !== null) {
                        if (res.data.provider.branch_id === 0) {
                            const { name, address, email, phone } = res.data.provider
                            this.setState({
                                provider: {
                                    ...this.state.provider,
                                    name, address, email, phone,
                                },
                                error: null
                            })
                        } else {
                            this.setState({ error: 'El proveedor ya esta registrado' })
                        }
                    }
                });
            } catch (err) {
                console.log(err)
            }
        }
    }

    submit = async () => {
        if (this.validate()) {
            try {
                await api.post('providers', this.state.provider)
                    .then(res => {
                        let { provider } = res.data
                        let { providers } = this.state
                        providers.push({ id: provider.id, atts: { identication: provider.identication, name: provider.name } })
                        this.setState({ providers, modalnewprov: false })
                        this.props.selectProvider(provider.id)
                    })
            } catch (error) {
                if (error.response.data.message === 'KEY_DUPLICATE') {
                    alert('Ya existe un proveedor con la identificación ' + this.state.provider.identication)
                }
                console.log(error)
            }
        }
    }

    //Validate data to send save
    validate = () => {

        let { provider } = this.state

        if (provider.identication === undefined || provider.name === undefined) {
            alert('Los campos marcados con * no pueden ser nulos')
            return
        }

        if (provider.type_identification === 'cédula' && provider.identication.trim().length !== 10) {
            alert('La cédula debe tener 10 dígitos')
            return
        }

        if (provider.type_identification === 'ruc' && provider.identication.trim().length < 13) {
            alert('El RUC debe tener 13 dígitos')
            return
        }

        if (provider.type_identification === 'pasaporte' && provider.identication.trim().length < 3) {
            alert('El pasaporte debe tener mínimo 3 caracteres')
            return
        }

        if (provider.name.trim().length < 3) {
            alert('El nombre debe tener mínimo 3 caracteres')
            return
        }

        return true
    }

    //Show & hidden modal
    toggle = async () => {
        let { providers } = this.state

        if (providers.length === 0) {
            try {
                await api.post('providerlist', { paginate: 10 })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState(state => ({
                            modal: !state.modal,
                            providers: data,
                            suggestion: [],
                            links,
                            meta,
                        }))
                    })
            } catch (error) { console.log(error) }
        } else {
            this.setState(state => ({ modal: !state.modal }))
        }
    }

    reqNewPage = async (e, page) => {
        e.preventDefault();

        if (page !== null) {
            let { search } = this.state
            try {
                await api.post(`providerlist?page=${page.substring((page.indexOf('=')) + 1)}`, { search, paginate: 10 })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            providers: data,
                            links,
                            meta,
                        })
                    })
            } catch (error) { console.log(error) }
        }
    }

    onChangeItem = async (e) => {
        let {
            value
        } = e.target

        if (value.length > 1) {
            try {
                await api.post('providerlist', { search: value, paginate: 4 })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            item: value,
                            suggestions: data,
                            providers: [],
                            links,
                            meta,
                        })
                    })
            } catch (error) { console.log(error) }
        } else {
            // tiene que ponerse el valor de item
            // ademas las sugerencias no tiene que aparecer
            this.setState({
                item: value,
                suggestions: []
            })
        }
    }

    onChangeSearch = async (e) => {
        let {
            value
        } = e.target

        try {
            await api.post('providerlist', { search: value, paginate: 10 })
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        search: value,
                        providers: data,
                        suggestions: [],
                        links,
                        meta,
                    })
                })
        } catch (error) { console.log(error) }
    }

    render = () => {

        let { providers, provider, suggestions, links, meta, item, search, error } = this.state

        return (
            <Fragment>
                <div>
                    <Row key={123}>
                        <Col>
                            <InputGroup size="sm">
                                <Input onChange={this.onChangeItem} value={item} placeholder="..." />
                                <InputGroupAddon addonType="append">
                                    <Button color="secondary" onClick={this.toggle}>
                                        <i className='nav-link-icon lnr-magnifier'></i>
                                    </Button>
                                    <Button color="secondary" onClick={this.toggleNewProvider}>
                                        <i className='nav-link-icon lnr-plus-circle'></i>
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row key={111}>
                        <Col style={{ width: '100%' }}>
                            <ListGroup style={{ 'cursor': 'pointer' }}>
                                {
                                    suggestions.map(({ id, atts }, index) => (
                                        <ListGroupItem onClick={() => this.props.selectProvider(id)} style={{ padding: '.4em', 'font-size': '.9em', 'text-align': 'left' }} key={index}>
                                            {`${atts.identication} - ${atts.name}`}
                                        </ListGroupItem>
                                    ))
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
                {/* Modal register provider */}
                <Modal
                    isOpen={this.state.modalnewprov}
                    toggle={this.toggleNewProvider}
                    className={this.props.className}
                    size={this.props.size}
                    centered={true}
                >
                    <ModalHeader toggle={this.toggleNewprovider}>Registrar proveedor</ModalHeader>
                    <ModalBody>
                        <Form className="text-right">
                            <Row form>
                                <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                            </Row>
                            <FormGroup className="mb-1" row>
                                <Label for="type_identification" sm={4}>Tipo de identicatión</Label>
                                <Col sm={8}>
                                    <CustomInput bsSize="sm" onChange={this.handleChange} value={provider.type_identification}
                                        type="select" id="type_identification" name="type_identification" requiered>
                                        <option value="cédula">Cédula</option>
                                        <option value="ruc">RUC</option>
                                        <option value="pasaporte">Pasaporte</option>
                                    </CustomInput>
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="identication" sm={4}>Identificación *</Label>
                                <Col sm={8}>
                                    <Input bsSize="sm" onChange={this.handleChangeIdentification} value={provider.identication}
                                        type="text" id="identication" name="identication" maxlength="13" requiered />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="name" sm={4}>Nombre *</Label>
                                <Col sm={8}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={provider.name}
                                        type="text" id="name" name="name" maxlength={300} requiered />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="address" sm={4}>Dirección</Label>
                                <Col sm={8}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={provider.address}
                                        type="text" id="address" name="address" />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="phone" sm={4}>Teléfono</Label>
                                <Col sm={8}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={provider.phone} type="text"
                                        id="phone" name="phone" maxlength={13} pattern="[0-9]{10,15}"
                                        title="Teléfono ejemplo 0939649714" />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-0" row>
                                <Label for="email" sm={4}>Correo electrónico</Label>
                                <Col sm={8}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={provider.email} type="email"
                                        id="email" name="email" />
                                </Col>
                            </FormGroup>
                            {
                                error !== null ? <Alert color='danger'>{error}</Alert> : null
                            }
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.submit} className="btn-transition" color="primary">
                            Guardar
                        </Button>
                    </ModalFooter>
                </Modal>
                {/* List providers */}
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={this.toggle}>Seleccionar proveedor</ModalHeader>
                    <ModalBody>
                        <Card className="mb-2">
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
                        {providers === null ? null :
                            (<Table className="mb-2" bordered>
                                <thead>
                                    <tr>
                                        <th style={{ width: '5em' }}>Identificación</th>
                                        <th>Nombre / Razón social</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {providers.map((provider, index) => (
                                        <tr key={`provider${index}`}>
                                            <td>{provider.atts.identication}</td>
                                            <td onClick={() => this.selectProvider(provider)}>
                                                <a href="javascript:void(0);" className="alert-link">{provider.atts.name}</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>)}
                        <Paginate
                            links={links}
                            meta={meta}
                            reqNewPage={this.reqNewPage}
                        />
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

export default SelectProvider;