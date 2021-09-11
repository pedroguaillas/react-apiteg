import React, { Component, Fragment } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

class SelectContact extends Component {

    state = { modal: false }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id > 0) {
            this.setState((state, props) => ({
                item: (props.contacts.lenght !== 0) ? props.contacts.filter(contact => contact.id === props.id)[0].company : ''
            }))
        }
    }

    selectContact = (item) => {
        this.props.selectContact(item.id)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {
        let { contacts } = this.props
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
                    <ModalHeader toggle={this.toggle}>Seleccionar contacto</ModalHeader>
                    <ModalBody>
                        {contacts === null ? '' :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>Cédula</th>
                                        <th>Ruc</th>
                                        <th>Razón social</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((item, index) => (
                                        <tr key={index}>
                                            <td scope="row">{item.identication_card}</td>
                                            <td scope="row">{item.ruc}</td>
                                            <td onClick={() => this.selectContact(item)}>
                                                <a href="javascript:void(0);" className="alert-link">{item.company}</a>
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

export default SelectContact