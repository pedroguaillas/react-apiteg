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
        let authorization = this._getTag(xmlDoc, "numeroAutorizacion");

        parser = new DOMParser();
        xmlDoc = parser.parseFromString(comprobante, "text/xml");

        // Solo RUC por que es de un proveedor 
        let ruc = this._getTag(xmlDoc, "ruc");
        let { providers, selectProvider, selectDocXml, registerProvider } = this.props;

        // let provider = providers.filter(c => c.identication === ruc)[0]

        // if (provider === undefined) {
        let objProvider = {
            type_identification: 'ruc',
            identication: ruc,
            name: this._getTag(xmlDoc, "razonSocial"),
            address: this._getTag(xmlDoc, "dirMatriz")
        }
        registerProvider(objProvider)
        // } else {
        //     selectProvider(provider.id)
        // }
        selectDocXml(xmlDoc, authorization)
    }

    _getTag = (xmlDoc, tag) => xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue.trim()

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