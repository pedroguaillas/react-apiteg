import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import api from '../../../services/api';

class FormCarrier extends Component {
  state = {
    form: {
      type_identification: 'cédula',
    },
  };

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;
    if (params.id) {
      try {
        await api.get(`carriers/${params.id}/edit`).then((res) => {
          this.setState({ form: res.data.carrier });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  submit = async () => {
    if (this.validate()) {
      try {
        let { form } = this.state;

        // quitar los espacios del principio y final de la identificacion y le nombre
        form.name = form.name.trim();
        form.identication = form.identication.trim();

        if (form.id) {
          await api.put(`carriers/${form.id}`, form).then((res) => {
            if (res.data.message === 'KEY_DUPLICATE') {
              alert('Ya existe un transportista con esa identificación');
              return;
            }
            this.props.history.push('/contactos/transportistas');
          });
        } else {
          await api.post('carriers', this.state.form).then((res) => {
            if (res.data.message === 'KEY_DUPLICATE') {
              alert('Ya existe un transportista con esa identificación');
              return;
            }
            this.props.history.push('/contactos/transportistas');
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Validate data to send save
  validate = () => {
    let { form } = this.state;

    if (
      form.identication === undefined ||
      form.name === undefined ||
      form.license_plate === undefined
    ) {
      alert('Los campos marcados con * no pueden ser nulos');
      return;
    }

    if (
      form.type_identification === 'cédula' &&
      form.identication.trim().length !== 10
    ) {
      alert('La cédula debe tener 10 dígitos');
      return;
    }

    if (
      form.type_identification === 'ruc' &&
      form.identication.trim().length < 13
    ) {
      alert('El RUC debe tener 13 dígitos');
      return;
    }

    if (
      form.type_identification === 'pasaporte' &&
      form.identication.trim().length < 3
    ) {
      alert('El pasaporte debe tener mínimo 3 dígitos');
      return;
    }

    if (form.name.trim().length < 3 || form.license_plate.trim().length < 3) {
      alert('El nombre y la placa debe tener mínimo 3 dígitos');
      return;
    }

    return true;
  };

  //Change data in to input form
  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  render() {
    let { form } = this.state;

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              type: 'button',
              id: 'tooltip-save-carrier',
              action: this.submit,
              icon: 'save',
              msmTooltip: 'Guardar cliente',
              color: 'primary',
            },
          ]}
          heading="Transportistas"
          subheading="Registro de un nuevo transportista."
          icon="pe-7s-add-user icon-gradient bg-mean-fruit"
        />
        <ReactCSSTransitionGroup
          component="div"
          transitionName="TabsAnimation"
          transitionAppear={true}
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <Row>
            <Col lg="6">
              <Card className="main-card mb-3">
                <CardBody>
                  <Form className="text-right">
                    <Row form>
                      <p className="mt-2">
                        <strong>Nota:</strong> Los campos marcados con * son
                        obligatorios
                      </p>
                    </Row>
                    <FormGroup className="mb-1" row>
                      <Label for="type_identification" sm={4}>
                        Tipo de identicatión *
                      </Label>
                      <Col sm={6}>
                        <CustomInput
                          bsSize="sm"
                          onChange={this.handleChange}
                          value={form.type_identification}
                          type="select"
                          id="type_identification"
                          name="type_identification"
                          requiered
                        >
                          <option value="cédula">Cédula</option>
                          <option value="ruc">RUC</option>
                          <option value="pasaporte">Pasaporte</option>
                        </CustomInput>
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                      <Label for="identication" sm={4}>
                        Identificación *
                      </Label>
                      <Col sm={6}>
                        <Input
                          bsSize="sm"
                          onChange={this.handleChange}
                          value={form.identication}
                          type="text"
                          id="identication"
                          name="identication"
                          maxlength={
                            form.type_identification === 'cédula' ? 10 : 13
                          }
                          requiered
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                      <Label for="name" sm={4}>
                        Nombre *
                      </Label>
                      <Col sm={6}>
                        <Input
                          bsSize="sm"
                          onChange={this.handleChange}
                          value={form.name}
                          type="text"
                          id="name"
                          name="name"
                          maxlength={300}
                          requiered
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                      <Label for="license_plate" sm={4}>
                        Placa *
                      </Label>
                      <Col sm={6}>
                        <Input
                          bsSize="sm"
                          onChange={this.handleChange}
                          value={form.license_plate}
                          type="text"
                          id="license_plate"
                          name="license_plate"
                          maxlength={20}
                          requiered
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-0" row>
                      <Label for="email" sm={4}>
                        Correo electrónico
                      </Label>
                      <Col sm={6}>
                        <Input
                          bsSize="sm"
                          onChange={this.handleChange}
                          value={form.email}
                          type="email"
                          id="email"
                          name="email"
                        />
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ReactCSSTransitionGroup>
      </Fragment>
    );
  }
}

export default FormCarrier;
