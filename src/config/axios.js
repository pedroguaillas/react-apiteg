import axios from 'axios';

const clientAxios = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
});

clientAxios.interceptors.response.use(
    response => response,
    (error) => {
        if (error.response.data.message === 'TOKEN_EXPIRED') {
            window.location = '/';
            // alert(JSON.stringify(error.response.config))
            // try {
            //     axios.get('api/refreshtoken', {
            //         baseURL: process.env.REACT_APP_BACKEND_URL,
            //         headers: error.response.config.headers
            //     })
            //         .then(res => AuthReducer.dispatch(refresthToken(res.data.token)))
            // } catch (error) {
            //     console.log(error)
            // }
        }
        // Do something with response error
        return Promise.reject(error);
    });

export default clientAxios;