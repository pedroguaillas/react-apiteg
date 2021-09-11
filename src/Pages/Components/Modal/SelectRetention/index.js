import React, { Component, Fragment } from 'react'
import '../scrollmodal.css'
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

class SelectRetention extends Component {

    state = { modal: false }

    componentDidMount() {
        this.setState((state, props) => ({
            item: (props.retentions.lenght !== 0 && props.tax_code > 0) ? props.retentions.filter(retention => retention.code === props.tax_code)[0].conception : ''
        }))
    }

    componentDidUpdate(prevProps) {
        if (this.props.tax_code !== prevProps.tax_code) {
            this.setState((state, props) => ({
                item: (props.tax_code !== '') ? props.retentions.filter(retention => retention.code === props.tax_code)[0].conception : ''
            }))
        }
    }

    selectRetention = (retention) => {
        let { index, selectRetention } = this.props
        selectRetention(retention, index)
        this.toggle()
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {
        let { retentions, code } = this.props
        let items = null

        if (code !== null) {
            items = retentions.filter(retention => Number(code) === 1 ? retention.type === 'iva' : retention.type === 'renta')
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
                        {items === null ? '' :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Cuenta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((retention, index) => (
                                        <tr key={index}>
                                            <td scope="row">{retention.code}</td>
                                            <td onClick={() => this.selectRetention(retention)}>
                                                <a href="javascript:void(0);" className="alert-link">{retention.conception}</a>
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

export default SelectRetention