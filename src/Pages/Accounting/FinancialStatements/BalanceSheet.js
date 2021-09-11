import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, CardTitle,
    FormGroup, Label, Form, CustomInput
} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

import { formatDate, count_chars, calMaxLenght, numberWithCommas } from '../functions';

class BalanceSheet extends Component {

    state = {
        balancessheet: [],
        company: {},
        maxlevel: [],
        level: 0
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('balanceSheet')
                .then(res => {
                    let maxlevel = new Array()
                    let level = calMaxLenght(res.data.balancesheet)
                    for (let i = 0; i < level; i++) {
                        maxlevel.push(i + 1);
                    }
                    this.setState({
                        balancessheet: res.data.balancesheet,
                        company: res.data.company,
                        maxlevel,
                        level
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    showPDF = async () => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get(`balanceSheetPdf/${this.state.level}`, { responseType: 'blob' })
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

        let { balancessheet, company, maxlevel, level } = this.state
        balancessheet = balancessheet.filter(elem => count_chars(elem.account) < level && elem.amount !== 0)
        // balancessheet = balancessheet.filter(elem => count_chars(elem.account) < level)

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-save-seat', action: this.showPDF, icon: 'pdf', msmTooltip: 'Mostrar PDF', color: 'primary' },
                    ]}
                    heading="Contabilidad"
                    subheading="Balance General"
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
                                    <CardTitle>Filtros</CardTitle>
                                    <Form className="text-right">
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="mb-1" row>
                                                    <Label for="level" sm={4}>Nivel</Label>
                                                    <Col sm={6}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={this.state.level}
                                                            type="select" name="level" id="level" >
                                                            {
                                                                maxlevel.map((elem) => (
                                                                    <option value={elem} key={'option' + elem}>{elem}</option>
                                                                ))
                                                            }
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
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
                                    <p className="text-center mb-0"><strong>Estado de situación financiera</strong></p>
                                    {/* <p className="text-center"><strong>Hasta el {formatDate()}</strong></p> */}
                                    <p className="text-center"><strong>Desde el 1 de enero hasta el 31 de diciembre del 2019</strong></p>
                                    <Row>
                                        <Col sm={2}></Col>
                                        <Col sm={8}>
                                            {
                                                (balancessheet.length > 0) ?
                                                    (balancessheet.map((accountentryitem, index) => (
                                                        count_chars(accountentryitem.account) < 3 ?
                                                            (
                                                                <div key={index}>
                                                                    <strong>{`${accountentryitem.account} ${accountentryitem.name}`}</strong>
                                                                    <strong style={{ float: 'right' }}>{`$${numberWithCommas(accountentryitem.amount.toFixed(2))}`}</strong>
                                                                </div>
                                                            ) :
                                                            (
                                                                <div key={index}>
                                                                    <i style={{ 'font-style': 'normal' }}>{`${accountentryitem.account} ${accountentryitem.name}`}</i>
                                                                    <span style={{ float: 'right' }}>{`$${numberWithCommas(accountentryitem.amount.toFixed(2))}`}</span>
                                                                </div>
                                                            )
                                                    )
                                                    )) : null
                                            }
                                        </Col>
                                    </Row>
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

export default connect(mapStateToProps)(BalanceSheet);