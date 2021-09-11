import React, { Component, Fragment } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

class SelectCustomer extends Component {

    state = { modal: false }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id > 0) {
            this.setState((state, props) => ({
                item: (props.customers.lenght !== 0) ? props.customers.filter(customer => customer.id === props.id)[0].name : ''
            }))
        }
    }

    selectCustomer = (item) => {
        this.props.selectCustomer(item.id)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {

        let { customers } = this.props

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
                    <ModalHeader toggle={this.toggle}>Seleccionar cliente</ModalHeader>
                    <ModalBody>
                        {customers === null ? null :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>Identificación</th>
                                        <th>Nombre / Razón social</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, index) => (
                                        <tr key={index}>
                                            <td scope="row">{customer.identication}</td>
                                            <td onClick={() => this.selectCustomer(customer)}>
                                                <a href="javascript:void(0);" className="alert-link">{customer.name}</a>
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

export default SelectCustomer