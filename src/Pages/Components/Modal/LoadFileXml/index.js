import React, { Component } from 'react'
import { InputGroup, Input, Button } from 'reactstrap'

class LoadFileXml extends Component {
  handleSelectFile = e => {
    let input = e.target

    let reader = new FileReader()
    reader.onload = () => this.testDataXml(reader.result)
    reader.readAsText(input.files[0])
  }

  handleButton = () => document.getElementById('file_invoice').click()

  testDataXml = xml => {
    let parser = new DOMParser()
    let xmlDoc = parser.parseFromString(xml, 'text/xml')

    let comprobante = this._getTag(xmlDoc, 'comprobante')
    let authorization = this._getTag(xmlDoc, 'numeroAutorizacion')

    parser = new DOMParser()
    xmlDoc = parser.parseFromString(comprobante, 'text/xml')

    let tv = parseInt(this._getTag(xmlDoc, 'codDoc'))
    let { voucher_type } = this.props

    if (tv !== voucher_type) {
      alert(`No es un tipo de comprobante seleccionado`)
      return
    }

    // Solo RUC por que es de un proveedor
    let ruc = this._getTag(xmlDoc, 'ruc')
    let { selectDocXml, registerProvider } = this.props

    let objProvider = {
      type_identification: 'ruc',
      identication: ruc,
      name: this._getTag(xmlDoc, 'razonSocial'),
      address: this._getTag(xmlDoc, 'dirMatriz')
    }
    registerProvider(objProvider)
    selectDocXml(xmlDoc, authorization)
  }

  _getTag = (xmlDoc, tag) =>
    xmlDoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue.trim()

  render = () => {
    return (
      <InputGroup size='sm'>
        <Button type='button' onClick={this.handleButton}>
          Cargar XML
        </Button>
        <Input
          onChange={this.handleSelectFile}
          style={{ display: 'none' }}
          type='file'
          name='invoice'
          id='file_invoice'
          accept='.xml'
        />
      </InputGroup>
    )
  }
}

export default LoadFileXml
