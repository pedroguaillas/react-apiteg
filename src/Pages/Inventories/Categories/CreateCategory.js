import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clientAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import api from '../../../services/api';

const CreateCategory = (props) => {

    const [formCategory, setFormCategory] = useState({
        category: '',
        type: 'producto',
        buy: false,
        sale: false,
    });

    const handleChange = e => {
        let { name, value } = e.target
        setFormCategory({
            ...formCategory,
            [name]: value
        })
    }

    const handleChangeCheck = e => {
        let { name, checked } = e.target
        setFormCategory({
            ...formCategory,
            [name]: checked
        })
    }

    const submit = async () => {
        if (formCategory.category !== '') {
            // tokenAuth(props.token);
            try {
                // await clientAxios.post('categories', formCategory)
                await api.post('categories', formCategory)
                    .then(res => props.history.push('/inventarios/categorias'))

            } catch (error) {
                if (error.message.includes('405')) {
                    alert('Ya existe una categoria con ese nombre')
                }
                console.log(error)
            }
        } else {
            alert('Los campos marcados con * son obligatorios')
        }
    }

    return (
        <Fragment>
            <PageTitle
                heading="Categorias"
                subheading="Agregar una nueva categoria"
                icon="pe-7s-note2 icon-gradient bg-mean-fruit"
            />
            <ReactCSSTransitionGroup
                component="div"
                transitionName="TabsAnimation"
                transitionAppear={true}
                transitionAppearTimeout={0}
                transitionEnter={false}
                transitionLeave={false}>

                <Row>
                    <Col>
                        <Card className="main-card mb-3">
                            <CardBody>
                                <Form className="text-right">
                                    <Row form>
                                        <p className='mt-2'>
                                            <strong>Nota:</strong> Los campos marcados con * son obligatorios
                                        </p>
                                    </Row>
                                    <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                        <strong className='mt-2'>Datos generales</strong>
                                    </Row>
                                    <Row form>
                                        <Col sm={6}>
                                            <FormGroup className="mb-1" row>
                                                <Label htmlFor="category" sm={4}>Categoría *</Label>
                                                <Col sm={6}>
                                                    <Input bsSize="sm" onChange={handleChange} value={formCategory.category}
                                                        type="text" name="category" id="category" maxLength="20" />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup className="mb-1" row>
                                                <Label htmlFor="type" sm={4}>Tipo</Label>
                                                <Col sm={6}>
                                                    <Input bsSize="sm" onChange={handleChange} value={formCategory.type}
                                                        type="select" name="type" id="type">
                                                        <option value="producto">Producto/Bien</option>
                                                        <option value="servicio">Servicio</option>
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup className="mb-0" row>
                                                <Label htmlFor="sale" sm={4}>Para venta</Label>
                                                <Col sm={6}>
                                                    <CustomInput className="text-left mt-2" onChange={handleChangeCheck} checked={formCategory.sale}
                                                        type="checkbox" id="sale" name="sale" />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label htmlFor="buy" sm={4}>Para compra</Label>
                                                <Col sm={6}>
                                                    <CustomInput className="text-left mt-2" onChange={handleChangeCheck} checked={formCategory.buy}
                                                        type="checkbox" id="buy" name="buy" />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col sm={4}></Col>
                                                <Button className="ml-3" color="primary" type="button" onClick={submit}>Agregar categoría</Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </ReactCSSTransitionGroup>
        </Fragment>
    );
}

// const mapStateToProps = state => ({
//     token: state.AuthReducer.token
// });

// const mapDispatchToProps = () => ({});

// export default connect(mapStateToProps, mapDispatchToProps)(CreateCategory);
export default CreateCategory;