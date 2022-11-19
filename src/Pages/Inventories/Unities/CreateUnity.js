import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clientAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import api from '../../../services/api';

const CreateUnity = (props) => {

    const [formUnity, setFormUnity] = useState({
        unity: ''
    });

    const handleChange = e => {
        setFormUnity({
            unity: e.target.value
        })
    }

    const submit = async () => {
        if (formUnity.unity !== '') {
            // tokenAuth(props.token);
            try {
                // await clientAxios.post('unities', formUnity)
                await api.post('unities', formUnity)
                    .then(res => props.history.push('/inventarios/unidades'))
            } catch (error) {
                if (error.message.includes('405')) {
                    alert('Ya existe una unidad con ese nombre')
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
                heading="Unidades"
                subheading="Agregar unidad"
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
                                                <Label htmlFor="unity" sm={4}>Unidad *</Label>
                                                <Col sm={6}>
                                                    <Input bsSize="sm" onChange={handleChange} value={formUnity.unity}
                                                        type="text" name="unity" id="unity" maxLength="20" />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col sm={4}></Col>
                                                <Button className="ml-3" color="primary" type="button" onClick={submit}>Agregar unidad</Button>
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

// export default connect(mapStateToProps, mapDispatchToProps)(CreateUnity);
export default CreateUnity;