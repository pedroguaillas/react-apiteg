import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {
    Form, FormGroup, Label, Input,
    Row, Col, Card, CardBody, Table, Button
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ListAccountSeat from './ListAccountSeat';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';


class AccountSeat extends Component {

    state = {
        date: new Date().toISOString().substring(0, 10),
        //Init accountingseats with two accountingseat
        accountingseats: [
            { chart_account_id: '', seat: '', debit: '', have: '' },
            { chart_account_id: '', seat: '', debit: '', have: '' }
        ],
        accounts: null
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

    //Register in debit & have
    handleChangeSeat = (e, index) => {
        // if (e.target.validity.valid) {
        const { accountingseats } = this.state
        accountingseats[index][e.target.name] = e.target.value
        this.setState({ accountingseats })
        // }
    }

    //Select account from list account
    selectAccount = (account, index) => {
        let { accountingseats } = this.state
        accountingseats[index].chart_account_id = account.id
        this.setState({ accountingseats })
    }

    //Register date & description
    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    //Send seat to register in database
    submit = async () => {
        if (this.validateEqual()) {
            tokenAuth(this.props.token);
            try {
                await clienteAxios.post('accountentries', this.state)
                    .then(res => this.props.history.push('/contabilidad/librodiario'))
            } catch (error) {
                console.log(error)
            }
        } else {
            alert('La suma del DEBE tiene que ser igual al HABER')
        }
    }

    //Compare sum_debit = sum_have
    validateEqual = () => {
        let sum_debit = 0
        let sum_have = 0
        this.state.accountingseats.forEach(seat => {
            sum_debit += parseFloat(seat.debit !== '' ? seat.debit : 0)
            sum_have += parseFloat(seat.have !== '' ? seat.have : 0)
        })
        return Number(sum_debit.toFixed(2)) === Number(sum_have.toFixed(2)) & sum_debit > 0
    }

    //Add new datail for seat
    addNewLine = () => {
        let { accountingseats } = this.state
        accountingseats.push({ chart_account_id: '', seat: '', debit: '', have: '' })
        this.setState({ accountingseats })
    }

    //Delete detail of seat
    deleteSeat = (index) => {
        this.setState(state => ({
            accountingseats: state.accountingseats.filter((seat, i) => i !== index)
        }))
    }

    render() {

        return (

            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-save-seat', action: this.submit, icon: 'save', msmTooltip: 'Guardar asiento contable', color: 'primary' },
                    ]}
                    heading="Contabilidad"
                    subheading="Registro del asiento contable"
                    icon="pe-7s-car icon-gradient bg-mean-fruit"
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
                                    <Form className="text-right mb-4">
                                        <FormGroup row className="mb-1">
                                            <Label for="date" sm={4} className="mr-sm-2">* Fecha:</Label>
                                            <Col sm={3}>
                                                <Input onChange={this.handleChange} type="date" name="date" id="date" value={this.state.date} required />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row className="mb-1">
                                            <Label for="description" sm={4} className="mr-sm-2">Glosa:</Label>
                                            <Col sm={3}>
                                                <Input onChange={this.handleChange} value={this.state.description} type="textarea"
                                                    name="description" id="description" required />
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                    <Table bordered>
                                        <thead>
                                            <th>CUENTA</th>
                                            <th>DEBE</th>
                                            <th>HABER</th>
                                            <th></th>
                                        </thead>
                                        <tbody>
                                            {this.state.accountingseats.map((accountingseat, index) => (
                                                <ListAccountSeat
                                                    accountingseat={accountingseat}
                                                    index={index}
                                                    id={accountingseat.chart_account_id}
                                                    handleChangeSeat={this.handleChangeSeat}
                                                    accounts={this.state.accounts}
                                                    selectAccount={this.selectAccount}
                                                    deleteSeat={this.deleteSeat}
                                                />
                                            ))}
                                        </tbody>
                                    </Table>
                                    <Button color="primary" onClick={this.addNewLine}>Agregar detalle</Button>
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

export default connect(mapStateToProps)(AccountSeat);