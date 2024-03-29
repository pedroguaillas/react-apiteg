import React, { Component, Fragment } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table,
    Card, Form, Row, Col, ListGroup, ListGroupItem,
    FormGroup, Label, CustomInput, ModalFooter
} from 'reactstrap'
import Paginate from '../../Paginate/Index';
import api from '../../../../services/api';

class SelectCarrier extends Component {

    state = {
        carriers: [],
        suggestions: [],
        modal: false,
        modalnewcarr: false,
        carrier: {
            'type_identification': 'cédula'
        },
        links: null,
        meta: null,
        search: ''
    }

    componentDidUpdate(prevProps) {

        if (this.props.id !== prevProps.id && this.props.id > 0) {

            // Se actualiza el nombre del cliente una vez termine cargar la pagina
            // Este se utiliza solo cuando va ver un registro
            if (this.props.carriers !== prevProps.carriers && this.props.carriers.length === 1) {
                this.setState((state, props) => ({
                    item: props.carriers[0].atts.name,
                }))
            } else {
                let { carriers, suggestions } = this.state

                if (carriers.length > 0 || suggestions.length > 0) {
                    let items = suggestions.length !== 0 ? suggestions : carriers
                    this.setState((state, props) => ({
                        item: (items.length !== 0) ? items.filter(carrier => carrier.id === props.id)[0].atts.name : '',
                        carriers: [],
                        suggestions: [],
                    }))
                }
            }
        }
    }

    selectCarrier = (item) => {
        this.props.selectCarrier(item.id)
        this.toggle()
    }

    //Show & hidden modal
    toggleNewCarrier = () => this.setState(state => ({ modalnewcarr: !state.modalnewcarr }))

    handleChange = e => {
        this.setState({
            carrier: {
                ...this.state.carrier,
                [e.target.name]: e.target.value
            }
        })
    }

    submit = async () => {
        if (this.validate()) {
            try {
                await api.post('carriers', this.state.carrier)
                    .then(res => {
                        let { carrier } = res.data
                        let { carriers } = this.state
                        carriers.push({ id: carrier.id, atts: { identication: carrier.identication, name: carrier.name } })
                        this.setState({ carriers, modalnewcarr: false })
                        this.props.selectCarrier(carrier.id)
                    })
            } catch (error) {
                if (error.response.data.message === 'KEY_DUPLICATE') {
                    alert('Ya existe un transportista con la identificación ' + this.state.carrier.identication)
                }
                console.log(error)
            }
        }
    }

    //Validate data to send save
    validate = () => {

        let { carrier } = this.state

        if (carrier.identication === undefined || carrier.name === undefined) {
            alert('Los campos marcados con * no pueden ser nulos')
            return
        }

        if (carrier.type_identification === 'cédula' && carrier.identication.trim().length !== 10) {
            alert('La cédula debe tener 10 dígitos')
            return
        }

        if (carrier.type_identification === 'ruc' && carrier.identication.trim().length < 13) {
            alert('El RUC debe tener 13 dígitos')
            return
        }

        if (carrier.type_identification === 'pasaporte' && carrier.identication.trim().length < 3) {
            alert('El pasaporte debe tener mínimo 3 caracteres')
            return
        }

        if (carrier.name.trim().length < 3) {
            alert('El nombre debe tener mínimo 3 caracteres')
            return
        }

        if (carrier.license_plate.trim().length < 3) {
            alert('La placa debe tener mínimo 3 dígitos')
            return
        }

        return true
    }

    //Show & hidden modal
    toggle = async () => {
        let { carriers } = this.state

        if (carriers.length === 0) {
            try {
                await api.post('carrierlist', { paginate: 10 })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState(state => ({
                            modal: !state.modal,
                            carriers: data,
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
                await api.post(`carrierlist?page=${page.substring((page.indexOf('=')) + 1)}`, { search, paginate: 10 })
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

    onChangeItem = async (e) => {
        let {
            value
        } = e.target

        if (value.length > 1) {
            try {
                await api.post('carrierlist', { search: value, paginate: 4 })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            item: value,
                            suggestions: data,
                            carriers: [],
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
            await api.post('carrierlist', { search: value, paginate: 10 })
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        search: value,
                        carriers: data,
                        suggestions: [],
                        links,
                        meta,
                    })
                })
        } catch (error) { console.log(error) }
    }

    render = () => {

        let { carriers, carrier, suggestions, links, meta, item, search } = this.state

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
                                    <Button color="secondary" onClick={this.toggleNewCarrier}>
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
                                        <ListGroupItem onClick={() => this.props.selectCarrier(id)} style={{ padding: '.4em', 'font-size': '.9em', 'text-align': 'left' }} key={index}>
                                            {`${atts.identication} - ${atts.name}`}
                                        </ListGroupItem>
                                    ))
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
                {/* Modal register carrier */}
                <Modal
                    isOpen={this.state.modalnewcarr}
                    toggle={this.toggleNewCarrier}
                    className={this.props.className}
                    size={this.props.size}
                    centered={true}
                >
                    <ModalHeader toggle={this.toggleNewCarrier}>Registrar transportista</ModalHeader>
                    <ModalBody>
                        <Form className="text-right">
                            <Row form>
                                <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                            </Row>
                            <FormGroup className="mb-1" row>
                                <Label for="type_identification" sm={4}>Tipo de identicatión</Label>
                                <Col sm={8}>
                                    <CustomInput bsSize="sm" onChange={this.handleChange} value={carrier.type_identification}
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
                                    <Input bsSize="sm" onChange={this.handleChange} value={carrier.identication}
                                        type="text" id="identication" name="identication" maxlength="13" requiered />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="name" sm={4}>Nombre *</Label>
                                <Col sm={8}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={carrier.name}
                                        type="text" id="name" name="name" maxlength={300} requiered />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-1" row>
                                <Label for="license_plate" sm={4}>Placa *</Label>
                                <Col sm={6}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={carrier.license_plate}
                                        type="text" id="license_plate" name="license_plate" maxlength={20} requiered />
                                </Col>
                            </FormGroup>
                            <FormGroup className="mb-0" row>
                                <Label for="email" sm={4}>Correo electrónico</Label>
                                <Col sm={8}>
                                    <Input bsSize="sm" onChange={this.handleChange} value={carrier.email} type="email"
                                        id="email" name="email" />
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.submit} className="btn-transition" color="primary">
                            Guardar
                        </Button>
                    </ModalFooter>
                </Modal>
                {/* List carriers */}
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={this.toggle}>Seleccionar cliente</ModalHeader>
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
                        {carriers === null ? null :
                            (<Table className="mb-2" bordered>
                                <thead>
                                    <tr>
                                        <th style={{ width: '5em' }}>Identificación</th>
                                        <th>Nombre / Razón social</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carriers.map((carrier, index) => (
                                        <tr key={index}>
                                            <td scope="row">{carrier.atts.identication}</td>
                                            <td onClick={() => this.selectCarrier(carrier)}>
                                                <a href="javascript:void(0);" className="alert-link">{carrier.atts.name}</a>
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

export default SelectCarrier;