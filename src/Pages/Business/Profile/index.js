import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Form, FormGroup,
    Input, Button, Label, CustomInput
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class Profile extends Component {

    state = {
        form: {
            accounting: false
        }
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('companies')
                .then(res => this.setState({ form: res.data.company }))
        } catch (error) {
            console.log(error)
        }
    }

    //Info seller handle
    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    handleChangeCheck = e => this.setState({ [e.target.name]: e.target.checked })

    render() {

        let { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    heading={form.company}
                    subheading={form.company}
                    icon="pe-7s-id icon-gradient bg-mean-fruit"
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
                                    <Form>
                                        <Row form>
                                            <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                                        </Row>
                                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                            <strong className='mt-2'>Datos generales</strong>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>RUC *</Label>
                                                    <Input onChange={this.handleChange} value={form.ruc}
                                                        type="text" id="identification" name="identification" maxLength="13" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Razon social *</Label>
                                                    <Input onChange={this.handleChange} value={form.company}
                                                        type="text" id="company" name="company" maxLength="300" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Tipo de contribuyente</Label>
                                                    <Input onChange={this.handleChange} value={form.ruc !== undefined ? (form.ruc.substr(2, 1) === '6' || form.ruc.substr(2, 1) === '9' ? 'Jurídica' : 'Persona Natural') : ''}
                                                        type="text" id="type" name="type" maxLength="300" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Teléfono</Label>
                                                    <Input onChange={this.handleChange} value={form.phone}
                                                        type="text" id="phone" name="phone" maxLength="13" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Actividad económica</Label>
                                                    <Input onChange={this.handleChange} value={form.economic_activity}
                                                        type="text" id="economic_activity" name="economic_activity" />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Agente de Retención. Nº Resolución</Label>
                                                    <Input onChange={this.handleChange} value={form.retention_agent}
                                                        type="text" id="retention_agent" name="retention_agent" maxLength="13" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={form.accounting} type="checkbox"
                                                            id="accounting" name="accounting" label="Obligado llevar contabilidad" />
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>
                                                        <CustomInput onChange={this.handleChangeCheck} checked={form.micro_business} type="checkbox"
                                                            id="micro_business" name="micro_business" label="Microempresa" />
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button color="primary" className="mt-2">Guardar</Button>
                                    </Form>
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

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);