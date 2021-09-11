import React, { Component, Fragment } from 'react'
import './scrollmodal.css'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap';

class SelectAccount extends Component {

    state = {
        modal: false
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id > 0) {
            this.setState((state, props) => ({
                item: (props.accounts.lenght !== 0) ? props.accounts.filter(account => account.id === props.id)[0].name : null
            }))
        }
    }

    selectAccount = (account) => {
        let { selectAccount, value } = this.props
        selectAccount(account, value)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {
        let { accounts, filter } = this.props
        let items = null

        if (accounts !== null) {
            items = accounts.filter(account => account.account.startsWith(filter))
        }

        return (
            <Fragment>
                <InputGroup size="sm">
                    <Input value={this.state.item} placeholder="..." />
                    <InputGroupAddon addonType="append">
                        <Button color="secondary" onClick={this.toggle}>
                            <i className='nav-link-icon lnr-magnifier'></i>
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={this.toggle}>Seleccionar cuenta</ModalHeader>
                    <ModalBody>
                        {items === null ? null :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Cuenta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((account, index) => (
                                        <tr key={index}>
                                            <td scope="row">{account.account}</td>
                                            <td onClick={() => this.selectAccount(account)}>
                                                <a href="javascript:void(0);" className="alert-link">{account.name}</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>)}
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

export default SelectAccount