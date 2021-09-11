import React, { Fragment, Component } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

class SelectProduct extends Component {

    state = { modal: false }

    componentDidMount() {
        this.setState((state, props) => ({
            item: (props.products.lenght !== 0 && props.id > 0) ? props.products.filter(product => product.id === props.id)[0].name : ''
        }))
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id > 0) {
            this.setState((state, props) => ({
                item: (props.products.lenght !== 0) ? props.products.filter(product => product.id === props.id)[0].name : ''
            }))
        }
    }

    selectProduct = (item) => {
        this.props.selectProduct(item, this.props.index)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {
        let { products } = this.props
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
                    <ModalHeader toggle={this.toggle}>Seleccionar producto</ModalHeader>
                    <ModalBody>
                        {products === null ? '' :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Producto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item, index) => (
                                        <tr key={index}>
                                            <td scope="row">{item.code}</td>
                                            <td onClick={() => this.selectProduct(item)}>
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

export default SelectProduct