import api from '../services/api';

import {
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    REFRESH_TOKEN,
    LOGOUT_SESSION
} from '../types';

// When the user click in submit
export function startSesion(user) {

    return async (dispatch) => {
        try {
            const response = await api.post('api/login', user);
            localStorage.setItem('russ', response.data.token);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            const alert = {
                // message: error.message,
                message: 'Usuario o contraseña incorrecto',
                category: 'alert-error'
            }
            dispatch({
                type: LOGIN_ERROR,
                payload: alert
            })
        }
    }
}

export function refresthToken(token) {
    return (dispatch) => {
        localStorage.setItem('russ', token);
        dispatch({
            type: REFRESH_TOKEN,
            payload: token
        })
    }
}

export function logout(token) {
    return async (dispatch) => {
        try {
            await api.get('logout');
            localStorage.removeItem('russ');
            dispatch({
                type: LOGOUT_SESSION
            })
        } catch (error) {
            console.log(error)
        }
    }
}