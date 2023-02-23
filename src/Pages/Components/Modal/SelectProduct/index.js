import React, { Component, Fragment } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  Input,
  InputGroupAddon,
  Table,
  Card,
  Form,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from 'reactstrap'

import Paginate from '../../Paginate/Index'
import api from '../../../../services/api'

class SelectProduct extends Component {
  state = {
    products: [],
    suggestions: [],
    modal: false,
    links: null,
    meta: null,
    search: '',
    searching: false
  }

  componentDidMount () {
    let { id, products } = this.props
    let items =
      products.length !== 0 && id > 0
        ? products.filter(product => product.id === id)
        : null
    if (items !== null && items.length > 0) {
      this.setState({ item: items[0].atts.name })
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.id !== prevProps.id && this.props.id > 0) {
      // Se actualiza el nombre del producto una vez termine cargar la pagina
      // Este se utiliza para actualizar el primer registro
      if (
        this.props.products !== prevProps.products &&
        this.props.products.length > 0
      ) {
        this.setState((state, props) => ({
          item: props.products.filter(product => product.id === props.id)[0]
            .atts.name
        }))
      } else {
        let { products, suggestions } = this.state

        if (products.length > 0 || suggestions.length > 0) {
          let items = suggestions.length !== 0 ? suggestions : products
          this.setState((state, props) => ({
            item: items.filter(product => product.id === props.id)[0].atts.name,
            products: [],
            suggestions: []
          }))
        }
      }
    }
  }

  selectProduct = item => {
    this.props.selectProduct(item, this.props.index)
    this.toggle()
  }

  //Show & hidden modal
  toggle = async () => {
    let { products } = this.state

    if (products.length === 0) {
      try {
        await api.post('productlist', { paginate: 10 }).then(res => {
          let { data, links, meta } = res.data
          this.setState(state => ({
            modal: !state.modal,
            products: data,
            suggestion: [],
            links,
            meta
          }))
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      this.setState(state => ({ modal: !state.modal }))
    }
  }

  reqNewPage = async (e, page) => {
    e.preventDefault()

    if (page !== null) {
      let { search } = this.state
      try {
        await api
          .post(`productlist?page=${page.substring(page.indexOf('=') + 1)}`, {
            search,
            paginate: 10
          })
          .then(res => {
            let { data, links, meta } = res.data
            this.setState({
              products: data,
              links,
              meta
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  onChangeItem = async e => {
    let { value } = e.target

    if (value.length > 1) {
      // Agregado Inicio
      this.setState({ item: value })
      if (!this.state.searching) {
        // Agregado Fin
        try {
          // Agregado Inicio
          this.setState({ searching: true })
          // Agregado Fin
          await api
            .post('productlist', { search: value, paginate: 5 })
            .then(res => {
              let { data, links, meta } = res.data
              this.setState({
                // Eliminado
                // item: value,
                suggestions: data,
                products: [],
                links,
                meta,
                searching: false
              })
            })
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      // tiene que ponerse el valor de item
      // ademas las sugerencias no tiene que aparecer
      this.setState({
        item: value,
        suggestions: []
      })
    }
  }

  onChangeSearch = async e => {
    let { value } = e.target

    try {
      await api
        .post('productlist', { search: value, paginate: 10 })
        .then(res => {
          let { data, links, meta } = res.data
          this.setState({
            search: value,
            products: data,
            suggestions: [],
            links,
            meta
          })
        })
    } catch (error) {
      console.log(error)
    }
  }

  render = () => {
    let { products, suggestions, links, meta, item, search } = this.state

    return (
      <Fragment>
        {/* <div onBlur={(e) => this.setState({ suggestions: [] })}> */}
        <div>
          <Row>
            <Col>
              <InputGroup size='sm'>
                <Input
                  onChange={this.onChangeItem}
                  value={item}
                  placeholder='...'
                />
                <InputGroupAddon addonType='append'>
                  <Button color='secondary' onClick={this.toggle}>
                    <i className='nav-link-icon lnr-magnifier'></i>
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col style={{ width: '100%' }}>
              <ListGroup style={{ cursor: 'pointer' }}>
                {suggestions.map((suggestion, index) => (
                  <ListGroupItem
                    onClick={() =>
                      this.props.selectProduct(suggestion, this.props.index)
                    }
                    style={{
                      padding: '.4em',
                      'font-size': '.9em',
                      'text-align': 'left'
                    }}
                    key={index}
                  >
                    {`${suggestion.atts.code} - ${suggestion.atts.name}`}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          size={this.props.size ? this.props.size : 'lg'}
        >
          <ModalHeader toggle={this.toggle}>Seleccionar producto</ModalHeader>
          <ModalBody>
            <Card className='mb-2'>
              <div className='card-header'>
                Busqueda
                <div className='btn-actions-pane-right'>
                  <Form className='text-right'>
                    <InputGroup size='sm'>
                      <Input
                        value={search}
                        onChange={this.onChangeSearch}
                        placeholder='Buscar'
                        className='search-input'
                      />
                    </InputGroup>
                  </Form>
                </div>
              </div>
            </Card>
            {products === null ? null : (
              <Table className='mb-2' responsive bordered>
                <thead>
                  <tr>
                    <th style={{ width: '8em' }}>Codigo</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td scope='row'>{product.atts.code}</td>
                      <td onClick={() => this.selectProduct(product)}>
                        <a href='javascript:void(0);' className='alert-link'>
                          {product.atts.name}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <Paginate links={links} meta={meta} reqNewPage={this.reqNewPage} />
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default SelectProduct
