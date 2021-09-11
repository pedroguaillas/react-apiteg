import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import { formatDate, numberWithCommas } from '../functions';

class BalancePurchase extends Component {

    state = {
        accountentryitems: null,
        company: {}
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('balancepurchase')
                .then(res => this.setState({
                    accountentryitems: res.data.accounts,
                    company: res.data.company
                }))
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        let sum_debit = 0
        let sum_have = 0
        let sum_credit_balance = 0
        let sum_debit_balance = 0

        let { accountentryitems, company } = this.state

        return (
            <Fragment>
                <PageTitle
                    heading="Contabilidad"
                    subheading="Balance de Comprobación de Sumas y Saldos"
                    icon="pe-7s-notebook icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    {(accountentryitems === null) ? (<p>Cargando ...</p>) :
                        (accountentryitems.length === 0) ? (<p>No se ha registrado asientos contables para el bance de compras.</p>) :
                            (<Row>
                                <Col lg="12">
                                    <Card className="main-card mb-3">
                                        <CardBody>
                                            <p className="text-center mb-0"><strong>{company.company}</strong></p>
                                            <p className="text-center mb-0"><strong>Balance de Comprobación de Sumas y Saldos</strong></p>
                                            <p className="text-center"><strong>Desde el 1 de enero hasta el 31 de diciembre del 2019</strong></p>
                                            <Table size="sm" bordered>
                                                <tbody>
                                                    <tr style={{ 'text-align': 'center' }}>
                                                        <th className="verticalAlign" rowspan="2">CUENTA</th>
                                                        <th className="verticalAlign" rowspan="2">NOMBRE DE LA CUENTA</th>
                                                        <th className="verticalAlign" colspan="2">SUMAS</th>
                                                        <th className="verticalAlign" colspan="2">SALDOS</th>
                                                    </tr>
                                                    <tr style={{ 'text-align': 'center' }}>
                                                        <th>DEBE</th>
                                                        <th>HABER</th>
                                                        <th>DEUDOR</th>
                                                        <th>ACREEDOR</th>
                                                    </tr>
                                                    {
                                                        accountentryitems.map((accountentryitem, index) => {

                                                            sum_debit += accountentryitem.debit
                                                            sum_have += accountentryitem.have

                                                            sum_credit_balance += accountentryitem.debit > accountentryitem.have ? accountentryitem.debit - accountentryitem.have : 0
                                                            sum_debit_balance += accountentryitem.have > accountentryitem.debit ? accountentryitem.have - accountentryitem.debit : 0

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{accountentryitem.account}</td>
                                                                    <td>{accountentryitem.name}</td>
                                                                    <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(accountentryitem.debit.toFixed(2))}`}</td>
                                                                    <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(accountentryitem.have.toFixed(2))}`}</td>
                                                                    <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas((accountentryitem.debit > accountentryitem.have ? accountentryitem.debit - accountentryitem.have : 0).toFixed(2))}`}</td>
                                                                    <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas((accountentryitem.have > accountentryitem.debit ? accountentryitem.have - accountentryitem.debit : 0).toFixed(2))}`}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    <tr>
                                                        <th style={{ 'text-align': 'center' }} colSpan={2}>TOTALES</th>
                                                        <th style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_debit.toFixed(2))}`}</th>
                                                        <th style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_have.toFixed(2))}`}</th>
                                                        <th style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_credit_balance.toFixed(2))}`}</th>
                                                        <th style={{ 'text-align': 'right' }}>{`$${numberWithCommas(sum_debit_balance.toFixed(2))}`}</th>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>)
                    }
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(BalancePurchase);