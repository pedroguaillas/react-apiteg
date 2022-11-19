import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import SelectProduct from '../../../Components/Modal/SelectProduct';

class ItemProduct extends Component {
  render() {
    let {
      index,
      product,
      handleChangeItem,
      productinputs,
      selectProduct,
      deleteProduct,
      format,
      breakdown,
      decimal,
    } = this.props;
    let sub_total = product.quantity * product.price;
    let discount = sub_total * product.discount * 0.01;

    return (
      <tr key={index}>
        <td>
          <Input
            size="sm"
            onChange={handleChangeItem(index)}
            name="quantity"
            className="form-control"
            type="number"
            value={product.quantity}
            min="0"
            required
          />
        </td>
        <td>
          <SelectProduct
            index={index}
            id={product.product_id}
            products={productinputs}
            selectProduct={selectProduct}
          />
        </td>
        <td>
          {breakdown ? (
            (+product.price).toFixed(decimal)
          ) : (
            <Input
              size="sm"
              onChange={handleChangeItem(index)}
              name="price"
              className="form-control"
              type="number"
              value={product.price}
              min={0}
              required
            />
          )}
        </td>
        {breakdown ? (
          <td>{format(product.price * (product.iva === 2 ? 0.12 : 0))}</td>
        ) : null}
        <td>
          {breakdown ? (
            <Input
              size="sm"
              onChange={handleChangeItem(index)}
              name="total_iva"
              className="form-control"
              type="number"
              value={product.total_iva}
              min={0}
              required
            />
          ) : (
            format(sub_total - discount)
          )}
        </td>
        <td>
          <Button
            size="sm"
            onClick={() => deleteProduct(index)}
            className="mr-2 btn-transition"
            color="danger"
          >
            <i className="nav-link-icon lnr-trash"></i>
          </Button>
        </td>
      </tr>
    );
  }
}

export default ItemProduct;
