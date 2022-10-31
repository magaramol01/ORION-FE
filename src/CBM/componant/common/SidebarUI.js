import React from "react";
import {Form} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../../Images/smart-ship-logo-white.png";
import {formOptions} from "../Constants";
const backgroundColor = "#000000";


const SidebarUI = ({onNavClick, selectedNavOption}) => {
    return (
        <div style={{
            height: "100%",
            // backgroundColor: "#5f5f5f",
            backgroundColor,
            minWidth: 196,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
            // minWidth: 186 todo
        }}>
            <div className="smartShipNavBarColor">
                <div style={{padding: 8, backgroundColor}}>
                    <img
                        alt={"logo"}
                        src={logo}
                        style={{width: 170, height: 52}}/>
                </div>
            </div>
            <Navbar
                className="smartShipNavBarColor smartShipSideBar"
                style={{
                    alignItems: "flex-start",
                    backgroundColor: "#161719"
                }}
            >
                <Nav className="mr-auto">
                    {
                        Object.keys(formOptions).map((navOption) => (
                            <Nav.Link
                                key={`subNav-${navOption}`}
                                data-navname={navOption}
                                className={selectedNavOption === navOption ? "active" : ""}
                                onClick={onNavClick}
                            >{formOptions[navOption].name}</Nav.Link>))
                    }
                </Nav>
                <Form inline>
                </Form>
            </Navbar>
        </div>
    );
}
export default SidebarUI;
