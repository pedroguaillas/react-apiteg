import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Table, Button,
    CardTitle, Form, FormGroup, Label, CustomInput,
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import { formatDate, numberWithCommas } from '../functions';

class DiaryBook extends Component {

    state = {
        dateStart: new Date().toISOString().substring(0, 10),
        dateEnd: new Date().toISOString().substring(0, 10),
        accountentries: null,
        company: {}
    }

    async componentDidMount() {

        let dateStart = new Date()
        dateStart.setDate(1)
        dateStart = dateStart.toISOString().substring(0, 10)

        tokenAuth(this.props.token)
        try {
            await clienteAxios.get('accountentries')
                .then(res => this.setState({
                    accountentries: res.data.accountentries,
                    company: res.data.company,
                    dateStart
                }))
        } catch (error) {
            console.log(error)
        }
    }

    addSeat = () => this.props.history.push('/contabilidad/registrarasiento');

    //Add new seat before save in database
    addNewAccountEntry = (accountentry) => {
        let { accountentries } = this.state
        accountentries.push(accountentry)
        this.setState({ accountentries })
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    render() {

        let { accountentries, company, dateStart, dateEnd } = this.state
        // resultstates = resultstates.filter(elem => count_chars(elem.account) < level)

        let filters = [
            { 'value': 'current_year', 'caption': 'Año en curso' },
            { 'value': 'last_year', 'caption': 'Año pasado' }
        ]

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-seat', action: this.addSeat, icon: 'plus', msmTooltip: 'Agregar asiento contable', color: 'primary' },
                    ]}
                    heading="Contabilidad"
                    subheading="Libro Diario"
                    icon="pe-7s-notebook icon-gradient bg-mean-fruit"
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
                                <CardBody>
                                    <CardTitle>Busqueda</CardTitle>
                                    <Form className="text-right">
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="level" sm={4}>Desde:*</Label>
                                                    <Col sm={4}>
                                                        <CustomInput value={dateStart} type="date" />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="level" sm={4}>Hasta:*</Label>
                                                    <Col sm={4}>
                                                        <CustomInput value={dateEnd} type="date" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="text-left" md={2}>
                                                <Button>
                                                    Consultar
                                                </Button>
                                            </Col>
                                            <Col md={10}>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <p className="text-center mb-0"><strong>{company.company}</strong></p>
                                    <p className="text-center mb-0"><strong>Libro Diario</strong></p>
                                    {/* <p className="text-center"><strong>Desde el 1 de enero hasta el {formatDate(new Date())}</strong></p> */}
                                    <p className="text-center"><strong>Desde el 1 de enero hasta el 31 de diciembre del 2019</strong></p>
                                    {
                                        (accountentries === null) ? (<p>Cargando...</p>) :
                                            (accountentries.length < 1) ? (<p>No se ha registrado asientos haga click en el botón "Agregar asiento".</p>) :
                                                (accountentries.map((accountentry, index) => {

                                                    let sum_debit = 0
                                                    let sum_have = 0

                                                    return (
                                                        <Fragment key={index}>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <span><strong>Asiento:</strong> {index + 1}</span>
                                                                    <br />
                                                                    <span><strong>Fecha:</strong> {accountentry.date}</span>
                                                                    <br />
                                                                    <span><strong>Glosa:</strong> {accountentry.description}</span>
                                                                </Col>
                                                            </Row>
                                                            <Table size="sm" bordered>
                                                                <tbody>
                                                                    <tr style={{ 'text-align': 'center' }}>
                                                                        <th colSpan="2">DETALLE</th>
                                                                        <th style={{ 'width': '5em' }} rowSpan="2">DEBE</th>
                                                                        <th style={{ 'width': '5em' }} rowSpan="2">HABER</th>
                                                                    </tr>
                                                                    <tr style={{ 'text-align': 'center' }}>
                                                                        <th style={{ 'width': '5em' }}>Asiento</th>
                                                                        <th style={{ 'width': '5em' }}>Cuenta</th>
                                                                    </tr>
                                                                    {
                                                                        accountentry.accountentryitems.map((accountentryitem, index) => {

                                                                            sum_debit += accountentryitem.debit
                                                                            sum_have += accountentryitem.have

                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{accountentryitem.account}</td>
                                                                                    <td>{accountentryitem.name}</td>
                                                                                    <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(accountentryitem.debit.toFixed(2))}`}</td>
                                                                                    <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(accountentryitem.have.toFixed(2))}`}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    <tr>
                                                                        <th style={{ 'text-align': 'center' }} colSpan={2}>TOTAL</th>
                                                                        <th style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_debit.toFixed(2))}`}</th>
                                                                        <th style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_have.toFixed(2))}`}</th>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Fragment>
                                                    )
                                                }))
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(DiaryBook);