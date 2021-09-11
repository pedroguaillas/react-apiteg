import React, { Component, Fragment } from 'react';
import { Row, Col, Card } from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import CreateModal from './CreateModal';
import TableDispatcher from './TableDispatcher';

import clienteAxios from '../../../config/axios';
import tokenAuth from '../../../config/token';

export default class Dispatchers extends Component {

    state = { dispatchers: null }

    async componentDidMount() {
        tokenAuth(this.props.token);
        try {
            await clienteAxios.get('dispatchers')
                .then(res => this.setState({ dispatchers: res.data }))
        } catch (error) {
            console.log(error)
        }
    }

    //ad Custom
    addDispatcher = dispatcher => this.setState(state => ({ dispatchers: [...state.dispatchers, dispatcher] }))

    //Update one ccustom in to list ccustoms
    editDispatcher = (dispatcher) => {
        const index = this.state.dispatchers.findIndex(data => data.id === dispatcher.id)
        const dispatchers = [
            // destructure all items from beginning to the indexed item
            ...this.state.dispatchers.slice(0, index),
            // add the updated item to the array
            dispatcher,
            // add the rest of the items to the array from the index after the replaced item
            ...this.state.dispatchers.slice(index + 1)
        ]
        this.setState({ dispatchers })
    }

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Transportistas"
                    subheading="Lista de todos los transportistas."
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
                        addDispatcher={this.addDispatcher}
                    />

                    <Row>
                        <Col lg="12">
                            <Card className="main-card mb-3">

                                <TableDispatcher
                                    dispatchers={this.state.dispatchers}
                                    editDispatcher={this.state.editDispatcher}
                                />

                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
