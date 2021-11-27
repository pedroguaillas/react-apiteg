import React, { Component } from 'react'
import { Button, Input } from 'reactstrap'
import SelectProduct from '../../../Components/Modal/SelectProduct'

class ItemProduct extends Component {

    render() {

        let { index, product, handleChangeItem,
            productinputs, selectProduct, deleteProduct
        } = this.props

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
                    <Button size="sm" onClick={() => deleteProduct(index)} className="mr-2 btn-transition" color="danger">
                        <i className="nav-link-icon lnr-trash"></i>
                    </Button>
                </td>
            </tr>
        )
    }
}

export default ItemProduct