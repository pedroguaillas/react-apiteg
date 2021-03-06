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
    handleChange = e => {
        this.setState({
            ...this.state.form,
            form: {
                [e.target.name]: e.target.value
            }
        })
    }

    handleChangeCheck = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.checked
            }
        })
    }

    loadFile = e => {
        let files = e.target.files || e.dataTransfer.files;

        if (!files.length)
            return;

        let file = files[0]
        let { name, name: { length } } = file

        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: file,
                extention_cert: name.substring(length - 4, length),
            }
        })
        // createImage(files[0], e.target.name);
    }

    onSubmit = async e => {
        e.preventDefault()

        // Validate empty field
        let { id, ruc, company, economic_activity, accounting, micro_business, retention_agent,
            logo, cert, extention_cert, pass_cert } = this.state.form
        // if (ruc.trim() === '' ||
        //     company.trim() === '') {
        //     alert('Los campos con * son obligatorios')
        //     return;
        // }

        let data = new FormData()
        data.append('id', id)
        data.append('ruc', ruc)
        data.append('company', company)
        if (logo) { data.append('logo', logo) }
        data.append('economic_activity', economic_activity)
        data.append('accounting', accounting)
        data.append('micro_business', micro_business)
        if (retention_agent) { data.append('retention_agent', retention_agent) }
        if (cert) { data.append('cert', cert) }
        if (extention_cert) { data.append('extention_cert', extention_cert) }
        if (pass_cert) { data.append('pass_cert', pass_cert) }

        // Send
        tokenAuth(this.props.token)

        try {
            await clienteAxios.post('company_update', data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                .then(res => alert('Editado correctamente'))
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        let { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    heading="Informaci??n de la empresa"
                    subheading="Info"
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
                                    <Form onSubmit={this.onSubmit}>
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
                                                        type="text" id="identification" name="identification" maxLength="13" />{' '}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Razon social *</Label>
                                                    <Input onChange={this.handleChange} value={form.company}
                                                        type="text" id="company" name="company" maxLength="300" />{' '}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Actividad econ??mica</Label>
                                                    <Input onChange={this.handleChange} value={form.economic_activity}
                                                        type="text" id="economic_activity" name="economic_activity" />{' '}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Agente de Retenci??n. N?? Resoluci??n</Label>
                                                    <Input onChange={this.handleChange} value={form.retention_agent}
                                                        type="text" id="retention_agent" name="retention_agent" maxLength="13" />{' '}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup row>
                                                    <Col sm={{ size: 10 }}>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="checkbox" checked={form.accounting} id="accounting"
                                                                    onChange={this.handleChangeCheck} name="accounting" />{' '}
                                                                Obligado llevar contabilidad
                                                            </Label>
                                                        </FormGroup>
                                                    </Col>
                                                </FormGroup>
                                                {/* <FormGroup>
                                                    <Label for="accounting">
                                                        <CustomInput onChange={this.handleChangeCheck} checked={form.accounting} type="checkbox"
                                                            id="accounting" name="accounting" label="Obligado llevar contabilidad" />
                                                    </Label>
                                                </FormGroup> */}
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup row>
                                                    <Col sm={{ size: 10 }}>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="checkbox" id="micro_business" checked={form.micro_business}
                                                                    onChange={this.handleChangeCheck} name="micro_business" />{' '}
                                                                Microempresa
                                                            </Label>
                                                        </FormGroup>
                                                    </Col>
                                                </FormGroup>
                                                {/* <FormGroup>
                                                    <Label for="micro_business">
                                                        <CustomInput onChange={this.handleChangeCheck} checked={form.micro_business} type="checkbox"
                                                            id="micro_business" name="micro_business" label="Microempresa" />
                                                    </Label>
                                                </FormGroup> */}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Logo</Label>
                                                    <Input type="file" name="logo" id="input-file-logo"
                                                        onChange={this.loadFile} accept="image/*" />{' '}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Certificado de firma electr??nica</Label>
                                                    <Input type="file" name="cert" id="input-file-cert"
                                                        onChange={this.loadFile} accept=".p12, .pfx" />{' '}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label>Contrase??a certificado</Label>
                                                    <Input type="password" onChange={this.handleChange} value={form.pass_cert} name="pass_cert" id="pass_cert" />{' '}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary" className="mt-2">
                                            Guardar
                                        </Button>
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

export default connect(mapStateToProps)(Profile);