import React, { Fragment } from 'react';
import { Table, Button } from 'reactstrap';

import ItemProduct from './ItemProduct';

class ListProducts extends React.Component {
  render() {
    let {
      edit,
      productinputs,
      productouts,
      addProduct,
      breakdown,
      decimal,
      ...functions
    } = this.props;

    return (
      <Fragment>
        <Table responsive bordered>
          <thead>
            <tr style={{ textAlign: 'center' }}>
              <th style={{ width: '9em' }}>Cantidad</th>
              <th>Nombre</th>
              <th style={{ width: '9em' }}>Precio unitario</th>
              {breakdown ? <th style={{ width: '5em' }}>Iva</th> : null}
              <th style={{ width: '9em' }}>Total</th>
              <th style={{ width: '1em' }}></th>
            </tr>
          </thead>
          <tbody>
            {productouts.length > 0
              ? productouts.map((product, i) => (
                  <ItemProduct
                    index={i}
                    product={product}
                    productinputs={productinputs}
                    breakdown={breakdown}
                    decimal={decimal}
                    {...functions}
                  />
                ))
              : null}
          </tbody>
        </Table>
        <Button onClick={addProduct} className="btn-transition" color="primary">
          Añadir producto
        </Button>
      </Fragment>
    );
  }
}

export default ListProducts;
