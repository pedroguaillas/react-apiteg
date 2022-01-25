import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { startSesion } from '../../actions/AuthActions';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: ''
        }
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // When the user click in submit
    onSubmit = e => {
        e.preventDefault();

        // Serealized attributes
        let { user, password } = this.state

        // Validate attributes
        if (user.trim() === '' || password.trim() === '') {
            alert('Todos los campos son obligatorios', 'alerta-error');
        }

        // Call_to_action
        this.props.startSesion({ user, password });
    }

    render() {

        let { authenticated } = this.props

        if (authenticated) {
            return <Redirect to="/dashboard/dashboard" />
        }

        let { user, password } = this.state

        return (
            <div style={styles.formusuario} >

                <div style={styles.contenedorform}>
                    <h1 fontSize={styles.title}>Iniciar Sesión</h1>

                    <form
                        style={styles.form}
                        onSubmit={this.onSubmit}
                    >

                        <div style={styles.campoform}>
                            <label style={styles.label} htmlFor="user">Usuario</label>
                            <input
                                style={styles.inputs}
                                type="text"
                                id="user"
                                name="user"
                                value={user}
                                onChange={this.onChange}
                            />
                        </div>

                        <div style={styles.campoform}>
                            <label style={styles.label} htmlFor="password">Contraseña</label>
                            <input
                                style={styles.inputs}
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={this.onChange}
                            />
                        </div>

                        {this.props.message ? (<div style={styles.alerta}> {this.props.message} </div>) : null}

                        <div style={styles.campoform, { margin: 0 }}>
                            <input style={styles.btn} type="submit" value="Iniciar Sesión" />
                        </div>
                    </form>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    authenticated: state.AuthReducer.authenticated,
    message: state.AuthReducer.message
});

const mapDispatchToProps = dispatch => ({
    startSesion: user => dispatch(startSesion(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = {
    formusuario: {
        // Variables
        '--blanco': '#ffffff',
        '--gris1': '#edf2f6',
        '--gris2': '#2f3848',
        '--gris3': '#1a202d',
        '--negro': '#000000',
        '--headingFont': 'sans-serif',
        '--textFont': 'sans-serif',
        // formusuario
        'background-color': 'var(--gris2)',
        'height': '100vh',
        'min-height': '800px',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        margin: '0'
    },
    contenedorform: {
        padding: '3rem 2rem',
        'max-width': '400px',
        width: '95%',
        'background-color': 'var(--blanco)',
        'border-radius': '1rem',
        '-webkit-box-shadow': '0px 6px 11px -8px rgba(0,0,0,0.9)',
        '-moz-box-shadow': '0px 6px 11px -8px rgba(0,0,0,0.9)',
        'box-shadow': '0px 6px 11px -8px rgba(0,0,0,0.9)'
    },
    title: {
        'font-family': 'var(--headingFont)',
        'font-weight': '900',
        margin: 'auto',
        display: 'block',
        // margin: '0 0 4rem 0',
        'text-align': 'center',
        color: 'var(--gris2)',
        'font-size': '3rem'
    },
    form: {
        'padding-top': '1rem',
    },
    campoform: {
        display: 'flex',
        'margin-bottom': '2rem',
        'align-item': 'center'
    },
    label: {
        flex: '0 0 100px',
        'font-family': 'var(--textFont)'
    },
    inputs: {
        border: '1px solid #e1e1e1',
        'border-radius': '.5rem',
        padding: '.5rem',
        flex: '1'
    },
    alerta: {
        'background-color': 'red',
        'border-radius': '.5rem',
        padding: '.5rem',
        color: 'var(--blanco)'
    },
    btn: {
        'margin-top': '1rem',
        'font-family': 'var(--headingFont)',
        padding: '.5rem',
        'font-size': '1.4',
        'font-weight': '400',
        'border-radius': '.5rem',
        border: 'none',
        transition: 'background-color .3s ease',
        // btn-primario
        'background-color': 'var(--gris2)',
        color: 'var(--blanco)',
        // btn-block
        display: 'block',
        width: '10em',
        cursor: 'pointer'
    }
}