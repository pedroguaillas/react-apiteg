import React, { Component } from 'react'
import { Col, FormGroup, Label, Input, CustomInput } from 'reactstrap'
import { Fragment } from 'react'

class RetentionForm extends Component {

    render() {

        let { edit, form, points, selectPoint, handleChange, changePoint } = this.props

        let date = new Date()
        date.setMonth(date.getMonth() - 3)

        return (
            <Fragment>
                <Col md={3} hidden={points.length < 2 || form.voucher_type === 3}>
                    <FormGroup row>
                        <Label for="point" sm={5} style={{ 'font-weight': 'bold' }}>Pto emisión</Label>
                        <Col sm={7} hidden={edit}>
                            <CustomInput onChange={changePoint} type="select" bsSize="sm" name="point_id" id="point_id" value={selectPoint.id}>
                                <option value="">Seleccione</option>
                                {points.map((point, i) => (
                                    <option value={point.id} key={`point${i}`}>{`${point.store}-${point.point ?? 'Cree un punto de emisión'} ${point.recognition ?? ''}`}</option>
                                ))}
                            </CustomInput>
                        </Col>
                    </FormGroup>
                </Col>

                <Col md={4}>
                    <FormGroup row>
                        <Label for="serie_retencion" sm={5} style={{ 'font-weight': 'bold' }}>Serie Ret</Label>
                        <Label style={{ 'text-align': 'left' }} sm={6}>{form.serie_retencion}</Label>
                        {/* <Col sm={7} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange}
                                value={form.serie_retencion} type="text" name="serie_retencion" maxLength={17} />
                        </Col> */}
                    </FormGroup>
                </Col>

                <Col md={4}>
                    <FormGroup row>
                        <Label for="date_retention" sm={5} style={{ 'font-weight': 'bold' }}>Fecha emisión</Label>
                        <Col sm={7} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange}
                                value={form.date_retention} type="date" name="date_retention"
                                max={new Date().toISOString().substring(0, 10)}
                                min={date.toISOString().substring(0, 10)} />
                        </Col>
                    </FormGroup>
                </Col>

                {/* <Col md={5}>
                    <FormGroup row>
                        <Label for="authorization_retention" sm={4} style={{ 'font-weight': 'bold' }}>Autorización</Label>
                        <Col sm={8} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange}
                                value={form.authorization_retention} type="text" name="authorization_retention" maxLength={49} />
                        </Col>
                    </FormGroup>
                </Col> */}
            </Fragment>
        )
    }
}

export default RetentionForm