import React, { PureComponent } from 'react';
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import CardTitle from 'reactstrap/lib/CardTitle';
import Col from 'reactstrap/lib/Col';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default class OrdersByMonths extends PureComponent {

    render() {

        let { color, items, title } = this.props

        if (items === null || items.length === 0) {
            return null
        }

        return (
            <Col md="12" lg="6">
                <Card className="main-card mb-3">
                    <CardBody>
                        <CardTitle className="text-center">{title}</CardTitle>
                        <div style={{ width: '100%', height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart width={150} height={40} data={items}>
                                    <Bar dataKey={title == 'Ventas' ? 'ingreso' : 'egreso'} fill={color} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>
            </Col>);
    }
}