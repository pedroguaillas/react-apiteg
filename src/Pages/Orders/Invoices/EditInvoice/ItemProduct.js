import React, { Component } from 'react'
import { Button, Input } from 'reactstrap'
import SelectProduct from '../../../Components/Modal/SelectProduct'

class ItemProduct extends Component {

    render() {

        let { edit, index, product, handleChangeItem,
            productinputs, selectProduct
        } = this.props

        let sub_total = product.quantity * product.price
        let discount = sub_total * product.discount * .01

        return (
            <tr key={index}>
                <td>
                    <Input size="sm" onChange={handleChangeItem(index)} name="quantity" className="form-control" type="number"
                        value={product.quantity} min="0" required />
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
                    <Input size="sm" onChange={handleChangeItem(index)} name="price" className="form-control" type="number"
                        value={product.price} min={0} required />
                </td>
                <td>
                    <Input size="sm" onChange={handleChangeItem(index)} name="discount" className="form-control" type="number"
                        value={product.discount} min={0} max={100} required />
                </td>
                <td>${discount.toFixed(2)}</td>
                <td>${(sub_total - discount).toFixed(2)}</td>
            </tr>
        )
    }
}

export default ItemProduct