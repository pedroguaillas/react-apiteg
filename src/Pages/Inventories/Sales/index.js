import React, { Component, Fragment } from 'react'
import {
    Row, Col, Card, CardBody, Table, Button,
    UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { Link } from 'react-router-dom'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { API_BASE_URL } from "../../../config/config"
import RetentionModal from './RetentionModal'

export default class Sales extends Component {

    state = {
        sales: null
    }

    componentDidMount() {
        this.getSales()
    }

    //Get all sales
    getSales = () => {
        fetch(API_BASE_URL + 'sales')
            .then(response => response.json())
            .then(response => this.setState({ sales: response }))
    }

    downloadXml = (id) => {
        fetch(API_BASE_URL + `invoices/${id}`)
            .then(response => response.json())
            .then(response => {
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([response.xml], { type: 'application/xml' }))
                link.setAttribute('download', 'factura.xml')    //or any other extension
                link.setAttribute('id', 'factura.xml')    //or any other extension
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(document.getElementById("factura.xml"))
            })
    }

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Ventas"
                    subheading="Lista de ventas"
                    icon="pe-7s-car icon-gradient bg-mean-fruit"
                    new={true}
                />

                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <Link to="/inventarios/nuevaventa" color="primary">Agregar nueva venta</Link>

                    {
                        (this.state.sales === null) ? (<p>Cargando ...</p>) :
                            (this.state.sales.lenght === 0) ? (<p>No se ha registrado ventas haz clic en "Agregar nueva venta"</p>) :
                                (<Row className="mt-4">
                                    <Col lg={12}>
                                        <Card>
                                            <CardBody>
                                                {/* <CardTitle>Productos</CardTitle> */}
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th>Serie</th>
                                                            <th>Cliente</th>
                                                            <th>Fecha</th>
                                                            <th>Pago</th>
                                                            <th>Vencimiento</th>
                                                            <th>Total</th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.state.sales.map(sale => (
                                                                <tr>
                                                                    <td>{sale.serie}</td>
                                                                    <td>{sale.name}</td>
                                                                    <td>{sale.date}</td>
                                                                    <td>{sale.pay_method}</td>
                                                                    <td>{sale.expiration_date}</td>
                                                                    <td>${parseFloat(sale.total).toFixed(2)}</td>
                                                                    <td>
                                                                        <UncontrolledButtonDropdown direction="botton" className="mb-2 mr-2">
                                                                            <Button outline color="primary">Opciones</Button>
                                                                            <DropdownToggle outline className="dropdown-toggle-split" caret color="primary" />
                                                                            <DropdownMenu right>
                                                                                <DropdownItem><Link to={`/inventarios/editarventa/${sale.id}`}>Abrir</Link></DropdownItem>
                                                                                <DropdownItem divider />
                                                                                {sale.pay_method === 'crédito' ? <DropdownItem>Pagos</DropdownItem> : ''}
                                                                                <DropdownItem>Enviar</DropdownItem>
                                                                                <DropdownItem divider />
                                                                                <DropdownItem>Mostrar PDF</DropdownItem>
                                                                                <DropdownItem onClick={() => this.downloadXml(sale.id)}>Descargar XML</DropdownItem>
                                                                                <DropdownItem>Retención</DropdownItem>
                                                                                {/* <DropdownItem onClick={() => this.loadRet(sale.id)}>Retentión</DropdownItem> */}
                                                                            </DropdownMenu>
                                                                        </UncontrolledButtonDropdown>
                                                                    </td>
                                                                    <td>
                                                                        <RetentionModal
                                                                            sale_id={sale.id}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>)
                    }
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}