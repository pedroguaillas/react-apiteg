import React, { Fragment } from 'react';
import { Table, Button } from 'reactstrap';

import ItemProduct from './ItemProduct';

class ListProducts extends React.Component {
  state = {
    enabledice: false
  }

  componentDidUpdate(preProps) {
    // Capturamos solo cuando se agrega un item
    if (preProps.productouts !== this.props.productouts) {
      let enabledice = this.props.productouts.filter(p => p.ice !== undefined).length > 0
      this.setState({ enabledice })
    }
  }

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

    let { enabledice } = this.state

    return (
      <Fragment>
        <Table responsive bordered>
          <thead>
            <tr style={{ textAlign: 'center' }}>
              <th style={{ width: '8em' }}>Cantidad</th>
              <th>Nombre</th>
              <th style={{ width: '8em' }}>Precio</th>
              <th style={{ width: '8em' }}>Descuento</th>
              {breakdown ? <th style={{ width: '5em' }}>IVA</th> : null}
              <th style={{ width: '8em' }}>Total</th>
              {enabledice ? <th style={{ width: '9em' }}>ICE</th> : null}
              <th style={{ width: '1em' }}></th>
            </tr>
          </thead>
          <tbody>
            {productouts.length > 0
              ? productouts.map((product, i) => (
                <ItemProduct
                  key={`producto${i}`}
                  index={i}
                  product={product}
                  productinputs={productinputs}
                  breakdown={breakdown}
                  enabledice={enabledice}
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
