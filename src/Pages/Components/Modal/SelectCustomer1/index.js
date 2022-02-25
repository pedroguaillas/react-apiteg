import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table,
    Card, Form, Row, Col, ListGroup, ListGroupItem
} from 'reactstrap'

import clientAxios from '../../../../config/axios';
import tokenAuth from '../../../../config/token';
import Paginate from '../../Paginate/Index';

class SelectCustomer1 extends Component {

    state = {
        customers: [],
        suggestions: [],
        modal: false,
        links: null,
        meta: null,
        search: ''
    }

    componentDidUpdate(prevProps) {

        if (this.props.id !== prevProps.id && this.props.id > 0) {

            // Se actualiza el nombre del cliente una vez termine cargar la pagina
            // Este se utiliza solo cuando va ver un registro
            if (this.props.customers !== prevProps.customers && this.props.customers.length === 1) {
                this.setState((state, props) => ({
                    item: props.customers[0].atts.name,
                }))
            } else {
                let { customers, suggestions } = this.state

                if (customers.length > 0 || suggestions.length > 0) {
                    let items = suggestions.length !== 0 ? suggestions : customers
                    this.setState((state, props) => ({
                        item: (items.length !== 0) ? items.filter(customer => customer.id === props.id)[0].atts.name : '',
                        customers: [],
                        suggestions: [],
                    }))
                }
            }
        }
    }

    selectCustomer = (item) => {
        this.props.selectCustomer(item.id)
        this.toggle()
    }

    //Show & hidden modal
    toggle = async () => {
        let { customers } = this.state

        if (customers.length === 0) {
            tokenAuth(this.props.token);
            try {
                await clientAxios.post('customerlist', { paginate: 10 })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState(state => ({
                            modal: !state.modal,
                            customers: data,
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
            tokenAuth(this.props.token);
            let { search } = this.state
            try {
                await clientAxios.post(`customerlist?page=${page.substring((page.indexOf('=')) + 1)}`, { search, paginate: 10 })
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

    onChangeItem = async (e) => {
        tokenAuth(this.props.token)
        let {
            value
        } = e.target

        if (value.length > 1) {
            try {
                await clientAxios.post('customerlist', { search: value, paginate: 4 })
                    .then(res => {
                        let { data, links, meta } = res.data
                        this.setState({
                            item: value,
                            suggestions: data,
                            customers: [],
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
        tokenAuth(this.props.token)
        let {
            value
        } = e.target

        try {
            await clientAxios.post('customerlist', { search: value, paginate: 10 })
                .then(res => {
                    let { data, links, meta } = res.data
                    this.setState({
                        search: value,
                        customers: data,
                        suggestions: [],
                        links,
                        meta,
                    })
                })
        } catch (error) { console.log(error) }
    }

    render = () => {

        let { customers, suggestions, links, meta, item, search } = this.state

        return (
            <Fragment>
                {/* <div onBlur={(e) => this.setState({ suggestions: [] })}> */}
                <div>
                    <Row key={123}>
                        <Col>
                            <InputGroup size="sm">
                                <Input onChange={this.onChangeItem} value={item} placeholder="..." />
                                <InputGroupAddon addonType="append">
                                    <Button color="secondary" onClick={this.toggle}>
                                        <i className='nav-link-icon lnr-magnifier'></i>
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
                                        <ListGroupItem onClick={() => this.props.selectCustomer(id)} style={{ padding: '.4em', 'font-size': '.9em', 'text-align': 'left' }} key={index}>
                                            {`${atts.identication} - ${atts.name}`}
                                        </ListGroupItem>
                                    ))
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
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
                        {customers === null ? null :
                            (<Table className="mb-2" bordered>
                                <thead>
                                    <tr>
                                        <th style={{ width: '5em' }}>Identificación</th>
                                        <th>Nombre / Razón social</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, index) => (
                                        <tr key={index}>
                                            <td scope="row">{customer.atts.identication}</td>
                                            <td onClick={() => this.selectCustomer(customer)}>
                                                <a href="javascript:void(0);" className="alert-link">{customer.atts.name}</a>
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

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(SelectCustomer1);