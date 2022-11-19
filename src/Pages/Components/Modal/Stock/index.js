import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Col,
  CustomInput,
  Row,
  Input,
  Form,
} from 'reactstrap';

class Stock extends Component {
  render = () => {
    let {
      modal,
      toggle,
      product,
      inventori,
      onChangeInventoriNumber,
      onChangeInventoriType,
      submit,
    } = this.props;
    if (product === null) {
      return null;
    }

    return (
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={this.props.className}
        size={this.props.size}
        centered={true}
      >
        <ModalHeader toggle={toggle}>Modificar stock</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup className="mb-1" row>
              <Label style={{ 'font-weight': 'bold' }} for="code" sm={3}>
                Código:
              </Label>
              <Label sm={4}> {product.atts.code} </Label>
            </FormGroup>
            <FormGroup className="mb-1" row>
              <Label style={{ 'font-weight': 'bold' }} for="name" sm={3}>
                Nombre:
              </Label>
              <Col sm={8}>{product.atts.name}</Col>
            </FormGroup>
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col>
                <Label className="visually-hidden" for="stock">
                  <strong>Stock: </strong> &nbsp;{' '}
                  {product.atts.stock === null ? 0 : product.atts.stock}
                </Label>
              </Col>
              <Col>
                <Label className="visually-hidden" for="newStock">
                  <strong>Nuevo stock:</strong> &nbsp;
                  {product.atts.stock === null && inventori.quantity === ''
                    ? 0
                    : (product.atts.stock === null ? 0 : product.atts.stock) +
                      Number(
                        inventori.quantity === ''
                          ? 0
                          : inventori.type === 'Compra' ||
                            inventori.type === 'Devolución en venta'
                          ? inventori.quantity
                          : inventori.quantity * -1
                      )}
                </Label>
              </Col>
            </Row>
            <FormGroup className="mb-1" row>
              <Label for="type" style={{ 'font-weight': 'bold' }} sm={5}>
                Tipo de movimiento:
              </Label>
              <Col sm={7}>
                <CustomInput
                  bsSize="sm"
                  onChange={onChangeInventoriType}
                  value={inventori.type}
                  type="select"
                  id="type"
                  name="type"
                  // requiered
                >
                  <option value="Compra">Compra (+)</option>
                  <option value="Venta">Venta (-)</option>
                  <option value="Devolución en compra">
                    Devolución de compra (-)
                  </option>
                  <option value="Devolución en venta">
                    Devolución de venta (+)
                  </option>
                </CustomInput>
              </Col>
            </FormGroup>
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col>
                <Label
                  className="visually-hidden"
                  style={{ 'font-weight': 'bold' }}
                  for="quantity"
                >
                  Cantidad:
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="text"
                  maxLength={8}
                  value={inventori.quantity}
                  onChange={onChangeInventoriNumber}
                />
              </Col>
              <Col>
                <Label
                  className="visually-hidden"
                  style={{ 'font-weight': 'bold' }}
                  for="price"
                >
                  Precio:
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="text"
                  maxLength={8}
                  value={inventori.price}
                  onChange={onChangeInventoriNumber}
                />
              </Col>
            </Row>
            <Row className="row-cols-lg-auto g-3 align-items-center mt-4">
              <Col>
                <Label className="visually-hidden" for="stock">
                  <strong>Total {inventori.type}: </strong> &nbsp; $
                  {inventori.quantity === '' || inventori.price === ''
                    ? 0
                    : (inventori.quantity * inventori.price).toFixed(2)}
                </Label>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-transition" color="primary" onClick={submit}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
}

// const mapStateToProps = (state) => ({
//   token: state.AuthReducer.token,
// });

// export default connect(mapStateToProps)(Stock);
export default Stock;
