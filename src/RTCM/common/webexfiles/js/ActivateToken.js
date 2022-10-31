import React, {Component} from 'react';
import {Button, Col, Form} from "react-bootstrap";
import {activateTokenapi} from "../../../../api";

class ActivateToken extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newToken: null
        }
    }

    onElementValueChange = (event) => {
        debugger
        const value = event.target.value;
        this.setState({
            newToken : value
        });
    };

    activateToken = (token) => {
        debugger
        activateTokenapi(this.tokenActiveSuccess, this.tokenActiveFail, token)
    };

    tokenActiveSuccess = (res) => {
        debugger
        if(res.data == false) {
            alert("Token Not Activate .");
        } else {
            alert("Token Activate .");
        }
    };

    tokenActiveFail = (err) => {
        debugger
        alert("Token Not Activate .");
    };

    render() {
        return (
            <div className="config-form-block sm-w-500" style={{margin: "0px auto"}}>
                <div>
                    <div className="config-form-block-header">
                        Activate Webex Token
                    </div>
                    <div>
                        <Form.Group size="sm" as={Col}>
                            <Form.Label>Paste your Token Here</Form.Label>
                            <Form.Control
                                placeholder="Token"
                                data-key="name"
                                onChange={this.onElementValueChange}
                                maxLength={700}
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group size="sm" as={Col} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 15
                        }}>
                            <Button
                                size="sm"
                                className="parameter-add-button"
                                onClick={
                                    ()=>{
                                        this.activateToken(this.state.newToken)
                                    }
                                }
                                variant="outline-secondary"
                            >
                                Activate
                            </Button>
                        </Form.Group>
                    </div>
                </div>
            </div>
        )
    }
}

export default ActivateToken;
