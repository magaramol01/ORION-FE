import md5 from 'md5-hash';
import React, {Component} from 'react';
import {Button,Col ,Form,Navbar,Container } from 'react-bootstrap';
import './UserRegistration.css'
import SmartShipLoader from "../common/SmartShipLoader";
import CustomAlert from "../custom/CustomAlert";
import {getUser} from "./authentication";
import CustomFooter from "./customFooter";
import {deploymentType} from "../../../api";
import ship1 from '../../Images/NOVA-Ships-BG/asia-aspara.jpg';
import ship2 from '../../Images/NOVA-Ships-BG/batavia-express2.jpg';
import ship3 from '../../Images/NOVA-Ships-BG/fujian-express.jpg';
import ship4 from '../../Images/NOVA-Ships-BG/shandong-express.jpg';
import ship5 from '../../Images/NOVA-Ships-BG/asia-evergreen.jpg';
import FMLship1 from '../../Images/FMLImages/FML1.JPG';
import FMLship2 from '../../Images/FMLImages/FML2.JPG';
import FMLship3 from '../../Images/FMLImages/FML3.JPG';
import FMLship4 from '../../Images/FMLImages/FML4.JPG';
import FMLship5 from '../../Images/FMLImages/FML5.JPG';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel'
import logo from "../../Images/smart-ship-logo-white.png";
import nova from "../../Images/nova-logo.png";
import NavigationBar from "../common/NavigationBar";
import {getItemFromLocalStorage, getRedirectionPage, setItemInLocalStorage} from "../../../RTCM/common/helper";
const emailRegex = RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]+$/);

class UserLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            User: {
                email: null,
                password: null,
            },
            Errors:{
                email:'',
                password:''
            },
            isChecked: false,
        };
        this.customAlertRef = React.createRef();
    }

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    componentDidMount() {
        const {User} = this.state;
        if (getItemFromLocalStorage("ssAppLoginUserRememberMeChecked") === "true") {
            User.email = getItemFromLocalStorage("ssAppLoginUserName");
            User.password = getItemFromLocalStorage("ssAppLoginUserPassword");
            this.setState({User});
            this.setState({
                isChecked: getItemFromLocalStorage("ssAppLoginUserRememberMeChecked")
            });

        }
        else{
            User.email = null;
            User.password = null;
            this.setState({User,isChecked:false});
        }
    }

    onChangeCheckbox=(event)=>{
        this.setState({isChecked:event.target.checked});
        setItemInLocalStorage("ssAppLoginUserRememberMeChecked", event.target.value);
    };

    isLoginFormEmpty = () => {
        let flag = false;
        let {Errors, User} = this.state;
        const currentState = Errors;
        Object.entries(User).forEach((val) => {
            if (val[1] === null || val[1].length === 0) {
                if(val[0] === "email")
                    currentState[val[0]] = "Please enter valid username.";
                if(val[0] === "password")
                    currentState[val[0]] = "Please enter valid password.";
                flag = true;
            }
        });

        this.setState({User, Error: currentState});
        return flag;
    };

    isLoginFormHavingErrors = () => {
        let flag = false;
        let {Errors} = this.state;
        Object.values(Errors).forEach((val) => {
            val.length > 0 && (flag = true);
        });
        return flag;
    };

    onLoginInputChange = (e) => {
        const {name, value} = e.target;
        let {Errors, User} = this.state;
        switch (name) {
            case "email":
                if (value.length > 0) {
                    if (emailRegex.test(value)) {
                        Errors.email = "";
                    } else {
                        Errors.email = "Invalid Email Address!";
                    }
                } else {
                    Errors.email = "Please enter valid username.";
                }
                break;
            case "password":
                if (value.length > 0) {
                    if (value.length > 60) {
                        Errors.password = "Password length should be less than 60";
                    } else {
                        Errors.password = "";
                    }
                } else {
                    Errors.password = "Please enter valid password.";
                }
                break;



            default:
                break;
        }

        const currentState = User;
        currentState[name] = value;
        this.setState({Errors, user: currentState});
    };

    onEnterSubmit = (e) => {
        if (e.key === 'Enter') {
            this.onLoginSubmit();
        }
    };

    onLoginSubmit = () => {
        const {User} = this.state;
        if (this.isLoginFormEmpty()) {
            if(this.state.User.password === ""){
                this.showAlert({
                    type: "warning",
                    message: "Please enter a valid password.",
                });
            }
            if(this.state.User.email === ""){
                this.showAlert({
                    type: "warning",
                    message: "Please enter a valid username.",
                });
            }

        } else {
            if (this.isLoginFormHavingErrors()) {
                this.showAlert({
                    type: "warning",
                    message: "Invalid credentials"
                });
            } else {
                let payload = {
                    "Email": this.state.User.email,
                    "Password": md5(this.state.User.password),
                };
                getUser(payload).then(auth => {
                    //console.log('auth value   ',auth);
                    if (auth === 1) {

                        if (this.state.isChecked) {
                            setItemInLocalStorage("ssAppLoginUserName", User.email);
                            setItemInLocalStorage("ssAppLoginUserPassword", User.password);
                            setItemInLocalStorage("ssAppLoginUserRememberMeChecked", this.state.isChecked);
                        }
                        else{
                            setItemInLocalStorage("ssAppLoginUserRememberMeChecked",this.state.isChecked);
                        }

                        this.showAlert({
                            type: "success",
                            message: "User Login Success"
                        });
                        this.setState({loading: false});
                        const redirectTo = getRedirectionPage();
                        this.props.history.push({pathname: `/${redirectTo}`});

                    } else if (auth === 0) {
                        this.showAlert({
                            type: "danger",
                            message: "The username is not registered yet."
                        });
                        this.setState({loading: false});
                    }

                    else {
                        this.showAlert({
                            type: "warning",
                            message: "The username or password you entered is incorrect."
                        });
                        this.setState({loading: false});
                    }
                });
            }
        }
    };



    render() {
        const {loading, Errors} = this.state;
        return (
            <div className="smartShipBody d-flex flex-column h-100">
                <SmartShipLoader isVisible={loading}/>
                <CustomAlert ref={this.customAlertRef}/>
                <NavigationBar
                    title={""}/>

                <div className="login-screen-wrapper">
                    <div className="config-form-block sm-w-500 login-screen-form-box">
                        <div>
                            <div className="config-form-block-header">
                                Login
                            </div>

                            <div>
                                <Form noValidate>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            style={Errors.email.length > 0 ? {borderColor: "red"} : null}
                                            placeholder="eg. john@abc.com"
                                            type="email"
                                            name="email"
                                            onChange={this.onLoginInputChange}
                                            maxLength={60}
                                            autoComplete="off"
                                            value={this.state.User.email || ''}
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
                                            style={Errors.password.length > 0 ? {borderColor: "red"} : null}
                                            placeholder="password"
                                            type="password"
                                            name="password"
                                            onChange={this.onLoginInputChange}
                                            maxLength={62}
                                            autoComplete="off"
                                            onKeyDown={this.onEnterSubmit}
                                            value={this.state.User.password || ''}
                                        />
                                        {Errors.password.length > 0 && (
                                            <Form.Text className='text-left errorMessage'>
                                                {Errors.password}
                                            </Form.Text>
                                        )}
                                    </Form.Group >
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Remember me"
                                            //data-key="isNumberOfOccurrencesChecked"
                                            onChange={this.onChangeCheckbox}
                                            defaultChecked={getItemFromLocalStorage("ssAppLoginUserRememberMeChecked") === "true"}
                                        />
                                    </Form.Group>

                                    <Form.Group size="sm" as={Col}>
                                        <Form.Text className="float-left">
                                            <a style={{cursor: "pointer"}}
                                               onClick={() => {
                                                   this.props.history.push({pathname: '/ForgotPassword'})
                                               }}> Forgot Password ?</a>
                                        </Form.Text>
                                        <Button
                                            size="sm"
                                            className="float-right parameter-add-button"
                                            onClick={this.onLoginSubmit}
                                            variant="outline-secondary"
                                            style={{width: "30%"}}
                                        >
                                            Login
                                        </Button>
                                    </Form.Group>
                                    {
                                        // (
                                        //     (deploymentType == 'shore') && (
                                        //         <Form.Group size="sm" as={Col} style={{
                                        //             marginTop: 40
                                        //         }}>
                                        //             <Form.Text className="float-right">
                                        //                 <a style={{cursor: "pointer"}}
                                        //                    onClick={() => {
                                        //                        this.props.history.push({pathname: '/UserRegistration'})
                                        //                    }}> Don't have an account?</a>
                                        //             </Form.Text>
                                        //         </Form.Group>
                                        //     )
                                        // )
                                    }
                                </Form>
                            </div>
                        </div>
                    </div>

                    <div  style={{width:'100%',position:'relative'}} >
                        <Carousel indicators={false} controls={false} interval={6000} fade={true}>
                            <Carousel.Item style={{'height':"600px"}} >
                                <img className="d-block w-100 login-screen-back-img" src={ship1} />
                            </Carousel.Item  >
                            <Carousel.Item style={{'height':"600px"}}>
                                <img className="d-block w-100 login-screen-back-img" src={ship2} />
                            </Carousel.Item>
                            <Carousel.Item style={{'height':"600px"}} >
                                <img className="d-block w-100 login-screen-back-img" src={ship3} />
                            </Carousel.Item>
                            <Carousel.Item style={{'height':"600px"}} >
                                <img className="d-block w-100 login-screen-back-img" src={ship4} />
                            </Carousel.Item>
                            <Carousel.Item style={{'height':"600px"}} >
                                <img className="d-block w-100 login-screen-back-img" src={ship5} />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
                <CustomFooter/>
            </div>
        );
    }
}

export default UserLogin;
