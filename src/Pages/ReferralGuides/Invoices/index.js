import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';
import Paginate from '../../Components/Paginate/Index';
import api from '../../../services/api';

class Invoices extends Component {
  state = {
    dropdowns: [],
    referralguides: null,
    links: null,
    meta: null,
  };

  async componentDidMount() {
    // tokenAuth(this.props.token);
    try {
      // await clienteAxios.get('referralguides')
      await api.get('referralguides').then((res) => {
        let { data, links, meta } = res.data;
        this.setState({
          referralguides: data,
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

    if (page !== null) {
      // tokenAuth(this.props.token);
      try {
        // await clienteAxios.get(`referralguides?page=${page.substring((page.indexOf('=')) + 1)}`)
        await api
          .get(`referralguides?page=${page.substring(page.indexOf('=') + 1)}`)
          .then((res) => {
            let { data, links, meta } = res.data;
            this.setState({
              referralguides: data,
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
    let { current_page } = this.state.meta;
    if (current_page !== null) {
      // tokenAuth(this.props.token);
      try {
        // await clienteAxios.get(`referralguides?page=${current_page}`)
        await api.get(`referralguides?page=${current_page}`).then((res) => {
          let { data, links, meta } = res.data;
          this.setState({
            referralguides: data,
            links,
            meta,
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  addDocument = () => this.props.history.push('/guiasremision/nuevo');

  viewInvoicePdf = async (id) => {
    // tokenAuth(this.props.token);
    try {
      // await clienteAxios.get(`referralguides/${id}/pdf`, { responseType: 'blob' })
      await api
        .get(`referralguides/${id}/pdf`, { responseType: 'blob' })
        .then((res) => {
          //Create a Blob from the PDF Stream
          const file = new Blob([res.data], { type: 'application/pdf' });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleDrops = (index) => {
    let { dropdowns } = this.state;
    dropdowns[index] = !dropdowns[index];
    this.setState({ dropdowns });
  };

  renderproccess = ({ id, atts: { state, extra_detail } }) => (
    <DropdownItem
      onClick={() =>
        state === 'CREADO' || state === 'DEVUELTA' || state === 'NO AUTORIZADO'
          ? this.generateSign(id)
          : state === 'FIRMADO'
          ? this.sendToSri(id)
          : state === 'ENVIADO' ||
            state === 'RECIBIDA' ||
            state === 'EN_PROCESO'
          ? this.autorizedFromSri(id)
          : null
      }
      title = {extra_detail}
    >
      {this.renderSwith(state)}
    </DropdownItem>
  );

  renderSwith = (state) => {
    switch (state) {
      case 'CREADO':
        return 'Firmar enviar y procesar';
      case 'FIRMADO':
        return 'Enviar y procesar';
      case 'ENVIADO':
        return 'Autorizar';
      case 'RECIBIDA':
        return 'Autorizar';
      case 'EN_PROCESO':
        return 'Autorizar';
      case 'DEVUELTA':
        return 'Volver a procesar';
      case 'NO AUTORIZADO':
        return 'Volver a procesar';
      default:
        break;
    }
  };

  generateSign = async (id) => {
    // tokenAuth(this.props.token);
    try {
      // await clienteAxios.get('referralguides/xml/' + id)
      await api
        .get('referralguides/xml/' + id)
        .then((res) => this.reloadPage());
    } catch (error) {
      console.log(error);
    }
  };

  sendToSri = async (id) => {
    // tokenAuth(this.props.token);
    try {
      // await clienteAxios.get('referralguides/sendsri/' + id)
      await api
        .get('referralguides/sendsri/' + id)
        .then((res) => this.reloadPage());
    } catch (error) {
      console.log(error);
    }
  };

  autorizedFromSri = async (id) => {
    // tokenAuth(this.props.token);
    // Recargar la pagina actual .......................
    try {
      // await clienteAxios.get(`referralguides/authorize/${id}`)
      await api
        .get(`referralguides/authorize/${id}`)
        .then((res) => this.reloadPage());
    } catch (error) {
      console.log(error);
    }
  };

  downloadXml = async (id) => {
    // tokenAuth(this.props.token);
    try {
      // await clienteAxios.get('referralguides/download/' + id)
      await api.get('referralguides/download/' + id).then((res) => {
        var a = document.createElement('a'); //Create <a>
        a.href = 'data:text/xml;base64,' + res.data.xml; //Image Base64 Goes here
        a.download = 'Guia de remision.xml'; //File name Here
        a.click(); //Downloaded file
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Layout
  render = () => {
    let { referralguides, dropdowns, links, meta } = this.state;

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              type: 'button',
              id: 'tooltip-add-document',
              action: this.addDocument,
              icon: 'plus',
              msmTooltip: 'Agregar guia de remisión',
              color: 'primary',
            },
          ]}
          heading="Guias de remisión"
          subheading="Todas las guias de remisión registradas"
          icon="pe-7s-repeat icon-gradient bg-mean-fruit"
        />
        <ReactCSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          {referralguides === null ? (
            <p>Cargando ...</p>
          ) : referralguides.length === 0 ? (
            <p>No existe guias de remsión registradas</p>
          ) : (
            <Row>
              <Col lg="12">
                <Card className="main-card mb-3">
                  <CardBody>
                    <Table striped size="sm" responsive>
                      <thead>
                        <tr>
                          <th style={{ width: '15em' }}>Período ruta</th>
                          <th>Serie</th>
                          <th>Cliente / Destinatario</th>
                          <th>Estado</th>
                          <th>Transportista</th>
                          <th style={{ width: '1em' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {referralguides.map((referralguide, index) => (
                          <tr key={index}>
                            <td>{`${referralguide.atts.date_start} - ${referralguide.atts.date_end}`}</td>
                            <td>
                              <Link
                                to={'/guiasremision/editar/' + referralguide.id}
                              >
                                {referralguide.atts.serie}
                              </Link>
                            </td>
                            <td>{referralguide.customer.name}</td>
                            <td>{referralguide.atts.state}</td>
                            <td>{referralguide.carrier.name}</td>
                            <td>
                              <ButtonDropdown
                                direction="left"
                                isOpen={dropdowns[index]}
                                toggle={() => this.handleDrops(index)}
                              >
                                <DropdownToggle caret></DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() =>
                                      this.viewInvoicePdf(referralguide.id)
                                    }
                                  >
                                    Ver Pdf
                                  </DropdownItem>
                                  {this.renderproccess(referralguide)}
                                  {referralguide.atts.xml ? (
                                    <DropdownItem
                                      onClick={() =>
                                        this.downloadXml(referralguide.id)
                                      }
                                    >
                                      Descargar XML
                                    </DropdownItem>
                                  ) : null}
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
  };
}

// const mapStateToProps = state => ({
//     token: state.AuthReducer.token
// });

// export default connect(mapStateToProps)(Invoices);
export default Invoices;
