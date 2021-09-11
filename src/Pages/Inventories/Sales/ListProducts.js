import React from 'react'
import { Row, Col, Card, CardBody, CardTitle, Table, Form, FormGroup } from 'reactstrap'

import SmartSearch from '../../Components/SmartSearch'
import ItemProduct from './ItemProduct'

export default class ListProducts extends React.Component {
    
    render() {

        const { products, addHandler, ...functions } = this.props

        return (
            <Row className="mt-4">
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <CardTitle>Productos</CardTitle>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Cantidad</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Precio unitario</th>
                                        <th>Precio total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (products.length > 0) ? (products.map((product, i) => (
                                            <ItemProduct
                                                index={i}
                                                quantity={product.quantity}
                                                name={product.name}
                                                description={product.description}
                                                price={product.price1}
                                                stock={product.stock}
                                                {...functions}
                                            />
                                        )
                                        )) : <p>...</p>
                                    }
                                </tbody>
                            </Table>
                            <Form className="typeahead form-row mt-4">
                                <FormGroup>
                                    <SmartSearch
                                        id="product"
                                        placeholder="Nombre del producto"
                                        msm="Escriba para cargar la sugerencia"
                                        url="products.findSmart"
                                        addItem={this.props.handleAddLineProduct}
                                    //addItem={this.loadProduct}
                                    />
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}
