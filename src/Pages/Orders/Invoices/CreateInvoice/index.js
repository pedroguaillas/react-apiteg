import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Row, Col, Card, CardBody, Table, Form, Button, Input,
  Label, FormGroup, CustomInput, CardText,
} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import ListProducts from './ListProducts';
import InfoDocument from './InfoDocument';
import Aditionals from './Aditionals';
import api from '../../../../services/api';

class CreateInvoice extends Component {
  constructor() {
    super();

    let date = new Date();
    date.setHours(date.getHours() - 5);
    date = date.toISOString().substring(0, 10);

    this.state = {
      form: {
        serie: 'Cree un punto de emisión',
        date,
        expiration_days: 0,
        no_iva: 0,
        base0: 0,
        base5: 0,
        base12: 0,
        base15: 0,
        iva: 0,
        ice: 0,
        sub_total: 0,
        discount: 0,
        total: 0,
        description: null,
        customer_id: 0,
        received: 0,
        doc_realeted: 0,
        voucher_type: 1,
        pay_method: null
      },
      customers: [],
      methodOfPayments: [],
      productinputs: [],
      productouts: [
        {
          product_id: 0,
          price: 0,
          quantity: 1,
          stock: 1,
          discount: 0,
          total_iva: 0,
        },
      ],
      taxes: [
        {
          code: null,
          tax_code: null,
          base: null,
          porcentage: null,
          value: 0,
          editable_porcentage: false,
        },
      ],
      aditionals: [],
      points: [],
      selectPoint: {},
      breakdown: false,
      loading: 'success',
    };
  }

  selectDocXml = (xmlDoc) => {
    let date = this._getTag(xmlDoc, 'fechaEmision');
    let newdate = new Date(
      parseInt(date.substring(6)),
      parseInt(date.substring(3, 5)),
      parseInt(date.substring(0, 2))
    )
      .toISOString()
      .substring(0, 10);
    this.setState({
      form: {
        ...this.state.form,
        serie:
          this._getTag(xmlDoc, 'estab') +
          '-' +
          this._getTag(xmlDoc, 'ptoEmi') +
          '-' +
          this._getTag(xmlDoc, 'secuencial'),
        date: newdate,
      },
    });
  };

