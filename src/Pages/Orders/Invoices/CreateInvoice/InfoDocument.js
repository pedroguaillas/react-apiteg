import React, { Component } from 'react'
import {
    Row, Col, FormGroup, Label, Input, CustomInput
} from 'reactstrap'
import SelectCustomer from '../../../Components/Modal/SelectCustomer'

class InfoDocument extends Component {

    render() {

        let { form, customers, points, selectPoint, handleChange, selectCustomer, changePoint } = this.props

        let type_vouchers = [
            { code: 1, description: 'Factura' },
            { code: 4, description: 'Nota Crédito' },
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
                    <FormGroup className="mb-1" row hidden={form.id || points.length < 2}>
                        <Label style={{ 'font-weight': 'bold' }} for="point" sm={4}>Punto Emi</Label>
                        <Col sm={8}>
                            <CustomInput type="select" bsSize="sm" name="point_id" id="point_id" value={selectPoint.id} onChange={changePoint}>
                                <option value="">Seleccione</option>
                                {points.map((point, i) => (
                                    <option value={point.id} key={`point${i}`}>{`${point.store}-${point.point ?? 'Cree un punto de emisión'} ${point.recognition ?? ''}`}</option>
                                ))}
                            </CustomInput>
                        </Col>
                    </FormGroup>
                    <FormGroup className={`mb-1 ${form.id !== undefined || selectPoint.id ? '' : 'text-danger'}`} row>
                        <Label style={{ 'font-weight': 'bold' }} for="serie" sm={4}>N° de serie</Label>
                        <Label style={{ 'text-align': 'left' }} sm={5}>{form.serie}</Label>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="customer_id" sm={4}>Cliente *</Label>
                        <Col sm={8}>
                            <SelectCustomer
                                id={form.customer_id}
                                selectCustomer={selectCustomer}
                                customers={customers}
                            />
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="voucher_type" sm={4}>Tipo de comprobante</Label>
                        <Col sm={6}>
                            <CustomInput bsSize="sm" onChange={handleChange} value={form.voucher_type}
                                type="select" name="voucher_type" id="voucher_type">
                                {
                                    type_vouchers.map((type_voucher, index) => (
                                        <option value={type_voucher.code} key={`tvchert${index}`}>{type_voucher.description}</option>
                                    ))
                                }
                            </CustomInput>
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row hidden={form.voucher_type !== 1}>
                        <Label style={{ 'font-weight': 'bold' }} for="serie" sm={4}>Guia de Remisión</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.guia} type="text"
                                id="guia" name="guia" maxlength={17} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row hidden={form.voucher_type !== 4}>
                        <Label style={{ 'font-weight': 'bold' }} for="date_order" sm={4}>Emisión factura *</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.date_order} type="date"
                                id="date_order" name="date_order" max={new Date().toISOString().substring(0, 10)} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row hidden={form.voucher_type !== 4}>
                        <Label style={{ 'font-weight': 'bold' }} for="serie_order" sm={4}>Serie factura *</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.serie_order} type="text"
                                id="serie_order" name="serie_order" maxlength={17} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row hidden={form.voucher_type !== 4}>
                        <Label style={{ 'font-weight': 'bold' }} for="reason" sm={4}>Motivo *</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.reason} type="textarea"
                                id="reason" name="reason" maxlength={300} />
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
        )
    }
}

export default InfoDocument