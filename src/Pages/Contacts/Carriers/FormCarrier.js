import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody,
    Form, FormGroup, Label, Input, CustomInput
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class FormCarrier extends Component {

    state = {
        form: {
            'type_identification': 'cédula'
        }
    }

    async componentDidMount() {
        const { match: { params } } = this.props
        if (params.id) {
            tokenAuth(this.props.token);
            try {
                await clienteAxios.get(`carriers/${params.id}/edit`)
                    .then(res => {
                        this.setState({ form: res.data.carrier })
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    submit = async () => {
        tokenAuth(this.props.token);
        try {
            let { form } = this.state
            if (form.id) {
                await clienteAxios.put(`carriers/${form.id}`, form)
                    .then(res => this.props.history.push('/contactos/transportistas'))
            } else {
                await clienteAxios.post('carriers', this.state.form)
                    .then(res => this.props.history.push('/contactos/transportistas'))
            }
        } catch (error) {
            console.log(error)
        }
    }

    //Change data in to input form
    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    render() {

        let { form } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-save-carrier', action: this.submit, icon: 'save', msmTooltip: 'Guardar cliente', color: 'primary' },
                    ]}
                    heading="Transportistas"
                    subheading="Registro de un nuevo transportista."
                    icon="pe-7s-add-user icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <Row>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <Form className="text-right">
                                        <Row form>
                                            <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                                        </Row>
                                        <FormGroup className="mb-1" row>
                                            <Label for="type_identification" sm={4}>Tipo de identicatión *</Label>
                                            <Col sm={6}>
                                                <CustomInput bsSize="sm" onChange={this.handleChange} value={form.type_identification}
                                                    type="select" id="type_identification" name="type_identification" requiered>
                                                    <option value="cédula">Cédula</option>
                                                    <option value="ruc">RUC</option>
                                                    <option value="pasaporte">Pasaporte</option>
                                                </CustomInput>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="identication" sm={4}>Identificación *</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.identication}
                                                    type="text" id="identication" name="identication" maxlength="13" requiered />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="name" sm={4}>Nombre *</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.name}
                                                    type="text" id="name" name="name" maxlength={300} requiered />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-1" row>
                                            <Label for="license_plate" sm={4}>Placa *</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.license_plate}
                                                    type="text" id="license_plate" name="license_plate" maxlength={20} requiered />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-0" row>
                                            <Label for="email" sm={4}>Correo electrónico</Label>
                                            <Col sm={6}>
                                                <Input bsSize="sm" onChange={this.handleChange} value={form.email} type="email"
                                                    id="email" name="email" />
                                            </Col>
                                        </FormGroup>
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

export default connect(mapStateToProps)(FormCarrier);