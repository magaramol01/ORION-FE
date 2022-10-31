import md5 from 'md5-hash';
import React, {Component} from 'react';
import {Button,Col ,Form } from 'react-bootstrap';
import './UserRegistration.css'
import CustomAlert from "../custom/CustomAlert";
import SmartShipLoader from "../common/SmartShipLoader";
import {createUser,getAllShip} from "../../../api";
import CustomFooter from "./customFooter";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Select from "react-select";
import NavigationBar from "../common/NavigationBar";
const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
    },
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
});
let shipNameList = [];
const specialCharsRegex = RegExp(/^[a-zA-Z0-9 ]*$/);
const mobilenumberRegex = RegExp(/^\d{10}$/);
const emailRegex = RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]+$/);

class UserRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            User: {
                firstName:null,
                shipName:[],
                lastName:null,
                mobileNumber:null,
                email:null,
                password:null,
                confirmPassword:null,
                role:null,
                createShips:false,
                createRules:false,
                companyName:null
            },
            Errors: {
                firstName: "",
                shipName:"",
                lastName: "",
                mobileNumber: "",
                email:"",
                password:"",
                confirmPassword:"",
                role:"",
                companyName:""
            },
            selectedShipName:null
        };
        this.customAlertRef = React.createRef();
    }

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    componentDidMount() {
        getAllShip(this.gerAllSuccess,this.getAllFail);
    }

    gerAllSuccess = (response)=>{
        let shipNameArray = [];
        response.data.map((item)=>{
            let obj = {};
            obj['label']=item.name;
            obj['value']=item.id;
            shipNameArray.push(obj);
        })
        shipNameList = shipNameArray;
        this.setState({
            loading:false
        })
    }

    getAllFail = (res)=>{
        this.setState({
            loading:false
        })
    }

    isRegistrationFormEmpty=()=> {
        let flag = false;
        let {Errors,User} = this.state;
        const currentState = Errors;
        if(User.role==="Ship Manager" || User.role==="Smart Ship Super User"){
            User.shipName=['no ship'];
        }
        if(User.role==="Smart Ship Super User"){
            User.createShips = true;
            User.createRules = true;
            User.editRules = true;
            User.companyName = 'smartshiphub';
        }
        Object.entries(User).forEach((val) => {
            if(val[1]=== null || val[1].length === 0){
                currentState[val[0]] = "This Field Can't be empty!";
                flag = true;
            }
        });

        this.setState({User,Error: currentState});
        return flag;
    }

    isRegistrationFormHavingErrors=()=> {
        let flag = false;
        let {Errors} = this.state;
        Object.values(Errors).forEach((val) => {
            val.length > 0 && (flag = true);
        });
        return flag;
    }

    onRegistrationSuccess = (res) => {
        if (res.status === 200 ) {
            if(res.data.userExists){
                this.showAlert({
                    type: "warning",
                    message: "User already exists with this email"
                });
                this.setState({loading:false});
            } else {
                this.showAlert({
                    type: "success",
                    message: "User Registration Success"
                });
                this.setState({loading:false});
                this.props.history.push({pathname:"/UserLogin"});
            }
        }
    };

    onRegistrationFailure= (err) => {
        this.showAlert({
            type: "warning",
            message: "Something Went Wrong! Please try again later..."
        });
        this.setState({loading:false});
    };

    onRegistrationSubmit = (e) => {
        e.preventDefault();
        if (this.isRegistrationFormEmpty()) {
            this.showAlert({
                type: "warning",
                message: "You need to fill all details!",
            });
        } else {
            if (this.isRegistrationFormHavingErrors()) {
                this.showAlert({
                    type: "warning",
                    message: "You need to correct all the errors!"
                });
            } else {
                let payload = {
                    "FirstName": this.state.User.firstName,
                    "ShipName": this.state.User.shipName,
                    "LastName": this.state.User.lastName,
                    "MobileNumber": this.state.User.mobileNumber,
                    "Email": this.state.User.email,
                    "Password": md5(this.state.User.password),
                    "Role": this.state.User.role,
                    "CreateShips": this.state.User.createShips,
                    "CreateRules": this.state.User.createRules,
                    "EditRules": this.state.User.editRules,
                    "CompanyName": this.state.User.companyName,
                    "ScreenMapping": '["All"]',
                    "DefaultScreenMapping": '["Dashboard"]',
                };
                this.setState({loading:true});
                createUser(this.onRegistrationSuccess, this.onRegistrationFailure, payload);
            }
        }
    }

    onDropdownMultipleValueChange = (selectedValue) => {
        let User = this.state.User;
        let Errors = this.state.Errors;

        let selectedValueArr = [];
        if(!(selectedValue==null)){
             for(let i=0;i<selectedValue.length;i++){
                 selectedValueArr.push(selectedValue[i].label);
        }
        }

        if (selectedValueArr.length !== 0) {
            Errors.shipName = "";
        } else {
            Errors.shipName = "This Field can't be empty!";
        }
        const currentState = User;
        currentState['shipName'] = selectedValueArr;
        this.setState({Errors,User: currentState});
    };

    checkBoxItemValueChange = (e) => {
        let User = {...this.state.User};
        const dataset = e.target.dataset;
        const key = dataset.key;
        if(key === 'createShips') {
            User.createShips = e.target.checked;
        }
        if(key === 'createRules') {
            User.createRules = e.target.checked;
        }
        this.setState({
            User
        })
    }

    onDropdownSingleValueChange = (e) => {
        const shipName = e.value;
        let User = this.state.User;
        let Errors = this.state.Errors;

        if (shipName.length !== 0) {
            if (shipName.length >= 50) {
                Errors.shipName = "First Name length Should be less than 50 characters";
            } else {
                Errors.shipName = "";
            }
        } else {
            Errors.shipName = "This Field can't be empty!";
        }

        const currentState = User;
        currentState['shipName'] = shipName;
        this.setState({Errors,User: currentState});
    };

    onRegistrationInputChange = (e) => {
        const {name, value} = e.target;
        let Errors = this.state.Errors;
        let User = this.state.User;

        switch (name) {
            case "firstName":
                if (specialCharsRegex.test(value)) {
                    if (value.length !== 0) {
                        if (value.length >= 50) {
                            Errors.firstName = "First Name length Should be less than 50 characters";
                        } else {
                            Errors.firstName = "";
                        }
                    } else {
                        Errors.firstName = "Please enter valid first name.";
                    }
                } else {
                    Errors.firstName = "Special Charecters are not allowed!";
                }
                break;

            case "lastName":
                if (specialCharsRegex.test(value)) {
                    if (value.length !== 0) {
                        if (value.length >= 50) {
                            Errors.lastName = "Last Name length Should be less than 50 characters";
                        } else {
                            Errors.lastName = "";
                        }
                    } else {
                        Errors.lastName = "Please enter valid last name.";
                    }
                } else {
                    Errors.lastName = "Special Charecters are not allowed!";
                }
                break;

            case "mobileNumber":
                if(value.length !== 0) {

                    if (mobilenumberRegex.test(value)) {
                        Errors.mobileNumber = "";
                    } else {
                        Errors.mobileNumber = "Invalid Number!";
                    }
                } else {
                    Errors.mobileNumber="Please enter valid mobile number";
                }
                break;

            case "email":
                if(value.length !== 0) {
                    if (emailRegex.test(value)) {
                        Errors.email = "";
                    } else {
                        Errors.email = "Invalid Email Address!";
                    }
                } else {
                    Errors.email = "Please enter valid email.";
                }
                break;

            case "password":
                    this.checkEnteredPassword(value, "password");
                  break;

            case "confirmPassword":
                let response = this.checkEnteredPassword(value, "confirmPassword");
                if(response) {
                    if (value === User.password) {
                        Errors.confirmPassword = "";
                    } else {
                        Errors.confirmPassword = "Both passwords should be same!";
                    }
                }
                break;

            case "role":
                if(value === "na"){
                    Errors.role="Invalid Role!";
                } else {
                    Errors.role="";
                }
                break;
            default:
                break;
        }

        const currentState = User;
        currentState[name] = value;
        this.setState({Errors, user:currentState});
    }

    resetToDefaultView = () => {
        this.props.history.push({pathname:"/UserLogin"});
    };

    checkEnteredPassword = (pass, selectedCase) => {
        let Errors = this.state.Errors;
        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        let flag = true;
        if(pass.length !== 0) {
            if(pass.search(/[0-9]/) === -1) {
                flag = false;
                Errors[selectedCase] = "Password must contain at least one digit.";
            }
            // else if(pass.length < 8){
            //     flag = false;
            //     Errors[selectedCase] = "Password must be at least 8 characters long.";
            // }
            else if(pass.search(/[a-z]/) === -1) {
                flag = false;
                Errors[selectedCase] = "Password must contain at least one lower case.";
            }
            // else if(pass.search(/[A-Z]/) === -1) {
            //     flag = false;
            //     Errors.password = "Password must contain at least one upper case.";
            // }
            else if(!format.test(pass)){
                flag = false;
                Errors[selectedCase] = "Password must contain at least one special character."
            }
            else {
                flag = true;
                Errors[selectedCase] = "";
            }
        } else {
            flag = false;
            Errors[selectedCase] = "Please enter valid password.";
        }

        return flag;

    }

    render() {
        const {loading, Errors,User} = this.state;
        return(
            <div className="smartShipBody d-flex flex-column h-100">
                <SmartShipLoader isVisible={loading}/>
                <CustomAlert ref={this.customAlertRef}/>
                <NavigationBar title={""}  />
                <div
                    className="d-flex justify-content-center mt-5"
                >
                    <div className="config-form-block sm-w-500" style={{margin: "0px auto"}}>
                        <div>
                            <div className="config-form-block-header">
                                Registration
                            </div>
                            <div>
                            <Form noValidate>
                                <Form.Group size="sm" as={Col}>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    style={Errors.firstName.length > 0 ? {borderColor:"red"} : null}
                                    placeholder="First Name"
                                    type="text"
                                    name="firstName"
                                    onChange={this.onRegistrationInputChange}
                                    className={Errors.firstName.length > 0 ? "error" : ""}
                                    maxLength={70}
                                    autoComplete="off"
                                />
                                    {Errors.firstName.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {Errors.firstName}
                                        </Form.Text>
                                    )}
                                 </Form.Group>

                                 <Form.Group size="sm" as={Col}>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        style={Errors.lastName.length > 0 ? {borderColor:"red"} : null}
                                        placeholder="Last Name"
                                        type="text"
                                        name="lastName"
                                        onChange={this.onRegistrationInputChange}
                                        maxLength={70}
                                        autoComplete="off"
                                    />
                                        {Errors.lastName.length > 0 && (
                                             <Form.Text className='text-left errorMessage'>
                                                 {Errors.lastName}
                                             </Form.Text>
                                        )}
                                 </Form.Group>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control
                                        style={Errors.mobileNumber.length > 0 ? {borderColor:"red"} : null}
                                        placeholder="eg. 80xxxxxx70"
                                        type="text"
                                        name="mobileNumber"
                                        onChange={this.onRegistrationInputChange}
                                        maxLength={12}
                                        autoComplete="off"
                                    />
                                    {Errors.mobileNumber.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {Errors.mobileNumber}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        style={Errors.email.length > 0 ? {borderColor:"red"} : null}
                                        placeholder="eg. john@abc.com"
                                        type="email"
                                        name="email"
                                        onChange={this.onRegistrationInputChange}
                                        maxLength={60}
                                        autoComplete="off"
                                    />
                                    {Errors.email.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {Errors.email}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        style={Errors.password.length > 0 ? {borderColor:"red"} : null}
                                        placeholder="password"
                                        type="password"
                                        name="password"
                                        onChange={this.onRegistrationInputChange}
                                        maxLength={100}
                                        autoComplete="off"
                                    />
                                    {Errors.password.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {Errors.password}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        style={Errors.confirmPassword.length > 0 ? {borderColor:"red"} : null}
                                        placeholder="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                        onChange={this.onRegistrationInputChange}
                                        maxLength={100}
                                        autoComplete="off"
                                    />
                                    {Errors.confirmPassword.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {Errors.confirmPassword}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group as={Col}>
                                <Form.Label>Account Role</Form.Label>
                                <Form.Control
                                    style={Errors.role.length > 0 ? {borderColor:"red"} : null}
                                    as="select"
                                    name="role"
                                    onChange={this.onRegistrationInputChange}
                                >
                                    <option value="na">--SELECT--</option>
                                    <option value="Smart Ship Super User">Smart Ship Super User</option>
                                </Form.Control>
                                    {Errors.role.length > 0 && (
                                        <Form.Text className='text-left errorMessage'>
                                            {Errors.role}
                                        </Form.Text>
                                    )}
                            </Form.Group>
                                {
                                    (
                                        User['role'] === 'Ship User' && (
                                        <Form.Group size="sm" as={Col}>
                                            <Select
                                                theme={theme}
                                                options={shipNameList}
                                                name="shipName"
                                                onChange={this.onDropdownSingleValueChange}
                                                isMulti={false}
                                                closeMenuOnSelect={true}
                                            />
                                            {Errors.shipName.length > 0 && (
                                                <Form.Text className='text-left errorMessage'>
                                                    {Errors.shipName}
                                                </Form.Text>
                                            )}
                                        </Form.Group>
                                        )
                                    )||
                                    (
                                        User['role'] === 'Fleet Manager' && (
                                            <Form.Group size="sm" as={Col}>
                                                <Select
                                                    theme={theme}
                                                    options={shipNameList}
                                                    name="shipName"
                                                    onChange={this.onDropdownMultipleValueChange}
                                                    isMulti={true}
                                                    closeMenuOnSelect={false}
                                                />
                                                {Errors.shipName.length > 0 && (
                                                    <Form.Text className='text-left errorMessage'>
                                                        {Errors.shipName}
                                                    </Form.Text>
                                                )}
                                            </Form.Group>
                                        )
                                    )
                                }
                                {
                                    (User['role'] === 'Fleet Manager' || User['role'] === 'Ship Manager') && (
                                        <div style={{display:'flex',justifyContent:"space-between"}}>
                                            <div style={{paddingLeft:20}}>
                                                <Form.Label>Create Ships</Form.Label>
                                                <div className="customSwitch">
                                                    <input
                                                        type="checkbox"
                                                        checked={User.createShips}
                                                        name="createShips"
                                                        data-key="createShips"
                                                        className={"customSwitch customSwitchInput"}
                                                        id="createShips"
                                                        onClick={this.checkBoxItemValueChange}
                                                    />
                                                    <label className="customSwitchLabel customSwitchToggle" htmlFor="createShips" />
                                                </div>
                                            </div>
                                            <div style={{paddingRight:20}}>
                                                <Form.Label>Create Rules</Form.Label>
                                                <div className="customSwitch">
                                                    <input
                                                        type="checkbox"
                                                        checked={User.createRules}
                                                        name="createRules"
                                                        data-key="createRules"
                                                        className={"customSwitch customSwitchInput"}
                                                        id="createRules"
                                                        onClick={this.checkBoxItemValueChange}
                                                    />
                                                    <label className="customSwitchLabel customSwitchToggle" htmlFor="createRules" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <Form.Group size="sm" as={Col} style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: 15
                                }}>

                                <Button
                                       size="sm"
                                       className="parameter-add-button"
                                       onClick={this.onRegistrationSubmit}
                                       variant="outline-secondary"
                                >
                                Register
                                </Button>

                                    <Button
                                        size="sm"
                                        className="parameter-add-button"
                                        onClick={this.resetToDefaultView}
                                        variant="outline-secondary"
                                    >
                                        Cancel
                                    </Button>

                                </Form.Group>
                            </Form>
                            </div>
                        </div>
                    </div>
                    <CustomFooter/>
                </div>
                <div style={{display:"block",height:"80px"}}>&nbsp; </div>
            </div>
        );
    }
}

export default UserRegistration;
