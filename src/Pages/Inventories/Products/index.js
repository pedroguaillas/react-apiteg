import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  InputGroup,
  Table,
  Input,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import Paginate from '../../Components/Paginate/Index';
import Stock from '../../Components/Modal/Stock';

class Products extends Component {
  state = {
    dropdowns: [],
    products: null,
    links: null,
    meta: null,
    search: '',
    modal: false,
    product: null,
    inventori: {},
  };

  handleDrops = (index) => {
    let { dropdowns } = this.state;
    dropdowns[index] = !dropdowns[index];
    this.setState({ dropdowns });
  };

  async componentDidMount() {
    tokenAuth(this.props.token);
    let { search } = this.state;
    try {
      await clienteAxios
        .post('productlist', { search })
        .then(({ data: { data, links, meta } }) => {
          this.setState({
            products: data,
            links,
            meta,
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  reqNewPage = async (e, page) => {
    e.preventDefault();

    let { search, meta } = this.state;

    if (page !== null) {
      tokenAuth(this.props.token);
      try {
        await clienteAxios
          .post(`${meta.path}?page=${page.substring(page.indexOf('=') + 1)}`, {
            search,
          })
          .then(({ data: { data, links, meta } }) => {
            this.setState({
              ...this.state,
              products: data,
              links,
              meta,
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  reloadPage = async () => {
    let { current_page } = this.state.meta
    if (current_page !== null) {
        tokenAuth(this.props.token);
        let { search , meta:{path}} = this.state
        try {
            await clienteAxios.post(`${path}?page=${current_page}`, { search })
                .then(({data:{ data, links, meta }}) => {
                    this.setState({
                        products: data,
                        links,
                        meta,
                    })
                })
        } catch (error) { console.log(error) }
    }
}

  importProducts = () => document.getElementById('file_csv').click();

  handleSelectFile = (e) => {
    let input = e.target;

    let reader = new FileReader();
    reader.onload = () => this.uploadCsv(reader.result);
    reader.readAsText(input.files[0], 'ISO-8859-1');
  };

  uploadCsv = (csv) => {
    let lines = csv.split(/\r\n|\n/);
    let products = [];
    let i = 0;
    for (let line in lines) {
      if (i > 0 && lines[line].length > 0) {
        let words = lines[line].split(';');
        let object = {
          code: words[0].trim(),
          type_product: words[1].trim(),
          name: words[2].trim(),
          unity_id: words[3] !== undefined ? words[3].trim() : null,
          price1: words[4],
          price2: words[5] !== undefined ? words[5].trim() : null,
          price3: words[6] !== undefined ? words[6].trim() : null,
          iva: words[7],
        };
        products.push(object);
      }
      i++;
    }
    this.saveProductsFromCsv(products);
  };

  saveProductsFromCsv = async (products) => {
    let data = { products };

    tokenAuth(this.props.token);
    try {
      await clienteAxios
        .post('products_import', data)
        .then(({ data: { data, links, meta } }) => {
          this.setState({
            products: data,
            links,
            meta,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  onChangeSearch = async (e) => {
    tokenAuth(this.props.token);
    let { value } = e.target;

    try {
      await clienteAxios
        .post('productlist', { search: value })
        .then(({ data: { data, links, meta } }) => {
          this.setState({
            search: value,
            products: data,
            links,
            meta,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = () => this.props.history.push('/inventarios/nuevoproducto');

  //Mostrar y cerrar la modal
  toggle = () => this.setState((state) => ({ modal: !state.modal }));

  editStock = (product) => {
    this.setState({
      product,
      inventori: { type: 'Compra', quantity: '', price: '' },
      modal: true,
    });
  };

  // Cuando el tipo cambia de estado se reinicia la cantidad
  onChangeInventoriType = (e) => {
    this.setState({
      inventori: {
        ...this.state.inventori,
        type: e.target.value,
        quantity: '',
      },
    });
  };

  onChangeInventoriNumber = (e) => {
    if (isNaN(e.target.value)) {
      alert('Solo se permite el ingreso del valor numérico');
      return;
    } else {
      let {
        inventori: { type },
        product: {
          atts: { stock },
        },
      } = this.state;
      let quantity = e.target.value;
      //Utilizamos para válidar cuando se seleccione el precio
      if (e.target.name === 'price') {
        this.onChangeInventori(e);
        return;
      }
      //Utilizamos para válidar cuando se modifique la cantidad y el tipo sea compra o devolución en venta
      if (type === 'Compra' || type === 'Devolución en venta') {
        this.onChangeInventori(e);
        return;
      }
      //Utilizamos para válidar cuando se modifique la cantidad y el tipo sea venta o devolución en compra
      if (quantity === '') {
        quantity = 0;
      }
      if (Number(quantity) > Number(stock)) {
        alert('El nuevo stock no puede ser negativo');
        return;
      } else {
        this.onChangeInventori(e);
      }
    }
  };
  //Utilizado para cambiar el estado de la función anterior
  onChangeInventori = (e) => {
    this.setState({
      inventori: {
        ...this.state.inventori,
        [e.target.name]: e.target.value,
      },
    });
  };

  submit = async () => {
    let { inventori, product } = this.state;
    inventori.product_id = product.id;

    if (inventori.quantity === '' || inventori.price === '') {
      alert('La cantidad y precio son obligatorios');
      return;
    }
    tokenAuth(this.props.token);
    try {
      await clienteAxios.post('inventories', this.state.inventori).then(() => {
        this.setState({
          product: null,
          modal: false,
          inventori: {},
        });
        this.reloadPage();
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let {
      products,
      links,
      meta,
      search,
      dropdowns,
      modal,
      product,
      inventori,
    } = this.state;

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              type: 'button',
              id: 'tooltip-import-contact',
              action: this.importProducts,
              icon: 'import',
              msmTooltip: 'Importar productos',
              color: 'success',
            },
            {
              type: 'button',
              id: 'tooltip-add-product',
              action: this.addProduct,
              icon: 'plus',
              msmTooltip: 'Agregar producto',
              color: 'primary',
            },
          ]}
          heading="Productos"
          subheading="Lista de todos los productos"
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
          <Stock
            modal={modal}
            toggle={this.toggle}
            product={product}
            inventori={inventori}
            onChangeInventoriNumber={this.onChangeInventoriNumber}
            onChangeInventoriType={this.onChangeInventoriType}
            submit={this.submit}
          />
          <Row>
            <Col lg="12" className="mb-4">
              <Card>
                <div className="card-header">
                  Busqueda
                  <div className="btn-actions-pane-right">
                    <Form className="text-right">
                      <InputGroup size="sm">
                        <Input
                          value={search}
                          onChange={this.onChangeSearch}
                          placeholder="Buscar"
                          className="search-input"
                        />
                      </InputGroup>
                    </Form>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Input
            onChange={this.handleSelectFile}
            style={{ display: 'none' }}
            type="file"
            name="contactscsv"
            id="file_csv"
            accept=".csv"
          />

          {products === null ? (
            <p>Cargando ...</p>
          ) : products.length < 1 ? (
            <p>No existe productos empiece por agregar el primer producto</p>
          ) : (
            <Row>
              <Col lg="12">
                <Card className="main-card mb-3">
                  <CardBody>
                    <Table striped size="sm" responsive>
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>iva</th>
                          <th style={{ width: '1em' }}></th>
                        </tr>
                      </thead>

                      <tbody>
                        {products.map((product, index) => (
                          <tr key={index}>
                            <td>{product.atts.code}</td>
                            <td>{product.atts.name}</td>
                            <td>
                              $
                              {Number(
                                product.atts.price1 !== null
                                  ? product.atts.price1
                                  : 0
                              ).toFixed(2)}
                            </td>
                            <td>
                              {product.atts.iva == 0
                                ? '0%'
                                : product.atts.iva == 2
                                ? '12%'
                                : 'no iva'}
                            </td>
                            <td>
                              <ButtonDropdown
                                direction="left"
                                isOpen={dropdowns[index]}
                                toggle={() => this.handleDrops(index)}
                              >
                                <DropdownToggle caret></DropdownToggle>
                                <DropdownMenu>
                                  {this.props.inventory ? (
                                    <DropdownItem
                                      onClick={() => this.editStock(product)}
                                    >
                                      Modificar stock
                                    </DropdownItem>
                                  ) : null}
                                  <Link
                                    to={'/inventarios/producto/' + product.id}
                                  >
                                    <DropdownItem>Editar</DropdownItem>
                                  </Link>
                                </DropdownMenu>
                              </ButtonDropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <Paginate
                      links={links}
                      meta={meta}
                      reqNewPage={this.reqNewPage}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </ReactCSSTransitionGroup>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.AuthReducer.token,
  inventory:state.AuthReducer.inventory
});

export default connect(mapStateToProps)(Products);
