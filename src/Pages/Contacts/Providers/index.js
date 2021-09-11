import React, { Component, Fragment } from 'react'
import { Row, Col, Card } from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import ReactCSSTransitionGroup from "react-addons-css-transition-group"

import CreateModal from './CreateModal'
import TableProviders from './TableProviders'

export default class Providers extends Component {

    state = { providers: null }

    componentDidMount() {
        // fetch(API_BASE_URL + 'providers')
        //     .then(response => response.json())
        //     .then(providers => this.setState({ providers }))
    }

    //ad Provider
    addProvider = provider => this.setState(state => ({ providers: [...state.providers, provider] }))

    //Update one provider in to list Providers
    editProvider = (provider) => {
        const index = this.state.providers.findIndex(data => data.id === provider.id)
        const providers = [
            // destructure all items from beginning to the indexed item
            ...this.state.providers.slice(0, index),
            // add the updated item to the array
            provider,
            // add the rest of the items to the array from the index after the replaced item
            ...this.state.providers.slice(index + 1)
        ]
        this.setState({ providers })
    }

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Proveedores"
                    subheading="Lista de todos los proveedores."
                    icon="pe-7s-car icon-gradient bg-mean-fruit"
                />
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <CreateModal
                        action='add'
                        addProvider={this.addProvider}
                    />

                    <Row>
                        <Col lg="12">
                            <Card className="main-card mb-3">

                                <TableProviders
                                    providers={this.state.providers}
                                    editProvider={this.editProvider}
                                />

                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
