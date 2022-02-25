import React, { Component } from 'react'
import { Button, Input } from 'reactstrap'
import SelectProduct1 from '../../../Components/Modal/SelectProduct1'

class ItemProduct extends Component {

    render() {

        let { edit, index, product, handleChangeItem,
            productinputs, selectProduct, deleteProduct, format
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
                    <SelectProduct1
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
                <td>{format(discount)}</td>
                <td>{format(sub_total - discount)}</td>
                <td>
                    <Button size="sm" onClick={() => deleteProduct(index)} className="mr-2 btn-transition" color="danger">
                        <i className="nav-link-icon lnr-trash"></i>
                    </Button>
                </td>
            </tr>
        )
    }
}

export default ItemProduct