import React, { Component } from 'react'
import { Table, Button, CardBody, CardTitle } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateModal from './CreateModal'

class TableProviders extends Component {

  render() {
    if (this.props.providers === null) {
      return <div className="font-icon-wrapper text-primary">
        <FontAwesomeIcon icon="spinner" spin size="4x" />
        <p>Cargando ...</p>
      </div>
    }

    return (
      <CardBody>
        <CardTitle>Lista de proveedores</CardTitle>
        <Table>
          <thead>
            <tr>
              <th>RUC</th>
              <th>Razón social</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.providers.map(provider => (
                <tr>
                  <td>{provider.identification_value}</td>
                  <td>{provider.name}</td>
                  <td>{provider.direction}</td>
                  <td>{provider.phone}</td>
                  <td>{provider.mail}</td>
                  <td>
                    <CreateModal
                      action='edit'
                      provider={provider}
                      editProvider={this.props.editProvider}
                    />
                    <Button outline className="mr-2 btn-transition" color="danger">
                      <i className="nav-link-icon lnr-trash"> </i>
                    </Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </CardBody>
    )
  }
}

export default TableProviders