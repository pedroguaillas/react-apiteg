import React, { Component } from 'react'
import {
    Row, Col, FormGroup, Label, Input, CustomInput
} from 'reactstrap'
import LoadFileXml from '../../Components/Modal/LoadFileXml'
import SelectProvider from '../../Components/Modal/SelectProvider'

class InfoDocument extends Component {

    render() {

        let { form, handleChange, providers, selectProvider, selectDocXml, registerProvider } = this.props
        let type_vouchers = [
            { code: 1, description: 'Factura' },
            { code: 2, description: 'Nota Venta' },
            { code: 3, description: 'Liquidación en Compra' },
            { code: 5, description: 'Nota Débito' }
        ]

        let date = new Date()
        date.setMonth(date.getMonth() - 3)

        return (
            <Row form>
                <Col md={6}>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="date" sm={4}>Fecha emisión</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.date} type="date"
                                id="date" name="date" max={new Date().toISOString().substring(0, 10)}
                                min={date.toISOString().substring(0, 10)} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="type" sm={4}>Número de serie</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.serie} type="text"
                                id="serie" name="serie" maxlength={17} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="contact_id" sm={4}>Proveedor *</Label>
                        <Col sm={8}>
                            <SelectProvider
                                id={form.provider_id}
                                providers={providers}
                                selectProvider={selectProvider}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="authorization" sm={4}>Autorización</Label>
                        <Col sm={8}>
                            <Input bsSize="sm" onChange={handleChange} value={form.authorization} type="text"
                                id="authorization" name="authorization" maxlength={49} />
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup className="mt-3" row>
                        <Col className="mt-3" sm={6}>
                            <CustomInput bsSize="sm" onChange={handleChange} value={form.voucher_type}
                                type="select" name="voucher_type" id="voucher_type">
                                {
                                    type_vouchers.map((type_voucher, index) => (
                                        <option value={type_voucher.code}>{type_voucher.description}</option>
                                    ))
                                }
                            </CustomInput>
                        </Col>
                        <Col className="mt-3" sm={3} hidden={form.voucher_type === 2 || form.voucher_type === 3}>
                            <LoadFileXml
                                selectDocXml={selectDocXml}
                                registerProvider={registerProvider}
                                voucher_type={form.voucher_type}
                            />
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
        )
    }
}

export default InfoDocument