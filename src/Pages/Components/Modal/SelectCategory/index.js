import React, { Component, Fragment } from 'react'
import '../scrollmodal.css'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

class SelectCategory extends Component {

    state = { modal: false }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id > 0) {
            this.setState((state, props) => ({
                item: (props.categories.lenght !== 0) ? props.categories.filter(category => category.id === props.id)[0].category : ''
            }))
        }
    }

    selectCategory = (category) => {
        this.props.selectCategory(category.id)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {
        let { categories } = this.props

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
                    <ModalHeader toggle={this.toggle}>Seleccionar categoria</ModalHeader>
                    <ModalBody>
                        {categories === null ? '' :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>Categoria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category, index) => (
                                        <tr key={index}>
                                            <td onClick={() => this.selectCategory(category)}>
                                                <a href="javascript:void(0);" className="alert-link">{category.category}</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>)}
                    </ModalBody>
                </Modal>
            </Fragment>
        )
    }
}

export default SelectCategory