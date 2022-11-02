import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap'

const Description = ({ form, handleChange, edit }) => {

    return (
        <Row form>
            <Col md={6}>
                <FormGroup row>
                    <Label style={{ 'font-weight': 'bold' }} for="description" sm={4}>Comentarios:</Label>
                    <Col sm={6} hidden={edit}>
                        <Input bsSize="sm" onChange={handleChange} value={form.description} type="textarea"
                            name="description" id="description" />
                    </Col>
                    <Label className="text-left" sm={6} hidden={!edit}>{form.description}</Label>
                </FormGroup>
            </Col>
        </Row>
    );
}

export default Description;