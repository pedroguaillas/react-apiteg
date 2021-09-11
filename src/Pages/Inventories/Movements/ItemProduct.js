import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import SelectProduct from '../../Components/Modal/SelectProduct';

class ItemProduct extends Component {

    render() {

        let { index, id, quantity, price, stock, handleChangeItem,
            productinputs, selectProduct, deleteProduct
        } = this.props;

        return (
            <tr>
                <td>
                    <Input size="sm" onChange={handleChangeItem(index)} name="quantity" className="form-control" type="number"
                        value={quantity} min="1" max={stock} required />
                </td>
                <td>
                    <SelectProduct
                        index={index}
                        id={id}
                        products={productinputs}
                        selectProduct={selectProduct}
                    />
                </td>
                <td>
                    <Input size="sm" onChange={handleChangeItem(index)} name="price" className="form-control" type="number"
                        value={price} min="0" required />
                </td>
                <td>$ {(quantity * price).toFixed(2)}</td>
                <td>
                    <Button size="sm" onClick={() => deleteProduct(index)} className="mr-2 btn-transition" color="danger">
                        <i className="nav-link-icon lnr-trash"></i>
                    </Button>
                </td>
            </tr>
        )
    }
}

export default ItemProduct;