import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, CardTitle,
    FormGroup, Label, Form, CustomInput, Button
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

import { formatDate, count_chars, calMaxLenght, numberWithCommas } from '../functions';

class ResultState extends Component {

    state = {
        resultstates: [],
        company: {},
        maxlevel: [],
        level: 3
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('resultState')
                .then(res => {
                    let maxlevel = new Array()
                    let level = calMaxLenght(res.data.resultstates)
                    for (let i = 0; i < level; i++) {
                        maxlevel.push(i + 1);
                    }
                    this.setState({
                        resultstates: res.data.resultstates,
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
            await clienteAxios.get(`resultStatePdf/${this.state.level}`, { responseType: 'blob' })
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

        let { resultstates, company, maxlevel, level } = this.state
        resultstates = resultstates.filter(elem => count_chars(elem.account) < level && elem.amount !== 0)
        // resultstates = resultstates.filter(elem => count_chars(elem.account) < level)

        let filters = [
            { 'value': 'current_year', 'caption': 'Año en curso' },
            { 'value': 'last_year', 'caption': 'Año pasado' }
        ]

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-save-seat', action: this.showPDF, icon: 'pdf', msmTooltip: 'Mostrar PDF', color: 'primary' },
                    ]}
                    heading="Contabilidad"
                    subheading="Estado de pérdidas y ganancias"
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
                                                    <Label for="level" sm={4}>Filtros</Label>
                                                    <Col sm={6}>
                                                        <CustomInput bsSize="sm" onChange={this.handleChange} value={this.state.filter}
                                                            type="select" name="filters" id="level">
                                                            {
                                                                filters.map((elem) => (
                                                                    <option value={elem.value} key={'option' + elem}>{elem.caption}</option>
                                                                ))
                                                            }
                                                        </CustomInput>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
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
                                    <p className="text-center mb-0"><strong>Estado de Resultado Integral</strong></p>
                                    <p className="text-center"><strong>Desde el 1 de enero hasta el 31 de diciembre del 2019</strong></p>
                                    {/* <p className="text-center"><strong>Desde el 1 de enero hasta el {formatDate(new Date())}</strong></p> */}
                                    <Row>
                                        <Col sm={2}></Col>
                                        <Col sm={8}>
                                            {
                                                (resultstates.length > 0) ? (resultstates.map((resultstate, index) => (
                                                    count_chars(resultstate.account) < 3 ?
                                                        (
                                                            <div key={index}>
                                                                <strong>{`${resultstate.account} ${resultstate.name}`}</strong>
                                                                <strong style={{ float: 'right' }}>{`$${numberWithCommas(resultstate.amount.toFixed(2))}`}</strong>
                                                            </div>
                                                        ) :
                                                        (
                                                            <div key={index}>
                                                                <i style={{ 'font-style': 'normal' }}>{`${resultstate.account} ${resultstate.name}`}</i>
                                                                <span style={{ float: 'right' }}>{`$${numberWithCommas(resultstate.amount.toFixed(2))}`}</span>
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

export default connect(mapStateToProps)(ResultState);