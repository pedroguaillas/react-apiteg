import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {
  Row, Col, Card, CardBody, Table, Input, Form, InputGroup,
  ButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle
} from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import Paginate from '../../Components/Paginate/Index'
import api from '../../../services/api'

class Documents extends Component {
  state = {
    dropdowns: [],
    shops: null,
    links: null,
    meta: null,
    search: ''
  }

  async componentDidMount() {
    let { search } = this.state
    try {
      await api.post('shoplist', { search }).then(res => {
        let { data, links, meta } = res.data
        this.setState({
          shops: data,
          links,
          meta
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  reqNewPage = async (e, page) => {
    e.preventDefault()

    if (page !== null) {
      let { search } = this.state
      try {
        await api
          .post(`shoplist?page=${page.substring(page.indexOf('=') + 1)}`, {
            search
          })
          .then(res => {
            let { data, links, meta } = res.data
            this.setState({
              shops: data,
              links,
              meta
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  reloadPage = async () => {
    let { current_page } = this.state.meta
    if (current_page !== null) {
      let { search } = this.state
      try {
        await api
          .post(`shoplist?page=${current_page}`, { search })
          .then(res => {
            let { data, links, meta } = res.data
            this.setState({
              shops: data,
              links,
              meta
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  onChangeSearch = async e => {
    let { value } = e.target

    try {
      await api.post('shoplist', { search: value }).then(res => {
        let { data, links, meta } = res.data
        this.setState({
          search: value,
          shops: data,
          links,
          meta
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  addDocument = () => this.props.history.push('/compras/registrardocumento')

  handleDrops = index => {
    let { dropdowns } = this.state
    dropdowns[index] = !dropdowns[index]
    this.setState({ dropdowns })
  }

  cal_prefix = type => {
    let prefix = null
    switch (Number(type)) {
      case 1:
        prefix = 'FAC'
        break
      case 2:
        prefix = 'N/V'
        break
      case 3:
        prefix = 'L/C'
        break
      case 4:
        prefix = 'N/C'
        break
      case 5:
        prefix = 'N/D'
        break
      default:
        break
    }
    return prefix
  }

  // Inicio Retencion
  renderRetention = ({
    id,
    atts: {
      state_retencion,
      serie_retencion,
      xml_retention,
      send_mail_retention
    },
    provider: { email }
  }) =>
    serie_retencion ? (
      <Fragment>
        <DropdownItem header>Retención</DropdownItem>
        <DropdownItem onClick={() => this.viewRetentionPdf(id)}>
          Ver Pdf
        </DropdownItem>
        {state_retencion !== 'ANULADO' ? (
          <DropdownItem
            onClick={() =>
              state_retencion === null ||
                state_retencion === 'CREADO' ||
                state_retencion === 'DEVUELTA' ||
                state_retencion === 'NO AUTORIZADO'
                ? this.generateSignRetention(id)
                : state_retencion === 'FIRMADO'
                  ? this.sendToSriRetention(id)
                  : state_retencion === 'ENVIADO' ||
                    state_retencion === 'RECIBIDA' ||
                    state_retencion === 'EN_PROCESO'
                    ? this.autorizedFromSriRetention(id)
                    : state_retencion === 'AUTORIZADO'
                      ? this.canceledRetention(id)
                      : null
            }
          >
            {this.renderSwith(state_retencion)}
          </DropdownItem>
        ) : null}
        {xml_retention ? (
          <DropdownItem onClick={() => this.downloadXmlRetention(id)}>
            Descargar XML
          </DropdownItem>
        ) : null}
        {email !== null && state_retencion === 'AUTORIZADO' ? (
          <DropdownItem onClick={() => this.sendMail(id)}>
            {send_mail_retention === 0 ? 'Enviar' : 'Reenviar'} correo
          </DropdownItem>
        ) : null}
      </Fragment>
    ) : null

  viewRetentionPdf = async id => {
    try {
      await api
        .get('retentions/pdf/' + id, { responseType: 'blob' })
        .then(res => {
          //Create a Blob from the PDF Stream
          const file = new Blob([res.data], { type: 'application/pdf' })
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file)
          //Open the URL on new Window
          window.open(fileURL)
        })
    } catch (error) {
      console.log(error)
    }
  }

  generateSignRetention = async id => {
    try {
      await api.get('retentions/xml/' + id).then(res => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }

  sendToSriRetention = async id => {
    try {
      await api.get('retentions/sendsri/' + id).then(res => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }

  autorizedFromSriRetention = async id => {
    try {
      await api.get(`retentions/authorize/${id}`).then(res => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }

  canceledRetention = async id => {
    try {
      await api.get(`retentions/cancel/${id}`).then(res => {
        let { state } = res.data
        if (state === 'OK') {
          this.reloadPage()
        } else {
          alert(
            'Para anular el comprobante en este sistema primero se debe anular en el Sistema del SRI'
          )
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  downloadXmlRetention = async id => {
    try {
      await api.get('retentions/download/' + id).then(res => {
        var a = document.createElement('a') //Create <a>
        a.href = 'data:text/xml;base64,' + res.data.xml //Image Base64 Goes here
        a.download = 'Retención.xml' //File name Here
        a.click() //Downloaded file
      })
    } catch (error) {
      console.log(error)
    }
  }

  sendMail = async id => {
    try {
      await api.get(`retentions/mail/${id}`).then(() => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }
  // Fin Retencion

  renderSwith = state => {
    switch (state) {
      case null:
        return 'Firmar enviar y procesar'
      case 'CREADO':
        return 'Firmar enviar y procesar'
      case 'FIRMADO':
        return 'Enviar y procesar'
      case 'EN_PROCESO':
        return 'Autorizar'
      case 'ENVIADO':
        return 'Autorizar'
      case 'RECIBIDA':
        return 'Autorizar'
      case 'DEVUELTA':
        return 'Volver a procesar'
      case 'AUTORIZADO':
        return 'Anular'
      case 'NO AUTORIZADO':
        return 'Volver a procesar'
      default:
        break
    }
  }

  // Inicio liquidación en compra
  renderSetPurchase = ({
    id,
    atts: { state, voucher_type, serie, xml, extra_detail }
  }) =>
    voucher_type === 3 && serie ? (
      <Fragment>
        <DropdownItem divider />
        <DropdownItem header>Liquidación en compra</DropdownItem>
        <DropdownItem onClick={() => this.viewSetPurchasePdf(id)}>
          Ver Pdf
        </DropdownItem>
        {state !== 'ANULADO' ? (
          <DropdownItem
            onClick={() =>
              state === 'CREADO' ||
                state === 'DEVUELTA' ||
                state === 'NO AUTORIZADO'
                ? this.generateSignSetPurchase(id)
                : state === 'FIRMADO'
                  ? this.sendToSriSetPurchase(id)
                  : state === 'ENVIADO' ||
                    state === 'RECIBIDA' ||
                    state === 'EN_PROCESO'
                    ? this.autorizedFromSriSetPurchase(id)
                    : state === 'AUTORIZADO'
                      ? this.canceledSetPurchase(id)
                      : null
            }
            title={extra_detail}
          >
            {this.renderSwith(state)}
          </DropdownItem>
        ) : null}
        {xml ? (
          <DropdownItem onClick={() => this.downloadXmlSetPurchase(id)}>
            Descargar XML
          </DropdownItem>
        ) : null}
      </Fragment>
    ) : null

  viewSetPurchasePdf = async id => {
    try {
      await api.get(`shops/${id}/pdf`, { responseType: 'blob' }).then(res => {
        //Create a Blob from the PDF Stream
        const file = new Blob([res.data], { type: 'application/pdf' })
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file)
        //Open the URL on new Window
        window.open(fileURL)
      })
    } catch (error) {
      console.log(error)
    }
  }

  generateSignSetPurchase = async id => {
    try {
      await api.get(`shops/${id}/xml`).then(res => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }

  sendToSriSetPurchase = async id => {
    try {
      await api.get(`shops/${id}/sendsri`).then(res => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }

  autorizedFromSriSetPurchase = async id => {
    try {
      await api.get(`shops/${id}/authorize`).then(res => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }

  canceledSetPurchase = async id => {
    try {
      await api.get(`shops/${id}/cancel`).then(res => {
        let { state } = res.data
        if (state === 'OK') {
          this.reloadPage()
        } else {
          alert(
            'Para anular el comprobante en este sistema primero se debe anular en el Sistema del SRI'
          )
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  downloadXmlSetPurchase = async id => {
    try {
      await api.get(`shops/${id}/download`).then(res => {
        var a = document.createElement('a') //Create <a>
        a.href = 'data:text/xml;base64,' + res.data.xml //Image Base64 Goes here
        a.download = 'LC.xml' //File name Here
        a.click() //Downloaded file
      })
    } catch (error) {
      console.log(error)
    }
  }
  // Fin liquidación en compra

  importFromTxt = () => document.getElementById('file_txt').click()

  handleSelectFile = e => {
    let input = e.target

    let reader = new FileReader()
    reader.onload = () => this.uploadTxtReport(reader.result)
    reader.readAsText(input.files[0])
  }

  uploadTxtReport = txt => {
    let lines = txt.split(/\r\n|\n/)
    let codekeys = []
    let i = 0

    for (let line in lines) {
      if (i > 0 && i % 2 === 0 && i < lines.length - 1) {
        let words = lines[line].split('\t')
        if (words[9].length === 49 || words[9].length === 13) {
          codekeys.push(words[words[9].length === 49 ? 9 : 10])
        }
      }
      i++
    }
    this.saveFromTxt(codekeys)
  }

  saveFromTxt = async codekeys => {
    let data = { clave_accs: codekeys }
    try {
      await api.post('shops/import', data).then(res => this.reloadPage())
    } catch (error) {
      console.log(error)
    }
  }

  //Layout
  render = () => {
    let { shops, links, meta, dropdowns, search } = this.state

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              type: 'button',
              id: 'tooltip-import-contact',
              action: this.importFromTxt,
              icon: 'import',
              msmTooltip: 'Importar desde .txt reporte SRI',
              color: 'success'
            },
            {
              type: 'button',
              id: 'tooltip-add-document',
              action: this.addDocument,
              icon: 'plus',
              msmTooltip: 'Agregar documento',
              color: 'primary'
            }
          ]}
          heading='Compras'
          subheading='Lista de todas las compras'
          icon='pe-7s-repeat icon-gradient bg-mean-fruit'
        />
        <ReactCSSTransitionGroup
          component='div'
          transitionName='TabsAnimation'
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <Row>
            <Col lg='12' className='mb-4'>
              <Card>
                <div className='card-header'>
                  Filtros
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
            </Col>
          </Row>

          <Input
            onChange={this.handleSelectFile}
            style={{ display: 'none' }}
            type='file'
            name='invoicestxt'
            id='file_txt'
            accept='.txt'
          />
          {shops === null ? (
            <p>Cargando ...</p>
          ) : shops.length === 0 ? (
            <p>No existe compras registradas</p>
          ) : (
            <Row>
              <Col lg='12'>
                <Card className='main-card mb-3'>
                  <CardBody>
                    <Table striped size='sm' responsive>
                      <thead>
                        <tr>
                          <th>Emisión</th>
                          <th>Documento</th>
                          <th>Razon social</th>
                          <th style={{ 'text-align': 'center' }}>Estado Ret</th>
                          <th style={{ 'text-align': 'center' }}>Total</th>
                          <th style={{ 'text-align': 'center' }}>Ret</th>
                          <th style={{ 'text-align': 'center' }}>Pagar</th>
                          <th></th>
                          <th style={{ width: '1rem' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {shops.map((voucher, index) => (
                          <tr key={index}>
                            <td>{voucher.atts.date}</td>
                            <td>
                              <Link to={'/compras/documento/' + voucher.id}>
                                {`${this.cal_prefix(
                                  voucher.atts.voucher_type
                                )} ${voucher.atts.serie}`}
                              </Link>
                            </td>
                            <td>{voucher.provider.name}</td>
                            <td className='font-icon-wrapper'>
                              {`${voucher.atts.state_retencion ?? ''} `}
                              {voucher.atts.state_retencion === 'DEVUELTA' || voucher.atts.state_retencion === 'NO AUTORIZADO' ?
                                <i className='pe-7s-info icon-gradient bg-plum-plate' style={{ cursor: 'help' }} title={voucher.atts.extra_detail_retention}> </i>
                                : null}
                            </td>
                            <td style={{ 'text-align': 'right' }}>{voucher.atts.total}</td>
                            <td style={{ 'text-align': 'right' }}>{voucher.atts.retention ?? '0.00'}</td>
                            <td style={{ 'text-align': 'right' }}>{(voucher.atts.total - (voucher.atts.retention ?? 0)).toFixed(2)}</td>
                            <td className='font-icon-wrapper font-icon-sm border-right-0 border-left-0'>
                              {voucher.atts.send_mail_retention === 1 ? (
                                <i
                                  title={`Enviado al correo ${voucher.provider.email}`}
                                  className='pe-7s-mail icon-gradient bg-plum-plate'
                                >
                                  {' '}
                                </i>
                              ) : null}
                            </td>
                            <td>
                              <ButtonDropdown
                                direction='left'
                                isOpen={dropdowns[index]}
                                toggle={() => this.handleDrops(index)}
                              >
                                <DropdownToggle caret></DropdownToggle>
                                <DropdownMenu>
                                  {/* Inicio Retención */}
                                  {this.renderRetention(voucher)}
                                  {/* Fin Retención */}

                                  {/* Inicio Liquidación en compra */}
                                  {this.renderSetPurchase(voucher)}
                                  {/* Fin Liquidación en compra */}
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
    )
  }
}

export default Documents
