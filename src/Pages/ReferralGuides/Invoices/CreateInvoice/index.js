import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, Form, Button, CardText } from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import ListProducts from './ListProducts';
import InfoDocument from './InfoDocument';
import api from '../../../../services/api';

class CreateInvoice extends Component {

  constructor() {
    super()

    let date = new Date()
    date.setHours(date.getHours() - 5)
    date = date.toISOString().substring(0, 10)

    this.state = {
      form: {
        serie: 'Cree un punto de emisión',
        date_start: date,
        date_end: date,
        carrier_id: 0,
        customer_id: 0,
      },
      carriers: [],
      customers: [],
      productinputs: [],
      productouts: [
        { product_id: 0, quantity: 1 }
      ],
      loading: 'success',
      points: [],
      selectPoint: {}
    }
  }

  async componentDidMount() {
    const { match: { params } } = this.props
    if (params.id) {
      try {
        await api.get(`referralguides/${params.id}`)
          .then(({ data }) => {
            this.setState({
              productinputs: data.products,
              productouts: data.referralguide_items,
              carriers: data.carriers,
              customers: data.customers,
              form: data.referralguide
            })
          })
      } catch (error) {
        this.setState({ loading: 'error' })
        console.log(error)
      }
    } else {
      try {
        await api.get('referralguides/create')
          .then(({ data: { points } }) => {
            this.setState({ points })
            if (points.length === 1 && points[0].point)
              this.generateSerie(points[0])
          })
      } catch (error) {
        this.setState({ loading: 'error' })
        console.log(error)
      }
    }
  }

  generateSerie = (point) => {
    let serie = point.store + '-' + point.point + '-'
    serie += (point.referralguide + '').padStart(9, '0')
    this.setState({
      selectPoint: point,
      form: {
        ...this.state.form,
        serie
      }
    })
  }

  //Save sale
  submit = async (send) => {

    if (this.validate()) {
      let { form, productouts, selectPoint } = this.state
      form.products = productouts.length > 0 ? productouts.filter(product => product.product_id !== 0) : []

      form.send = send

      try {
        document.getElementById("btn-save").disabled = true
        document.getElementById("btn-save-send").disabled = true

        if (form.id) {
          await api.put(`referralguides/${form.id}`, form)
            .then(res => this.props.history.push('/guiasremision/index'))
        } else {
          form.point_id = selectPoint.id
          await api.post('referralguides', form)
            .then(res => this.props.history.push('/guiasremision/index'))
        }
      } catch (error) { console.log(error) }
    }
  }

  //Validate data to send save
  validate = () => {

    let { form, productouts, selectPoint } = this.state

    // Cuando se va registrar y no ha seleccionado un punto de emisión
    if (form.id === undefined && selectPoint.id === undefined) {
      alert('La seleccione un punto de emisión')
      return
    }

    // Validar que se selecciono un cliente
    if (form.customer_id === 0) {
      alert('Debe seleccionar un cliente o destinatario')
      return
    }

    // Validar que se selecciono un transportista
    if (form.carrier_id === 0) {
      alert('Debe seleccionar un transportista')
      return
    }

    // Validar que se la serie contenga 17 caracteres
    if (form.address_from.trim().length < 3 || form.address_to.trim().length < 3 || form.reason_transfer.trim().length < 3) {
      alert('Los siguiente campos son obligatorios: motivo, dirección partida y llegada, ademas deben tener minimo 3 caracteres')
      return
    }

    // Validar que se registren productos
    if (productouts.length === 0) {
      alert('Debe seleccionar almenos un producto')
      return
    }

    let i = 0
    // Products length siempre va ser mayor a cero por que se valido en la condicion anterior
    while (i < productouts.length) {
      if (productouts[i].product_id === 0 || productouts[i].quantity < 1) {
        alert('No puedes dejar un item vacio y la cantidad debe ser mayor a 0')
        return
      }
      i++
    }

    return true
  }

  changePoint = e => {
    if (e.target.value === "") return
    let point = this.state.points.filter(p => p.id == parseInt(e.target.value))[0]
    if (point) this.generateSerie(point)
  }

  //Info sale handle
  handleChange = e => {
    let { name, value } = e.target
    this.setState({
      form: {
        ...this.state.form,
        [name]: value
      }
    })
  }

  //Add carrier
  selectCarrier = (carrier_id) => {
    this.setState({
      form: {
        ...this.state.form,
        carrier_id
      }
    })
  }

  //Add customer
  selectCustomer = (customer_id) => {
    this.setState({
      form: {
        ...this.state.form,
        customer_id
      }
    })
  }

  //................Products
  //Only add line for add product
  addProduct = () => {
    let { productouts } = this.state
    productouts.push({ product_id: 0, quantity: 1 })
    this.setState({ productouts })
  }

  //add product when select product from de list modal
  selectProduct = (product, index) => {
    let productouts = this.state.productouts.map((item, i) => {
      if (index === i) {
        item.product_id = product.id
        item.quantity = 1
      }
      return item
    })

    this.setState({ productouts })
  }

  //Delete product
  deleteProduct = (index) => {
    let productouts = this.state.productouts.filter((product, i) => i !== index)

    this.setState({ productouts })
  }

  //add quatity to product
  handleChangeItem = (index) => (e) => {
    let { value } = e.target
    if (value < 0) return
    let { productouts } = this.state
    productouts[index].quantity = value
    this.setState({ productouts })
  }

  //...............Layout
  render = () => {

    let { loading, form, points, selectPoint } = this.state

    return (
      <Fragment>
        <PageTitle
          heading="Guia de remisión"
          subheading="Registrar guia de remisión"
          icon="pe-7s-news-paper icon-gradient bg-mean-fruit"
        />
        <ReactCSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}>

          <Row>
            <Col lg="12">
              <Card className="main-card mb-3">
                <CardBody>
                  {loading === 'success' ?
                    <Fragment>
                      <Form className="text-right">

                        <Row form>
                          <p className='mt-2'><strong>Nota:</strong> Los campos marcados con * son obligatorios</p>
                        </Row>

                        <Row form style={{ 'breferralguide-top': '1px solid #ced4da' }}>
                          <strong className='mt-2'>Datos generales</strong>
                        </Row>
                        <InfoDocument
                          form={form}
                          carriers={this.state.carriers}
                          customers={this.state.customers}
                          points={points}
                          selectPoint={selectPoint}
                          handleChange={this.handleChange}
                          selectCarrier={this.selectCarrier}
                          selectCustomer={this.selectCustomer}
                          changePoint={this.changePoint}
                        />

                        <Row form className="my-3 pt-2" style={{ 'breferralguide-top': '1px solid #ced4da', 'border-top': '1px solid #ced4da' }}>
                          <strong className='mt-2'>Productos</strong>
                        </Row>

                        <ListProducts
                          productinputs={this.state.productinputs}
                          productouts={this.state.productouts}
                          addProduct={this.addProduct}
                          selectProduct={this.selectProduct}
                          deleteProduct={this.deleteProduct}
                          handleChangeItem={this.handleChangeItem}
                        />
                      </Form>
                      <Row form>
                        <Col lg={8}></Col>
                        <Col lg={4}>
                          <Button color="secondary" id="btn-save" onClick={() => this.submit(false)} className="mr-2 btn-transition" disable>Guardar</Button>
                          <Button color="success" id="btn-save-send" onClick={() => this.submit(true)} className="mr-2 btn-transition">Guardar y procesar</Button>
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
    )
  }
}

export default CreateInvoice;