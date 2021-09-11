import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CreateModal from './CreateModal'

class TableDispatcher extends Component {

  render() {

    if (this.props.dispatchers === null) {
      return <div className="font-icon-wrapper text-primary">
        <FontAwesomeIcon icon="spinner" spin size="4x" />
        <p>Cargando</p>
      </div>

    }

    if (this.props.dispatchers.lenght === 0) {

    }

    return (
      <Table>
        <thead>
          <tr>
            <th>Apellidos y Nombres / Razón Social</th>
            <th>Tipo de indentificación</th>
            <th>Nª de indentificación</th>
            <th>Correo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.dispatchers.map(dispatcher => (
              <tr>
                <td>{dispatcher.name}</td>
                <td>{dispatcher.identification_type}</td>
                <td>{dispatcher.identification_value}</td>
                <td>{dispatcher.email != null ? dispatcher.email : ''}</td>
                <td>
                  <CreateModal
                    action='edit'
                    dispatcher={dispatcher}
                    editDispatcher={this.editDispatcher}
                  />
                  <Button outline className="mr-2 btn-transition" color="danger">
                    <i className="nav-link-icon lnr-trash"></i>
                  </Button>
                  <Link to={`./clientes-facturas/${dispatcher.id}`} color="primary">Guias de emisión</Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

export default TableDispatcher