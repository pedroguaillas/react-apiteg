import React, { Fragment } from 'react'
import { Table, Button, Input } from 'reactstrap'

class Aditionals extends React.Component {

    render() {

        let { aditionals, addAditional, deleteAditional, onChangeAditional } = this.props

        return (
            <Fragment>
                <Table responsive bordered>
                    <thead>
                        <tr>
                            <th colSpan={3} style={{ 'text-align': 'center' }}>Información Adicional</th>
                        </tr>
                        <tr>
                            <th style={{ 'text-align': 'center', 'width': '30%' }}>Nombre</th>
                            <th style={{ 'text-align': 'center' }}>Descripción</th>
                            <th style={{ 'width': '1em' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {aditionals.map((aditional, index) => (
                            <tr key={`${aditional}${index}`}>
                                <td>
                                    <Input size="sm" name="name" className="form-control" type="text"
                                        onChange={onChangeAditional(index)} value={aditional.name} required />
                                </td>
                                <td>
                                    <Input size="sm" name="description" className="form-control" type="text"
                                        onChange={onChangeAditional(index)} value={aditional.description} required />
                                </td>
                                <td>
                                    <Button onClick={() => deleteAditional(index)} size="sm" className="mr-2 btn-transition" color="danger">
                                        <i className="nav-link-icon lnr-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button onClick={addAditional} type="button">Agregar</Button>
            </Fragment>
        )
    }
}

export default Aditionals