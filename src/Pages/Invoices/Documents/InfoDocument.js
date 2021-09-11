import React, { Component } from 'react'
import {
    Row, Col, FormGroup, Label, Input, CustomInput
} from 'reactstrap'
import LoadFileXml from '../../Components/Modal/LoadFileXml'
import SelectContact from '../../Components/Modal/SelectContact'
import SelectDocument from '../../Components/Modal/SelectDocument'

class InfoDocument extends Component {

    render() {

        let { edit, form, handleChange, contacts, selectContact, selectDocRelated, selectDocXml } = this.props

        let type_vouchers = [
            { code: 1, description: 'Factura' },
            { code: 3, description: 'Liquidación en Compra' },
            { code: 4, description: 'Nota Crédito' },
            { code: 5, description: 'Nota Débito' }
        ]

        if (Number(form.type) === 2) {
            type_vouchers = type_vouchers.filter(v => v.code !== 3)
        }

        return (
            <Row form>
                <Col md={6}>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="date" sm={4}>Fecha emisión</Label>
                        <Col sm={6} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange} value={form.date} type="date"
                                id="date" name="date" />
                        </Col>
                        <Label className="text-left" sm={4} hidden={!edit}>{form.date}</Label>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="type" sm={4}>Tipo de movimiento</Label>
                        <Col sm={6} hidden={edit}>
                            <CustomInput bsSize="sm" onChange={handleChange} value={Number(form.type)}
                                type="select" name="type" id="type">
                                <option value={1}>Compra</option>
                                <option value={2}>Venta</option>
                            </CustomInput>
                        </Col>
                        <Label className="text-left" sm={4} hidden={!edit}>{Number(form.type) === 1 ? 'Compra' : 'Venta'}</Label>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="type" sm={4}>Número de serie</Label>
                        <Col sm={6} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange} value={form.serie} type="text"
                                id="serie" name="serie" maxlength={17} />
                        </Col>
                        <Label className="text-left" sm={4} hidden={!edit}>{form.serie}</Label>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="contact_id" sm={4}>{form.type === '1' ? 'Proveedor' : 'Cliente'} *</Label>
                        <Col sm={6} hidden={edit}>
                            <SelectContact
                                id={form.contact_id}
                                contacts={contacts}
                                selectContact={selectContact}
                            />
                        </Col>
                        <Label className="text-left" sm={4} hidden={!edit}>{contacts.length > 0 && form.contact_id > 0 ? contacts.filter(contact => contact.id === form.contact_id)[0].company : null}</Label>
                    </FormGroup>
                    <FormGroup className="mb-1" hidden={Number(form.voucher_type) < 4} row>
                        <Label style={{ 'font-weight': 'bold' }} for="expiration_date" sm={4}>Doc relacionado *</Label>
                        <Col sm={6} hidden={edit}>
                            <SelectDocument
                                contact_id={form.contact_id}
                                selectDocRelated={selectDocRelated}
                            />
                        </Col>
                        <Label className="text-left" sm={4} hidden={!edit}>{form.doc_realeted}</Label>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="expiration_date" sm={4}>Vencimiento</Label>
                        <Col sm={2} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange} value={form.expiration_days} type="number"
                                id="expiration_days" name="expiration_days" step={1} min={0} max={30} />
                        </Col>
                        <Label className="text-left" sm={1} hidden={!edit}>{form.expiration_days}</Label>
                        <Label style={{ 'text-align': 'left' }} sm={2}>días</Label>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup className="mt-3" row>
                        <Col className="mt-3" sm={3} hidden={Number(form.type) === 2 || (Number(form.type) === 1 && Number(form.voucher_type) === 3)}>
                            <LoadFileXml
                                contacts={contacts}
                                selectContact={selectContact}
                                selectDocXml={selectDocXml}
                            />
                        </Col>
                        <Col className="mt-3" sm={6}>
                            <CustomInput bsSize="sm" onChange={handleChange} value={form.voucher_type}
                                type="select" name="voucher_type" id="voucher_type" hidden={edit}>
                                {
                                    type_vouchers.map((type_voucher, index) => (
                                        <option value={type_voucher.code}>{type_voucher.description}</option>
                                    ))
                                }
                            </CustomInput>
                            <Label style={{ 'text-align': 'left' }} sm={12} hidden={!edit}>{() => type_vouchers.filter(t => Number(form.voucher_type) === Number(t.code))[0].description}</Label>
                            {/* <Label style={{ 'text-align': 'left' }} sm={12} hidden={!edit}>{Number(form.voucher_type) === 1 ? 'Factura' : (Number(form.voucher_type) === 4 ? 'Nota Crédito' : 'Nota Débito')}</Label> */}
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
        )
    }
}

export default InfoDocument