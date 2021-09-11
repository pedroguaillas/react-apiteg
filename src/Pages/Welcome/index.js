import React, { Fragment } from 'react';

import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';

const Welcome = () => {
    return (
        <Fragment>
            <AppHeader />
            <div className="app-main">
                <AppSidebar />
                <div className="app-main__outer">
                    <div className="app-main__inner">

                        <h1>From Welcome</h1>
                        {/* <Route path={`${match.url}/perfil`} component={Profile} />
                        <Route path={`${match.url}/establecimientos`} component={Branch} /> */}
                    </div>
                    <AppFooter/>
                </div>
            </div>
        </Fragment>
    )
}

export default Welcome;