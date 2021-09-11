import React from 'react'
import { Input, Button } from 'reactstrap'

export default class ItemProduct extends React.Component {

    render = () => {
        let { index, quantity, name, description, price, stock } = this.props
        return (
            <tr>
                <td><Input onChange={this.props.addQty(index)} name="quantity" className="form-control" type="number"
                    value={quantity} min="1" max={stock} required /></td>
                <td>{name}</td>
                <td>{description}</td>
                <td>${price}</td>
                <td>${this.props.round(quantity * price, 2)}</td>
                <td>
                    <Button onClick={() => this.props.handleDeleteProduct(index)} outline className="mr-2 btn-transition" color="danger">
                        <i className="nav-link-icon lnr-trash"></i>
                    </Button>
                </td>
            </tr>
        )
    }
}
