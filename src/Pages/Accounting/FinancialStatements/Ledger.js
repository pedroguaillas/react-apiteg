import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import { formatDate, numberWithCommas } from '../functions';

class Ledger extends Component {

    state = {
        ledgers: null,
        company: {}
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('chartaccountsledger')
                .then(res => this.setState({
                    ledgers: res.data.chartAccounts,
                    company: res.data.company
                }))
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        let { ledgers, company } = this.state

        return (
            <Fragment>
                <PageTitle
                    heading="Contabilidad"
                    subheading="Libro Mayor"
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
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <p className="text-center mb-0"><strong>{company.company}</strong></p>
                                    <p className="text-center mb-0"><strong>Libro Mayor</strong></p>
                                    {/* <p className="text-center"><strong>Desde el 1 de enero hasta el {formatDate(new Date())}</strong></p> */}
                                    <p className="text-center"><strong>Desde el 1 de enero hasta el 31 de diciembre del 2019</strong></p>
                                    {
                                        (ledgers === null) ? (<p>Cargando...</p>) :
                                            (ledgers.length === 0) ? (<p>No se ha registrado asientos contables.</p>) :
                                                (ledgers.map(ledger => {

                                                    let sum_debit = 0
                                                    let sum_have = 0
                                                    let saldo = 0

                                                    return (
                                                        <Fragment>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <span><strong>Cuenta:</strong> {ledger.account}</span>

                                                                    <br />
                                                                    <span><strong>Nombre cuenta:</strong> {ledger.name}</span>
                                                                </Col>
                                                            </Row>
                                                            <Table size="sm" bordered>
                                                                <tbody>
                                                                    <tr style={{ 'text-align': 'center' }}>
                                                                        <th style={{ 'width': '5em' }}>ASIENTO</th>
                                                                        <th style={{ 'width': '10em' }}>FECHA</th>
                                                                        <th>GLOSA</th>
                                                                        <th style={{ 'width': '8em' }}>DEBE</th>
                                                                        <th style={{ 'width': '8em' }}>HABER</th>
                                                                        <th style={{ 'width': '8em' }}>SALDO</th>
                                                                    </tr>
                                                                    {
                                                                        ledger.accountentryitems.map(accountentryitem => {

                                                                            sum_debit += accountentryitem.debit
                                                                            sum_have += accountentryitem.have

                                                                            if (ledger.account.startsWith('1') || ledger.account.startsWith('5')) {
                                                                                saldo = accountentryitem.debit - accountentryitem.have + saldo
                                                                            }

                                                                            if (ledger.account.startsWith('2') || ledger.account.startsWith('3') || ledger.account.startsWith('4')) {
                                                                                saldo = accountentryitem.have - accountentryitem.debit + saldo
                                                                            }

                                                                            return (<tr>
                                                                                <td>{accountentryitem.id - 20}</td>
                                                                                <td>{accountentryitem.date}</td>
                                                                                <td>{accountentryitem.description}</td>
                                                                                <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(accountentryitem.debit.toFixed(2))}`}</td>
                                                                                <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(accountentryitem.have.toFixed(2))}`}</td>
                                                                                <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(saldo.toFixed(2))}`}</td>
                                                                            </tr>)
                                                                        })
                                                                    }
                                                                    <tr style={{ 'font-weight': 'bold' }}>
                                                                        <td style={{ 'text-align': 'center' }} colSpan={3}>TOTALES</td>
                                                                        <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_debit.toFixed(2))}`}</td>
                                                                        <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_have.toFixed(2))}`}</td>
                                                                        <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(saldo.toFixed(2))}`}</td>
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

export default connect(mapStateToProps)(Ledger);