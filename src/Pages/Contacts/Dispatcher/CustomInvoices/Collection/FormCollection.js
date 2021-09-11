import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

const FormCollection = ({ form, addvalue, submit }) => (
    <Form>
        <FormGroup>
            <Label for="datevalue">Fecha</Label>
            <Input onChange={addvalue} value={form.date} type="date"
                name="date" id="datevalue" required />
        </FormGroup>
        <FormGroup>
            <Label for="amountvalue">Monto ($)</Label>
            <Input onChange={addvalue} value={form.amount} type="number" pattern="[\d\.]*"
                name="amount" id="amountvalue" placeholder="12.50" required />
        </FormGroup>
        <Button type="submit" onClick={submit}>Guardar</Button>
    </Form>
)

export default FormCollection