import jwtDecode from 'jwt-decode';
import { refresthToken } from '../actions/AuthActions';
import axiosInstance from './api';

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    async (req) => {
      const { dispatch, getState } = store;
      let {
        AuthReducer: { token },
      } = getState();

      // // Cuando este autenticado va existir el token y se debe poner en la cabecera
      // // El caso contrario se va utilizar para logear y crear nueva cuenta que no requieren token
      if (token !== null) {
        const { exp } = jwtDecode(token);
        const currentDate = new Date().getTime();
        if (exp * 1000 <= currentDate) {
          try {
            let headers = { 'Content-Type': 'application/json' };
            headers['Authorization'] = `Bearer ${token}`;
            const url = process.env.REACT_APP_BACKEND_URL;
            await fetch(`${url}api/refreshtoken`, {
              method: 'GET',
              headers,
            })
              .then((res) => res.json())
              .then((data) => {
                req.headers.common['Authorization'] = `Bearer ${data.token}`;
                dispatch(refresthToken(data.token));
              });
          } catch (err) {
            console.log(err);
          }
        } else {
          req.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      return req;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response.data.message === 'TOKEN_EXPIRED') {
        window.location = '/';
        return Promise.reject(err);
      } else {
        return err;
      }
    }
  );
};

export default setup;
