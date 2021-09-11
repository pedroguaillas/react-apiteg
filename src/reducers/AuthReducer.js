import {
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    REFRESH_TOKEN,
    LOGOUT_SESSION
} from '../types';

const initialState = {
    token: null,
    authenticated: false,
    user: null,
    message: null,
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                authenticated: true,
                token: action.payload.token,
                user: action.payload.user,
                message: null,
                cargando: false
            }
        case LOGIN_ERROR:
            return {
                ...state,
                message: action.payload.message
            }
        case REFRESH_TOKEN:
            return {
                ...state,
                token: action.payload
            }
        case LOGOUT_SESSION:
            return {
                token: null,
                authenticated: false,
                user: null,
                message: null,
                loading: false
            }
        default: return state;
    }
}