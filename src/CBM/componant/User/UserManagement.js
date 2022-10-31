import React ,{Component, Fragment} from "react";
import SmartShipLoader from "../common/SmartShipLoader";
import NavigationBar from "../common/NavigationBar";
import {
    getAllUserData,
    deleteUser,
    getAllShip,
    createUser,
    getUserById,
    updateUserById,
    getAllCompanyEntry
} from "../../../api";
import {getItemFromLocalStorage} from "../../../RTCM/common/helper"
import SMSidebar from "../../../SMSidebar";
import {Button, Table, Modal,Form, Row, Col} from "react-bootstrap";
import Select from "react-select";
import md5 from "md5-hash";
import CustomAlert from "../custom/CustomAlert";
import {screenArr} from "../Constants";
import {NavItem} from "@trendmicro/react-sidenav";



const specialCharsRegex = RegExp(/^[a-zA-Z0-9 ]*$/);
const mobilenumberRegex = RegExp(/^\d{10}$/);
const emailRegex = RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]+$/);
let shipNameList = [];
let companyNameList = []
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

let allRoles = ["Smart Ship Super User", "Smart Ship User","Company Admin", "Ship User", "Ship Manager", "Fleet Manager"];
const lvl4RolesArr = [{value: "Smart Ship Super User",label: "Smart Ship Super User"},{value: "Smart Ship User", label:"Smart Ship User"}];
let lvl1RolesArr = [], lvl2RolesArr = [], lvl3RolesArr = [];
allRoles.map(item =>{
    lvl3RolesArr.push(
    {
        value: item,
        label: item
    });
});
lvl1RolesArr = [...lvl3RolesArr];
lvl3RolesArr.shift();
lvl3RolesArr.shift();
lvl2RolesArr = [...lvl3RolesArr];
lvl3RolesArr.shift();

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            popup:false,
            toggleAddEditDeleteUserButton:false,
            selectedRole: undefined,
            query: "All User",
            user:'',
            inputquery:'',
            type: "",
            alluser: "active",
            smart: "",
            client: "",
            allRegestredUser: [{
                    uId:"",
                    Email: "loading",
                    FirstName: "loading",
                    LastName: "loding",
                    MobileNumber: "loading",
                    Role: "loading",
                    ScreenMapping:"loading",
                    ShipName: []
            }],
            User: {
                firstName:null,
                shipName:null,
                lastName:null,
                mobileNumber:null,
                email:null,
                password:null,
                confirmPassword:null,
                role:null,
                createShips:false,
                createRules:false,
                editRules:false,
                companyName:null,
                ScreenMapping: [],
                DefaultScreenMapping: "",
            },
            UserUpdate: {
                FirstName:"",
                ShipName:"",
                LastName:"",
                MobileNumber:"",
                Email:"",
                Password:"",
                ConfirmPassword:"",
                Role:"",
                CreateShips: "",
                CreateRules: "",
                EditRules:false,
                id:"",
                CompanyName:"",
                ScreenMapping: [],
                DefaultScreenMapping: "",
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
                companyName:"",
                ScreenMapping: "",
                DefaultScreenMapping: ""
            },
            defaultScreenArr: [],
            enableScreenMapping: true
        };
        this.customAlertRef = React.createRef();
    }
    componentDidMount() {
        getAllCompanyEntry(this.gerAllCompanySuccess,this.getAllCompanyFail);
        getAllUserData(this.getAllUserSuccess,this.getAllUserFailure);
        getAllShip(this.gerAllSuccess,this.getAllFail);
    }
    getAllUserSuccess = (response) => {
        let sortedCompanyAdmins = [];
        let sortedShipManagers = [];
        let sortedFleetManagers = [];
        let sortedShipUsers = [];
        let sortedSmartShipSuperUser = [];
        let finalSortedUsersList = [];
        let sortedSmartShipUser = [];
        const allRegestredUserData = Object.entries(response.data).map(([key, obj]) => Object.assign(
            {
                uId: key,
                ...obj
            }
        ));

        allRegestredUserData.map((item) => {
            if (item.Role === "Company Admin") {
                sortedCompanyAdmins.push(item);
            } else if (item.Role === "Ship Manager") {
                sortedShipManagers.push(item);
            } else if (item.Role === "Fleet Manager") {
                sortedFleetManagers.push(item);
            } else if (item.Role === "Ship User") {
                sortedShipUsers.push(item);
            } else if (item.Role === "Smart Ship Super User") {
                sortedSmartShipSuperUser.push(item);
            } else if(item.Role === "Smart Ship User") {
                sortedSmartShipUser.push(item);
            }
        })

        sortedCompanyAdmins.sort((a,b)=>(a.FirstName > b.FirstName) ? 1:-1);
        sortedShipManagers.sort((a,b)=>(a.FirstName > b.FirstName) ? 1:-1);
        sortedFleetManagers.sort((a,b)=>(a.FirstName > b.FirstName) ? 1:-1);
        sortedShipUsers.sort((a,b)=>(a.FirstName > b.FirstName) ? 1:-1);
        sortedSmartShipSuperUser.sort((a,b)=>(a.FirstName > b.FirstName) ? 1:-1);
        sortedSmartShipUser.sort((a,b)=>(a.FirstName > b.FirstName) ? 1:-1);

        finalSortedUsersList = [...sortedCompanyAdmins, ...sortedShipManagers, ...sortedFleetManagers, ...sortedShipUsers, ...sortedSmartShipSuperUser, ...sortedSmartShipUser];


        this.setState({
            allRegestredUser : finalSortedUsersList,
            loading: false
        })
    }
    getAllUserFailure = (error) => {
        this.setState({
            loading: true
        })
    };
    popupShow =({selectedRole})=> {
         this.userReset();
         this.userUpdateReset();
        const userRole = getItemFromLocalStorage("role");
        const enableScreenMapping = userRole === "Smart Ship Super User" || userRole === "Company Admin" || userRole === "Smart Ship User";
        const ScreenMapping = [{value: "", label: ""}];
        const defaultScreenMapping = [{value: "", label: ""}];
        const {User, UserUpdate} = this.state;
        User.ScreenMapping = ScreenMapping;
        UserUpdate.ScreenMapping = ScreenMapping;
        User.DefaultScreenMapping = defaultScreenMapping;
        UserUpdate.DefaultScreenMapping = defaultScreenMapping;

        this.setState({
            popup: true,
            selectedRole,
            User,
            UserUpdate,
            enableScreenMapping
        });
    }
    gerAllCompanySuccess = (response)=> {
        let companyData = response.data;
        let companyNameArray = [];
        const userRole = getItemFromLocalStorage("role");
        if(userRole==="Company Admin" || userRole==="Smart Ship Super User"){
             this.setState({toggleAddEditDeleteUserButton:true})
        }
        for(let i=0;i<companyData.length;i++){
            let obj = {};
            obj['label']=companyData[i].companyRegisteredName;
            obj['value']=companyData[i].companyRegisteredName;
            companyNameArray.push(obj);
        }
        companyNameList = companyNameArray;
        const {User, UserUpdate} = this.state;
        UserUpdate.CompanyName = companyNameArray[0].value;
        User.companyName = companyNameArray[0].value;
        this.setState({
            User,
            UserUpdate
        })
    }
    getAllCompanyFail = (error)=> {

    }
    userUpdateReset =()=> {
        const { UserUpdate: UserUpdate, User: User } = this.state;
        UserUpdate.FirstName = "";
        UserUpdate.LastName= "";
        UserUpdate.MobileNumber = "";
        UserUpdate.Password = "";
        UserUpdate.ConfirmPassword = "";
        UserUpdate.ShipName ="";
        UserUpdate.Role = "";
        UserUpdate.Email = "";
        UserUpdate.CreateShips = "";
        UserUpdate.CreateRules = "";
        UserUpdate.EditRules = "";
        UserUpdate.id = "";
        UserUpdate.CompanyName = companyNameList.length > 0 ? companyNameList[0].value : "";
        UserUpdate.ScreenMapping = "";
        UserUpdate.DefaultScreenMapping = "";
        this.setState({UserUpdate: UserUpdate});
    }

    userReset = ()=> {
        const {User} = this.state;
        User.firstName="";
        User.lastName="";
        User.email="";
        User.password="";
        User.confirmPassword="";
        User.role="";
        User.shipName="";
        User.createShips = "";
        User.createRules = "";
        User.editRules = "";
        User.companyName = companyNameList.length > 0 ? companyNameList[0].value : "";
        User.ScreenMapping = "";
        User.DefaultScreenMapping = "";
        this.setState({User});
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
    }
    getAllFail = (res)=>{
        this.setState({
            loading:false
        })
    }
    popupClose =()=> {
        document.getElementById("UserReg").reset();
        this.setState({
            popup:false,
            selectedRole: undefined,
            enableScreenMapping: true
        });
    }
    onUserDeleteClick =(e)=> {
        const UserID = e.target.dataset.fid;
        deleteUser(this.deleteUserSuccess,this.deleteUserFail,UserID);
    }
    deleteUserSuccess =(response)=> {
        if(response.data.isSuccess) {
            this.showAlert({
                type: "success",
                message: response.data.msg
            });
        }
        else{
            this.showAlert({
                type: "error",
                message: response.data.msg
            });
        }
        getAllUserData(this.getAllUserSuccess,this.getAllUserFailure);
    }
    deleteUserFail =(error)=> {
        this.setState({
            loading: true
        })
    }
    isRegistrationFormEmpty=()=> {
        let flag = false;
        let {Errors,User} = this.state;
        const currentState = Errors;
        if(User.role==="Ship Manager"){
            User.shipName=['no ship'];
        }
        if(User.role==="Company Admin"){
            User.createShips=true;
            User.createRules=true;
            User.editRules=true;
        }
        if(User.role=="Smart Ship Super User"){
            User.shipName=['no ship'];
            User.companyName='smartshiphub';
            User.createShips=true;
            User.createRules=true;
            User.editRules=true;
        }
        if(User.role=="Smart Ship User"){
            User.companyName='smartshiphub';
        }
        if(User.role==="Ship User"){
            User.createShips=false;
            User.createRules=false;
            User.editRules=false;
        }
        if(User.role!=='Company Admin' && User.role!=='Smart Ship Super User'){
            {
                if(getItemFromLocalStorage("role")!=="Smart Ship Super User"){
                    User.companyName = getItemFromLocalStorage("companyName")
                }
            }
        }
        if(User.editRules === ""){
            User.editRules = false;
        }
        if(User.createRules === ""){
            User.createRules = false;
        }
        if(User.createShips === ""){
            User.createShips = false;
        }
        if(User.ScreenMapping === ""){
            User.ScreenMapping = null;
        }
        if(User.DefaultScreenMapping === ""){
            User.DefaultScreenMapping = null;
        }
        debugger
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

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    onRegistrationSuccess = (res) => {
        if (res.status === 200 ) {
            if(res.data.userExists){
                this.showAlert({
                    type: "warning",
                    message: "User already exists with this email"
                });
                this.setState({loading:false});
            } else {
                this.setState({loading:false});
                this.showAlert({
                    type: "success",
                    message: "User Registered Succesfully"
                });
                this.popupClose();
                getAllUserData(this.getAllUserSuccess,this.getAllUserFailure);
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

    getScreenMappingArr = (screenMapping) => {
        let ScreenMappingArr = [];
        if(!!screenMapping[0] && screenMapping[0].label === ""){
            return ScreenMappingArr;
        }
        if (!(screenMapping == null)) {
            if (Array.isArray(screenMapping)) {
                for (let i = 0; i < screenMapping.length; i++) {
                    ScreenMappingArr.push(screenMapping[i].label);
                }
            } else {
                ScreenMappingArr = [screenMapping.label];
            }
        }
        return ScreenMappingArr;
    }

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
                let ScreenMappingArr = this.getScreenMappingArr(this.state.User.ScreenMapping);
                let DefaultScreenMapping = this.getScreenMappingArr(this.state.User.DefaultScreenMapping);
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
                    "EditRules":this.state.User.editRules,
                    "CompanyName": this.state.User.companyName,
                    "ScreenMapping": JSON.stringify(ScreenMappingArr),
                    "DefaultScreenMapping": JSON.stringify(DefaultScreenMapping),
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
                selectedValueArr.push(selectedValue[i].value);
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
        let arr = [];
        arr.push(shipName)
        currentState['shipName'] = arr ;
        this.setState({Errors,User: currentState});
    };
    onDropdownCompanyValueChange = (e)=> {
        let User = this.state.User;
        let Errors = this.state.Errors;
        const companyName = e.value;
        if (companyName.length !== 0) {
            Errors.companyName = "";
        } else {
            Errors.shipName = "This Field can't be empty!";
        }
        const currentState = User;
        currentState['companyName'] = companyName;
        this.setState({Errors,User: currentState});
    }

    onDropdownRoleValueChange = (e) => {
        let User = this.state.User;
        let Errors = this.state.Errors;
        const role = e.value;
        if (role.length !== 0) {
            Errors.role = "";
        } else {
            Errors.role = "This Field can't be empty!";
        }
        const currentState = User;
        currentState['role'] = role;
        this.setState({Errors,User: currentState});
    }

    checkBoxItemValueChange = (e) => {
        let User = {...this.state.User};
        let UserUpdate = {...this.state.UserUpdate};
        const dataset = e.target.dataset;
        const key = dataset.key;
        if(key === 'createShips') {
            User.createShips = e.target.checked;
        }
        if(key === 'createRules') {
            User.createRules = e.target.checked;
        }
        if(key === 'editRules') {
            User.editRules = e.target.checked;
        }
        if(key === 'CreateShips') {
            UserUpdate.CreateShips = e.target.checked;
        }
        if(key === 'CreateRules') {
            UserUpdate.CreateRules = e.target.checked;
        }
        if(key === 'EditRules') {
            UserUpdate.EditRules = e.target.checked;
        }
        this.setState({
            User,
            UserUpdate
        })
    }

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
                        Errors.firstName = "This Field can't be empty!";
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
                        Errors.lastName = "This Field can't be empty!";
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
                    Errors.mobileNumber="This Field can't be empty!";
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
                    Errors.email = "This Field Can't be empty!";
                }
                break;
            case "password":
                if(value.length !== 0) {
                    if (value.length > 60) {
                        Errors.password = "Password length should be less than 60";
                    } else if(value !== User.confirmPassword) {
                        Errors.confirmPassword="Both passwords should be same!";
                        Errors.password = "";
                    } else {
                        Errors.password = "";
                    }
                } else {
                    Errors.password = "This Field Can't be empty!";
                }
                break;
            case "confirmPassword":
                if(value === User.password){
                    Errors.confirmPassword="";
                    Errors.password="";
                } else {
                    Errors.password=" ";
                    Errors.confirmPassword="Both passwords should be same!";
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
        debugger
        this.props.history.push({pathname:"/UserManagement"});
    };
    onUserEditClick = (e)=> {
        this.userUpdateReset();
        this.userReset();
        const UserID = e.target.dataset.fid;
        getUserById(this.getUserByIdSuccess,this.getUserByIdFail,UserID);
    }
    getScreenMappingDDObject = (screenMappingArr) => {
        let ScreenMapping = [];
        if (screenMappingArr && Array.isArray(screenMappingArr) && screenMappingArr.length>0) {
            for (let i = 0; i < screenMappingArr.length; i++) {
                ScreenMapping.push({
                    value: screenMappingArr[i],
                    label: screenMappingArr[i]
                });
            }
        } else {
            ScreenMapping = [{value:"",label:""}]
        }
        return ScreenMapping;
    }

    getUserByIdSuccess = (response)=> {
        const role = {selectedRole: response.data[0].Role};
        const User = this.state.User;
        const screenMappingArr = [...response.data[0].ScreenMapping];
        const defaultScreenMappingArr = [...response.data[0].DefaultScreenMapping];
        let defaultScreenArr = [];

        this.popupShow(role);

        let ScreenMapping = this.getScreenMappingDDObject(screenMappingArr);
        let DefaultScreenMapping = this.getScreenMappingDDObject(defaultScreenMappingArr);
        response.data[0].ScreenMapping = [...ScreenMapping];
        response.data[0].DefaultScreenMapping = [...DefaultScreenMapping];
        User.ScreenMapping = [...ScreenMapping];
        User.DefaultScreenMapping = [...DefaultScreenMapping];
        defaultScreenArr = ScreenMapping[0].value === "All"
            ? screenArr.filter((item) => item.value !== "All")
            : [...ScreenMapping];

        this.setState({
            defaultScreenArr,
            User,
            UserUpdate:response.data[0],
            loading:false
        });
    }
    getUserByIdFail = (error)=> {
        this.setState({loading:false});
    }
    onSubmitUpdateUser = (e)=> {
        const UserID = e.target.dataset.fid;
        const {User: User,
            UserUpdate: UserUpdate} = this.state;
        let payload = {};

        if(User.role !=="" && UserUpdate.Role !== User.role) {
            let AllShipNameArray = [];
            for(let i=0;i<shipNameList.length;i++){
                AllShipNameArray.push(shipNameList[i].label);
            }
            if(User.role == "Smart Ship Super User"){
                User.shipName=AllShipNameArray
                User.companyName='smartshiphub';
                UserUpdate.CreateShips=true;
                UserUpdate.CreateRules=true;
                UserUpdate.EditRules=true;
            }
            if(User.role == "Smart Ship User"){
                User.companyName = "smartshiphub";
            }
            if(User.role==="Company Admin"){
                UserUpdate.CreateShips=true;
                UserUpdate.CreateRules=true;
                UserUpdate.EditRules=true;
            }
            if(User.role==="Ship User"){
                UserUpdate.CreateShips=false;
                UserUpdate.CreateRules=false;
                UserUpdate.EditRules=false;
                if(User.shipName == ""){
                    User.shipName = [AllShipNameArray[0]];
                }
            }
            if(User.role==="Ship Manager"){
                User.shipName=AllShipNameArray
            }
        } else {
            if(UserUpdate.Role == "Smart Ship Super User" || UserUpdate.Role == "Smart Ship User"){
                User.companyName = 'smartshiphub';
            }
        }
        if(User.firstName) payload.FirstName=User.firstName;
        if(User.lastName) payload.LastName=User.lastName;
        if(User.mobileNumber) payload.MobileNumber=User.mobileNumber;
        if(User.password) payload.Password=User.password;
        if(User.confirmPassword) payload.ConfirmPassword=User.confirmPassword;
        if(User.email) payload.Email=User.email;
        if(User.shipName){
            let ids = [];
            shipNameList.map((item)=>{
                if(User.shipName.includes(item.label) || User.shipName.includes(item.value)){
                    ids.push(item.value);
                }
            })
            payload.ShipName=ids;
        }

        if(User.role) payload.Role=User.role;
        if(User.companyName) payload.CompanyName=User.companyName;
        payload.CreateRules=UserUpdate.CreateRules;
        payload.EditRules=UserUpdate.EditRules;
        payload.CreateShips=UserUpdate.CreateShips;
debugger
        if(User.ScreenMapping) {
            const ScreenMappingArr = this.getScreenMappingArr(this.state.User.ScreenMapping);
            payload.ScreenMapping=Array.isArray(ScreenMappingArr) ? JSON.stringify(ScreenMappingArr) : JSON.stringify([ScreenMappingArr]);
        }

        if(User.DefaultScreenMapping) {
            const DefaultScreenMapping = this.getScreenMappingArr(this.state.User.DefaultScreenMapping);
            payload.DefaultScreenMapping= Array.isArray(DefaultScreenMapping) ? JSON.stringify(DefaultScreenMapping) : JSON.stringify([DefaultScreenMapping]);
        }
        payload.id = UserID;

        updateUserById(this.updateUserSuccess,this.updateUserFail,payload);
        this.setState({loading:false});
    }
    updateUserSuccess = (response)=> {
        this.popupClose();
        getAllUserData(this.getAllUserSuccess,this.getAllUserFailure);
        let rduin = getItemFromLocalStorage('rduin');
        const configData = JSON.parse(response.config.data);
        if(configData.id == rduin) {
            window.location.reload();
        }
    }
    updateUserFail = (error)=> {

    }

    getRoleDisplayName = (role, email) => {
        if (role === "Smart Ship Super User") {
            // return "Smartship Super User"
            return "Smartship User";
        } else if (/@smartshiphub\.com$/.test(email) || /@dimentrix\.com$/.test(email) || email === "vivekkalambi@gmail.com") {
            return "Smartship User";
        } else if (role === "Fleet Manager") {
            return "Fleet Manager";
        }
        return role;
    };

    onSelectScreenDropdownValueChange = (selectedValue) => {
        let {
            Errors,
            User,
            UserUpdate,
            defaultScreenArr
        } = this.state;
        let defaultSelectedValue = null;

        if (selectedValue !== null) {
            const isSelectedOptionOtherThanAll = selectedValue.find((item) => item.value !== "All");
            if (
                (
                    (Array.isArray(User.ScreenMapping) && User.ScreenMapping.length > 0 && User.ScreenMapping[0].value === "All")
                    || (Array.isArray(UserUpdate.ScreenMapping) && UserUpdate.ScreenMapping > 0 && UserUpdate.ScreenMapping[0].value === "All")
                ) && isSelectedOptionOtherThanAll
            ) {
                selectedValue = selectedValue.filter((item) => item.value !== "All");
                defaultScreenArr = selectedValue;
            } else {
                const isSelectedOptionIsAll = selectedValue.find((item) => item.value === "All")
                if(isSelectedOptionIsAll) {
                    selectedValue = [{value: "All", label: "All"}];
                    defaultScreenArr = screenArr.filter((item) => item.value !== "All");
                } else {
                    defaultScreenArr = selectedValue;
                }
            }
            Errors.ScreenMapping = "";
            Errors.DefaultScreenMapping = "";
        } else {
            defaultScreenArr = [];
            defaultSelectedValue = null;
            Errors.ScreenMapping = "";
            Errors.DefaultScreenMapping = "";
        }
        if(defaultScreenArr.length > 0) {
            defaultSelectedValue = [defaultScreenArr[0]];
        }
        User.ScreenMapping = selectedValue;
        User.DefaultScreenMapping = defaultSelectedValue;
        UserUpdate.ScreenMapping = selectedValue;
        UserUpdate.DefaultScreenMapping = defaultSelectedValue;
        this.setState({
            User,
            UserUpdate,
            defaultScreenArr,
            Errors
        });
    };

    onSelectDefaultScreenDropdownValueChange = (selectedValue) => {
        const {
            Errors,
            User,
            UserUpdate
        } = this.state;

        if (selectedValue !== null) {
            Errors.DefaultScreenMapping = "";
        } else {
            Errors.DefaultScreenMapping = "This Field can't be empty!";
        }
        User.DefaultScreenMapping = selectedValue
        UserUpdate.DefaultScreenMapping = selectedValue
        this.setState({
            User,
            UserUpdate,
            Errors
        });
    };

    render() {
        const {
            loading,
            popup,
            allRegestredUser,
            Errors,
            User,
            UserUpdate,
            selectedRole,
            enableScreenMapping,
            defaultScreenArr
        } = this.state;

        //code added for split (user-client , smartship-user & Search bar ) 

const styles = {
    borderTop: "transparent",
    borderLeft: "transparent",
    borderRight: "transparent",
    backgroundColor: "white",
    width: "250px ",
  };

  const user = localStorage.getItem("role");   // geting user from localstore
  let result = user.toLowerCase().includes("smart ship"); // validating user

  if (result) {
    var dataByRole = allRegestredUser.filter((items) =>
    items.Role.toLowerCase().includes("")
  )

  } else {
    var dataByRole = allRegestredUser.filter((items) =>
    !items.Role.toLowerCase().includes("smart ship")
  )
  }

// data by tabs

  if (this.state.query === 'All User') {
    var dataByTab = dataByRole.filter((items)=>
    items.Role.toLowerCase().includes('')
    )
  } else if (this.state.query === "Smart Ship User") {
    var dataByTab = dataByRole.filter((items)=>
    items.Role.toLowerCase().includes('smart ship')
    )
  }else if(this.state.query === "Client User"){
    var dataByTab = dataByRole.filter((items)=>
    !items.Role.toLowerCase().includes('smart ship')
    )
  }

  // for serach bar Querys
  const search = (types) => {
    return types.filter(
      (items) =>
        items.Email.toLowerCase().includes(this.state.inputquery ) ||
        items.FirstName.toLowerCase().includes(this.state.inputquery) ||
        items.LastName.toLowerCase().includes(this.state.inputquery) ||
        items.MobileNumber.toLowerCase().includes(this.state.inputquery) ||
        items.Role.toLowerCase().includes(this.state.inputquery) ||
        items.ShipName.map(shipname => shipname.toLowerCase()).some(shipname=>shipname.includes(this.state.inputquery))
    );
  };

  const AllRegestredUser = search(dataByTab);

        return (
            <SMSidebar history={this.props.history} screenPath={"/settings"}>
            <div className="smartShipBody d-flex flex-column vh-100">
                <SmartShipLoader isVisible={loading}/>
                <CustomAlert ref={this.customAlertRef}/>
                <NavigationBar
                    title={"User Management"}/>
                {
                    <div className="flex-1 overflow-auto cbm-wrapper d-flex justify-content-center">
                        <div className="config-form-block alarm-form" style={{width: "98%"}}>
                            <nav className="MyTabs nav nav-tabs"style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="tabs d-flex w-auto">
                  {(result)?( <>
                  <a
                      className={`nav-item nav-link mx-2 ${this.state.alluser}`}
                      onClick={() =>
                        this.setState({ query: "All User"  , alluser:'active' , smart:'', client:''})
                      }
                    >
                      {(result)?("All User"):("Client User")}
                    </a>
                    <a
                      className={`nav-item nav-link mx-2 ${this.state.smart}`}
                      onClick={() => this.setState({ query: "Smart Ship User" , alluser:'' , smart:'active', client:'' })}
                    >
                      SmartShip User
                    </a>
                    <a
                      className={`nav-item nav-link mx-2 ${this.state.client}`}
                      onClick={() =>
                        this.setState({ query: "Client User"  , alluser:'' , smart:'', client:'active'})
                      }
                    >
                       Client User
                    </a></>):(    <a
                      className={`nav-item nav-link mx-2 ${this.state.alluser}`}
                      onClick={() =>
                        this.setState({ query: "All User"  , alluser:'active' , smart:'', client:''})
                      }
                    >
                      {(result)?("All User"):("Client User")}
                    </a>)}
                    <div className="search  mb-2 ml-5 w-auto">
                      <form class="form-inline md-form form-sm w-auto">
                        <input
                          class="form-control form-control-sm ml-3"
                          onChange={(e) => this.setState({inputquery: e.target.value.toLowerCase()})}
                          type="text"
                          placeholder="Search"
                          aria-label="Search"
                          style={styles}
                        />
                        <i class="fas fa-search active" aria-hidden="true"></i>
                      </form>
                    </div>
                  </div>
                  {this.state.toggleAddEditDeleteUserButton ? (
                    <div style={{ display: "flex" }}>
                      <Button
                        size="sm"
                        className="parameter-add-button"
                        variant="outline-secondary"
                        onClick={this.popupShow}
                      >
                        <img
                          alt=""
                          width={16}
                          src={"newFrontend\\src\\CBM\\Images\\plus-64.png"}
                          style={{ marginRight: 6 }}
                        />
                        Add User
                      </Button>
                    </div>
                  ) : null}
                </nav>
                                <div>
                                    <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table" style={{textAlign:"center"}}>
                                        <thead>
                                        <tr className="tableHeader">
                                            <th className="align-middle">Sr.No.</th>
                                            <th className="align-middle">Email</th>
                                            <th className="align-middle">First Name</th>
                                            <th className="align-middle">Last Name</th>
                                            <th className="align-middle">Assigned Screen</th>
                                            <th className="align-middle">Role</th>
                                            <th className="align-middle">Ship Name</th>
                                            <th className="align-middle">Edit List</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            AllRegestredUser.map((item, index) => {
                                                let MappingScreen = item.ScreenMapping.replaceAll('["', "").replaceAll('"]', "").replaceAll('","',',\r\n');
                                                return (
                                                    <tr key={index+1}>
                                                        <td className="align-middle">{index+1}</td>
                                                        <td className="align-middle">{item.Email}</td>
                                                        <td className="align-middle">{item.FirstName}</td>
                                                        <td className="align-middle">{item.LastName}</td>
                                                        <td className="align-middle">{MappingScreen}</td>
                                                        <td className="align-middle">{item.Role==="Fleet Manager"?"Fleet Manager":item.Role}</td>
                                                        {
                                                            (item.Role==='Ship User' || item.ShipName===['no ship']) ? (
                                                                <td><tr>{item.ShipName}</tr></td>
                                                            ) : (
                                                                <td>{
                                                                    item.ShipName.map((item,index)=> {
                                                                            return (<tr className="align-middle" style={{paddingLeft:"10px"}}>{item}</tr>)
                                                                        }
                                                                    )}</td>
                                                            )
                                                        }
                                                        <td className="align-middle">
                                                            {this.state.toggleAddEditDeleteUserButton? <div style={{display:"flex",justifyContent:"space-evenly"}} >
                                                                <img style={{
                                                                    width: 18,
                                                                    cursor: "pointer"
                                                                }}
                                                                     alt="Edit Ship"
                                                                     src={require('../../Images/edit.png')}
                                                                     data-index={index+1}
                                                                     data-fid={item.uId}
                                                                     onClick={this.onUserEditClick}
                                                                     title={"Edit User"}
                                                                />
                                                                { (item.Role!=='Smart Ship Super User') && (
                                                                    <img style={{
                                                                        width: 18,
                                                                        cursor: "pointer",
                                                                    }}
                                                                         alt="Delete Ship"
                                                                         src={require('../../Images/delete.png')}
                                                                         data-index={index + 1}
                                                                         data-fid={item.uId}
                                                                         onClick={this.onUserDeleteClick}
                                                                         title="Delete User"
                                                                    />
                                                                )
                                                                }
                                                            </div>:null}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </Table>
                                </div>
                            <Modal
                                size="lg"
                                show={popup}
                                onHide={this.popupClose}
                                backdrop="static"
                                centered
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title style={{color:"#6d6d6c"}}>Register User</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="config-form-block sm-w-700" style={{margin: "0px auto"}}>
                                        <div>
                                            <Form noValidate id="UserReg">
                                                <Row>
    {/*Row for FirstName and LastName----------------------------------------------------------------------------*/}
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
                                                        defaultValue={UserUpdate.FirstName}
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
                                                        defaultValue={UserUpdate.LastName}
                                                    />
                                                    {Errors.lastName.length > 0 && (
                                                        <Form.Text className='text-left errorMessage'>
                                                            {Errors.lastName}
                                                        </Form.Text>
                                                    )}
                                                </Form.Group>
                                                </Row>
    {/*Row for FirstName and LastName----------------------------------------------------------------------------*/}
                                                <Row>
    {/*Row for Mobile Number and Email----------------------------------------------------------------------------*/}
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
                                                        defaultValue={UserUpdate.MobileNumber}
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
                                                         defaultValue={UserUpdate.Email}
                                                     />
                                                     {Errors.email.length > 0 && (
                                                         <Form.Text className='text-left errorMessage'>
                                                             {Errors.email}
                                                         </Form.Text>
                                                     )}
                                                 </Form.Group>
    {/*Row for Mobile Number and Email----------------------------------------------------------------------------*/}
                                                </Row>
   {/*Row for Password Number and Confirm Password----------------------------------------------------------------------------*/}
                                                <Row>
                                                {
                                                    (UserUpdate.Password=="") && (
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control
                                                                style={Errors.password.length > 0 ? {borderColor:"red"} : null}
                                                                placeholder="password"
                                                                type="password"
                                                                name="password"
                                                                onChange={this.onRegistrationInputChange}
                                                                maxLength={62}
                                                                autoComplete="off"
                                                            />
                                                            {Errors.password.length > 0 && (
                                                                <Form.Text className='text-left errorMessage'>
                                                                    {Errors.password}
                                                                </Form.Text>
                                                            )}
                                                        </Form.Group>
                                                    )
                                                }
                                                {
                                                    (UserUpdate.ConfirmPassword=="") && (
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Confirm Password</Form.Label>
                                                            <Form.Control
                                                                style={Errors.confirmPassword.length > 0 ? {borderColor:"red"} : null}
                                                                placeholder="Confirm Password"
                                                                type="password"
                                                                name="confirmPassword"
                                                                onChange={this.onRegistrationInputChange}
                                                                maxLength={60}
                                                                autoComplete="off"
                                                            />
                                                            {Errors.confirmPassword.length > 0 && (
                                                                <Form.Text className='text-left errorMessage'>
                                                                    {Errors.confirmPassword}
                                                                </Form.Text>
                                                            )}
                                                        </Form.Group>
                                                    )
                                                }
   {/*Row for Password Number and Confirm Password----------------------------------------------------------------------------*/}
                                                </Row>
                                                <Row>
   {/*Row for Company Name----------------------------------------------------------------------------*/}
                                                    {/*row specially for smartShipAdmin*/}
                                                    {/*at the time of creating smartShipAdmin user*/}
                                                    {
                                                        (getItemFromLocalStorage("role")==="Smart Ship Super User") && (
                                                            (UserUpdate.Role=="" && User.role !== "Smart Ship Super User" && User.role !=="Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Company</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={companyNameList}
                                                                        name="companyName"
                                                                        onChange={this.onDropdownCompanyValueChange}
                                                                        isMulti={false}
                                                                        closeMenuOnSelect={true}
                                                                        isDisabled={true}
                                                                        defaultValue={ [{
                                                                            value: UserUpdate.CompanyName,
                                                                            label: UserUpdate.CompanyName
                                                                        }] }
                                                                    />
                                                                    {Errors.companyName.length > 0 && (
                                                                        <Form.Text className='text-left errorMessage'>
                                                                            {Errors.companyName}
                                                                        </Form.Text>
                                                                    )}
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    {/*Fleet Manager*/}
                                                    {
                                                        (getItemFromLocalStorage("role")==="Smart Ship Super User") && (
                                                            (UserUpdate.Role == "Fleet Manager") && (
                                                                (User.role=="") && (
                                                                    <Form.Group size="sm" as={Col}>
                                                                        <Form.Label>Select Company</Form.Label>
                                                                        <Select
                                                                            theme={theme}
                                                                            options={companyNameList}
                                                                            name="companyName"
                                                                            onChange={this.onDropdownCompanyValueChange}
                                                                            isMulti={false}
                                                                            closeMenuOnSelect={true}
                                                                            isDisabled={true}
                                                                            defaultValue={
                                                                                [
                                                                                    {
                                                                                        label:UserUpdate.CompanyName,
                                                                                        value:UserUpdate.CompanyName
                                                                                    }
                                                                                ]
                                                                            }
                                                                        />
                                                                        {Errors.companyName.length > 0 && (
                                                                            <Form.Text className='text-left errorMessage'>
                                                                                {Errors.companyName}
                                                                            </Form.Text>
                                                                        )}
                                                                    </Form.Group>
                                                                )
                                                            )
                                                        )
                                                    }
                                                    {/*ship manager*/}
                                                    {
                                                        (getItemFromLocalStorage("role")==="Smart Ship Super User") && (
                                                            (UserUpdate.Role == "Ship Manager") && (
                                                                (User.role=="") && (
                                                                    <Form.Group size="sm" as={Col}>
                                                                        <Form.Label>Select Company</Form.Label>
                                                                        <Select
                                                                            theme={theme}
                                                                            options={companyNameList}
                                                                            name="companyName"
                                                                            onChange={this.onDropdownCompanyValueChange}
                                                                            isMulti={false}
                                                                            closeMenuOnSelect={true}
                                                                            defaultValue={
                                                                                [
                                                                                    {
                                                                                        label:UserUpdate.CompanyName,
                                                                                        value:UserUpdate.CompanyName
                                                                                    }
                                                                                ]
                                                                            }
                                                                            isDisabled={true}
                                                                        />
                                                                        {Errors.companyName.length > 0 && (
                                                                            <Form.Text className='text-left errorMessage'>
                                                                                {Errors.companyName}
                                                                            </Form.Text>
                                                                        )}
                                                                    </Form.Group>
                                                                )
                                                            )
                                                        )
                                                    }
                                                    {/*ship user*/}
                                                    {
                                                        (getItemFromLocalStorage("role")==="Smart Ship Super User") && (
                                                            (UserUpdate.Role == "Ship User") && (
                                                                (User.role=="") && (
                                                                    <Form.Group size="sm" as={Col}>
                                                                        <Form.Label>Select Company</Form.Label>
                                                                        <Select
                                                                            theme={theme}
                                                                            options={companyNameList}
                                                                            name="companyName"
                                                                            onChange={this.onDropdownCompanyValueChange}
                                                                            isMulti={false}
                                                                            closeMenuOnSelect={true}
                                                                            defaultValue={
                                                                                [
                                                                                    {
                                                                                        label:UserUpdate.CompanyName,
                                                                                        value:UserUpdate.CompanyName
                                                                                    }
                                                                                ]
                                                                            }
                                                                            isDisabled={true}
                                                                        />
                                                                        {Errors.companyName.length > 0 && (
                                                                            <Form.Text className='text-left errorMessage'>
                                                                                {Errors.companyName}
                                                                            </Form.Text>
                                                                        )}
                                                                    </Form.Group>
                                                                )
                                                            )
                                                        )
                                                    }
                                                    {
                                                        (UserUpdate.Role == "Company Admin") && (
                                                            (User.role=="") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Company</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={companyNameList}
                                                                        name="companyName"
                                                                        onChange={this.onDropdownCompanyValueChange}
                                                                        isMulti={false}
                                                                        closeMenuOnSelect={true}
                                                                        defaultValue={
                                                                            [
                                                                                {
                                                                                    label:UserUpdate.CompanyName,
                                                                                    value:UserUpdate.CompanyName
                                                                                }
                                                                            ]
                                                                        }
                                                                        isDisabled={true}
                                                                    />
                                                                    {Errors.companyName.length > 0 && (
                                                                        <Form.Text className='text-left errorMessage'>
                                                                            {Errors.companyName}
                                                                        </Form.Text>
                                                                    )}
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    {
                                                        (UserUpdate.Role !== "") && (
                                                            (User.role=="Company Admin") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Company</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={companyNameList}
                                                                        name="companyName"
                                                                        onChange={this.onDropdownCompanyValueChange}
                                                                        isMulti={false}
                                                                        closeMenuOnSelect={true}
                                                                        defaultValue={
                                                                            [
                                                                                {
                                                                                    label:UserUpdate.CompanyName,
                                                                                    value:UserUpdate.CompanyName
                                                                                }
                                                                            ]
                                                                        }
                                                                    />
                                                                    {Errors.companyName.length > 0 && (
                                                                        <Form.Text className='text-left errorMessage'>
                                                                            {Errors.companyName}
                                                                        </Form.Text>
                                                                    )}
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    {
                                                        (getItemFromLocalStorage("role")==="Smart Ship Super User" && UserUpdate.Role !== "") &&
                                                        (User.role =="Ship User" || User.role =="Ship Manager" || User.role =="Fleet Manager") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Company</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={companyNameList}
                                                                        name="companyName"
                                                                        onChange={this.onDropdownCompanyValueChange}
                                                                        isMulti={false}
                                                                        closeMenuOnSelect={true}
                                                                        defaultValue={
                                                                            [
                                                                                {
                                                                                    label:UserUpdate.CompanyName,
                                                                                    value:UserUpdate.CompanyName
                                                                                }
                                                                            ]
                                                                        }
                                                                        isDisabled={true}
                                                                    />
                                                                    {Errors.companyName.length > 0 && (
                                                                        <Form.Text className='text-left errorMessage'>
                                                                            {Errors.companyName}
                                                                        </Form.Text>
                                                                    )}
                                                                </Form.Group>
                                                        )
                                                    }
             {/*Row for Company Name----------------------------------------------------------------------------*/}
                                                </Row>
                                                <Row>
            {/*Row for Account Row and select ship----------------------------------------------------------------------------*/}
                                                    {
                                                        (getItemFromLocalStorage("role")==="Smart Ship Super User") && (
                                                            <Form.Group as={Col}>
                                                                <Form.Label>Account Role</Form.Label>
                                                                <Select
                                                                    theme={theme}
                                                                    options={lvl1RolesArr}
                                                                    name="role"
                                                                    onChange={this.onDropdownRoleValueChange}
                                                                    isMulti={false}
                                                                    closeMenuOnSelect={true}
                                                                    defaultValue={
                                                                        selectedRole ?
                                                                            [
                                                                                {
                                                                                    value:selectedRole,
                                                                                    label:selectedRole
                                                                                }
                                                                            ] : []
                                                                    }
                                                                />
                                                                {Errors.role.length > 0 && (
                                                                    <Form.Text className='text-left errorMessage'>
                                                                        {Errors.role}
                                                                    </Form.Text>
                                                                )}
                                                            </Form.Group>
                                                        )
                                                    }
                                                    {
                                                        (getItemFromLocalStorage("role")==="Company Admin") && (
                                                            <Form.Group as={Col}>
                                                                <Form.Label>Account Role</Form.Label>
                                                                <Select
                                                                    theme={theme}
                                                                    options={lvl2RolesArr}
                                                                    name="role"
                                                                    onChange={this.onDropdownRoleValueChange}
                                                                    isMulti={false}
                                                                    closeMenuOnSelect={true}
                                                                    defaultValue={
                                                                        selectedRole ?
                                                                            [
                                                                                {
                                                                                    value:selectedRole,
                                                                                    label:selectedRole
                                                                                }
                                                                            ] : []
                                                                    }
                                                                />
                                                                {Errors.role.length > 0 && (
                                                                    <Form.Text className='text-left errorMessage'>
                                                                        {Errors.role}
                                                                    </Form.Text>
                                                                )}
                                                            </Form.Group>
                                                        )
                                                    }
                                                    {
                                                        (getItemFromLocalStorage("role") ==="Smart Ship User") && (
                                                            <Form.Group as={Col}>
                                                                <Form.Label>Account Role</Form.Label>
                                                                <Select
                                                                    theme={theme}
                                                                    options={lvl4RolesArr}
                                                                    name="role"
                                                                    onChange={this.onDropdownRoleValueChange}
                                                                    isMulti={false}
                                                                    closeMenuOnSelect={true}
                                                                    defaultValue={
                                                                        selectedRole ?
                                                                            [
                                                                                {
                                                                                    value:selectedRole,
                                                                                    label:selectedRole
                                                                                }
                                                                            ] : []
                                                                    }
                                                                />
                                                                {Errors.role.length > 0 && (
                                                                    <Form.Text className='text-left errorMessage'>
                                                                        {Errors.role}
                                                                    </Form.Text>
                                                                )}
                                                            </Form.Group>
                                                        )
                                                    }
                                                    {
                                                        (getItemFromLocalStorage("role") !="Company Admin" && getItemFromLocalStorage("role") !="Smart Ship Super User" && getItemFromLocalStorage("role") !="Smart Ship User") && (
                                                            <Form.Group as={Col}>
                                                                <Form.Label>Account Role</Form.Label>
                                                                <Select
                                                                    theme={theme}
                                                                    options={lvl3RolesArr}
                                                                    name="role"
                                                                    onChange={this.onDropdownRoleValueChange}
                                                                    isMulti={false}
                                                                    closeMenuOnSelect={true}
                                                                    defaultValue={
                                                                        selectedRole ?
                                                                            [
                                                                                {
                                                                                    value:selectedRole,
                                                                                    label:selectedRole
                                                                                }
                                                                            ] : []
                                                                    }
                                                                />
                                                                {Errors.role.length > 0 && (
                                                                    <Form.Text className='text-left errorMessage'>
                                                                        {Errors.role}
                                                                    </Form.Text>
                                                                )}
                                                            </Form.Group>
                                                        )
                                                    }
                                                    {/*when any user click on New user and select role company admin*/}
                                                    {
                                                        (UserUpdate.Role=="") && (
                                                            (User.role === "Company Admin") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Ship</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={shipNameList}
                                                                        name="shipName"
                                                                        onChange={this.onDropdownMultipleValueChange}
                                                                        isMulti={true}
                                                                        closeMenuOnSelect={false}
                                                                    />
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    {
                                                        // (UserUpdate.Role=="") && (
                                                        //     (User.role === "Company Admin") && ()
                                                        // )
                                                    }
                                                    {/*any user try to update company admin*/}
                                                    {
                                                        (UserUpdate.Role == "Company Admin") && (
                                                            (User.role=="") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Ship</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={shipNameList}
                                                                        name="shipName"
                                                                        onChange={this.onDropdownMultipleValueChange}
                                                                        isMulti={true}
                                                                        closeMenuOnSelect={false}
                                                                        defaultValue={
                                                                            UserUpdate.ShipName.map((item)=>{
                                                                                return {
                                                                                    value:item,
                                                                                    label:item
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    {/*any user try to update any user and select company admin*/}
                                                    {
                                                        (UserUpdate.Role !== "") && (
                                                            (User.role=="Company Admin") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Ship</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={shipNameList}
                                                                        name="shipName"
                                                                        onChange={this.onDropdownMultipleValueChange}
                                                                        isMulti={true}
                                                                        closeMenuOnSelect={false}
                                                                        defaultValue={
                                                                            UserUpdate.ShipName.map((item)=>{
                                                                                return {
                                                                                    value:item,
                                                                                    label:item
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    {/*create New user and and select role ship user || select fleet manager*/}
                                                    {
                                                        (UserUpdate.Role==="") &&
                                                        (
                                                            User['role'] === 'Ship User' && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Ship</Form.Label>
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
                                                            (UserUpdate.Role==="") && (
                                                                User['role'] === 'Fleet Manager' && (
                                                                    <Form.Group size="sm" as={Col}>
                                                                        <Form.Label>Select Ship</Form.Label>
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
                                                        )
                                                    }
                                                    {/*try to update ship user and fleet manager ||*/}
                                                    {/*try to update user and select ship user || try to update user fleet manager*/}
                                                    {
                                                        (UserUpdate.ShipName !== "") && (
                                                            (User.role === "") ? (
                                                                (UserUpdate.Role === "Ship User") ? (
                                                                    <Form.Group size="sm" as={Col}>
                                                                        <Form.Label>Select Ship</Form.Label>
                                                                        <Select
                                                                            theme={theme}
                                                                            options={shipNameList}
                                                                            name="shipName"
                                                                            onChange={this.onDropdownSingleValueChange}
                                                                            isMulti={false}
                                                                            closeMenuOnSelect={true}
                                                                            defaultValue={
                                                                                UserUpdate.ShipName === ''? ['no ship'] :
                                                                                    [
                                                                                        {
                                                                                            value:UserUpdate.ShipName,
                                                                                            label:UserUpdate.ShipName
                                                                                        }
                                                                                    ]
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                ):(
                                                                    (UserUpdate.Role === "Fleet Manager") && (
                                                                        <Form.Group size="sm" as={Col}>
                                                                            <Form.Label>Select Ship</Form.Label>
                                                                            <Select
                                                                                theme={theme}
                                                                                options={shipNameList}
                                                                                name="shipName"
                                                                                onChange={this.onDropdownMultipleValueChange}
                                                                                isMulti={true}
                                                                                closeMenuOnSelect={false}
                                                                                defaultValue={
                                                                                    UserUpdate.ShipName.map((item)=>{
                                                                                        return {
                                                                                            value:item,
                                                                                            label:item
                                                                                        }
                                                                                    })
                                                                                }
                                                                            />
                                                                        </Form.Group>
                                                                    )
                                                                )
                                                            ): (
                                                                (User.role === "Ship User") ? (
                                                                    <Form.Group size="sm" as={Col}>
                                                                        <Form.Label>Select Ship</Form.Label>
                                                                        <Select
                                                                            theme={theme}
                                                                            options={shipNameList}
                                                                            name="shipName"
                                                                            onChange={this.onDropdownSingleValueChange}
                                                                            isMulti={false}
                                                                            closeMenuOnSelect={true}
                                                                            defaultValue={[
                                                                                {
                                                                                    value:shipNameList[0].label,
                                                                                    label:shipNameList[0].label
                                                                                }
                                                                                ]
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                ):(
                                                                    (User.role == "Fleet Manager") && (
                                                                        <Form.Group size="sm" as={Col}>
                                                                            <Form.Label>Select Ship</Form.Label>
                                                                            <Select
                                                                                theme={theme}
                                                                                options={shipNameList}
                                                                                name="shipName"
                                                                                onChange={this.onDropdownMultipleValueChange}
                                                                                isMulti={true}
                                                                                closeMenuOnSelect={false}
                                                                                defaultValue={
                                                                                    UserUpdate.ShipName.map((item)=>{
                                                                                        return {
                                                                                            value:item,
                                                                                            label:item
                                                                                        }
                                                                                    })
                                                                                }
                                                                            />
                                                                        </Form.Group>
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    }
                                                    {/*smart ship super user log in and click on new user and select smart ship user type*/}
                                                    {
                                                        ((getItemFromLocalStorage("role")==="Smart Ship Super User" || getItemFromLocalStorage("role")==="Smart Ship User")  && UserUpdate.Role == "") && (
                                                            (User.role === "Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    <Form.Label>Select Ship</Form.Label>
                                                                    <Select
                                                                        theme={theme}
                                                                        options={shipNameList}
                                                                        name="shipName"
                                                                        onChange={this.onDropdownMultipleValueChange}
                                                                        isMulti={true}
                                                                        closeMenuOnSelect={false}
                                                                    />
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    {
                                                        (getItemFromLocalStorage("role")==="Smart Ship Super User" || getItemFromLocalStorage("role")==="Smart Ship User") && (
                                                            (UserUpdate.Role !== "") &&(
                                                                (User.role === "") ? (
                                                                    (UserUpdate.Role === "Smart Ship User") && (
                                                                        <Form.Group size="sm" as={Col}>
                                                                            <Form.Label>Select Ship</Form.Label>
                                                                            <Select
                                                                                theme={theme}
                                                                                options={shipNameList}
                                                                                name="shipName"
                                                                                onChange={this.onDropdownMultipleValueChange}
                                                                                isMulti={true}
                                                                                closeMenuOnSelect={false}
                                                                                defaultValue={
                                                                                    UserUpdate.ShipName.map((item)=>{
                                                                                        return {
                                                                                            value:item,
                                                                                            label:item
                                                                                        }
                                                                                    })
                                                                                }
                                                                            />
                                                                        </Form.Group>
                                                                    )
                                                                ):(
                                                                    (User.role === "Smart Ship User") && (
                                                                        <Form.Group size="sm" as={Col}>
                                                                            <Form.Label>Select Ship</Form.Label>
                                                                            <Select
                                                                                theme={theme}
                                                                                options={shipNameList}
                                                                                name="shipName"
                                                                                onChange={this.onDropdownMultipleValueChange}
                                                                                isMulti={true}
                                                                                closeMenuOnSelect={false}
                                                                                defaultValue={
                                                                                    UserUpdate.ShipName.map((item)=>{
                                                                                        return {
                                                                                            value:item,
                                                                                            label:item
                                                                                        }
                                                                                    })
                                                                                }
                                                                            />
                                                                        </Form.Group>
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    }
      {/*Row for Account Row and select ship----------------------------------------------------------------------------*/}
                                                </Row>
                                                <Row>
   {/* create ship/ create Rule/ edit rule toggle button----------------------------------------------------------------------------*/}
                                                    {
                                                        (UserUpdate.CreateShips==="" && User['role'] === 'Smart Ship User') && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    Allow to create ships
                                                                    <div className="customSwitch" style={{float:"right"}}>
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
                                                                </Form.Group>
                                                        )
                                                    }{
                                                        (UserUpdate.CreateRules==="" && User['role'] === 'Smart Ship User') && (
                                                        <Form.Group size="sm" as={Col} style={{}}>
                                                        Allow to create rules
                                                        <div className="customSwitch" style={{float:"right"}}>
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
                                                        </Form.Group>
                                                        )
                                                    }{
                                                        (UserUpdate.EditRules==="" && User['role'] === 'Smart Ship User') && (
                                                                <Form.Group size="sm" as={Col} style={{}}>
                                                                    Allow to edit rule
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={User.editRules}
                                                                            name="editRules"
                                                                            data-key="editRules"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="editRules"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="editRules" />
                                                                    </div>
                                                                </Form.Group>
                                                        )
                                                    }
                                                    {
                                                        (UserUpdate.CreateShips==="") && (
                                                        (User['role'] === 'Fleet Manager') ? (
                                                            <Form.Group size="sm" as={Col}>
                                                                Allow to create ships
                                                                <div className="customSwitch" style={{float:"right"}}>
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
                                                            </Form.Group>
                                                        ):(
                                                            (User['role'] === 'Ship Manager') && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    Allow to create ships
                                                                    <div className="customSwitch" style={{float:"right"}}>
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
                                                                </Form.Group>
                                                            )
                                                        )
                                                        )
                                                    }{
                                                    (UserUpdate.CreateRules==="") && (
                                                    (User['role'] === 'Fleet Manager') ? (
                                                        <Form.Group size="sm" as={Col} style={{}}>
                                                           Allow to create rules
                                                            <div className="customSwitch" style={{float:"right"}}>
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
                                                        </Form.Group>
                                                    ):(
                                                        (User['role'] === 'Ship Manager') && (
                                                            <Form.Group size="sm" as={Col} style={{}}>
                                                                Allow to create rules
                                                                <div className="customSwitch" style={{float:"right"}}>
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
                                                            </Form.Group>
                                                        )
                                                    )
                                                    )
                                                }{
                                                    (UserUpdate.EditRules==="") && (
                                                        (User['role'] === 'Fleet Manager') ? (
                                                            <Form.Group size="sm" as={Col} style={{}}>
                                                                Allow to edit rule
                                                                <div className="customSwitch" style={{float:"right"}}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={User.editRules}
                                                                        name="editRules"
                                                                        data-key="editRules"
                                                                        className={"customSwitch customSwitchInput"}
                                                                        id="editRules"
                                                                        onClick={this.checkBoxItemValueChange}
                                                                    />
                                                                    <label className="customSwitchLabel customSwitchToggle" htmlFor="editRules" />
                                                                </div>
                                                            </Form.Group>
                                                        ):(
                                                            (User['role'] === 'Ship Manager') && (
                                                                <Form.Group size="sm" as={Col} style={{}}>
                                                                    Allow to edit rules
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={User.editRules}
                                                                            name="editRules"
                                                                            data-key="editRules"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="editRules"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="editRules" />
                                                                    </div>
                                                                </Form.Group>
                                                            )
                                                        )
                                                    )
                                                }
                                                {
                                                    (UserUpdate.CreateShips!=="") && (
                                                        (User.role === "") ? (
                                                            (UserUpdate.Role==="Ship Manager" || UserUpdate.Role==="Fleet Manager" || UserUpdate.Role==="Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    Allow to create ships
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={UserUpdate.CreateShips}
                                                                            name="CreateShips"
                                                                            data-key="CreateShips"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="CreateShips"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="CreateShips" />
                                                                    </div>
                                                                </Form.Group>
                                                            )
                                                        ) : (
                                                            (User.role === "Ship Manager" || User.role==="Fleet Manager" || User.role==="Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col}>
                                                                    Allow to create ships
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={UserUpdate.CreateShips}
                                                                            name="CreateShips"
                                                                            data-key="CreateShips"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="CreateShips"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="CreateShips" />
                                                                    </div>
                                                                </Form.Group>
                                                            )
                                                        )
                                                    )
                                                }{
                                                    (UserUpdate.CreateRules!=="") && (
                                                        (User.role === "") ? (
                                                            (UserUpdate.Role==="Ship Manager" || UserUpdate.Role==="Fleet Manager" || UserUpdate.Role==="Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col} style={{}}>
                                                                    Allow to create rules
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={UserUpdate.CreateRules}
                                                                            name="CreateRules"
                                                                            data-key="CreateRules"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="CreateRules"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="CreateRules" />
                                                                    </div>
                                                                </Form.Group>
                                                            )
                                                            ): (
                                                            (User.role === "Ship Manager" || User.role==="Fleet Manager" || User.role==="Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col} style={{}}>
                                                                    Allow to create rules
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={UserUpdate.CreateRules}
                                                                            name="CreateRules"
                                                                            data-key="CreateRules"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="CreateRules"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="CreateRules" />
                                                                    </div>
                                                                </Form.Group>
                                                            )
                                                            )
                                                    )
                                                }{
                                                    (UserUpdate.EditRules!=="") && (
                                                        (User.role === "") ? (
                                                            (UserUpdate.Role==="Ship Manager" || UserUpdate.Role==="Fleet Manager" || UserUpdate.Role==="Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col} style={{}}>
                                                                    Allow to edit rules
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={UserUpdate.EditRules}
                                                                            name="EditRules"
                                                                            data-key="EditRules"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="EditRules"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="EditRules" />
                                                                    </div>
                                                                </Form.Group>
                                                            )
                                                        ): (
                                                            (User.role === "Ship Manager" || User.role==="Fleet Manager" || User.role==="Smart Ship User") && (
                                                                <Form.Group size="sm" as={Col} style={{}}>
                                                                    Allow to edit rules
                                                                    <div className="customSwitch" style={{float:"right"}}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={UserUpdate.EditRules}
                                                                            name="EditRules"
                                                                            data-key="EditRules"
                                                                            className={"customSwitch customSwitchInput"}
                                                                            id="EditRules"
                                                                            onClick={this.checkBoxItemValueChange}
                                                                        />
                                                                        <label className="customSwitchLabel customSwitchToggle" htmlFor="EditRules" />
                                                                    </div>
                                                                </Form.Group>
                                                            )
                                                        )
                                                    )
                                                }
   {/* create ship/ create Rule/ edit rule toggle button----------------------------------------------------------------------------*/}
                                                </Row>
                                                <Row>
    {/*select screen and default screen dropdown                                             */}
                                                    <Form.Group size="sm" as={Col} >
                                                        <Form.Label>Select Screen</Form.Label>
                                                        <Select
                                                            theme={theme}
                                                            options={screenArr}
                                                            data-key="machineName"
                                                            onChange={this.onSelectScreenDropdownValueChange}
                                                            isMulti={true}
                                                            closeMenuOnSelect={false}
                                                            key={UserUpdate.ScreenMapping && UserUpdate.ScreenMapping.toString()}
                                                            defaultValue={UserUpdate.ScreenMapping}
                                                            value={UserUpdate.ScreenMapping}
                                                            isDisabled={!enableScreenMapping}
                                                        />
                                                        {Errors.ScreenMapping.length > 0 && (
                                                            <Form.Text className='text-left errorMessage'>
                                                                {Errors.ScreenMapping}
                                                            </Form.Text>
                                                        )}
                                                    </Form.Group>
                                                    <Form.Group size="sm" as={Col} >
                                                        <Form.Label>Select Default Screen</Form.Label>
                                                        <Select
                                                            theme={theme}
                                                            options={defaultScreenArr}
                                                            data-key="machineName"
                                                            onChange={this.onSelectDefaultScreenDropdownValueChange}
                                                            isMulti={false}
                                                            closeMenuOnSelect={true}
                                                            key={UserUpdate.ScreenMapping && UserUpdate.ScreenMapping.toString()}
                                                            defaultValue={UserUpdate.DefaultScreenMapping}
                                                            value={UserUpdate.DefaultScreenMapping}
                                                            isDisabled={!enableScreenMapping}
                                                        />
                                                        {Errors.ScreenMapping.length > 0 && (
                                                            <Form.Text className='text-left errorMessage'>
                                                                {Errors.ScreenMapping}
                                                            </Form.Text>
                                                        )}
                                                    </Form.Group>
    {/*select screen and default screen dropdown*/}
                                                </Row>
                                                <Form.Group size="sm" as={Col} style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    marginTop: 15,
                                                    paddingLeft:0,
                                                    paddingRight:0
                                                }}>
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button"
                                                        onClick={this.popupClose}
                                                        variant="outline-secondary"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    {
                                                        (UserUpdate.id=== "") ? (
                                                            <Button
                                                                size="sm"
                                                                className="parameter-add-button"
                                                                onClick={this.onRegistrationSubmit}
                                                                variant="outline-secondary"
                                                            >
                                                                Register User
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="parameter-add-button"
                                                                onClick={this.onSubmitUpdateUser}
                                                                data-fid ={UserUpdate.id}
                                                                variant="outline-secondary"
                                                            >
                                                                Update User
                                                            </Button>
                                                        )
                                                    }
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                }
            </div>
            </SMSidebar>
        )
    }
}
export default UserManagement;
