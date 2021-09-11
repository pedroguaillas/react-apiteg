import React, { Fragment } from 'react';

class AppFooter extends React.Component {

    render() {

        return (
            <Fragment>
                <div className="app-footer">
                    <div className="app-footer__inner">
                        <div className="app-footer-left">
                            <ul className="nav">
                                <li className="nav-item">
                                    <a href="javascript:void(0);" className="nav-link">
                                        Auditeg
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="javascript:void(0);" className="nav-link">
                                        Sistema Integral
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="app-footer-right">
                            <ul className="nav">
                                <li className="nav-item">
                                    <a href="javascript:void(0);" className="nav-link">
                                        Auditeg
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="javascript:void(0);" className="nav-link">
                                        <div className="badge badge-success mr-1 ml-0">
                                            <small>NEW</small>
                                        </div>
                                        Sistema Integral
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default AppFooter;