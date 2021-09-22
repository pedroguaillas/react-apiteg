import React, { Component, Fragment } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

class SelectProvider extends Component {

    state = { modal: false }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id > 0) {
            this.setState((state, props) => ({
                item: (props.providers.lenght !== 0) ? props.providers.filter(provider => provider.id === props.id)[0].name : ''
            }))
        }
    }

    selectProvider = (item) => {
        this.props.selectProvider(item.id)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {
        let { providers } = this.props
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
                    <ModalHeader toggle={this.toggle}>Seleccionar providero</ModalHeader>
                    <ModalBody>
                        {providers === null ? null :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>identicación</th>
                                        <th>Razón social</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {providers.map((item, index) => (
                                        <tr key={index}>
                                            <td scope="row">{item.identication}</td>
                                            <td onClick={() => this.selectProvider(item)}>
                                                <a href="javascript:void(0);" className="alert-link">{item.name}</a>
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

export default SelectProvider