import React, { Component, Fragment } from 'react';
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, UncontrolledTooltip,
    Nav, NavItem, NavLink, Button
} from 'reactstrap';
import { faFilePdf, faPlus, faSave, faBusinessTime, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class TitleComponent2 extends Component {

    state = {
        options: null
    }

    componentDidMount() {
        if (this.props.options) {
            this.setState((state, props) => ({ options: props.options }))
        }
    }

    toggle(name) {
        this.setState({
            [name]: !this.state[name],
            progress: 0.5,
        })
    }

    renderIcon = (icon) => {
        switch (icon) {
            case 'pdf': return faFilePdf
            case 'save': return faSave
            case 'plus': return faPlus
            case 'import': return faFileImport
        }
    }

    render() {
        let { options } = this.state
        if (options === null) {
            return ''
        } else {
            return (
                <Fragment>
                    {options.map(option => {
                        if (option.type === 'button') {
                            return (
                                <Fragment>
                                    <Button className="btn-shadow ml-2" onClick={option.action} color={option.color} id={option.id}>
                                        <FontAwesomeIcon icon={this.renderIcon(option.icon)} />
                                        {/* <FontAwesomeIcon icon={option.icon === 'plus' ? faPlus : (option.icon === 'pdf' ? faFilePdf : faSave)} /> */}
                                    </Button>
                                    <UncontrolledTooltip placement="left" target={option.id}>
                                        {option.msmTooltip}
                                    </UncontrolledTooltip>
                                </Fragment>
                            )
                        } else {
                            return (
                                <UncontrolledDropdown className="d-inline-block">
                                    <DropdownToggle color="info" className="btn-shadow" caret>
                                        <span className="btn-icon-wrapper pr-2 opacity-7">
                                            <FontAwesomeIcon icon={faBusinessTime} />
                                        </span>
                                        Agregar
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <Nav vertical>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);">
                                                    <i className="nav-link-icon lnr-inbox"> </i>
                                                    <span>Inbox</span>
                                                    <div className="ml-auto badge badge-pill badge-secondary">86
                                                    </div>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);">
                                                    <i className="nav-link-icon lnr-book"> </i>
                                                    <span>Book</span>
                                                    <div className="ml-auto badge badge-pill badge-danger">5</div>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);">
                                                    <i className="nav-link-icon lnr-picture"> </i>
                                                    <span>Picture</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink disabled href="javascript:void(0);">
                                                    <i className="nav-link-icon lnr-file-empty"> </i>
                                                    <span>File Disabled</span>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            )
                        }
                    })
                    }
                </Fragment>
            );
        }
    }
}
