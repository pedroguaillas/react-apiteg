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
  Alert,
} from 'reactstrap';
import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import api from '../../../services/api';

class FormProvider extends Component {
  state = {
    form: {
      type_identification: 'ruc',
    },
    error: null
  };

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;
    if (params.id) {
      try {
        await api.get(`providers/${params.id}/edit`).then((res) => {
          this.setState({ form: res.data.provider });
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
          await api.put(`providers/${form.id}`, form).then((res) => {
            if (res.data.message === 'KEY_DUPLICATE') {
              alert('Ya existe un proveedor con esa identificación');
              return;
            }
            this.props.history.push('/contactos/proveedores');
          });
        } else {
          await api.post('providers', form).then((res) => {
            if (res.data.message === 'KEY_DUPLICATE') {
              alert('Ya existe un proveedor con esa identificación');
              return;
            }
            this.props.history.push('/contactos/proveedores');
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

    if (form.identication === undefined || form.name === undefined) {
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
      alert('El pasaporte debe tener mínimo 3 caracteres');
      return;
    }

    if (form.name.trim().length < 3) {
      alert('El nombre debe tener mínimo 3 caracteres');
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

  //Change data in to input form
  handleChangeIdentification = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })

    if (this.state.form.id === undefined) this.searchByIdentification(e.target.value)
  }

  searchByIdentification = async (identication) => {
    let { type_identification } = this.state.form
    if (identication !== undefined) {

      if ((type_identification === 'ruc' && identication.length === 13)) {
        try {
          await api.get(`providers/searchByRuc/${identication}`).then((res) => {
            if (res.data.provider !== null) {
              if (res.data.provider.branch_id === 0) {
                const { name, address, email, phone } = res.data.provider
                this.setState({
                  form: {
                    ...this.state.form,
                    name, address, email, phone,
                  },
                  error: null
                })
              } else {
                this.setState({ error: 'El proveedor ya esta registrado' })
              }
            }
          });
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  render() {
    let { form, error } = this.state;

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              type: 'button',
              id: 'tooltip-save-customer',
              action: this.submit,
              icon: 'save',
              msmTooltip: 'Guardar cliente',
              color: 'primary',
            },
          ]}
          heading="Proveedores"
          subheading="Registro de un nuevo proveedor"
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
                          <option value="ruc">RUC</option>
                          <option value="cédula">Cédula</option>
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
                          onChange={this.handleChangeIdentification}
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
                      <Label for="address" sm={4}>
                        Dirección
                      </Label>
                      <Col sm={6}>
                        <Input
                          bsSize="sm"
                          onChange={this.handleChange}
                          value={form.address}
                          type="text"
                          id="address"
                          name="address"
                          maxlength={300}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" row>
                      <Label for="phone" sm={4}>
                        Teléfono
                      </Label>
                      <Col sm={6}>
                        <Input
                          bsSize="sm"
                          onChange={this.handleChange}
                          value={form.phone}
                          type="text"
                          id="phone"
                          name="phone"
                          maxlength={13}
                          pattern="[0-9]{10,15}"
                          title="Teléfono ejemplo 0939649714"
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
                    {
                      error !== null ? <Alert color='danger'>{error}</Alert> : null
                    }
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

export default FormProvider;
