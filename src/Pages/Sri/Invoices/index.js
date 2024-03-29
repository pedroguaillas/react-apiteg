import React, { Component, Fragment } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {
  Row, Col, Card, CardBody,
  Button, FormGroup, Label, Input
} from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import api from '../../../services/api';

class Invoices extends Component {
  state = {}

  handleChange = e => {
    this.setState({ month: e.target.value })
  }

  donwloadExcel = async type => {
    try {
      await api
        .get(
          type === 'Compras'
            ? `shops/${this.state.month}/export`
            : `orders/export/${this.state.month}`,
          { responseType: 'blob' }
        )
        .then(({ data }) => {
          var blob = new Blob([data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
          })

          var a = document.createElement('a') //Create <a>
          // a.href = 'data:text/xlsx;base64,' + res.data //Image Base64 Goes here
          a.href = URL.createObjectURL(blob) //Image Base64 Goes here
          a.download = `${type}.xlsx` //File name Here
          a.click() //Downloaded file
        })
    } catch (error) {
      console.log(error)
    }
  }

  donwloadAts = async () => {
    try {
      await api
        .get(`ats/${this.state.month}`, { responseType: 'blob' })
        .then(({ data }) => {
          var blob = new Blob([data], { type: 'application/xml' })
          var a = document.createElement('a') //Create <a>
          a.href = URL.createObjectURL(blob) //Image Base64 Goes here
          a.download = `ats.xml` //File name Here
          a.click() //Downloaded file
        })
    } catch (error) {
      console.log(error)
    }
  }

  //Layout
  render = () => {
    let { month } = this.state
    return (
      <Fragment>
        <PageTitle
          heading='Reportes'
          subheading='Reportes en excel y el ATS'
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
            <Col lg='12'>
              <Card className='main-card mb-3'>
                <CardBody>
                  <p>Reporte de compras y ventas</p>
                  <Row form>
                    <Col md={6}>
                      <FormGroup className='mb-1' row>
                        <Label
                          style={{ 'font-weight': 'bold' }}
                          for='month'
                          sm={4}
                        >
                          Mes
                        </Label>
                        <Col sm={6}>
                          <Input
                            bsSize='sm'
                            onChange={this.handleChange}
                            value={month}
                            type='month'
                            id='month'
                            name='month'
                            max={new Date().toISOString().substring(0, 7)}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button onClick={() => this.donwloadExcel('Compras')}>
                    Compras
                  </Button>
                  <Button
                    onClick={() => this.donwloadExcel('Ventas')}
                    className='ml-2'
                  >
                    Ventas
                  </Button>
                  <Button onClick={() => this.donwloadAts()} className='ml-2'>ATS</Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ReactCSSTransitionGroup>
      </Fragment>
    )
  }
}

export default Invoices;
