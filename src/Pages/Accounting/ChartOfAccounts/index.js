import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col, Card, CardBody, Table, CardTitle } from 'reactstrap';

import AddChartAccount from './AddChartAccont';
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

import { count_chars, numberWithCommas } from '../functions';

class ChartOfAccounts extends Component {

    state = {
        accounts: [],
        level: 7,
        modal: false,
        account: {},
        form: {}
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('chartaccounts')
                .then(res => this.setState({ accounts: res.data }))
        } catch (error) {
            console.log(error)
        }
    }

    submit = async () => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.post('chartaccounts', this.state.form)
                .then(res => this.setState(state => ({
                    accounts: res.data,
                    modal: !state.modal
                })))
        } catch (error) {
            console.log(error)
        }
    }

    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    selectAccount = (obj) => {
        let { account } = obj
        let sub = this.newSubAccount(account)
        this.setState({
            account: obj,
            form: {
                ...this.state.form,
                account: sub
            }
        })
        this.toggle()
    }

    newSubAccount = (account) => {
        let newaccount = null;
        let auxarray = this.state.accounts.filter(elem => elem.account.startsWith(account))
        // If return most itselft is account iterminate
        if (auxarray.length > 1) {
            let repeat = count_chars(account)
            auxarray = auxarray.filter(elem => count_chars(elem.account) === repeat + 1)
            // Then create subaccount last
            let lastElement = auxarray[auxarray.length - 1]
            let numbers = lastElement.account.split('.')
            // Need detected the most last
            numbers[numbers.length - 1] = parseInt(numbers[numbers.length - 1]) + 1
            newaccount = numbers.join('.')
        } else {
            // If return only itselft, is last subaccount
            // Then create subaccount .1
            newaccount = account + '.1'
        }
        return newaccount;
    }

    toggle = () => this.setState(state => ({ modal: !state.modal }))

    countCharacter = (elems) => {
        let result = 0;
        for (let i = 0; i < elems.length; i++) {
            if (elems.CharAt(i) === '.') {
                result++
            }
        }
        return result
    }

    showPDF = async () => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('chartaccountspdf', { responseType: 'blob' })
                .then(res => {
                    //Create a Blob from the PDF Stream
                    const file = new Blob([res.data], { type: 'application/pdf' });
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(file);
                    //Open the URL on new Window
                    window.open(fileURL);
                })
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        let { accounts, level } = this.state
        // accounts = accounts.filter(elem => count_chars(elem.account) < level)

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-save-seat', action: this.showPDF, icon: 'pdf', msmTooltip: 'Mostrar PDF', color: 'primary' },
                    ]}
                    heading="Contabilidad"
                    subheading="Plan de cuentas"
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

                        <AddChartAccount
                            handleChange={this.handleChange}
                            modal={this.state.modal}
                            toggle={this.toggle}
                            account={this.state.account}
                            form={this.state.form}
                            submit={this.submit}
                        />

                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle className="text-center mb-0">PLAN DE CUENTAS</CardTitle>
                                    <Table size="sm" striped>
                                        <thead>
                                            <tr>
                                                <th style={{ 'text-align': 'center' }}>Cuenta</th>
                                                <th style={{ 'width': '150px', 'text-align': 'right' }}>Saldo</th>
                                            </tr>
                                        </thead>
                                        <tbody>{
                                            (accounts.length > 0) ?
                                                (accounts.map((accountentryitem, index) => (
                                                    <tr key={index}>
                                                        {count_chars(accountentryitem.account) < 4 ?
                                                            (
                                                                <td onClick={() => this.selectAccount(accountentryitem)} style={{ 'text-indent': 2 * count_chars(accountentryitem.account) + '0px' }}>
                                                                    <strong style={{ 'cursor': 'pointer' }}>{`${accountentryitem.account} ${accountentryitem.name}`}</strong>
                                                                </td>
                                                            ) : (
                                                                <td onClick={() => this.selectAccount(accountentryitem)} style={{ 'text-indent': 2 * count_chars(accountentryitem.account) + '0px' }}>{`${accountentryitem.account} ${accountentryitem.name}`}</td>
                                                            )
                                                        }
                                                        <td style={{ 'text-align': 'right' }}>{`$${numberWithCommas(accountentryitem.amount.toFixed(2))}`}</td>
                                                    </tr>
                                                ))) : null
                                        }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(ChartOfAccounts);