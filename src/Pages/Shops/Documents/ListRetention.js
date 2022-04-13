import React, { Component } from 'react'
import { Table, Button, CustomInput, Input } from 'reactstrap'
import SelectRetention from '../../Components/Modal/SelectRetention'

class ListRetention extends Component {

    render() {

        let { edit, taxes, retentions, handleChangeTax, deleteTax, handleChangeOthersTax, ...functions } = this.props

        return (
            <Table className="my-3" bordered>
                <thead>
                    <tr style={{ 'textAlign': 'center' }}>
                        <th style={{ 'width': '10em' }}>Impuesto</th>
                        <th>Retención</th>
                        <th style={{ 'width': '10em' }}>Porcentaje</th>
                        <th style={{ 'width': '10em' }}>Base Imp</th>
                        <th style={{ 'width': '10em' }}>Valor</th>
                        <th style={{ 'width': '2em' }} hidden={edit}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        edit ?
                            taxes.length === 0 ? null :
                                taxes.map((tax, index) => (
                                    <tr key={index}>
                                        <td style={{ 'textAlign': 'center' }}>{tax.code === '1' ? 'IVA' : 'Renta'}</td>
                                        <td>
                                            <SelectRetention
                                                index={index}
                                                code={tax.code}
                                                tax_code={tax.tax_code}
                                                retentions={retentions}
                                                {...functions}
                                            />
                                            {/* {retentions.filter(retention => retention.tax_code === tax.tax_code)[0].conception} */}
                                        </td>
                                        <td>{`${tax.porcentage}%`}</td>
                                        <td>{tax.base}</td>
                                        <td>{parseFloat(tax.value).toFixed(2)}</td>
                                    </tr>
                                ))
                            :
                            taxes.length === 0 ? null :
                                taxes.map((tax, index) => (
                                    <tr key={index}>
                                        <td>
                                            <CustomInput bsSize="sm" onChange={handleChangeTax(index)} type="select"
                                                name="code" value={tax.code}>
                                                <option value={null}>Seleccione</option>
                                                <option value={2}>IVA</option>
                                                <option value={1}>Imp. Renta</option>
                                            </CustomInput>
                                        </td>
                                        <td>
                                            <SelectRetention
                                                index={index}
                                                code={tax.code}
                                                tax_code={tax.tax_code}
                                                retentions={retentions}
                                                {...functions}
                                            />
                                        </td>
                                        <td>
                                            {/* El maxLength es igual a 2 para permitir hasta 10% */}
                                            {tax.editable_porcentage ?
                                                (<Input bsSize="sm" onChange={handleChangeOthersTax(index)}
                                                    value={tax.porcentage} type="text" maxLength="2" name="porcentage" required />)
                                                : `${tax.porcentage === undefined || tax.porcentage === null ? 0 : tax.porcentage}%`}
                                        </td>
                                        <td>
                                            {/* El maxLength es igual a 10 para permitir hasta 9999999.99 */}
                                            <Input bsSize="sm" onChange={handleChangeOthersTax(index)}
                                                value={tax.base} type="text" maxLength="10" name="base" required />
                                        </td>
                                        <td>{parseFloat(tax.value).toFixed(2)}</td>
                                        <td hidden={edit}>
                                            <Button size="sm" onClick={() => deleteTax(index)} className="mr-2 btn-transition" color="danger">
                                                <i className="nav-link-icon lnr-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                    }
                </tbody>
            </Table>
        )
    }
}

export default ListRetention