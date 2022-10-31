import React, {Component} from 'react';
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap';
import {
    createFailureAdvisory,
    getAllFailureAdvisories,
    updateFailureAdvisory,
} from "../../../../api";
import SmartShipLoader from "../SmartShipLoader";
import NavigationBar from "../NavigationBar";
import {green} from "color-name";
import SMSidebar from "../../../../SMSidebar";
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";

const defaultAdvisoryForm = {
    uId: "-1",
    fa_alarm_radio: "failure_advisory",//"alarm"
    name: "",
    description: "",
};
const fa_alarm_text = {
    failure_advisory: "Failure",
    alarm: "Alarm",
};

class NewAdvisoryFormUI extends Component {
    constructor(props) {
        super(props);
        debugger
        let advisoryForm = JSON.parse(JSON.stringify(defaultAdvisoryForm));
        let currentUid = "-1";
        if (props.location.data) {
            advisoryForm = props.location.data.advisoryForm;
            currentUid = advisoryForm.hasOwnProperty("uId") && advisoryForm.uId;
        }
        this.state = {
            loading: false,
            currentUid,
            advisoryForm,
            isSaveUpdateButtonDisabled: true
        }
    }

    componentDidMount() {
        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(this.state.advisoryForm);
        this.setState({
            isSaveUpdateButtonDisabled
        })
    }

    getIsSaveUpdateButtonDisabled = (advisoryForm) => {
        let isSaveUpdateButtonDisabled = false;
        for (let key in advisoryForm) {
            if (!isSaveUpdateButtonDisabled) {
                isSaveUpdateButtonDisabled = advisoryForm[key] === "";
            }
        }
        return isSaveUpdateButtonDisabled;
    };
    onElementValueChange = (event) => {
        //debugger
        const key = event.target.dataset.key;
        const value = event.target.value;
        const advisoryForm = this.state.advisoryForm;
        advisoryForm[key] = value;
        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(advisoryForm);
        this.setState({
            advisoryForm,
            isSaveUpdateButtonDisabled
        });
    };
    onRadioValueChange = (event) => {
        debugger;
        const advisoryForm = {...this.state.advisoryForm};
        advisoryForm.fa_alarm_radio = event.target.dataset.radioname;
        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(advisoryForm);
        this.setState({
            advisoryForm,
            isSaveUpdateButtonDisabled
        })
    };

    getAdvisoryObjectForServer = (advisoryFormState) => {
        debugger
        const {
            name,
            description,
            fa_alarm_radio,
        } = {...advisoryFormState};

        return {
            name,
            description,
            isFailureAdvisory: fa_alarm_radio === "failure_advisory",
            isAlarm: fa_alarm_radio === "alarm"
        }
    };

