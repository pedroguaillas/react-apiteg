import React, { Component, Fragment } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import PageTitle from '../../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import api from '../../../../services/api';
import FormPoint from './FormPoint';

class EmisionPoint extends Component {

    state = {
        points: null,
        isOpen: false,
        form: {}
    }

    async componentDidMount() {
        this.loadList()
    }

    loadList = async () => {
        const {
            match: { params },
        } = this.props;
        try {
            await api.get(`branch/${params.id}`)
                .then(res => this.setState({ points: res.data.points }))
        } catch (error) {
            console.log(error)
        }
    }

    addPoint = () => {
        this.setState({
            form: {
                invoice: 1,
                creditnote: 1,
                retention: 1,
                referralguide: 1,
                settlementonpurchase: 1
            }
        })
        this.toggle()
    }

    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    handleChangeNumber = (e) => {

        if (!isNaN(e.target.value)) this.handleChange(e)

    }

    save = async () => {
        let { form } = this.state
        const {
            match: { params },
        } = this.props;
        let data = { ...form, branch_id: params.id }

        if (data.id) {
            try {
                await api.put('points/update/' + data.id, data).
                    then(() => {
                        this.loadList()
                        this.toggle()
                    });
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                await api.post('points/store', data).
                    then(() => {
                        this.loadList()
                        this.toggle()
                    });
            } catch (error) {
                console.log(error);
            }
        }
    }

    edit = (form) => {
        this.setState({ form })
        this.toggle()
    }

    toggle = () => this.setState(state => ({ isOpen: !state.isOpen }))

    render() {

        let { points, isOpen, form } = this.state

        return (
            <Fragment>
                <PageTitle
                    options={[
                        { type: 'button', id: 'tooltip-add-point', action: this.addPoint, icon: 'plus', msmTooltip: 'Agregar Punto de Emisión', color: 'primary' },
                    ]}
                    heading="Puntos de emisión"
                    subheading="Puntos de emisión"
                    icon="pe-7s-id icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <FormPoint isOpen={isOpen} form={form} toggle={this.toggle} handleChange={this.handleChange} handleChangeNumber={this.handleChangeNumber} save={this.save} />

                    {
                        (points === null) ? (<p>Cargando ...</p>) :
                            (points.length < 1) ? (<p>No existe registro de sucursales</p>) :
                                (<Row>
                                    <Col lg="12">
                                        <Card className="main-card mb-3">
                                            <CardBody>
                                                <Table className='text-center' striped size="sm" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>N° Pto Emi</th>
                                                            <th>Factura</th>
                                                            <th>Nota Crédito</th>
                                                            <th>Retención</th>
                                                            <th>Liq Compra</th>
                                                            <th>Guía R</th>
                                                            <th style={{ width: '1em' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            points.map((point, index) => (
                                                                <tr key={`point${index}`}>
                                                                    <td>{(point.point + '').padStart(3, '0')}</td>
                                                                    <td>{point.invoice}</td>
                                                                    <td>{point.creditnote}</td>
                                                                    <td>{point.retention}</td>
                                                                    <td>{point.settlementonpurchase}</td>
                                                                    <td>{point.referralguide}</td>
                                                                    <td>
                                                                        <Button onClick={() => this.edit(point)} size='sm' color="primary">
                                                                            <i className='nav-link-icon lnr-pencil'></i>
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                )
                    }
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

export default EmisionPoint;