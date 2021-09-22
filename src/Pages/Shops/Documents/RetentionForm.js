import React, { Component } from 'react'
import { Col, FormGroup, Label, Input } from 'reactstrap'
import { Fragment } from 'react'

class RetentionForm extends Component {

    render() {

        let { edit, form, handleChange } = this.props

        let date = new Date()
        date.setMonth(date.getMonth() - 3)

        return (
            <Fragment>
                <Col md={6}>
                    <FormGroup row>
                        <Label for="serie_retencion" sm={4} style={{ 'font-weight': 'bold' }}>Serie</Label>
                        <Col sm={6} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange}
                                value={form.serie_retencion} type="text" name="serie_retencion" maxLength={17} />
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup row>
                        <Label for="date_retention" sm={4} style={{ 'font-weight': 'bold' }}>Fecha de emisión</Label>
                        <Col sm={6} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChange}
                                value={form.date_retention} type="date" name="date_retention"
                                max={new Date().toISOString().substring(0, 10)}
                                min={date.toISOString().substring(0, 10)} />
                        </Col>
                    </FormGroup>
                </Col>
            </Fragment>
        )
    }
}

export default RetentionForm