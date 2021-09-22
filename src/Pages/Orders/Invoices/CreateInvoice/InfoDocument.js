import React, { Component } from 'react'
import {
    Row, Col, FormGroup, Label, Input
} from 'reactstrap'
import SelectCustomer from '../../../Components/Modal/SelectCustomer'

class InfoDocument extends Component {

    render() {

        let { form, handleChange, customers, selectCustomer } = this.props

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
                        <Label style={{ 'font-weight': 'bold' }} for="serie" sm={4}>Número de serie</Label>
                        <Col sm={6}>
                            <Input bsSize="sm" onChange={handleChange} value={form.serie} type="text"
                                id="serie" name="serie" maxlength={17} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="customer_id" sm={4}>Cliente *</Label>
                        <Col sm={6}>
                            <SelectCustomer
                                id={form.customer_id}
                                customers={customers}
                                selectCustomer={selectCustomer}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                        <Label style={{ 'font-weight': 'bold' }} for="expiration_date" sm={4}>Vencimiento</Label>
                        <Col sm={2}>
                            <Input bsSize="sm" onChange={handleChange} value={form.expiration_days} type="number"
                                id="expiration_days" name="expiration_days" step={1} min={0} max={30} />
                        </Col>
                        <Label style={{ 'text-align': 'left' }} sm={2}>días</Label>
                    </FormGroup>
                </Col>
                <Col md={6}></Col>
            </Row>
        )
    }
}

export default InfoDocument