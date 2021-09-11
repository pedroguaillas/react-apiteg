import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import {
    Modal, ModalHeader, ModalBody, FormGroup, Label, Input, ModalFooter, Button
} from 'reactstrap';

class AddChartAccount extends Component {

    render() {

        let { handleChange, modal, toggle, account, form, submit } = this.props

        return (
            <Fragment>
                <Modal
                    isOpen={modal}
                    toggle={toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={toggle}>Agregar cuenta</ModalHeader>
                    <ModalBody>
                        <p><strong>Grupo:</strong> {account.account} {account.name}</p>
                        <FormGroup>
                            <Label for="name">Cuenta a crear: {form.account}</Label>
                            <Input type="text" onChange={handleChange} value={form.name} name="name" id="name" />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" onClick={submit} className="btn primary">Guardar</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    token: state.AuthReducer.token
});

export default connect(mapStateToProps)(AddChartAccount);