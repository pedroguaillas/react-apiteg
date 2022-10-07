import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'

// Layout
import AppSidebar from '../../Layout/AppSidebar'
import AppHeader from '../../Layout/AppHeader'
import Invoices from './Invoices'

//Import Local

const Sri = ({ match }) => (
  <Fragment>
    <AppHeader />
    <div className='app-main'>
      <AppSidebar />
      <div className='app-main__outer'>
        <div className='app-main__inner'>
          {/*Load table facturas*/}
          <Route path={`${match.url}`} component={Invoices} />
        </div>
      </div>
    </div>
  </Fragment>
)

export default Sri
