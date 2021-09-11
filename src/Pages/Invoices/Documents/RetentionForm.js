import React, { Component } from 'react'
import { Col, FormGroup, Label, Input } from 'reactstrap'
import { Fragment } from 'react'

class RetentionForm extends Component {

    render() {

        let { edit, form, handleChangeRetention } = this.props

        return (
            <Fragment>
                <Col md={6}>
                    <FormGroup row>
                        <Label for="serie" sm={4} style={{ 'font-weight': 'bold' }}>Serie</Label>
                        <Col sm={6} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChangeRetention}
                                value={form.serie} type="text" name="serie" maxLength={17} />
                        </Col>
                        <Label for="serie" sm={6} hidden={!edit}>{form.serie}</Label>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup row>
                        <Label for="date" sm={4} style={{ 'font-weight': 'bold' }}>Fecha de emisión</Label>
                        <Col sm={6} hidden={edit}>
                            <Input bsSize="sm" onChange={handleChangeRetention}
                                value={form.date} type="date" name="date" />
                        </Col>
                        <Label for="serie" sm={6} hidden={!edit}>{form.date}</Label>
                    </FormGroup>
                </Col>
            </Fragment>
        )
    }
}

export default RetentionForm