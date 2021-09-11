import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class Unities extends Component {

    state = {
        unities: null
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('unities')
                .then(res => this.setState({ unities: res.data.data }))
        } catch (error) {
            console.log(error)
        }
    }

    addUnity = () => {
        this.props.history.push('/inventarios/nuevaunidad')
    }

    render() {

        let { unities } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-unity', action: this.addUnity, icon: 'plus', msmTooltip: 'Agregar unidad', color: 'primary' },
                    ]}
                    heading="Unidades"
                    subheading="Lista de todas las unidades"
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
                        (unities === null) ? (<p>Cargando ...</p>) :
                            (unities.length < 1) ? (<p>No existe unidades empiece por agregar la primera unidad</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>Unidad</th>
                                                            <th style={{ 'width': '2em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            unities.map((unity, index) => (
                                                                <tr key={index}>
                                                                    <td>{unity.attributes.unity}</td>
                                                                    <td>
                                                                        <Button size='sm' color="primary">
                                                                            <i className='nav-link-icon lnr-pencil'></i>
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
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

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Unities);