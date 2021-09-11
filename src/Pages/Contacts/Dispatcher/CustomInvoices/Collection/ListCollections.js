import React from 'react'
import { Table } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListCollections = ({ collections, first }) => {

    if (collections === null) {
        return <div className="font-icon-wrapper text-primary">
            <FontAwesomeIcon icon="spinner" spin size="4x" />
            <p>Cargando</p>
        </div>
    }

    if (collections.length === 0) {
        return <p>No se ha realizado pagos, rellene el formulario "Registro de cobro" y envialo para agregar un cobro nuevo.</p>
    }

    return <Table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Deuda anterior</th>
                <th>Cobro</th>
                <th>Deuda actual</th>
            </tr>
        </thead>
        <tbody>
            {
                collections.map(collection => {
                    return (
                        <tr>
                            <td>{collection.date}</td>
                            <td>${first}</td>
                            <td>${collection.amount}</td>
                            <td>${first -= collection.amount}</td>
                        </tr>
                    )
                }
                )
            }
        </tbody>
    </Table>
}

export default ListCollections