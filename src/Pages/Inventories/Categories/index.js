import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class Categories extends Component {

    state = {
        categories: null,
        move: {
            redirect: false,
            to: null
        }
    }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('categories')
                .then(res => this.setState({ categories: res.data.data }))
        } catch (error) {
            console.log(error)
        }
    }

    addCategory = () => {
        this.setState({
            move: {
                redirect: true,
                to: 'nuevacategoria'
            }
        })
    }

    render() {

        let { move, categories } = this.state

        if (move.redirect) {
            return <Redirect push to={`/inventarios/${move.to}`} />
        }

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-product', action: this.addCategory, icon: 'plus', msmTooltip: 'Agregar categoria', color: 'primary' },
                    ]}
                    heading="Categorias"
                    subheading="Lista de todas las categorias"
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
                        (categories === null) ? (<p>Cargando ...</p>) :
                            (categories.length < 1) ? (<p>No existe categorias empiece por agregar el primer categoria</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>Categoria</th>
                                                            <th style={{ 'width': '2em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            categories.map((category, index) => (
                                                                <tr key={index}>
                                                                    <td>{category.attributes.category}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(Categories);