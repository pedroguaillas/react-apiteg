import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Modal, ModalBody, ModalFooter, ModalHeader,
    Button, Table, Row, Col
} from 'reactstrap';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class ViewMovement extends Component {

    state = {
        movement: {},
        products: []
    }

    async componentDidUpdate(prevProps) {
        let { id } = this.props;
        if (id > 0 && id !== prevProps.id) {
            tokenAuth(this.props.token);
            try {
                await clienteAxios.get('movements/' + id)
                    .then(res => this.setState({
                        movement: res.data.movement,
                        products: res.data.products
                    }))
            } catch (error) {
                console.log(error)
            }
        }
    }

    render() {
        let { movement, products } = this.state
        let { modal, toggle } = this.props

        return (
            <Modal
                isOpen={modal}
                toggle={toggle}
                className={this.props.className}
                size={this.props.size ? this.props.size : 'lg'}
            >
                <ModalHeader toggle={toggle}>Datos del movimiento</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <p><strong>Fecha: </strong>{movement.date}</p>
                            <p><strong>Descripción: </strong>{movement.description}</p>
                            <p><strong>Tipo: </strong>{movement.type === 1 ? 'Ingreso' : 'Egreso'}</p>
                            <p><strong>Asiento: </strong></p>
                            <p><strong>Documento: </strong></p>
                            <p><strong>Total: </strong>${movement.sub_total}</p>
                        </Col>
                    </Row>
                    <Table bordered>
                        <thead>
                            <tr style={{ 'textAlign': 'center' }}>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Costo unitario</th>
                                <th>Costo total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.name}</td>
                                    <td style={{ 'textAlign': 'center' }}>{product.quantity}</td>
                                    <td style={{ 'textAlign': 'right' }}>${parseFloat(product.price).toFixed(2)}</td>
                                    <td style={{ 'textAlign': 'right' }}>${(parseFloat(product.quantity) * parseFloat(product.price)).toFixed(2)}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>Aceptar</Button>{' '}
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(ViewMovement);