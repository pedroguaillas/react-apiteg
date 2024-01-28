import React, { Component, Fragment } from 'react'
import {
    Row, Col, FormGroup, Label, Input,
    CustomInput
} from 'reactstrap'
import SelectCustomer from '../../../Components/Modal/SelectCustomer'
import SelectCarrier from '../../../Components/Modal/SelectCarrier'

class InfoDocument extends Component {

    render() {

        let { form, carriers, customers, points, selectPoint, handleChange, selectCarrier, selectCustomer, changePoint } = this.props

        let date = new Date()
        date.setMonth(date.getMonth() - 3)

        return (
            <Fragment>
                <Row form>
                    <Col md={6}>
                        <FormGroup className="mb-1" row hidden={form.id || points.length < 2}>
                            <Label style={{ 'font-weight': 'bold' }} for="point_id" sm={4}>Pto emisión *</Label>
                            <Col sm={6}>
                                <CustomInput type="select" bsSize="sm" name="point_id" id="point_id" value={selectPoint.id} onChange={changePoint}>
                                    <option value="">Seleccione</option>
                                    {points.map((point, i) => (
                                        <option value={point.id} key={`point${i}`}>{`${point.store}-${point.point ?? 'Cree un punto de emisión'} ${point.recognition ?? ''}`}</option>
                                    ))}
                                </CustomInput>
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="serie" sm={4}>Serie</Label>
                            <Label style={{ 'text-align': 'left' }} sm={4}>{form.serie}</Label>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="carrier_id" sm={4}>Transportista *</Label>
                            <Col sm={6}>
                                <SelectCarrier
                                    id={form.carrier_id}
                                    carriers={carriers}
                                    selectCarrier={selectCarrier}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="customer_id" sm={4}>Destinatario *</Label>
                            <Col sm={6}>
                                <SelectCustomer
                                    id={form.customer_id}
                                    customers={customers}
                                    selectCustomer={selectCustomer}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="address_from" sm={4}>Dirección partida *</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.address_from} type="text"
                                    id="address_from" name="address_from" maxlength={300} />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="address_to" sm={4}>Dirección destino *</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.address_to} type="text"
                                    id="address_to" name="address_to" maxlength={300} />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="date_start" sm={4}>Fecha inicio *</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.date_start} type="date" max={new Date().toISOString().substring(0, 10)}
                                    min={date.toISOString().substring(0, 10)} id="date_start" name="date_start" />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="date_end" sm={4}>Fecha fin *</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.date_end} type="date"
                                    min={form.date_start} id="date_end" name="date_end" />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="reason_transfer" sm={4}>Motivo translado *</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.reason_transfer} type="text"
                                    id="reason_transfer" name="reason_transfer" maxlength={300} />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="branch_destiny" sm={4}>Cod estable destino</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.branch_destiny} type="text"
                                    id="branch_destiny" name="branch_destiny" maxlength={3} />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="customs_doc" sm={4}>Documento aduanero</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.customs_doc} type="text"
                                    id="customs_doc" name="customs_doc" maxlength={20} />
                            </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                            <Label style={{ 'font-weight': 'bold' }} for="route" sm={4}>Ruta</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.route} type="text"
                                    id="route" name="route" maxlength={300} />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                    <strong className='mt-2'>Factura</strong>
                </Row>
                <Row form>
                    <Col md={3}>
                        <FormGroup row>
                            <Label for="serie_invoice" sm={4}>Serie</Label>
                            <Col sm={6}>
                                <Input bsSize="sm" onChange={handleChange} value={form.serie_invoice} type="text"
                                    id="serie_invoice" name="serie_invoice" maxlength={17} />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup row>
                            <Label for="date_invoice" sm={5}>Fecha de autorización</Label>
                            <Col sm={7}>
                                <Input bsSize="sm" onChange={handleChange} value={form.date_invoice} type="date"
                                    id="date_invoice" name="date_invoice" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md={5}>
                        <FormGroup row>
                            <Label for="authorization_invoice" sm={3}>Autorización</Label>
                            <Col sm={9}>
                                <Input bsSize="sm" onChange={handleChange} value={form.authorization_invoice} type="text"
                                    id="authorization_invoice" name="authorization_invoice" maxlength={49} />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

export default InfoDocument