import Navbar from "react-bootstrap/Navbar";
import logo from "../common/images/smart-ship-logo-white.png";
import Nav from "react-bootstrap/Nav";
import {Form} from "react-bootstrap";
import React, {Component} from "react";

class NavigationBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar className="smartShipNavBarColor">
                <img alt={"logo"} src={logo} style={{width: 170, height: 52}}
                    onClick={() => console.log()}/>
                {/*<Navbar.Brand href="#home">Navbar</Navbar.Brand>*/}
                <Nav className="mr-auto"/>
                <Form inline>
{/*                    <Nav className="mr-auto">
                        <Nav.Link href="#home" data-navname="whatever" onClick={(e) => {
                            console.log(e)
                        }}>Connect</Nav.Link>
                        <Nav.Link href="#features">Logout</Nav.Link>
                    </Nav>*/}
                </Form>
            </Navbar>
        )
    }

}

export default NavigationBar;
