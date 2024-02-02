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
      enabledice
    } = this.props;
    return (
      <tr>
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
        <td>
          <Input
            size="sm"
            onChange={handleChangeItem(index)}
            name="discount"
            className="form-control"
            type="number"
            value={product.discount}
            min={0}
            required
          />
        </td>
        {breakdown ? (
          <td>{format(product.iva === 2 ? (product.quantity * product.price - product.discount) * 0.12 : 0)}</td>
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
            format(product.total_iva)
          )}
        </td>
        {enabledice ?
          <td>
            {product.ice !== undefined ? (
              <Input
                size="sm"
                onChange={handleChangeItem(index)}
                name="ice"
                className="form-control"
                type="number"
                value={product.ice}
                min={0}
                required
              />
            ) : null}
          </td>
          : null}
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
