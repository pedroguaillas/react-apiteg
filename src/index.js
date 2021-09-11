import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './assets/base.css';
import configureStore from './config/configureStore';

import Main from './Pages/Main';

const store = configureStore();

// ReactDOM.render(
//     <Provider store={store}>
//         <HashRouter>
//             <Main />
//         </HashRouter>
//     </Provider>,
//     document.getElementById('root')
// );

const rootElement = document.getElementById('root');

const renderApp = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <HashRouter>
                <Component />
            </HashRouter>
        </Provider>,
        rootElement
    );
};

renderApp(Main);

if (module.hot) {
    module.hot.accept('./Pages/Main', () => {
        const NextApp = require('./Pages/Main').default;
        renderApp(NextApp);
    });
}
