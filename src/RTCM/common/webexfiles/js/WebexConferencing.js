import React, {Component} from "react";
import SMSidebar from "../../../../SMSidebar";
import NavigationBar from "../../../../CBM/componant/common/NavigationBar";
import {Col, Form, Modal, Row} from "react-bootstrap";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {getAllMeetings, getAllShips, getAllRemoteInspectionUsers, timeZone, saveWebexMeeting} from '../../../../api';
import CustomAlert from "../../../../CBM/componant/custom/CustomAlert";
import {getItemFromLocalStorage} from "../../helper"
import SmartShipLoader from "../../../../CBM/componant/common/SmartShipLoader";

export let weblink = "";
const theme1 = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
    },
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
});

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
const token = 'ZTdjM2UxZTMtOTZiZC00MTExLTkyMzctMjQ4MzAxOWMwNDdiNjAzYjE0ZWEtYmI3_P0A1_d1d17980-94b0-4f95-af6e-224afebb719b';
class WebexConferencing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            popup: false,
            meeting: {
                title: "",
                agenda: "",
                start: "",
                end: "",
                timezone: timeZone,
                invitees: [],
                sendEmail: true,
                hostEmail: "smartshiphub2021@gmail.com"
            },
            upcomingMeetings: [],
            historyMeetings: [],

            alarmVesselShipList: [],
            webVesselLabel: "",
            webVesselValue: "",

            userList: [],
            webuserLabel: "",
            webuserValue: "",

            responseObjScheduled: null
        }
        this.customAlertRef = React.createRef();
    }

    componentDidMount() {
        getAllMeetings(this.onGetAllMeetingsSuccess, this.onGetAllMeetingsFailure);
        getAllShips(this.getAllShipsSuccess, this.getAllShipsFail);
    }

    getAllShipsSuccess = (response) => {
        this.setState({
            alarmVesselShipList: response.data,
            loading:false
        });
        console.log("get All ships success !!!");
    };

    getAllShipsFail = (error) => {
        this.setState({
            loading: false
        })
        this.showAlert({
            type: "error",
            message: 'Error occured at the time of get All ship fail !!!'
        });
        console.log("Error occured at the time of get All ship fail !!!");
    };

    onAlarmVesselChange = (e) => {
        this.setState({
            webVesselLabel: e.label,
            webVesselValue: e.value
        })

        getAllRemoteInspectionUsers(this.onGetAllRemoteInspectionUsersSuccess, this.onGetAllRemoteInspectionUsersFailure, e.value);
    }

    onGetAllRemoteInspectionUsersSuccess = (res) => {
        console.log("The res", res.data);
        let UserListArr = [];
        res.data.map((item) => {
            let obj = {};
            obj['label'] = item.firstname + " " + item.lastname;
            obj['value'] = item.email;
            UserListArr.push(obj);
        })
        this.setState({
            userList: UserListArr
        })
    }

    onGetAllRemoteInspectionUsersFailure = (err) => {

    }


    onGetAllMeetingsSuccess = (res) => {
        debugger
        this.setState({
            upcomingMeetings: res.data,
            loading:false
        })
        console.log("get All meetings success !!!");
    }

    onGetAllMeetingsFailure = (err) => {
        this.setState({
            loading:false
        })
        this.showAlert({
            type: "error",
            message: 'Error occured while get All meetings'
        });
        console.log("Error in getting all meetings");
    }

    onDropdownmachineValueChange = (selectedValue) => {
        let selectedValueArr = [];
        const {meeting} = {...this.state};
        const currentState = meeting;
        {
            if (!(selectedValue == null)) {
                for (let i = 0; i < selectedValue.length; i++) {

                    selectedValueArr.push({
                        "email": selectedValue[i].value
                    });
                }
            }
            currentState['invitees'] = selectedValueArr;
            this.setState({
                meeting: currentState,
            });
        }
    }

    onFieldChange = (e) => {
        const {value, name} = e.target;
        const {meeting} = {...this.state};
        const currentState = meeting;
        let emailJsonArr = [];
        if (name === 'invitees') {
            currentState[name] = value.split(",");
            currentState[name].map((item) => {
                emailJsonArr.push({
                    "email": item
                })
            })
            currentState[name] = emailJsonArr;
        } else {
            currentState[name] = value;
        }
        this.setState({
            meeting: currentState,
        });

    }

    checkFileds = () => {
        let isInValidFlag = true;
        const formData = this.state.meeting;
        if(formData.title !== "" && formData.agenda !== "" && formData.start !== "" && formData.end !== "" && formData.invitees.length !== 0){
            isInValidFlag = false
        }
        console.log("Invalid Status :: ",isInValidFlag);
        return isInValidFlag;
    }


    onScheduleMeeting = () => {
        this.setState({
            loading:true
        })
        if(this.checkFileds()){
            this.showAlert({
                type: "warning",
                message: "You need to fill all details!",
            });
            this.setState({
                loading:false
            })
        }else{
            debugger
            console.log("Schedule meeting obj ", this.state.meeting);
            fetch("https://webexapis.com/v1/meetings",
                {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.meeting),
                })
                .then(res => res.json())
                .then((result) => {
                    debugger
                    if(!!result.errors){
                        this.setState({
                            loading:false
                        })
                        this.showAlert({
                            type: "warning",
                            message: "Error Occured while creating meeting !!!",
                        });
                    }else{
                        this.setState({
                            responseObjScheduled: result
                        }, this.storeScheduledMeetingResponse)
                    }
                });
        }
    }


    storeScheduledMeetingResponse = () => {
        debugger
        const {responseObjScheduled, meeting} = this.state;
        responseObjScheduled.fromUser = getItemFromLocalStorage("email");
        responseObjScheduled.status = 'active';
        let emails = "";
        meeting.invitees.map((item)=>{
            emails += item.email + ",";
        })
        responseObjScheduled.emails = emails.slice(0, -1);
        responseObjScheduled.toUser = emails;
        responseObjScheduled.subject = "Smartship Hub - Remote support  <" + meeting.title + ">";
        responseObjScheduled.mediainfo = "[]";
        debugger
        saveWebexMeeting(this.onSaveWebexMeetingSuccess, this.onSaveWebexMeetingFailure, responseObjScheduled)
        console.log("The response obj is ", responseObjScheduled)
        this.setState({
            loading:false
        })
    }

    onSaveWebexMeetingSuccess = (res) => {
        this.setState({
            popup: false
        })
        this.showAlert({
            type: "success",
            message: 'Meeting Scheduled Successfully !!!'
        });
        getAllMeetings(this.onGetAllMeetingsSuccess, this.onGetAllMeetingsFailure);
    }

    onSaveWebexMeetingFailure = (err) => {
        console.log(err);
        getAllMeetings(this.onGetAllMeetingsSuccess, this.onGetAllMeetingsFailure);
    }

    onScheduleMeetingSuccess = (response) => {
        console.log(response);
    }

    onScheduleMeetingFailure = (failure) => {
        console.log(failure);
    }

    onDropdownValueChange = (selectedValue) => {
        console.log(selectedValue.value);
        const {meeting} = {...this.state};
        const currentState = meeting;
        currentState['sendEmail'] = selectedValue.value;
        this.setState({
            meeting: currentState,
        });


    }
    popupClose = () => {
        document.getElementById("webexSchedule").reset();
        this.setState({popup: false});
    }

    popupShow = () => {
        this.setState({popup: true});
    }

    onJoinMeeting = (link) => {
        weblink = link;
        debugger
        //window.location.href = "http://localhost:3000/#/StartMeeting";
        this.props.history.push({
            pathname: '/StartMeeting',
            data: {
            }
        });
    }

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    // onDropdownMultipleValueChange = (selectedValue) => {
    //     let User = this.state.User;
    //     let selectedValueArr = [];
    //     if(!(selectedValue==null)){
    //         for(let i=0;i<selectedValue.length;i++){
    //             selectedValueArr.push(selectedValue[i].value);
    //         }
    //     }
    //
    //     if (selectedValueArr.length !== 0) {
    //         Errors.shipName = "";
    //     } else {
    //         Errors.shipName = "This Field can't be empty!";
    //     }
    //     const currentState = User;
    //     currentState['shipName'] = selectedValueArr;
    //     this.setState({Errors,User: currentState});
    // };

    render() {
        const {loading,popup, alarmVesselShipList, userList, upcomingMeetings} = this.state;
        return (
            <SMSidebar history={this.props.history} screenPath={"/WebexConferencing"}>
                <CustomAlert ref={this.customAlertRef}/>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Remote Inspection and Diagnostic"}/>
                    <div className="webex__container">
                        <Modal
                            size="lg"
                            show={popup}
                            onHide={this.popupClose}
                            backdrop="static"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title style={{color: "#6d6d6c"}}>Schedule Meeting</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="config-form-block sm-w-800">
                                    <div>
                                        <Form id="webexSchedule">
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Title</Form.Label>
                                                    <Form.Control
                                                        placeholder="John's Meeting"
                                                        name="title"
                                                        autoComplete="off"
                                                        onChange={this.onFieldChange}
                                                        // defaultValue={CompanyUpdate.companyRegisteredName}

                                                    />

                                                </Form.Group>

                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Timezone</Form.Label>
                                                    <Form.Control
                                                        placeholder="Asia/Singapore"
                                                        name="timezone"
                                                        autoComplete="off"
                                                        onChange={this.onFieldChange}
                                                        defaultValue={timeZone}

                                                    />

                                                </Form.Group>

                                            </Row>

                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Agenda</Form.Label>
                                                    <Form.Control
                                                        placeholder="Agenda"
                                                        name="agenda"
                                                        autoComplete="off"
                                                        onChange={this.onFieldChange}
                                                        // defaultValue={CompanyUpdate.companyRegisteredName}

                                                    />

                                                </Form.Group>
                                            </Row>
                                            <Row>

                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Start Date And Start Time</Form.Label>
                                                    <Form.Control
                                                        name="start"
                                                        autoComplete="off"
                                                        type="datetime-local"
                                                        onChange={this.onFieldChange}
                                                        // defaultValue={CompanyUpdate.companyHQCountry}

                                                    />

                                                </Form.Group>

                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>End Date And End Time</Form.Label>
                                                    <Form.Control
                                                        name="end"
                                                        autoComplete="off"
                                                        type="datetime-local"
                                                        onChange={this.onFieldChange}
                                                        // defaultValue={CompanyUpdate.companyHQCountry}

                                                    />

                                                </Form.Group>

                                            </Row>
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Select Ship</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={alarmVesselShipList}
                                                        name="shipName"
                                                        onChange={this.onAlarmVesselChange}
                                                        isMulti={false}
                                                        closeMenuOnSelect={true}
                                                        // value={alarmVesselShipList[0]}
                                                    />
                                                </Form.Group>

                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Select Users</Form.Label>
                                                    <Select
                                                        theme={theme1}
                                                        options={userList}
                                                        data-key="machineName1"
                                                        onChange={(selectedOption) => this.onDropdownmachineValueChange(selectedOption)}
                                                        isMulti={true}
                                                        closeMenuOnSelect={false}
                                                    />
                                                </Form.Group>

                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer style={{marginTop: "-20px"}}>
                                <Button
                                    size="sm"
                                    className="parameter-add-button ml-0"
                                    variant="outline-secondary"
                                    onClick={this.popupClose}

                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="parameter-add-button ml-0"
                                    variant="outline-secondary"
                                    onClick={this.onScheduleMeeting}
                                >
                                    Schedule
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <div className="flex-1 overflow-auto cbm-wrapper justify-content-center">
                            <div className="config-form-block alarm-form" style={{width: "98%"}}>
                                <nav
                                    className="MyTabs nav nav-tabs"
                                    style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}
                                >
                                    <a
                                        className="nav-item nav-link active"
                                    >My Upcoming Meetings
                                    </a>
                                    <div style={{display: "flex"}}>
                                        <Button
                                            size="sm"
                                            className="float-right parameter-add-button"
                                            variant="outline-secondary"
                                            onClick={this.popupShow}
                                        >
                                            Schedule Meeting
                                        </Button>
                                    </div>
                                </nav>
                                <div>
                                    <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table"
                                           style={{textAlign: "center"}}>
                                        <thead>

                                        <tr className="tableHeader">
                                            <th className="align-middle">id</th>
                                            <th className="align-middle">Action</th>
                                            <th className="align-middle">Title</th>
                                            <th className="align-middle">Start</th>
                                            <th className="align-middle">End</th>
                                            <th className="align-middle">From User</th>
                                            <th className="align-middle">Agenda</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            upcomingMeetings !== [] && upcomingMeetings.map((item, index) => {
                                                debugger
                                                    return (

                                                        <tr>
                                                            <td className="align-middle"> {item.meetingid}</td>
                                                            <td className="align-middle">
                                                                <Button
                                                                    size="sm"
                                                                    className=" webex-join"
                                                                    onClick={() => {this.onJoinMeeting(item.meetlink)}}
                                                                >
                                                                    Join
                                                                </Button>
                                                            </td>
                                                            <td className="align-middle">{item.title}</td>
                                                            <td className="align-middle">{item.startdatetime}</td>
                                                            <td className="align-middle">{item.enddatetime}</td>
                                                            <td className="align-middle">{item.fromuser}</td>
                                                            <td className="align-middle">{item.agenda}</td>
                                                        </tr>
                                                    )
                                                }
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            <br/>
                            <div className="config-form-block alarm-form" style={{width: "98%"}}>
                                <nav
                                    className="MyTabs nav nav-tabs"
                                    style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}
                                >
                                    <a
                                        className="nav-item nav-link active"
                                    >My Past Meetings
                                    </a>
                                </nav>
                                <div>
                                    <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table"
                                           style={{textAlign: "center"}}>
                                        <thead>
                                        <tr className="tableHeader">
                                            <th className="align-middle">id</th>
                                            <th className="align-middle">Title</th>
                                            <th className="align-middle">Start</th>
                                            <th className="align-middle">End</th>
                                            <th className="align-middle">To Vessel</th>
                                            <th className="align-middle">From User</th>
                                            <th className="align-middle">Agenda</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {/*<tr>*/}
                                        {/*    <td className="align-middle"> 1</td>*/}
                                        {/*    <td className="align-middle">fdgdghshsdfhshsdf</td>*/}
                                        {/*    <td className="align-middle">ghshsghgfhfgh</td>*/}
                                        {/*    <td className="align-middle">srgargsrgawerga</td>*/}
                                        {/*    <td className="align-middle">arewgaertgaer</td>*/}
                                        {/*    <td className="align-middle">eherherh</td>*/}
                                        {/*    <td className="align-middle">erheher</td>*/}
                                        {/*</tr>*/}

                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </SMSidebar>


        )
    }
}

export default WebexConferencing;
