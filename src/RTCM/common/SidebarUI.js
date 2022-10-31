import React from "react";
import {Form} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import logo from "./images/smart-ship-logo-white.png";


const SidebarUI = ({onNavClick, selectedNavOption}) => {
    return (
        <div style={{
            height: "100%",
            backgroundColor: "#5f5f5f",
            minWidth: 196
            // minWidth: 186 todo
        }}>
            <div className="smartShipNavBarColor">
                <div style={{padding: 8, backgroundColor: "#404040"}}>
                    <img
                        alt={"logo"}
                        src={logo}
                        style={{width: 170, height: 52}}/>
                </div>
            </div>
            <Navbar className="smartShipNavBarColor smartShipSideBar">

                <Form inline>
                </Form>
            </Navbar>
        </div>
    );
}
export default SidebarUI;
