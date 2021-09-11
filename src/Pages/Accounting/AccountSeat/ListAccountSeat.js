import React from 'react'
import { Input, InputGroup, Button } from 'reactstrap'
import SelectAccount from '../../Components/Modal/SelectAccount'

class ListAccountSeat extends React.Component {

    selectAccount = (account, attribute) => {
        let { selectAccount, index } = this.props
        selectAccount(account, index)
    }

    handleChangeSeat = e => {
        let { handleChangeSeat, index } = this.props
        handleChangeSeat(e, index)
    }

    render() {

        let { accountingseat, deleteSeat, index, accounts, id } = this.props

        return (
            <tr>
                <td>
                    <InputGroup>
                        <SelectAccount
                            value="chart_account_id"
                            //id of chart_account 
                            id={id}
                            filter=''
                            accounts={accounts}
                            selectAccount={this.selectAccount}
                        />
                    </InputGroup>
                </td>
                <td><Input bsSize="sm" onChange={this.handleChangeSeat} type="number" name="debit" value={accountingseat.debit} /></td>
                <td><Input bsSize="sm" onChange={this.handleChangeSeat} type="number" name="have" value={accountingseat.have} /></td>
                <td>
                    <Button size="sm" onClick={() => deleteSeat(index)} className="mr-2 btn-transition" color="danger">
                        <i className="nav-link-icon lnr-trash"></i>
                    </Button>
                </td>
            </tr>
        )
    }
}

export default ListAccountSeat