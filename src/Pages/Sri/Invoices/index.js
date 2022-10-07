import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import tokenAuth from '../../../config/token'
import clientAxios from '../../../config/axios'

class Invoices extends Component {
  state = {}

  handleChange = e => {
    this.setState({ month: e.target.value })
  }
  donwloadExcel = async () => {
    tokenAuth(this.props.token)
    try {
      await clientAxios
        .get(`shops/${this.state.month}/export`, { responseType: 'blob' })
        .then(res => {
          var blob = new Blob([res.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'
          })

          var a = document.createElement('a') //Create <a>
          // a.href = 'data:text/xlsx;base64,' + res.data //Image Base64 Goes here
          a.href = URL.createObjectURL(blob) //Image Base64 Goes here
          a.download = 'Compras.xlsx' //File name Here
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
          heading='Información para el SRI'
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
                  <p>Descargar Compras</p>
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
                  <Button onClick={this.donwloadExcel}>Compras</Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ReactCSSTransitionGroup>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  token: state.AuthReducer.token
})

export default connect(mapStateToProps)(Invoices)