  _getTag = (xmlDoc, tag) =>
    xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue;

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;
    if (params.id) {
      try {
        await api.get(`orders/${params.id}`)
          .then(({ data }) => {
            let { points, methodOfPayments } = data;
            let productouts = data.order_items
            productouts.forEach((po, i) => {
              productouts[i].total_iva = productouts[i].price * productouts[i].quantity - productouts[i].discount
              if (po.codice === null) {
                delete po.ice
              }
            })
            this.setState({
              productinputs: data.products,
              productouts,
              customers: data.customers,
              aditionals: data.order_aditionals,
              form: data.order,
              points,
              methodOfPayments
            });
          });
      } catch (error) {
        this.setState({ loading: 'error' })
        console.log(error);
      }
    } else {
      try {
        await api.get('orders/create').
          then(({ data }) => {
            let { points, methodOfPayments, pay_method } = data
            this.setState({
              form: {
                ...this.state.form,
                pay_method
              },
              methodOfPayments,
              points
            })
            if (points.length === 1 && points[0].point) this.selectSerie(points[0])
          });
      } catch (error) {
        this.setState({ loading: 'error' })
        console.log(error);
      }
    }
  }

  changePoint = (e) => {
    if (e.target.value === "") return
    let point = this.state.points.filter(p => p.id == parseInt(e.target.value))[0]
    if (point) this.selectSerie(point)
  }

  selectSerie = (point) => {
    let serie = point.store + '-' + point.point + '-'
    serie += ((this.state.form.voucher_type == 1 ? point.invoice : point.creditnote) + '').padStart(9, '0')
    this.setState({
      selectPoint: point,
      form: {
        ...this.state.form,
        serie
      },
    })
  }

  //Save sale
  submit = async (send) => {
    if (this.validate()) {
      let { form, productouts, aditionals, selectPoint } = this.state;
      form.products =
        productouts.length > 0
          ? productouts.filter((product) => product.product_id !== 0)
          : [];

      form.send = send;
      form.aditionals = aditionals;

      try {
        document.getElementById('btn-save').disabled = true;
        document.getElementById('btn-save-send').disabled = true;

        if (form.id) {
          await api
            .put(`orders/${form.id}`, form)
            .then((res) => this.props.history.push('/ventas/facturas'));
        } else {
          form.point_id = selectPoint.id
          await api
            .post('orders', form)
            .then((res) => this.props.history.push('/ventas/facturas'));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Validate data to send save
  validate = () => {
    let { form, productouts, selectPoint } = this.state;

    // Validar exista un punto de emision seleccionada
    if (form.id === undefined && selectPoint.id === undefined) {
      alert('Seleccione un punto de emisión');
      return;
    }

    // Validar que se selecciono un cliente
    if (form.customer_id === 0) {
      alert('Seleccione el cliente');
      return;
    }

    // Validar cuando es factura
    if (form.voucher_type === 1) {
      if (form.guia && form.guia.length < 17) {
        alert(
          'La "Guia de Remisión" debe contener el siguiente formato 000-000-000000000'
        );
        return;
      }
    } else {
      // Validar 3 campos que no sean nulos cuando es N/C
      if (form.date_order === undefined) {
        alert('Es obligatorio la "Emisión factura" para Nota de Crédito');
        return;
      }
      if (form.serie_order === undefined || form.serie_order.length < 17) {
        alert(
          'Es obligatorio la "Serie factura" y debe tener el siguiente formato 000-000-000000000'
        );
        return;
      }
      if (form.reason === undefined || form.reason.length < 3) {
        alert(
          'Es obligatorio el "Motivo" y debe contener almenos 3 caracteres'
        );
        return;
      }
    }

    // Validar que se registren productos
    if (productouts.length === 0) {
      alert('Debe seleccionar almenos un producto');
      return;
    }

    let i = 0;
    // Products length siempre va ser mayor a cero por que se valido en la condicion anterior
    while (i < productouts.length) {
      if (productouts[i].product_id === 0) {
        alert('No puedes dejar un item vacio de los productos');
        return;
      }
      if (productouts[i].quantity === '') {
        alert('La "Cantidad" del producto debe tener un valor');
        return;
      }
      if (productouts[i].price === '') {
        alert('El "Precio" del producto debe tener un valor');
        return;
      }
      if (productouts[i].discount === '') {
        alert('El "Descuento" del producto debe tener un valor');
        return;
      }
      if (productouts[i].ice !== undefined && productouts[i].ice === '') {
        alert('El "ICE" del producto debe tener un valor');
        return;
      }
      i++;
    }

    return true;
  };

  //Info sale handle
  handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'voucher_type') {
      let voucher_type = Number(value);
      let { selectPoint, form: { serie } } = this.state;

      if (selectPoint.id) {
        let type = voucher_type == 1 ? selectPoint.invoice : selectPoint.creditnote
        serie = `${serie.substring(0, 8)}${(type + '').padStart(9, '0')}`
      }

      this.setState({
        form: {
          ...this.state.form,
          serie,
          voucher_type,
        },
      });
    } else {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    }
  };

  //Add customer
  selectCustomer = (customer_id) => {
    this.setState({
      form: {
        ...this.state.form,
        customer_id,
      },
    });
  };

  //................Products
  //Only add line for add product
  addProduct = () => {
    let { productouts } = this.state;
    productouts.push({
      product_id: 0,
      price: 0,
      quantity: 1,
      stock: 1,
      discount: 0,
      total_iva: 0,
    });
    this.setState({ productouts });
  };

  //add product when select product from de list modal
  selectProduct = (product, index) => {
    if (
      this.state.productouts.find((p) => p.product_id === product.id) ===
      undefined
    ) {
      let productouts = this.state.productouts.map((item, i) => {
        if (index === i) {
          item.product_id = product.id;
          item.price = parseFloat(product.atts.price1);
          item.quantity = 1;
          item.discount = 0;
          item.stock = product.stock > 0 ? product.stock : 1;
          item.total_iva = parseFloat(product.atts.price1);
          if (product.atts.ice !== null) {
            item.ice = '';
          }
          item.iva = product.iva.code
          item.percentage = product.iva.percentage
        }
        return item;
      });

      this.recalculate(productouts);
    } else {
      alert('Ya esta el producto en la lista');
    }
  };

  //Delete product
  deleteProduct = (product_id) => {
    const productouts = this.state.productouts.filter(product => product.product_id !== product_id)
    this.recalculate(productouts)
  }

  //add quatity to product
  handleChangeItem = (index) => (e) => {
    let { name, value } = e.target;
    if (value < 0) return
    let { productouts } = this.state;
    productouts[index][name] = value
    let { price, quantity, discount, percentage } = productouts[index]
    price = price === '' ? 0 : price;
    quantity = quantity === '' ? 0 : quantity;
    discount = discount === '' ? 0 : discount;
    if (name === 'total_iva') {
      productouts[index].price = parseFloat((value / quantity / (1 + (percentage / 100))).toFixed(this.props.decimal))
    } else if (name !== 'ice') {
      productouts[index].total_iva = price * quantity - discount
    }
    this.recalculate(productouts);
  };

  //Method caculate totals & modify state all.
  recalculate = (productouts) => {
    let no_iva = 0;
    let base0 = 0;
    let base5 = 0;
    let base12 = 0;
    let base13 = 0;
    let base15 = 0;
    let totalDiscount = 0;
    let totalIce = 0;

    productouts.forEach(({ quantity, price, discount, iva, total_iva, ice }) => {
      totalIce += ice !== undefined ? Number(ice) : 0
      totalDiscount += discount !== '' ? Number(discount) : 0
      if (iva !== undefined) {
        // IVA = 0% el total_iva = price * quantity - discount + 0 (0% IVA)
        no_iva += iva === 6 ? Number(total_iva) : 0;
        base0 += iva === 0 ? Number(total_iva) : 0;
        // IVA > 0% entonces total_iva = price * quantity - discount + Valor del IVA (5%-12%-13%-15%)
        base5 += iva === 5 ? Number(price * quantity - discount) : 0;
        base12 += iva === 2 ? Number(price * quantity - discount) : 0;
        // base13 += iva === 10 ? Number(price * quantity - discount) : 0;
        base15 += iva === 4 ? Number(price * quantity - discount) : 0;
      }
    });
    let sub_total = no_iva + base0 + base5 + base12 + base13 + base15;

    let iva5 = Number(((base5 + Number(totalIce)) * 0.05).toFixed(2));
    let iva12 = Number(((base12 + Number(totalIce)) * 0.12).toFixed(2));
    // let iva13 = Number(((base13 + Number(totalIce)) * 0.13).toFixed(2));
    let iva15 = Number(((base15 + Number(totalIce)) * 0.15).toFixed(2));
    let iva = Number((iva5 + iva12 + iva15).toFixed(2));

    let total = sub_total + Number(totalIce) + iva;

    this.setState({
      productouts,
      form: {
        ...this.state.form,
        no_iva,
        base0,
        base5,
        base12,
        // base12: base5 + base12 + base13 + base15,
        base15,
        sub_total,
        ice: totalIce,
        discount: totalDiscount,
        iva5,
        iva15,
        iva,
        total
      },
    });
  };

  onChangeNumber = (e) => {
    let { value } = e.target
    if (value < 0) return
    let { sub_total, iva, ice } = this.state.form
    let total = sub_total + Number(ice) + iva - Number(value);
    this.setState({
      form: {
        ...this.state.form,
        discount: value,
        total
      },
    });
  };

  importFromCsv = () => document.getElementById('file_csv').click();

  handleSelectFile = (e) => {
    let input = e.target;

    let reader = new FileReader();
    reader.onload = () => this.uploadCsv(reader.result);
    reader.readAsText(input.files[0]);
  };

  uploadCsv = (csv) => {
    let lines = csv.split(/\r\n|\n/);
    let productinputs = [];
    let i = 0;

    // Extraer los codigos, precios y cantidades
    for (let line in lines) {
      if (i > 0 && lines[line].length > 0) {
        let words = lines[line].split(';');
        let object = {
          code: words[0].trim(),
          quantity: words[2],
        };
        productinputs.push(object);
      }
      i++;
    }
    this.getMasive(productinputs);
  };

  getMasive = async (prods) => {
    let data = { prods };

    try {
      // Enviar a traer solo esos productos
      await api.post('products/getmasive', data).then((res) => {
        let { products, order_items } = res.data;
        let newpros = [];
        for (let i = 0; i < products.length; i++) {
          newpros.push({
            id: products[i].id,
            atts: {
              code: products[i].code,
              iva: products[i].iva,
              name: products[i].name,
              price1: products[i].price1,
            },
          });
        }
        // Actualizar esos productos
        this.setState({
          productinputs: newpros,
        });
        this.recalculate(order_items);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Agregar Informacion Adicional
  addAditional = () => {
    let { aditionals } = this.state;
    aditionals.push({ name: '', description: '' });
    this.setState({ aditionals });
  };

  //Delete Informacion Adicional
  deleteAditional = (index) => {
    let aditionals = this.state.aditionals.filter(
      (aditional, i) => i !== index
    );
    this.setState({ aditionals });
  };

  onChangeAditional = (index) => (e) => {
    let { aditionals } = this.state;
    let { name, value } = e.target;
    aditionals[index][name] = value;
    this.setState({ aditionals });
  };

  // Create our number formatter.
  formatter = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',

    //     // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
  });

  //Desglose del valor total
  handleChangeCheck = (e) => {
    let { breakdown, productouts } = this.state
    productouts.forEach(item => {
      let base = item.price * item.quantity - item.discount
      item.total_iva = (breakdown ? base : base * (1 + item.percentage / 100)).toFixed(2)
    })
    this.setState((state) => ({
      breakdown: !state.breakdown,
      productouts
    }));
  };

  //...............Layout
  render = () => {
    let { loading, form, aditionals, breakdown, methodOfPayments, customers, points, selectPoint } = this.state;

    let { format } = this.formatter;

    return (
      <Fragment>
        <PageTitle
          heading="Documento"
          subheading="Registrar un nuevo documento"
          icon="pe-7s-news-paper icon-gradient bg-mean-fruit"
        />
        <ReactCSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <Input
            onChange={this.handleSelectFile}
            style={{ display: 'none' }}
            type="file"
            name="customerscsv"
            id="file_csv"
            accept=".csv"
          />
          <Row>
            <Col lg="12">
              <Card className="main-card mb-3">
                <CardBody>
                  {loading === 'success' ?
                    <Fragment>
                      <Form className="text-right">
                        <Row form>
                          <p className="mt-2">
                            <strong>Nota:</strong> Los campos marcados con * son
                            obligatorios
                          </p>
                        </Row>

                        <Row form style={{ 'border-top': '1px solid #ced4da' }}>
                          <strong className="mt-2">Datos generales</strong>
                        </Row>
                        <InfoDocument
                          form={form}
                          points={points}
                          selectPoint={selectPoint}
                          customers={customers}
                          handleChange={this.handleChange}
                          changePoint={this.changePoint}
                          selectCustomer={this.selectCustomer}
                        />

                        <Row
                          form
                          className="my-3 pt-2"
                          style={{ 'border-top': '1px solid #ced4da' }}
                        >
                          <div className="col-sm-1 text-left">
                            <strong>Productos</strong>
                          </div>
                          <Col md={3}>
                            <FormGroup>
                              <Label>
                                <CustomInput
                                  onChange={this.handleChangeCheck}
                                  checked={breakdown}
                                  type="checkbox"
                                  id="breakdown"
                                  name="breakdown"
                                  label="Desglose"
                                />
                              </Label>
                            </FormGroup>
                          </Col>

                          <div className="col-sm-8">
                            <Button onClick={this.importFromCsv}>Importar</Button>
                          </div>
                        </Row>

                        <ListProducts
                          productinputs={this.state.productinputs}
                          productouts={this.state.productouts}
                          addProduct={this.addProduct}
                          selectProduct={this.selectProduct}
                          deleteProduct={this.deleteProduct}
                          handleChangeItem={this.handleChangeItem}
                          format={format}
                          breakdown={breakdown}
                          decimal={this.props.decimal}
                        />
                      </Form>

                      <Row
                        form
                        className="my-3"
                        style={{ 'border-top': '1px solid #ced4da' }}
                      ></Row>
                      <Row>
                        <Col lg={8}>
                          <FormGroup className="mb-1" row hidden={form.voucher_type === 4}>
                            <Label style={{ 'font-weight': 'bold' }} for="serie" sm={4}>Forma de pago</Label>
                            <Col sm={6}>
                              <Input value={form.pay_method} bsSize="sm" onChange={this.handleChange} type="select"
                                id="pay_method" name="pay_method">
                                {methodOfPayments.map((mp, i) => (
                                  <option value={mp.code} key={`mp${i}`}>{mp.description}</option>
                                ))}
                              </Input>
                            </Col>
                          </FormGroup>
                          <Aditionals
                            aditionals={aditionals}
                            addAditional={this.addAditional}
                            deleteAditional={this.deleteAditional}
                            onChangeAditional={this.onChangeAditional}
                          />
                        </Col>
                        <Col lg={4}>
                          <Table bordered>
                            <thead>
                              <tr>
                                <th style={{ 'text-align': 'center' }}>
                                  Resultados
                                </th>
                                <th style={{ 'text-align': 'center' }}>Monto</th>
                              </tr>
                            </thead>
                            <tbody>
                              {form.base5 > 0 ?
                                <tr>
                                  <td>Subtotal 5%</td>
                                  <td style={{ 'text-align': 'right' }}>
                                    {format(form.base5)}
                                  </td>
                                </tr> : null}
                              {form.base12 > 0 ?
                                <tr>
                                  <td>Subtotal 12%</td>
                                  <td style={{ 'text-align': 'right' }}>
                                    {format(form.base12)}
                                  </td>
                                </tr> : null}
                              {form.base15 > 0 ?
                                <tr>
                                  <td>Subtotal 15%</td>
                                  <td style={{ 'text-align': 'right' }}>
                                    {format(form.base15)}
                                  </td>
                                </tr> : null}
                              <tr>
                                <td>Subtotal 0%</td>
                                <td style={{ 'text-align': 'right' }}>
                                  {format(form.base0)}
                                </td>
                              </tr>
                              <tr>
                                <td>Descuento</td>
                                <td style={{ 'text-align': 'right' }}>
                                  <input
                                    onChange={this.onChangeNumber}
                                    name="discount"
                                    value={form.discount}
                                    type="number"
                                    min={0}
                                    max={form.total}
                                    style={{
                                      'text-align': 'right',
                                    }}
                                    bsSize="sm"
                                  />
                                </td>
                              </tr>
                              {form.ice > 0
                                ?
                                <tr>
                                  <td>Monto ICE</td>
                                  <td style={{ 'text-align': 'right' }}>
                                    {format(form.ice)}
                                  </td>
                                </tr>
                                : null}
                              <tr>
                                <td>IVA</td>
                                <td style={{ 'text-align': 'right' }}>
                                  {format(form.iva)}
                                </td>
                              </tr>
                              <tr>
                                <td>No objeto de IVA</td>
                                <td style={{ 'text-align': 'right' }}>
                                  {format(form.no_iva)}
                                </td>
                              </tr>
                              <tr>
                                <th style={{ 'text-align': 'center' }}>TOTAL</th>
                                <th style={{ 'text-align': 'right' }}>
                                  {format(form.total)}
                                </th>
                              </tr>
                            </tbody>
                          </Table>
                          <Button
                            color="secondary"
                            id="btn-save"
                            onClick={() => this.submit(false)}
                            className="mr-2 btn-transition"
                            disable
                          >
                            Guardar
                          </Button>
                          <Button
                            color="success"
                            id="btn-save-send"
                            onClick={() => this.submit(true)}
                            className="mr-2 btn-transition"
                          >
                            Guardar y procesar
                          </Button>
                        </Col>
                      </Row>
                    </Fragment>
                    :
                    <Row className='m-1'>
                      <CardText className='text-danger'>
                        Error con el internet!
                      </CardText>
                    </Row>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ReactCSSTransitionGroup>
      </Fragment>
    );
  };
}

const mapStateToProps = (state) => ({
  decimal: state.AuthReducer.decimal
});

export default connect(mapStateToProps)(CreateInvoice);