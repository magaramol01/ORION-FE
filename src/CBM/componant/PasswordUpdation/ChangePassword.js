import React, {Component} from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import SmartShipLoader from "../common/SmartShipLoader";
import NavigationBar from "../common/NavigationBar";
import {updatePassword} from '../../../api';
import md5 from 'md5-hash';
import CustomAlert from "../custom/CustomAlert";



class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: null,
            newPassword: null,
            confirmPassword: null,
            errors:{
                currError: "",
                newError: "",
                confError: "",

            },
            loading: false,

        };
        this.customAlertRef = React.createRef();

    }

    handleSubmit = e =>{
        e.preventDefault();
        if(this.valid())
        {
            this.update();
        }else{
            console.error(`FORM INVALID - DISPLAY ERROR MESSAGE`);
        }
    };

    handleChange = e =>{
        e.preventDefault();
        const {name, value } = e.target;
        let errors = {...this.state.errors};

        switch(name){
            case "currentPassword":
                if(value.length < 9)
                    errors.currError = "Password must be atleast 8 characters long";
                else if(value.search(/[0-9]/) === -1)
                    errors.currError =  "Password must contain atleast one digit" ;
                else if(value.search(/[a-z]/) === -1)
                    errors.currError = "Password must contain atleast one lower case";
                else if(value.search(/[A-Z]/) === -1)
                    errors.currError  = "Password must contain atleast one upper case";
                else
                    errors.currError = "";
                break;

            case 'newPassword':
                if(value.length < 9)
                    errors.newError = "Password must be atleast 8 characters long";
                else if(value.search(/[0-9]/) === -1)
                    errors.newError =  "Password must contain atleast one digit" ;
                else if(value.search(/[a-z]/) === -1)
                    errors.newError = "Password must contain atleast one lower case";
                else if(value.search(/[A-Z]/) === -1)
                    errors.newError  = "Password must contain atleast one upper case";
                else
                    errors.newError = "";
                break;

            case 'confirmPassword':
                if(value !== this.state.newPassword)
                    errors.confError = "New Password and Confirm Password must be same";
                else
                    errors.confError = "";
                break;

            default:
                break;

        }
        this.setState({errors,[name]:value}, ()=> console.log())

    };


    valid=()=>{
        if(this.state.errors.currError === "" && this.state.errors.newError==="" && this.state.errors.confError === "" &&
            this.state.currentPassword !== null && this.state.confirmPassword !== null &&
            this.state.newPassword!==null) {


            return true;
        }
        else
            return false;
    }

    update = ()=> {
        this.setState({
            loading: true
        })
        const payload = {
            "Password": md5(this.state.newPassword)
        };

        updatePassword(this.onUpdatePasswordSuccess, this.onUpdatePasswordFailure, payload);

    };

    onUpdatePasswordSuccess = (res) => {

        if (res.status === 200 ) {
            this.showAlert({
                type: "success",
                message: "PASSWORD UPDATION SUCCESSFULL!!!"
            });
            this.setState({
                loading: false
            })
        }
        else {
            this.showAlert({
                type: "error",
                message: "PASSWORD UPDATION FAILED!!!"
            });

        }
    };
    onUpdatePasswordFailure = (err) => {
        //console.log(err);
    };

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    resetToDefaultView = () => {
        this.props.history.goBack();
    };


    render() {
        const {errors} = this.state;



        return (

            <div className="smartShipBody d-flex flex-column h-100">
                <SmartShipLoader isVisible={this.state.loading}/>
                <CustomAlert ref={this.customAlertRef}/>

                <NavigationBar
                    onBackPress={this.resetToDefaultView}
                    title={"Update Password"}/>
                <div
                    className="d-flex justify-content-center mt-5"
                    xs={12} md={12} lg={12}
                >
                    <div className="config-form-block sm-w-500" style={{margin: "0px auto"}}>
                        <div>
                            <div className="config-form-block-header">
                                Update Password
                            </div>
                            <div>
                                <Form.Group size="sm" as={Col}  >
                                    <Form.Label>Current Password</Form.Label>

                                    <Form.Control
                                        placeholder="Current Password"
                                        /* onChange={(event) => {
                                             this.setState({currentPassword: event.target.value})
                                         }}*/
                                        onChange={this.handleChange}
                                        maxLength={15}
                                        autoComplete="off"
                                        type="password"
                                        name = "currentPassword"
                                        noValidate
                                        required = "true"

                                    />
                                    {errors.currError.length > 0 &&(
                                        <Form.Text className="text-danger h6">{
                                            errors.currError
                                        }
                                        </Form.Text>

                                    )}

                                </Form.Group>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>New Password</Form.Label>

                                    <Form.Control
                                        placeholder="New Password"
                                        /* onChange={(event) => {
                                             this.setState({newPassword: event.target.value})
                                         }}*/
                                        onChange={this.handleChange}
                                        maxLength={15}
                                        autoComplete="off"
                                        type="password"
                                        name="newPassword"
                                        noValidate
                                        required = "true"
                                    />
                                    {errors.newError.length > 0 &&(
                                        <Form.Text className="text-danger h6">{
                                            errors.newError
                                        }
                                        </Form.Text>

                                    )}
                                </Form.Group>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Confirm Password</Form.Label>

                                    <Form.Control
                                        placeholder="Confirm Password"
                                        onChange={this.handleChange}
                                        maxLength={30}
                                        autoComplete="off"
                                        type="password"
                                        name="confirmPassword"
                                        required = "true"

                                    />
                                    {errors.confError.length > 0 &&(
                                        <Form.Text className="text-danger h6">{
                                            errors.confError
                                        }
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
                                    //  onClick={() => this.submit()}
                                    variant="outline-secondary"
                                    style={{align: "right"}}
                                    onClick = {this.handleSubmit}
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

export default ChangePassword;
