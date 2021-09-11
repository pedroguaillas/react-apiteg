import React, { Fragment } from 'react'
import { Table, Button } from 'reactstrap'

import ItemProduct from './ItemProduct'

class ListProducts extends React.Component {

    render() {

        let { edit, productinputs, productouts,
            addProduct, ...functions } = this.props

        return (
            <Fragment>
                <Table bordered>
                    <thead>
                        <tr style={{ 'textAlign': 'center' }}>
                            <th style={{ 'width': '9em' }}>Cantidad</th>
                            <th>Nombre</th>
                            <th style={{ 'width': '9em' }}>Costo unitario</th>
                            <th style={{ 'width': '9em' }}>Descuento (%)</th>
                            <th style={{ 'width': '9em' }}>Descuento ($)</th>
                            <th style={{ 'width': '9em' }}>Costo total</th>
                            <th style={{ 'width': '2em' }} hidden={edit}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (productouts.length > 0) ? (productouts.map((product, i) => (
                                <ItemProduct
                                    edit={edit}
                                    index={i}
                                    product={product}
                                    productinputs={productinputs}
                                    {...functions}
                                />
                            )
                            )) : null
                        }
                    </tbody>
                </Table>
                {
                    (edit === false) ?
                        (<Button onClick={addProduct} className="btn-transition" color="primary">
                            Añadir producto
                        </Button>)
                        : null
                }
            </Fragment>
        )
    }
}

export default ListProducts