import React, { Component, Fragment } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

class SelectCarrier extends Component {

    state = { modal: false }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id > 0) {
            this.setState((state, props) => ({
                item: (props.carriers.lenght !== 0) ? props.carriers.filter(carrier => carrier.id === props.id)[0].name : ''
            }))
        }
    }

    selectCarrier = (item) => {
        this.props.selectCarrier(item.id)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {

        let { carriers } = this.props

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
                    <ModalHeader toggle={this.toggle}>Seleccionar transportista</ModalHeader>
                    <ModalBody>
                        {carriers === null ? null :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>Identificación</th>
                                        <th>Nombre y Nombres / Razón social</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carriers.map((carrier, index) => (
                                        <tr key={index}>
                                            <td scope="row">{carrier.identication}</td>
                                            <td onClick={() => this.selectCarrier(carrier)}>
                                                <a href="javascript:void(0);" className="alert-link">{carrier.name}</a>
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

export default SelectCarrier