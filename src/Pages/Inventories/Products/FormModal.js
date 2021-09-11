import React from 'react'
import { API_BASE_URL } from "../../../config/config"
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Col, Form, FormGroup, Label, Input, Row, CustomInput
} from 'reactstrap'

class ProductForm extends React.Component {

    state = {
        unities: [],
        form: {
            id: 0,
            code: '00',
            name: '',
            price1: '',
            price2: '',
            price3: '',
            iva: '',
            ice: '',
            irbpnr: '',
            stock: ''
        },
        modal: false
    }

    componentDidMount() {
        // this.getUnities()
        // if (this.props.product) {
        //     this.setState((state, props) => ({ form: props.product }))
        // }
    }

    getUnities = () => {
        fetch(API_BASE_URL + 'unities')
            .then(response => response.json())
            .then(unities => this.setState({ unities }))
    };

    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    submit = () => {
        let id = this.state.form.id
        fetch(API_BASE_URL + 'products', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.form)
        })
            .then(response => response.json())
            .then(product => {
                if (id === 0) {
                    this.props.addProduct(product)
                } else {
                    this.props.editProduct(product)
                }
                this.toggle()
            })
            .catch(error => console.log(error))
    }

    //Show & hidden modal
    toggle = () => this.setState(state => ({ modal: !state.modal }))

    render = () => {

        let { form } = this.state
        let { action } = this.props
        return (
            <div className="d-inline-block mb-2 mr-2">
                <Button outline={action === 'edit'} color="primary" onClick={this.toggle}>
                    {action === 'edit' ? <i className='nav-link-icon lnr-pencil'></i> : 'Agregar'}
                </Button>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    size={this.props.size ? this.props.size : 'lg'}
                >
                    <ModalHeader toggle={this.toggle}>Datos del producto</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Row form>
                                <p className='mt-2'>Nota: Los campos marcados con (*) son obligatorios</p>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="code">*Código</Label>
                                        <Input onChange={this.handleChange} value={form.code} type="text"
                                            name="code" id="code" maxLength="3" placeholder="00" />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="type_product">*Tipo</Label>
                                        <CustomInput onChange={this.handleChange} value={form.type_product}
                                            type="select" name="type_product" id="type_product" >
                                            <option value="">Seleccione</option>
                                            <option value="1">Producto</option>
                                            <option value="2">Servicio</option>
                                        </CustomInput>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="name">*Nombre</Label>
                                        <Input onChange={this.handleChange} value={form.name} type="text"
                                            name="name" id="name" />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="price1">*Precio 1</Label>
                                        <Input onChange={this.handleChange} value={form.price1} type="text"
                                            name="price1" id="price1" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="price2">Precio 2</Label>
                                        <Input onChange={this.handleChange} value={form.price2} type="text"
                                            name="price2" id="price2" />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="price3">Precio 3</Label>
                                        <Input onChange={this.handleChange} value={form.price3} type="text"
                                            name="price3" id="price3" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="unity_id">*Unidad</Label>
                                        <CustomInput onChange={this.handleChange} value={form.unity_id}
                                            name="unity_id" type="select" id="unity_id" >
                                            <option value="">Seleccione</option>
                                            {this.state.unities === null ? '' :
                                                this.state.unities.map(unity => (
                                                    <option value={unity.id}>{unity.unity}</option>
                                                ))
                                            }
                                        </CustomInput>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="stock">Stock</Label>
                                        <Input onChange={this.handleChange} value={form.stock} type="text"
                                            name="stock" id="stock" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                                <p className='mt-2'>Impuestos</p>
                            </Row>
                            <Row form>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="iva">*Imp. al Valor Agregado:</Label>
                                        <CustomInput onChange={this.handleChange} value={form.iva}
                                            type="select" name="iva" id="iva" >
                                            <option value="">Seleccione</option>
                                            <option value="2">Iva 12%</option>
                                            <option value="0">Iva 0%</option>
                                            <option value="6">No objeto de Iva</option>
                                        </CustomInput>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="ice">Imp. a los Consumos Esp:</Label>
                                        <CustomInput onChange={this.handleChange} value={form.ice}
                                            type="select" id="ice" name="ice">
                                            <option value="">Seleccione</option>
                                        </CustomInput>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="irbpnr">IRBPNR</Label>
                                        <CustomInput onChange={this.handleChange} value={form.irbpnr}
                                            type="select" name="irbpnr" id="irbpnr" >
                                            <option value="">Seleccione</option>
                                            <option value="5001">Botellas plasticas no retornables</option>
                                        </CustomInput>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="link" onClick={this.toggle}>Cancelar</Button>
                        <Button color="primary" onClick={this.submit}>Guardar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ProductForm