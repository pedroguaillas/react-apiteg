import React from 'react'
import { Form, Row, Col, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap'

class RetentionForm extends React.Component {

    state = {
        taxes: null
    }

    //Handle change global 
    handleChange = e => {
        if (e.target.validity.valid) {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    //Handle change only tax type
    handleChangeTax = (e) => {
        let { name, value } = e.target
        if (value > 0) {
            this.setState((state, props) => ({
                [name]: value,
                taxes: props.taxes.filter((tax, i) => (value == 1) ? tax.code < 10 : tax.code > 9)
            }))
        }
    }

    //Handle change only code
    handleChangeCode = (e) => {
        let { name, value } = e.target
        if (value > 0) {
            this.setState(state => ({
                [name]: value,
                porcentage: state.taxes.filter((tax, i) => (tax.code === value))[0].porcentage
            }))
        }
    }

    //Handle change only base
    handleChangeBase = (e) => {
        let { name, value } = e.target
        if (value > 0) {
            this.setState(state => ({
                [name]: value,
                value: (value * state.porcentage * .01).toFixed(2)
            }))
        }
    }

    //add tax to table taxes
    addTax = () => {
        let { code, tax_code, base, porcentage, value } = this.state
        this.props.addTax({ code, tax_code, base, porcentage, value })
        this.setState({
            code: '',
            tax_code: '',
            base: '',
            porcentage: '',
            value: '',
        })
    }

    render() {
        return (
            <Form>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label>*Impuesto</Label>
                            <CustomInput onChange={this.handleChangeTax} type="select"
                                id="code" name="code" value={this.state.code}>
                                <option value="">Seleccione</option>
                                <option value="1">IVA</option>
                                <option value="2">Imp. Renta</option>
                            </CustomInput>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label>*Retención</Label>
                            <CustomInput onChange={this.handleChangeCode} value={this.state.tax_code}
                                id="tax_code" type="select" name="tax_code">
                                <option value="">Seleccione</option>
                                {
                                    this.state.taxes !== null ? this.state.taxes.map(tax => (
                                        <option value={tax.code}>{`${tax.code} - ${tax.conception}`}</option>
                                    )) : ''
                                }
                            </CustomInput>
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label>*Base imponible</Label>
                            <Input id="base" onChange={this.handleChangeBase} value={this.state.base} type="text"
                                pattern="^[1-9]*[\.\d]?[0-9]?[0-9]?$" maxLength="11" name="base" required />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label>* % de retención</Label>
                            <Input id="porcentage" onChange={this.handleChange} value={this.state.porcentage} type="text"
                                pattern="^[1-9]*[\.\d]?[0-9]?[0-9]?$" maxLength="5" name="porcentage" required />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label>*Valor retenido</Label>
                            <Input id="value" onChange={this.handleChange} value={this.state.value} type="text"
                                pattern="^[1-9]*[\.\d]?[0-9]?[0-9]?$" maxLength="11" name="value" required />
                        </FormGroup>
                    </Col>
                </Row>
                <Button color="primary" onClick={this.addTax}>Añadir impuesto</Button>
            </Form>
        )
    }
}

export default RetentionForm