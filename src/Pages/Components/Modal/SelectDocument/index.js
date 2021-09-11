import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux';
import {
    Button, Modal, ModalHeader, ModalBody,
    InputGroup, Input, InputGroupAddon, Table
} from 'reactstrap'

import clienteAxios from '../../../../config/axios';
import tokenAuth from '../../../../config/token';

class SelectDocument extends Component {

    state = {
        documents: [],
        modal: false
    }

    selectDocRelated = (item) => {
        this.setState({ item: item.serie })
        this.props.selectDocRelated(item)
        this.setState(state => ({ modal: !state.modal }))
    }

    //Show & hidden modal
    toggle = () => {
        if (this.props.contact_id > 0) {
            this.setState(state => ({ modal: !state.modal }))
            this.getDocuments()
        } else {
            alert('Primero debe seleccionar el contacto')
        }
    }

    getDocuments = async () => {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get(`vouchersbycontact/${this.props.contact_id}`)
                .then(response => {
                    this.setState({
                        documents: response.data.documents
                    })
                })
        } catch (error) {
            console.log(error)
        }
    }

    render = () => {

        let { item, documents } = this.state

        return (
            <Fragment>
                <InputGroup size="sm">
                    <Input value={item} placeholder="..." />
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
                    <ModalHeader toggle={this.toggle}>Seleccionar Documento Relacionado</ModalHeader>
                    <ModalBody>
                        {documents.length === 0 ? null :
                            (<Table className="mb-0" bordered>
                                <thead>
                                    <tr style={{ 'text-align': 'center' }}>
                                        <th>Documento</th>
                                        <th>Fecha de emisión</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((item, index) => (
                                        <tr key={index}>
                                            <td onClick={() => this.selectDocRelated(item)}>
                                                <a href="javascript:void(0);" className="alert-link">{`Fac ${item.serie}`}</a>
                                            </td>
                                            <td>{item.date}</td>
                                            <td>{item.state}</td>
                                            <td style={{ 'text-align': 'rigth' }}>{`$${item.total}`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>)
                        }
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(SelectDocument);