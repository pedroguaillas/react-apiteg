import React from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Row, Col, Form, FormGroup, Label, Input, CustomInput
} from 'reactstrap'

class CreateModal extends React.Component {

    state = {
        modal: false,
        form: {
            id: 0,
            identification_type: 'ruc',
            type: '01',
            accounting: false,
        }
    }

    componentDidMount = () => {
        if (this.props.provider) {
            this.setState((state, props) => ({ form: props.provider }))
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

    handleChangeCheck = (e) => {
        let { name, checked } = e.target
        this.setState(state => ({
            form: {
                ...state.form,
                [name]: checked
            }
        }))
    }

    //Save provider
    onSubmit = () => {
        // let id = this.state.form.id
        // return fetch(API_BASE_URL + 'providers', {
        //     method: "POST",
        //     mode: "cors",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(this.state.form)
        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         if (response.provider != null) {
        //             if (id === 0) {
        //                 this.props.addProvider(response.provider)
        //             } else {
        //                 this.props.editProvider(response.provider)
        //             }
        //             this.toggle()
        //         }
        //     })
        //     .catch(error => console.log(error))
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render() {
        let { form } = this.state
        let { action } = this.props
        return (
            <span className="d-inline-block mb-2 mr-2">
                <Button outline={action === 'edit'} color="primary" onClick={this.toggle}>
                    {action === 'edit' ? <i className='nav-link-icon lnr-pencil'></i> : 'Agregar'}
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}>
                    <ModalHeader toggle={this.toggle}>Datos del proveedor</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>*RUC</Label>
                                        <Input onChange={this.handleChange} value={form.identification_value}
                                            type="text" id="identification_value" name="identification_value" maxlength="13" />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>*Razón social</Label>
                                        <Input onChange={this.handleChange} value={form.name} type="text"
                                            id="name" name="name" pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+{3,100}"
                                            title="El nombre solo debe tener letras" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label >*Dirección</Label>
                                        <Input onChange={this.handleChange} value={form.direction} type="text"
                                            id="direction" name="direction" />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>*Teléfono</Label>
                                        <Input onChange={this.handleChange} value={form.phone} type="text"
                                            id="phone" name="phone" maxlength={13} pattern="[0-9]{10,15}"
                                            title="Teléfono ejemplo 0939649714" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>*Correo electrónico</Label>
                                        <Input onChange={this.handleChange} value={form.mail} type="email"
                                            id="mail" name="mail" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <CustomInput onChange={this.handleChangeCheck} checked={form.accounting} type="checkbox"
                                        id="accounting" name="accounting" label="Obligado llevar contabilidad" />
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>Cancelar</Button>
                        <Button color="primary" onClick={this.onSubmit}>Guardar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </span>
        )
    }
}

export default CreateModal