import React from 'react'
import { Table, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListSales = ({ sales }) => {
    if (sales === null) {
        return <div className="font-icon-wrapper text-primary">
          <FontAwesomeIcon icon="spinner" spin size="4x" />
          <p>Cargando</p>
        </div>
    }
    
    if (sales.length === 0) {
        return <p>No se ha realizado pagos, rellene el formulario "Registro de cobro" y envialo para agregar un cobro nuevo.</p>
    }

    return <Table>
        <thead>
            <tr>
                <th>Factura</th>
                <th>Adquirido</th>
                <th>Costo</th>
                <th>Ultimo pago</th>
                <th>Pagado</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {
                sales.map(sale => (
                    <tr>
                        <td>{sale.serie}</td>
                        <td>{sale.created_at.substring(0, 10)}</td>
                        <td>${sale.total}</td>
                        <td>{sale.created_at.substring(0, 10)}</td>
                        <td>${sale.total}</td>
                        <th>
                            <Link to={`../clientes-cobros/${sale.id}`} color="primary">Cobros</Link>
                        </th>
                    </tr>
                ))
            }
        </tbody>
    </Table>
}

export default ListSales