import React , {Component} from 'react';
import {Button , Form } from 'react-bootstrap';
import logo from '../../Images/smart-ship-logo-white.png'
import '../../css/fontFamily.css'
import '../../css/common.css'
import {Redirect} from "react-router-dom";


class Login extends Component {
    constructor (props) {
        super (props);
        this.state = {
            redirectToLogin: false
        }
    }

    onSubmitClick = () => {
        debugger
        this.setState({
            redirectToLogin: true
        });
    };

    render () {

        return (
            <div style={{width: "100vw", height: "100vh", overflow: "hidden"}}>
                {
                    this.state.redirectToLogin && (<Redirect to="/AddCase"/>)
                }
                <div style={{width: "100%",height: "100%",overflow: "auto", display: "flex", flexDirection: "row"}}>
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        className="animationClass">
                        <div className="logo">
                            <img alt={"logo"} src={logo} style={{}}/>
                        </div>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            // borderWidth: 1,
                            // borderColor: "yellow",
                            // backgroundColor: "red"
                        }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            // backgroundColor: "blue",
                            width: 400,
                            margin: "0 3rem"
                        }}>

                            <Form.Group controlId="gno">
                                <Form.Control className="login-input" type="text"
                                              style={{fontsize : ".95rem" , color : '#495057'}}
                                              placeholder="Email ID" value="SmartShip"
                                              onChange={this.handleNameChange}
                                              required/>
                            </Form.Group>
                            <Form.Group controlId="verCode">
                                <Form.Control className="login-input" type="password"
                                              style={{fontsize : ".95rem" , color : '#495057' , marginTop : 10}}
                                              placeholder="Password" value={1233213}
                                              onChange={this.handlePasswardChange} required/>
                            </Form.Group>
                            <Button
                                className="login-btn"
                                type="submit"
                                disabled={false}
                                onClick={this.onSubmitClick}
                            >
                                LOGIN
                            </Button>
                        </div>
                        {/*<div style={{borderWidth: 1, borderColor: "black", height: 50, width: 50, backgroundColor: 'blue'}}>
                        </div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
