import React from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Table,
    Row, Col, Form, FormGroup, Label, Input
} from 'reactstrap'
import { API_BASE_URL } from '../../../config/config'
import RetentionForm from './RetentionForm'

class RetentionModal extends React.Component {

    state = {
        id: 0,
        taxes: [],
        taxes_request: null,
        modal: false
    }

    componentDidMount() {
        let sale_id = this.props.sale_id
        this.setState({ sale_id })
        fetch(API_BASE_URL + 'retentionsales/' + sale_id)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    id: response.retentionSale !== null ? response.retentionSale.id : 0,
                    serie: response.retentionSale !== null ? response.retentionSale.serie : '',
                    date: response.retentionSale !== null ? response.retentionSale.date : new Date().toISOString().substring(0, 10),
                    taxes: response.retentionSale !== null ? response.retentionSaleitems : [],
                    taxes_request: response.taxes
                })
            })
    }

    //Handle change global 
    handleChange = e => {
        //if (e.target.validity.valid) {
        this.setState({ [e.target.name]: e.target.value })
        //}
    }

    //add tax to table taxes
    addTax = (form) => {
        let { taxes } = this.state
        taxes.push(form)
        this.setState({ taxes })
    }

    submit = () => {
        fetch(API_BASE_URL + 'retentionsales', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state)
        })
            .then(response => {
                if (response.ok) {
                    this.toggle()
                }
            })
            .catch(error => console.log(error))
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render() {

        return (
            <div className="d-inline-block mb-2 mr-2">
                <Button color="primary" onClick={this.toggle}>
                    Retención
                </Button>
                {/* <div className="ml-4" onClick={this.toggle}>Retención</div> */}
                {/* <DropdownItem onClick={() => this.toggle}>Retención</DropdownItem> */}
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={this.toggle}>Datos de la Retención</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>*Nº de comprobante (Ejemplo: 001001000000001)</Label>
                                        <Input id="serie" onChange={this.handleChange} value={this.state.serie} type="text"
                                            pattern="^[1-9]*$" name="serie" maxLength="15" />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>*Fecha de emisión</Label>
                                        <Input id="date" onChange={this.handleChange} value={this.state.date} type="date" name="date" />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                        <div className="divider" />
                        <h5>Agregar impuesto venta</h5>
                        <RetentionForm
                            addTax={this.addTax}
                            sale_id={this.props.sale_id}
                            taxes={this.state.taxes_request}
                        />
                        {/* <h5>Impuestos</h5> */}
                        <Table className="mt-3 mb-0" bordered>
                            <thead>
                                <tr>
                                    <th>Impuesto</th>
                                    <th>Retención</th>
                                    <th>Base Imp</th>
                                    <th>Porcentaje</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.taxes.length === 0 ? '' :
                                        this.state.taxes.map(tax => (
                                            <tr>
                                                <td>{tax.code === 1 ? 'IVA' : 'Imp. Renta'}</td>
                                                <td>{tax.tax_code}</td>
                                                <td>{`$${tax.base}`}</td>
                                                <td>{`${tax.porcentage}%`}</td>
                                                <td>{`$${tax.value}`}</td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>Cancelar</Button>
                        <Button color="primary" onClick={this.submit}>Guardar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default RetentionModal