import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Form,
  FormGroup,
  Input,
  CustomInput,
  Button,
} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

class FormProduct extends Component {
  state = {
    unities: [],
    categories: [],
    form: {
      code: null,
      type_product: 1,
      name: null,
      unity_id: null,
      iva: 2,
      stock: '',
      price1: '',
    },
  };

  async componentDidMount() {
    tokenAuth(this.props.token);
    const {
      match: { params },
    } = this.props;
    if (params.id) {
      try {
        await clienteAxios
          .get('products/' + params.id)
          .then(({ data: { accounts, product, categories, unities } }) => {
            this.setState({ form: product, unities, categories, accounts });
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await clienteAxios
          .get('productscreate')
          .then(({ data: { unities, categories } }) => {
            this.setState({ unities, categories });
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  submit = async () => {
    const {
      match: { params },
    } = this.props;
    if (this.validate()) {
      tokenAuth(this.props.token);
      try {
        let { form } = this.state;
        if (form.id) {
          delete form.stock;
          await clienteAxios
            .put('products/' + params.id, form)
            .then((res) => this.props.history.push('/inventarios/productos'));
        } else {
          if (form.stock === '') {
            delete form.stock;
          }
          await clienteAxios
            .post('products', form)
            .then((res) => this.props.history.push('/inventarios/productos'));
        }
      } catch (error) {
        if (error.response.data.message === 'KEY_DUPLICATE') {
          alert('Ya existe un producto con ese código');
        }
        console.log(error);
      }
    }
  };

  validate = () => {
    let { code, name, price1 } = this.state.form;

    if (
      code === undefined ||
      name === undefined ||
      price1 === '' ||
      code.trim().length === 0 ||
      name.trim().length === 0 ||
      price1.trim().length === 0
    ) {
      alert('No puede quedar campo en blanco');
      return;
    }

    if (isNaN(price1.trim())) {
      alert('El precio solo debe contener numeros');
      return;
    }

    if (Number(price1.trim()) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
    return true;
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChangeNumber = (e) => {
    if (isNaN(e.target.value)) {
      alert('Solo se permite valor numérico');
      return;
    } else {
      this.handleChange(e);
    }
  };

  handleChangeCheck = (e) =>
    this.setState({ [e.target.name]: e.target.checked });

  selectAccount = (account, attribute) => {
    this.setState({
      form: {
        ...this.state.form,
        [attribute]: account.id,
      },
    });
  };

  selectCategory = (id) => {
    this.setState({
      form: {
        ...this.state.form,
        category_id: id,
      },
    });
  };

  render() {
    var { form } = this.state;

    return (
      <Fragment>
        <PageTitle
          heading="Producto"
          subheading="Registro de producto"
          icon="pe-7s-note2 icon-gradient bg-mean-fruit"
        />
        <ReactCSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <Row>
            <Col lg="12">
              <Card className="main-card mb-3">
                <CardBody>
                  <Form className="text-right">
                    <Row form>
                      <p className="mt-2">
                        <strong>Nota:</strong> Todos los campos son obligatorios
                      </p>
                    </Row>
                    <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                      <strong className="mt-2">Datos generales</strong>
                    </Row>
                    <Row form>
                      <Col sm={6}>
                        <FormGroup className="mb-1" row>
                          <Label for="code" sm={4}>
                            Código
                          </Label>
                          <Col sm={6}>
                            <Input
                              bsSize="sm"
                              onChange={this.handleChange}
                              value={form.code}
                              type="text"
                              name="code"
                              id="code"
                              maxLength={25}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                          <Label for="type_product" sm={4}>
                            Tipo
                          </Label>
                          <Col sm={6}>
                            <CustomInput
                              bsSize="sm"
                              onChange={this.handleChange}
                              value={form.type_product}
                              type="select"
                              name="type_product"
                              id="type_product"
                            >
                              <option value={1}>Producto</option>
                              <option value={2}>Servicio</option>
                            </CustomInput>
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-1" row>
                          <Label for="name" sm={4}>
                            Nombre
                          </Label>
                          <Col sm={6}>
                            <Input
                              bsSize="sm"
                              onChange={this.handleChange}
                              value={form.name}
                              type="text"
                              name="name"
                              id="name"
                              maxLength={300}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-1" row>
                          <Label for="price1" sm={4}>
                            Precio
                          </Label>
                          <Col sm={6}>
                            <Input
                              bsSize="sm"
                              onChange={this.handleChangeNumber}
                              value={form.price1}
                              type="text"
                              name="price1"
                              id="price1"
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup
                          className="mb-1"
                          row
                          hidden={!this.props.inventory}
                        >
                          <Label for="stock" sm={4}>
                            Stock
                          </Label>
                          <Col sm={6}>
                            <Input
                              bsSize="sm"
                              onChange={this.handleChangeNumber}
                              value={form.stock}
                              type="text"
                              name="stock"
                              id="stock"
                              disabled={form.id}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                      <strong className="mt-2">Impuestos</strong>
                    </Row>
                    <Row form>
                      <Col md={4}>
                        <FormGroup row>
                          <Label for="iva" sm={4}>
                            Imp. al IVA
                          </Label>
                          <Col sm={7}>
                            <CustomInput
                              bsSize="sm"
                              onChange={this.handleChange}
                              value={form.iva}
                              type="select"
                              name="iva"
                              id="iva"
                            >
                              <option value={2}>Iva 12%</option>
                              <option value={0}>Iva 0%</option>
                              <option value={6}>No objeto de Iva</option>
                            </CustomInput>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button onClick={this.submit} color="primary" type="button">
                      Guardar
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ReactCSSTransitionGroup>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.AuthReducer.token,
  inventory: state.AuthReducer.inventory,
});

export default connect(mapStateToProps)(FormProduct);
