import React, { Component } from 'react';
import { InputGroup, Input, Button } from 'reactstrap';

class LoadFileXml extends Component {

    handleSelectFile = e => {
        let input = e.target;

        let reader = new FileReader();
        reader.onload = () => this.testDataXml(reader.result)
        reader.readAsText(input.files[0]);
    }

    handleButton = () => document.getElementById('file_invoice').click()

    testDataXml = xml => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");

        let comprobante = this._getTag(xmlDoc, "comprobante");

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(comprobante, "text/xml");

        // Solo RUC por que es de un proveedor 
        let ruc = this._getTag(xmlDoc, "ruc");
        let { contacts, selectContact, selectDocXml } = this.props;

        let provider = contacts.filter(c => c.ruc === ruc)[0]

        if (provider === undefined) {
            alert('No esta registrado el proveedor: ' + this._getTag(xmlDoc, "razonSocial"))
        } else {
            selectContact(provider.id)
            selectDocXml(xmlDoc)
        }
    }

    _getTag = (xmlDoc, tag) => xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue

    render = () => {

        return (
            <InputGroup size="sm">
                <Button type="button" onClick={this.handleButton}>Cargar XML</Button>
                <Input onChange={this.handleSelectFile} style={{ 'display': 'none' }} type="file" name="invoice" id="file_invoice" accept=".xml" />
            </InputGroup>
        );
    }
}

export default LoadFileXml