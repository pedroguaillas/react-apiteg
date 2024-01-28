import React, { Component } from "react";
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";

class FormPoint extends Component {
    render() {
        let { isOpen, form, toggle, handleChange, handleChangeNumber, save } = this.props
        return (
            <Modal
                isOpen={isOpen}
                toggle={toggle}
            >
                <ModalHeader toggle={toggle}>{form.id ? 'Editar' : 'Agregar'} punto de emisión</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label form='point' sm={4}>Punto de emisión</Label>
                        <Col sm={3}>
                            <Input onChange={handleChangeNumber} value={form.point} name="point" maxlength={3} className="text-right" bsSize="sm" />
                        </Col>
                    </FormGroup>

                    <Row form>
                        <strong className="my-2">
                            Secuencia de comprobantes
                        </strong>
                    </Row>

                    <FormGroup row>
                        <Label form='invoice' sm={4}>Factura</Label>
                        <Col sm={3}>
                            <Input onChange={handleChangeNumber} value={form.invoice} name="invoice" maxlength={3} className="text-right" bsSize="sm" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label form='creditnote' sm={4}>Nota crédito</Label>
                        <Col sm={3}>
                            <Input onChange={handleChangeNumber} value={form.creditnote} name="creditnote" maxlength={3} className="text-right" bsSize="sm" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label form='retention' sm={4}>Retención</Label>
                        <Col sm={3}>
                            <Input onChange={handleChangeNumber} value={form.retention} name="retention" maxlength={3} className="text-right" bsSize="sm" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label form='settlementonpurchase' sm={4}>Liquidación compra</Label>
                        <Col sm={3}>
                            <Input onChange={handleChangeNumber} value={form.settlementonpurchase} name="settlementonpurchase" maxlength={3} className="text-right" bsSize="sm" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label form='referralguide' sm={4}>Guía remisión</Label>
                        <Col sm={3}>
                            <Input onChange={handleChangeNumber} value={form.referralguide} name="referralguide" maxlength={3} className="text-right" bsSize="sm" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label form='recognition' sm={4}>Reconocimiento</Label>
                        <Col sm={4}>
                            <Input onChange={handleChange} value={form.recognition} name="recognition" maxlength={255} bsSize="sm" />
                        </Col>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggle}>
                        Cancelar
                    </Button>
                    <Button onClick={save} color="primary">Guardar</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default FormPoint