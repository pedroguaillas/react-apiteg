import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Card, CardBody, Table
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import api from '../../../services/api';

class Branch extends Component {

    state = { branches: null }

    async componentDidMount() {
        // tokenAuth(this.props.token);
        try {
            // await clienteAxios.get('branches')
            await api.get('branches')
                .then(res => this.setState({ branches: res.data.branches }))
        } catch (error) {
            console.log(error)
        }
    }

    lZeros = (number, width) => {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */
        var zero = "0"; /* String de cero */

        if (width <= length) {
            if (number < 0) {
                return ("-" + numberOutput.toString());
            } else {
                return numberOutput.toString();
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString());
            }
        }
    }

    addBranch = () => this.props.history.push("/empresa/nuevo-establecimiento")

    render() {

        let { branches } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-branch', action: this.addBranch, icon: 'plus', msmTooltip: 'Agregar Establecimiento', color: 'primary' },
                    ]}
                    heading="Establecimientos"
                    subheading="Surcursales de la empresa"
                    icon="pe-7s-id icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    {
                        (branches === null) ? (<p>Cargando ...</p>) :
                            (branches.length < 1) ? (<p>No existe registro de sucursales</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped size="sm" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Identificación</th>
                                                            <th>Nombre</th>
                                                            <th>Dirección</th>
                                                            <th>Tipo</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            branches.map((branch, index) => (
                                                                <tr key={index}>
                                                                    <td>{this.lZeros(branch.store, 3)}</td>
                                                                    <td>{branch.name}</td>
                                                                    <td>{branch.address}</td>
                                                                    <td>{branch.type}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                )
                    }
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

// const mapStateToProps = state => ({
//     token: state.AuthReducer.token
// });

// export default connect(mapStateToProps)(Branch);
export default Branch;