    onCreateAdvisoryClick = (advisoryFormState) => {
        debugger
        const payload = this.getAdvisoryObjectForServer(advisoryFormState);
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload["vesselName"] = "";
        }
        this.setState({
            loading: true
        });
        createFailureAdvisory(this.onCreateAdvisorySuccess, this.onCreateAdvisoryFailure, payload)
    };
    onCreateAdvisorySuccess = (res) => {
        //debugger
        // console.log(res);
        if (res.status === 200 ) {
            //debugger;
            // let  advisoryForm = {...this.state.advisoryForm};
            // advisoryForm.uId = res.data;
            /*const addedAdvisoryElements = [advisoryForm, ...this.state.addedAdvisoryElements];
            this.setState({
                loading: false,
                addedAdvisoryElements,
                advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),
                currentUid: "-1",
                isTableVisible: true,
            });*/
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "advisory",
                    uId: res.data
                }
            })
        }
    };
    onCreateAdvisoryFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
        //console.log(err)
    };

    onUpdateAdvisoryClick = (advisoryFormState) => {
        debugger
        const currentUid = this.state.currentUid;
        const advisoryForm = this.getAdvisoryObjectForServer(advisoryFormState);
        const payload = {
            [currentUid]: advisoryForm
        };
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload[currentUid]["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload[currentUid]["vesselName"] = "";
        }
        this.setState({
            loading: true
        });

        updateFailureAdvisory(this.onUpdateAdvisorySuccess, this.onUpdateAdvisoryFailure, payload)
    };
    onUpdateAdvisorySuccess = (res) => {
        //debugger
        // console.log(res)
        //debugger
        if (res.status === 200 ) {
            //debugger;
            /*const currentUid = this.state.currentUid;
            const addedAdvisoryElements = [...this.state.addedAdvisoryElements];
            for (let eIndex = 0; eIndex < addedAdvisoryElements.length; eIndex++) {
                if (currentUid === addedAdvisoryElements[eIndex].uId) {
                    addedAdvisoryElements[eIndex] = {...this.state.advisoryForm};
                    break;
                }
            }
            this.setState({
                loading: false,
                addedAdvisoryElements,
                advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),
                currentUid: "-1",
                isTableVisible: true
            });*/

            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "advisory",
                    uId: this.state.currentUid
                }
            })

        }
    };
    onUpdateAdvisoryFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
        //console.log(err)
    };

    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        const {
            loading,
            advisoryForm,
            currentUid,
            isSaveUpdateButtonDisabled
        } = {...this.state};

        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Advisory Configuration"}/>
                    <div
                        className="d-flex justify-content-center pt-5 overflow-auto cbm-wrapper"
                        xs={12} md={12} lg={12}
                    >
                        <div className="config-form-block sm-w-500" style={{margin: "0px auto"}}>
                            <div>
                                <div className="config-form-block-header">
                                    Advisory Configuration
                                </div>
                                <div>
                                    <Form.Group size="sm" as={Col}>
                                        {/*<Form.Label>Failure Advisory</Form.Label>*/}
                                        <Form.Check
                                            name={`fa_alarm_radio`} inline
                                            label="Failure"
                                            type="radio"
                                            id={`condition-inline-radio-1`}
                                            data-key="fa_alarm_radio"
                                            data-radioname="failure_advisory"
                                            checked={advisoryForm["fa_alarm_radio"] === 'failure_advisory'}
                                            // data-ruleconfigid={ruleIndex}
                                            onChange={this.onRadioValueChange}
                                        />
                                        <Form.Check
                                            name={`fa_alarm_radio`} inline
                                            label="Alarm"
                                            type="radio"
                                            id={`condition-inline-radio-2`}
                                            data-key="fa_alarm_radio"
                                            data-radioname="alarm"
                                            checked={advisoryForm["fa_alarm_radio"] === 'alarm'}
                                            // data-ruleconfigid={ruleIndex}
                                            onChange={this.onRadioValueChange}
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            placeholder="Name"
                                            data-key="name"
                                            onChange={this.onElementValueChange}
                                            value={advisoryForm["name"]}
                                            maxLength={100}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea" aria-label="With textarea"
                                            placeholder="Description"
                                            data-key="description"
                                            onChange={this.onElementValueChange}
                                            value={advisoryForm["description"]}
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
                                            onClick={this.resetToDefaultView}
                                            variant="outline-secondary"
                                        >
                                            Cancel
                                        </Button>
                                        {/*{JSON.stringify(currentUid)}*/}
                                        {
                                            (
                                                currentUid === "-1" && (
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button"
                                                        onClick={() => {
                                                            this.onCreateAdvisoryClick(this.state.advisoryForm)
                                                        }}
                                                        variant="outline-secondary"
                                                        disabled={isSaveUpdateButtonDisabled}
                                                    >
                                                        Add
                                                    </Button>
                                                )
                                            )
                                            || (
                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button"
                                                    onClick={() => {
                                                        this.onUpdateAdvisoryClick(this.state.advisoryForm)
                                                    }}
                                                    variant="outline-secondary"
                                                    disabled={isSaveUpdateButtonDisabled}
                                                >
                                                    Update
                                                </Button>
                                            )
                                        }
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SMSidebar>
        );
    }
}

export default NewAdvisoryFormUI;
