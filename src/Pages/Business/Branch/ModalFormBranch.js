import React, { Component } from 'react';
import {
    Col, FormGroup, Label, CustomInput, Input,
    Modal, ModalBody, ModalHeader, ModalFooter, Button
} from 'reactstrap';

class ModalFormBranch extends Component {
    //...............Layout
    render = () => {

        let { isOpen, toggle, form, branches, handleChange, handleChangeCheck, submit } = this.props

        return (
            <Modal
                isOpen={isOpen}
                toggle={toggle}
            >
                <ModalHeader toggle={toggle}>{form.id ? 'Editar' : 'Agregar'} establecimiento</ModalHeader>
                <ModalBody>
                    <FormGroup className="mb-1" row>
                        <Label for="store" sm={4}>Establecimiento *</Label>
                        <Col sm={2}>
                            <Input bsSize="sm" onChange={handleChange} value={form.store} type="text"
                                name="store" id="store" maxLength="3" />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label for="name" sm={4}>Nombre Comercial</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.name} type="text"
                                name="name" id="name" maxLength="300" />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label for="address" sm={4}>Dirección *</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.address} type="text"
                                name="address" id="address" maxLength="300" />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label for="iva" sm={4}>Tipo</Label>
                        <Col sm={3}>
                            <CustomInput bsSize="sm" onChange={handleChange} value={form.type}
                                type="select" name="type" id="type" >
                                <option value="">Seleccione</option>
                                <option value="matriz">Matriz</option>
                                <option value="sucursal">Sucursal</option>
                            </CustomInput>
                        </Col>
                    </FormGroup>

                    <Label for="cf" hidden={branches !== null && branches.length > 0}>
                        <input onChange={handleChangeCheck} type='checkbox' name='cf' checked={form.cf} />
                        &nbsp;Facturar a consumidor final
                    </Label>

                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggle}>
                        Cancelar
                    </Button>
                    <Button onClick={submit} color="primary">Guardar</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalFormBranch;