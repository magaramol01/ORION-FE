import React, {Component} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import logo from '../common/images/smart-ship-logo-white.png'
import '../common/css/common.css'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="d-flex justify-content-center" style={{height: "100%"}}>
                <div
                    style={{
                        backgroundColor: "#2e2e2f",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1
                    }}
                    className="animationClass">
                    <div style={{}} className="logo">
                        <img alt={"logo"} src={logo} style={{}}/>
                    </div>
                </div>
                <div style={{
                    borderWidth: 5, bordeColor: "red",
                    flex: 1
                }}>
                    <Form.Group controlId="gno">
                        <Form.Control className="login-input" type="text"
                                      style={{fontsize: ".95rem", color: '#495057'}}
                                      placeholder="Email ID" value={this.state.uName}
                                      onChange={this.handleNameChange} required/>
                    </Form.Group>
                    <Form.Group controlId="verCode">
                        <Form.Control className="login-input" type="password"
                                      style={{fontsize: ".95rem", color: '#495057', marginTop: 10}}
                                      placeholder="Password" value={this.state.password}
                                      onChange={this.handlePasswardChange} required/>
                    </Form.Group>
                    <Row>
                        <Col style={{marginTop: 20,}} className="d-flex justify-content-center">
                            <Button className="login-btn" style={{}} type="submit"
                                    disabled={false} onClick={this.onSubmitClick}>
                                LOGIN
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Login;
