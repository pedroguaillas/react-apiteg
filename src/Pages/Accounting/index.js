import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Layout
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';

// Financial Statement
import AccountSeat from './AccountSeat';
import DiaryBook from './FinancialStatements/DiaryBook';
import Ledger from './FinancialStatements/Ledger';
import BalancePurchase from './FinancialStatements/BalancePurchase';
import ResultState from './FinancialStatements/ResultState';
import BalanceSheet from './FinancialStatements/BalanceSheet';
import ChartOfAccounts from './ChartOfAccounts';

const Accounting = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">

                    <Route path={`${match.url}/plandecuentas`} component={ChartOfAccounts} />
                    <Route path={`${match.url}/librodiario`} component={DiaryBook} />
                    <Route path={`${match.url}/registrarasiento`} component={AccountSeat} />
                    <Route path={`${match.url}/libromayor`} component={Ledger} />
                    <Route path={`${match.url}/balancedecompras`} component={BalancePurchase} />
                    <Route path={`${match.url}/perdidasyganancias`} component={ResultState} />
                    <Route path={`${match.url}/balancegeneral`} component={BalanceSheet} />

                </div>
            </div>
        </div>
    </Fragment>
)

export default Accounting