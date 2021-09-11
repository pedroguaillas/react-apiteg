import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authenticated, ...props }) => (
    <Route {...props} render={props => !authenticated ?
        (
            <Redirect to="/" />
        ) :
        (
            <Component {...props} />
        )
    } />
);

const mapStateToProps = state => ({
    authenticated: state.AuthReducer.authenticated,
});

export default connect(mapStateToProps)(PrivateRoute);