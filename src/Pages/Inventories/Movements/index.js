import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import ViewMovement from './ViewMovement';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import api from '../../../services/api';

class Movements extends Component {

    state = {
        movements: null,
        id: 0,
        modal: false
    }

    async componentDidMount() {
        // tokenAuth(this.props.token);
        try {
            // await clienteAxios.get('movements')
            await api.get('movements')
                .then(response => this.setState({
                    movements: response.data.data
                }))
        } catch (error) {
            console.log(error)
        }
    }

    addMovement = () => this.props.history.push("/inventarios/nuevomovimiento")

    showMovement = (id) => {
        this.setState(prevState => ({ id, modal: !prevState.modal }))
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render() {

        let { movements } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-movement', action: this.addMovement, icon: 'plus', msmTooltip: 'Agregar movimiento', color: 'primary' },
                    ]}
                    heading="Movimiento de inventario"
                    subheading="Lista de todos los movimientos"
                    icon="pe-7s-note2 icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    {
                        (movements === null) ? (<p>Cargando ...</p>) :
                            (movements.length < 1) ? (<p>No existe movimientos registrados ...</p>) :
                                (<Row>
                                    <ViewMovement
                                        id={this.state.id}
                                        modal={this.state.modal}
                                        toggle={this.toggle}
                                    />
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>Fecha</th>
                                                            <th>Descripción</th>
                                                            <th>Tipo</th>
                                                            <th>Total</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {movements.map((movement, index) => (
                                                            <tr key={index}>
                                                                <td>{movement.atts.date}</td>
                                                                <td>{movement.atts.description}</td>
                                                                <td>{movement.atts.type === 1 ? 'Ingreso' : 'Egreso'}</td>
                                                                <td>${Number(movement.atts.sub_total).toFixed(2)}</td>
                                                                <td>
                                                                    <Button size='sm' color="primary" onClick={() => this.showMovement(movement.id)}>
                                                                        <i className='nav-link-icon lnr-pencil'></i>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>)
                    }
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

// const mapStateToProps = state => ({
//     token: state.AuthReducer.token
// });

// export default connect(mapStateToProps)(Movements);
export default Movements;