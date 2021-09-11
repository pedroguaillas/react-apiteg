import React, { Fragment } from 'react';
import { Table, Button } from 'reactstrap';

import ItemProduct from './ItemProduct';

class ListProducts extends React.Component {

    render() {

        const { productinputs, productouts,
            addProduct, ...functions } = this.props

        return (
            <Fragment>
                <Table bordered>
                    <thead>
                        <tr>
                            <th style={{ 'width': '10em' }}>Cantidad</th>
                            <th>Nombre</th>
                            <th style={{ 'width': '10em' }}>Costo unitario</th>
                            <th>Costo total</th>
                            <th style={{ 'width': '2em' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (productouts.length > 0) ? (productouts.map((product, i) => (
                                <ItemProduct
                                    index={i}
                                    id={product.product_id}
                                    quantity={product.quantity}
                                    price={product.price}
                                    stock={product.stock}
                                    productinputs={productinputs}
                                    {...functions}
                                />
                            )
                            )) : null
                        }
                    </tbody>
                </Table>
                <Button onClick={addProduct} className="mr-2 btn-transition" color="primary">
                    <i className="nav-link-icon pe-7s-plus"></i>Agregar producto
                </Button>
            </Fragment>
        )
    }
}

export default ListProducts;