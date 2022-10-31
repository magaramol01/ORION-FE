import React, {Component} from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import SmartShipLoader from "../common/SmartShipLoader";
import NavigationBar from "../common/NavigationBar";
import md5 from 'md5-hash';
import {updatePassword} from '../../../api';
import CustomAlert from "../custom/CustomAlert";
import Cryptr from "cryptr";

const cryptr = new Cryptr('myTotalySecretKey');

class ResetPasswordLink extends Component{
    constructor(props) {
        super(props);
        this.state = {
            email : null,
            newPassword: null,
            confirmPassword: null,
            errors:{
                newPassword: "",
                confirmPassword: "",
            },
            loading: false,

        };
        this.customAlertRef = React.createRef();

    }

    componentDidMount() {
        let linkLoc = ((window.location.href).split("#/")[1]).split("/")[1];
        this.setState({email : cryptr.decrypt(linkLoc) })
    }


    handleChange = e =>{
        const {name, value } = e.target;
        let errors = this.state.errors;

        switch(name){

            case 'newPassword':
                this.checkEnteredPassword(value, 'newPassword')
                break;

            case 'confirmPassword':
                let response = this.checkEnteredPassword(value, 'confirmPassword');
                if(response) {
                    if (value !== this.state.newPassword)
                        errors.confirmPassword = "New Password and Confirm Password must be same";
                    else
                        errors.confirmPassword = "";
                }
                break;

            default:
                break;

        }
        this.setState({errors,[name]:value})

    };


    checkEnteredPassword = (pass, selectedCase) => {
        let errors = this.state.errors;
        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        let flag = true;
        if(pass.length !== 0) {
            if(pass.search(/[0-9]/) === -1) {
                flag = false;
                errors[selectedCase] = "Password must contain at least one digit.";
            }
            else if(pass.length < 8){
                flag = false;
                errors[selectedCase] = "Password must be at least 8 characters long.";
            }
            else if(pass.search(/[a-z]/) === -1) {
                flag = false;
                errors[selectedCase] = "Password must contain at least one lower case.";
            }
            else if(pass.search(/[A-Z]/) === -1) {
                flag = false;
                errors[selectedCase] = "Password must contain at least one upper case.";
            }
            else if(!format.test(pass)){
                flag = false;
                errors[selectedCase] = "Password must contain at least one special character."
            }
            else {
                flag = true;
                errors[selectedCase] = "";
            }
        } else {
            flag = false;
            errors[selectedCase] = "Please enter valid password.";
        }
        return flag;

    }

    updatePassword = () => {
        const {errors} = this.state;

        if(errors.confirmPassword === "" && errors.newPassword === "" && this.state.newPassword !== null && this.state.confirmPassword !== null) {
            const payload = {
                "email" : this.state.email,
                "encPassword" : md5(this.state.newPassword),
                "plainText" : this.state.newPassword
            };

            updatePassword(this.onUpdatePasswordSuccess, this.onUpdatePasswordFailure, payload);
        }
    };

    onUpdatePasswordSuccess = (res) => {

        if (res.data) {
            this.showAlert({
                type: "success",
                message: "PASSWORD UPDATED SUCCESSFULLY !!!"
            });
        }
        else {
            this.showAlert({
                type: "error",
                message: "FAILED TO UPDATE PASSWORD !!!"
            });

        }
        window.setTimeout(() => {
            this.resetToDefaultView();
        }, 1000);

    };
    onUpdatePasswordFailure = (err) => {
        this.resetToDefaultView();
        console.log(err)
    };

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    resetToDefaultView = () => {
        this.props.history.push({pathname:"/UserLogin"});
    };

    render() {
        const {errors} = this.state;

        return (

            <div className="smartShipBody d-flex flex-column h-100">
                <SmartShipLoader isVisible={this.state.loading}/>
                <CustomAlert ref={this.customAlertRef}/>
                <NavigationBar
                    onBackPress={this.resetToDefaultView}
                    title={"Reset Password"}/>
                <div
                    className="d-flex justify-content-center mt-5"
                    xs={12} md={12} lg={12}
                >
                    <div className="config-form-block sm-w-500" style={{margin: "0px auto"}}>
                        <div>
                            <div className="config-form-block-header">
                                Reset Password
                            </div>
                            <div>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>New Password</Form.Label>

                                    <Form.Control
                                        placeholder="New Password"
                                        onChange={this.handleChange}
                                        maxLength={100}
                                        autoComplete="off"
                                        type="password"
                                        name="newPassword"
                                        noValidate
                                        required = "true"
                                    />
                                    {errors.newPassword.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {errors.newPassword}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Confirm Password</Form.Label>

                                    <Form.Control
                                        placeholder="Confirm Password"
                                        onChange={this.handleChange}
                                        maxLength={100}
                                        autoComplete="off"
                                        type="password"
                                        name="confirmPassword"
                                        required = "true"

                                    />
                                    {errors.confirmPassword.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {errors.confirmPassword}
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
                                    variant="outline-secondary"
                                    style={{align: "right"}}
                                    onClick = {this.updatePassword}
                                    type="submit"
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
export default ResetPasswordLink;
