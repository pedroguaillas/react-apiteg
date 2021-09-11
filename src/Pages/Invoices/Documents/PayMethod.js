import React, { Component, Fragment } from 'react'
import { Table, Input, CustomInput, Button } from 'reactstrap'

class PayMethod extends Component {

    handleChangePay = (index) => (e) => {
        this.props.handleChangePay(index, e)
    }

    render() {

        let { pay_methods, handleDeletePay, handleAddPay } = this.props

        return (
            <Fragment>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Forma de pago</th>
                            <th style={{ 'width': '10em' }}>Monto a pagar</th>
                            <th style={{ 'width': '10em' }}>Unidad de tiempo</th>
                            <th style={{ 'width': '10em' }}>Plazo</th>
                            <th style={{ 'width': '2em' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pay_methods.map((pay, index) => (
                            <tr key={index}>
                                <td>
                                    <CustomInput bsSize="sm" onChange={this.handleChangePay(index)} type="select"
                                        name="code" value={pay.code}>
                                        <option value="01">Sin utilización del sistema financiero</option>
                                        <option value="15">Compensación de deudas</option>
                                        <option value="16">Tarjeta de débito</option>
                                        <option value="17">Dinero electrónico</option>
                                        <option value="18">Targeta prepago</option>
                                        <option value="19">Targeta de crédito</option>
                                        <option value="20">Otros con utilización del sistema financiero</option>
                                        <option value="21">Endoso de títulos</option>
                                    </CustomInput>
                                </td>
                                <td>
                                    <Input bsSize="sm" onChange={this.handleChangePay(index)} value={pay.value} type="text"
                                        pattern="^[1-9]*[\.\d]?[0-9]?[0-9]?$" maxLength="11" name="value" required />
                                </td>
                                <td>
                                    <CustomInput bsSize="sm" onChange={this.handleChangePay(index)} type="select"
                                        name="unit_time" value={pay.unit_time}>
                                        <option value="">Seleccione</option>
                                        <option value="dias">Días</option>
                                        <option value="meses">Meses</option>
                                        <option value="anios">Años</option>
                                    </CustomInput>
                                </td>
                                <td>
                                    <Input bsSize="sm" onChange={this.handleChangePay(index)} value={pay.term} type="text"
                                        disabled={pay.unit_time.length === 0} pattern="^[1-9]*[\.\d]?[0-9]?[0-9]?$" maxLength="11" name="term" required />
                                </td>
                                <td>
                                    <Button size="sm" onClick={() => handleDeletePay(index)} className="mr-2 btn-transition" color="danger">
                                        <i className="nav-link-icon lnr-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button size="sm" onClick={handleAddPay} className="mr-2 btn-transition" color="primary">
                    Añadir forma de pago
                </Button>
            </Fragment>
        )
    }
}

export default PayMethod