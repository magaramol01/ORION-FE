import React, {Component} from 'react';
import {Button, Col, Form, Modal} from 'react-bootstrap';
import SmartShipLoader from "../common/SmartShipLoader";
import NavigationBar from "../common/NavigationBar";
import Cryptr from  "cryptr";
import {getEmail} from "../../../api";
import CustomAlert from "../custom/CustomAlert";

const cryptr = new Cryptr('myTotalySecretKey');
const emailRegex = RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]+$/);

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popup : false,
            resetLinkLocation :"",
            email : "",
            emailError : "",
            mailSent : "",
            loading : false,
            popupMsg : ""
        };
        this.customAlertRef = React.createRef();
    }

    componentDidMount() {
        let linkLoc = (window.location.href).split("#/");
        linkLoc[1] = "ResetPasswordLink/";
        let joinedString = linkLoc.join("#/")
        this.setState({resetLinkLocation : joinedString })
    }

    valid = () => {
        const {email} = this.state;
        if (!emailRegex.test(email))
            this.setState({emailError: "Invalid Email"})
        else
            return true;
    }

    onForgotPasswordInputChange = (e) => {
        const {name, value} = e.target;
        let error = "";
        if(value.length !== 0) {
            if (emailRegex.test(value)) {
                error = "";
            } else {
                error = "Invalid Email Address!";
            }
        } else {
            error = "Please enter valid email.";
        }
        this.setState({emailError:error,email:value});
    }

    submit = () => {
        const {emailError, email, resetLinkLocation} = this.state;
        if (emailError === "" && email !== "") {
            let encryptEmail = cryptr.encrypt(email);

            const payload = {
                Email: email,
                linkLocation : resetLinkLocation + encryptEmail
            }
            getEmail(this.onMailFoundSuccess, this.onMailNotFoundFailure, payload)
        }
    };

    onMailFoundSuccess = (res) => {
        if (res.data.status) {
            this.setState({popupMsg : res.data.msg});
            this.popupShow();
        }
        else{
            this.setState({popupMsg : res.data.msg});
            this.popupShow();
        }
    };

    onMailNotFoundFailure = (err) => {
        console.log(err)
        this.setState({
            loading: false
        })
        this.resetToDefaultView();
    };

    resetForm = () => {
        this.setState({emailError: ""})

    }

    resetToDefaultView = () => {
        this.props.history.push({pathname: "/UserLogin"});
    };

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    popupClose = () => {
        this.setState({popup: false});
        this.resetToDefaultView();
    }

    popupShow = () => {
        this.setState({popup: true});
    }

    render() {
        const {email, emailError, loading, popup, popupMsg} = this.state;

        return (
            <div className="smartShipBody d-flex flex-column h-100">
                <SmartShipLoader isVisible={loading}/>
                <CustomAlert ref={this.customAlertRef}/>
                <NavigationBar title={""}/>
                <div
                    className="d-flex justify-content-center mt-5"
                    xs={12} md={12} lg={12}
                >
                    <div className="config-form-block sm-w-500" style={{margin: "0px auto"}}>

                        <div>
                            <div className="config-form-block-header">
                                Forgot Password
                            </div>
                            <div>
                                <Modal
                                    size="md"
                                    show={popup}
                                    onHide={this.popupClose}
                                    backdrop="static"
                                    centered
                                >

                                    <Modal.Body>
                                        <p style={{textAlign:"center"}}>
                                            <Modal.Title style={{color: "#6d6d6c"}}>
                                                <h5>{ popupMsg }</h5>
                                            </Modal.Title>
                                        </p>
                                        <div className="sm-w-800" style={{textAlign: 'center'}}>
                                            <Button
                                                size="lg"
                                                className="parameter-add-button"
                                                variant="outline-secondary"
                                                onClick={this.popupClose}
                                            >
                                                OK
                                            </Button>
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </div>
                            <div>
                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        style={emailError.length > 0 ? {borderColor:"red"} : null}
                                        placeholder="eg. john@abc.com"
                                        type="email"
                                        name="email"
                                        onChange={this.onForgotPasswordInputChange}
                                        maxLength={60}
                                        autoComplete="off"
                                    />
                                    {emailError.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {emailError}
                                        </Form.Text>
                                    )}
                                </Form.Group>


                                <Button
                                    size="sm"
                                    className="parameter-add-button pull-right"
                                    style={{marginRight: "11px"}}
                                    onClick={this.resetToDefaultView}


                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="parameter-add-button pull-right "
                                    onClick={this.submit}
                                    variant="outline-secondary"

                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgotPassword;
