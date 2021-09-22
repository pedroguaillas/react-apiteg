import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import clienteAxios from '../../config/axios';
import './index.css';

const NuevaCuenta = () => {

    const initialBusiness = {
        ruc: '',
        company: '',
        economic_activity: '',
        // type: '', -- No requiere por que es caculable con el tercer digito de la cedula
        special: null, //For bussiness requiere number if exist
        accounting: false,
        micro_business: false,
        retention_agent: null,
        phone: '',
        logo: null,
        cert: null,
        extention_cert: '',
        pass_cert: '',
        user: '',
        password: '',
        email: ''
    }

    const [business, setBusiness] = useState(initialBusiness);
    const [alert, setAlert] = useState({
        state: false,
        message: null,
        type: null
    });

    const onChange = e => {
        setBusiness({
            ...business,
            [e.target.name]: e.target.value
        })
    }

    const onChangeCheckbox = e => {
        setBusiness({
            ...business,
            [e.target.name]: e.target.checked
        })
    }

    const loadFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        let file = files[0]
        let { name, name: { length } } = file
        setBusiness({
            ...business,
            [e.target.name]: file,
            extention_cert: name.substring(length - 4, length),
        })
        // createImage(files[0], e.target.name);
    }

    const createImage = (file, name) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            setBusiness({
                ...business,
                [name]: e.target.result
            })
        };
        reader.readAsDataURL(file);
    }

    // When register company
    const onSubmit = e => {
        e.preventDefault();

        // Validate empty field
        if (business.ruc.trim() === '' ||
            business.company.trim() === '' ||
            // cert.trim() === '' ||
            // pass_cert.trim() === '' ||
            business.user.trim() === '' ||
            business.password.trim() === '' ||
            business.email.trim() === '') {
            setAlert({
                state: true,
                message: 'Los campos con * son obligatorios',
                type: 'alert-error'
            })
            return;
        }

        // Password min of 6 character
        if (business.password.length < 6) {
            setAlert({
                state: true,
                message: 'La contraseña debe ser de al menos 6 caracteres',
                type: 'alert-error'
            });
            return;
        }

        // Send
        registrarCompany();
    }

    // Save database
    const registrarCompany = async () => {

        let { ruc, company, economic_activity, accounting, micro_business, retention_agent,
            logo, phone, cert, extention_cert, pass_cert, user, password, email } = business

        let data = new FormData();
        data.append('ruc', ruc);
        data.append('company', company);
        if (logo) { data.append('logo', logo) }
        data.append('economic_activity', economic_activity);
        data.append('accounting', accounting)
        data.append('micro_business', micro_business)
        // if (accounting) { data.append('accounting', true) }
        // if (micro_business) { data.append('micro_business', true) }
        if (retention_agent) { data.append('retention_agent', retention_agent) }
        if (phone) { data.append('logo', phone) }
        if (cert) { data.append('cert', cert) }
        if (extention_cert) { data.append('extention_cert', extention_cert) }
        if (pass_cert) { data.append('pass_cert', pass_cert) }
        data.append('user', user);
        data.append('password', password);
        data.append('email', email);
        try {
            const response = await clienteAxios.post('api/companies', data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            console.log(response.data.user);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="form-usuario">
            {alert.state ? (<div className={`alert ${alert.type}`}> {alert.message} </div>) : null}
            <div className="contenedor-form sombra-dark">
                <h1>Registrar compañia</h1>

                <form
                    onSubmit={onSubmit}
                    method="post" encType="multipart/form-data"
                >
                    <div className="campo-form">
                        <label htmlFor="ruc">RUC *</label>
                        <input type="text" id="ruc" name="ruc"
                            value={business.ruc} onChange={onChange} maxLength={13} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="company">Compañia *</label>
                        <input type="text" id="company" name="company"
                            value={business.company} onChange={onChange} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="logo">Logo</label>
                        <input type="file" id="logo" name="logo"
                            onChange={loadFile} accept="image/*" />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="economic_activity">Actividad económica *</label>
                        <select name="economic_activity" value={business.economic_activity} onChange={onChange}>
                            <option value="">Seleccione</option>
                            <option value="comercial">Comercial</option>
                            <option value="construcción">Construcción</option>
                        </select>
                    </div>

                    <div className="campo-form">
                        <label htmlFor="accounting">Obligado llevar contabilidad</label>
                        <input type="checkbox" id="accounting" name="accounting"
                            checked={business.accounting} onChange={onChangeCheckbox} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="micro_business">Microempresa</label>
                        <input type="checkbox" id="micro_business" name="micro_business"
                            checked={business.micro_business} onChange={onChangeCheckbox} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="retention_agent">Agente de Retención</label>
                        <input type="text" id="retention_agent" name="retention_agent"
                            value={business.retention_agent} onChange={onChange} max={10} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="phone">Teléfono</label>
                        <input type="text" id="phone" name="phone"
                            value={business.phone} onChange={onChange} min={10} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="cert">Certificado digital</label>
                        <input type="file" id="cert" name="cert"
                            onChange={loadFile} accept=".p12, .pfx" />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="pass_cert">Contraseña certificado</label>
                        <input type="password" id="pass_cert" name="pass_cert"
                            value={business.pass_cert} onChange={onChange} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="email">Correo electrónico *</label>
                        <input type="email" id="email" name="email"
                            value={business.email} onChange={onChange} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="user">Usuario *</label>
                        <input type="text" id="user" name="user"
                            value={business.user} onChange={onChange} />
                    </div>

                    <div className="campo-form">
                        <label htmlFor="password">Contraseña usuario *</label>
                        <input type="password" id="password" name="password"
                            value={business.password} onChange={onChange} />
                    </div>

                    <div className="campo-form">
                        <input type="submit" className="btn btn-primario btn-block" value="Registrarme" />
                    </div>
                </form>

                <Link to={'/'} className="enlace-cuenta">
                    Volver a Iniciar Sesión
                </Link>
            </div>
        </div>
    );
}

export default NuevaCuenta;