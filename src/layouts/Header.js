import React, { useState } from 'react';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

export default props => {
    const [state, setState] = useState({
        isOpen: false
    });
    const toggle = () => {
        setState({
            isOpen: !state.isOpen
        });
    }
    return (
        <div className="Header">
            <Navbar color="light" light expand="md" className="fixed-top">
                <NavbarBrand href="/">bdtnetwork</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                        Name
                        </DropdownToggle>
                        <DropdownMenu right>
                        <DropdownItem>
                            My Account
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                            Sign out
                        </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}