import React from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Col, Form, FormGroup, Label, Input, Row, CustomInput
} from 'reactstrap';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class CreateModal extends React.Component {

    //Init state
    state = {
        modal: false,
        form: {
            id: 0,
            identification_value: '',
            name: '',
            email: ''
        }
    }

    componentDidMount = () => {
        if (this.props.dispatcher) {
            this.setState((state, props) => ({ form: props.dispatcher }))
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

    handleChangeTypeIdentification = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
                maxlength_value: (e.target.value === "cedula") ? 10 : ((e.target.value === "ruc") ? 13 : 9)
            }
        })
    }

    submit = () => {
        // let f = this.state.form
        // if (f.identification_type != null && f.identification_value != null && f.name != null && f.license_plate != null) {
        //     fetch(API_BASE_URL + 'dispatchers', {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(this.state.form)
        //     })
        //         .then(response => response.json())
        //         .then(response => {
        //             if (response.dispatcher != null) {
        //                 if (f.id === 0) {
        //                     this.props.addDispatcher(response.dispatcher)
        //                 } else {
        //                     this.props.editDispatcher(response.dispatcher)
        //                 }
        //                 this.toggle()
        //             }
        //         })
        //         .catch(error => console.log(error))
        // }
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render() {

        let { form } = this.state
        let { action } = this.props

        return (
            <div className="d-inline-block mb-2 mr-2">
                <Button outline={action === 'edit'} color="primary" onClick={this.toggle}>
                    {action === 'edit' ? <i className='nav-link-icon lnr-pencil'></i> : 'Agregar'}
                </Button>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={this.toggle}>Datos del transportista</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="identification_type">*Tipo de identificación</Label>
                                        <CustomInput onChange={this.handleChangeTypeIdentification} value={form.identification_type}
                                            type="select" id="identification_type" name="identification_type">
                                            <option value="">Seleccione</option>
                                            <option value="ruc">Ruc</option>
                                            <option value="cedula">Cédula</option>
                                            <option value="pasaporte">Pasaporte</option>
                                        </CustomInput>
                                    </FormGroup>
                                </Col>

                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="identification_value">*Número de identificación</Label>
                                        <Input onChange={this.handleChange} value={form.identification_value} type="text"
                                            id="identification_value" name="identification_value" maxlength={form.maxlength_value} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="name">*Apellidos y Nombres / Razón social</Label>
                                        <Input onChange={this.handleChange} value={form.name} type="text"
                                            id="name" name="name" pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+{3,100}"
                                            title="El nombre solo debe tener letras" />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="email">Correo</Label>
                                        <Input onChange={this.handleChange} value={form.email} type="email"
                                            id="email" name="email" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="license_plate">*Placa</Label>
                                        <Input onChange={this.handleChange} value={form.license_plate} type="text"
                                            id="license_plate" name="license_plate" pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+{3,100}"
                                            title="El nombre solo debe tener letras" maxLength="20" />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>Cancelar</Button>
                        <Button color="primary" onClick={this.submit}>Guardar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default CreateModal