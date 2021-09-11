import React from 'react'
import { Row, Col, Card, CardBody, CardTitle, FormGroup, Label, Input } from 'reactstrap'
import SmartSearch from '../../Components/SmartSearch'

export default class CustomerCard extends React.Component {

    render() {

        let { custom } = this.props

        return (
            <Col lg="6">
                <Card className="main-card mb-3">
                    <CardBody>
                        <CardTitle>Cliente</CardTitle>
                        <Row form>
                            <Col lg={6}>
                                <SmartSearch
                                    id="cust"
                                    placeholder="Nombre del cliente"
                                    msm="Escriba para cargar la sugerencia"
                                    url="customers.findSmart"
                                    addItem={this.props.addCustom}
                                />
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="identification_value">Número de identificación</Label>
                                    <Input id="identification_value" value={custom.identification_value}
                                        type="text" disabled />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="name">Nombre</Label>
                                    <Input id="name" value={custom.name}
                                        type="text" disabled />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="phone">Teléfono</Label>
                                    <Input id="phone" value={custom.phone}
                                        type="text" disabled />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="email">Correo</Label>
                                    <Input id="email" value={custom.email}
                                        type="text" disabled />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}