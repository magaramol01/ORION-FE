import Navbar from "react-bootstrap/Navbar";
import logo from "../../Images/smart-ship-logo-white.png";
import nova from '../../Images/nova-logo.png';
import Nav from "react-bootstrap/Nav";
import {Button, Form} from "react-bootstrap";
import React from "react";
import {deploymentType} from "../../../api";
import {getItemFromLocalStorage} from "../../../RTCM/common/helper";


export default function NavigationBar({
                                          onBackPress,
                                          title = "Configuring Condition-based Alarms",
                                          redirectMethod
                                      }) {

    return (
        <Navbar className="smartShipNavBarColor">
            <Navbar.Brand href="#"><img src={logo} width="121px" height="40px" /></Navbar.Brand>
            <Nav className="mr-auto">
                <Navbar.Text style={{fontSize:'21px',color:'white'}}> {title}</Navbar.Text>
            </Nav>
            <Form inline>
                {
                    (title==='Alarm') && (
                        (deploymentType==='shore') ? (
                            (getItemFromLocalStorage("createRules")!=="false") && (
                                <Button
                                    size="sm"
                                    className="alarm-header-button parameter-add-button mr-sm-2"
                                    onClick={() => {redirectMethod()}}
                                    disabled={false}
                                >
                                    Create and Change Rules
                                </Button>
                            )
                        ) : (
                            <Button className="sm-nav-header" style={{paddingLeft:800}}>Show All Rules</Button>
                        )
                    )
                }
                <img
                    alt={"logo"} src={nova}
                    style={{
                        width:'100px',
                        height:'36px',
                    }}
                />

            </Form>
        </Navbar>
    )
}
