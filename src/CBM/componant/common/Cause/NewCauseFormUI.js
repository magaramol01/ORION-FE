import React, {Component} from 'react';
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap';
import {
    createCause,
    getAllCauses,
    updateCause,
} from "../../../../api";
import SmartShipLoader from "../SmartShipLoader";
import NavigationBar from "../NavigationBar";
import SMSidebar from "../../../../SMSidebar";
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";

const defaultCauseForm = {
    uId: "-1",
    name: "",
    description: "",
};

class NewCauseFormUI extends Component {
    constructor(props) {
        debugger
        super(props);
        let causeForm = JSON.parse(JSON.stringify(defaultCauseForm));
        let currentUid = "-1";
        if (props.location.data) {
            causeForm = props.location.data.causeForm;
            currentUid = causeForm.hasOwnProperty("uId") && causeForm.uId;
        }
        this.state = {
            loading: false,
            currentUid,
            causeForm,
            isSaveUpdateButtonDisabled: true
        };
    }

    componentDidMount() {
        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(this.state.causeForm);
        this.setState({
            isSaveUpdateButtonDisabled
        })
    }

    getObjectForServer = () => {
        const {
            name,
            description,
        } = {...this.state.causeForm};

        return {
            name,
            description,
        }
    };
    getIsSaveUpdateButtonDisabled = (causeForm) => {
        let isSaveUpdateButtonDisabled = false;
        for (let key in causeForm) {
            if (!isSaveUpdateButtonDisabled) {
                isSaveUpdateButtonDisabled = causeForm[key] === "";
            }
        }
        return isSaveUpdateButtonDisabled;
    };

    onElementValueChange = (event) => {
        //debugger
        const key = event.target.dataset.key;
        const value = event.target.value;
        const causeForm = this.state.causeForm;
        causeForm[key] = value;
        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(causeForm);
        this.setState({
            causeForm,
            isSaveUpdateButtonDisabled
        });
    };
    onAddButtonClick = () => {
        debugger
        const payload = this.getObjectForServer();
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload["vesselName"] = "";
        }
        this.onCreateCauseButtonClick(payload);
    };
    onUpdateButtonClick = () => {
        //debugger
        const currentUid = this.state.currentUid;
        const causeForm = this.getObjectForServer();
        const payload = {
            [currentUid]: causeForm
        };
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload[currentUid]["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload[currentUid]["vesselName"] = "";
        }
        this.onUpdateCauseButtonClick (payload);
    };

    onCreateCauseButtonClick = (payload) => {
        debugger
        this.setState({
            loading: true
        });
        createCause(this.onCreateElementSuccess, this.onCreateElementFailure, payload)
    };
    onCreateElementSuccess = (res) => {
        //debugger
        // console.log(res);
        if (res.status === 200 ) {
            //debugger;
            /*let causeForm = {...this.state.causeForm};
            causeForm.uId = res.data;
            const addedCauseElements = [causeForm, ...this.state.addedCauseElements];
            this.setState({
                loading: false,
                addedCauseElements,
                causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
                currentUid: "-1",
                isSaveUpdateButtonDisabled: true,
                isTableVisible: true
            });*/
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "cause",
                    uId: res.data
                }
            })
        }
    };
    onCreateElementFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
       // console.log(err)
    };

    onUpdateCauseButtonClick = (payload) => {
        //debugger
        this.setState({
            loading: true
        });
        updateCause(this.onUpdateElementSuccess, this.onUpdateElementFailure, payload)
    };
    onUpdateElementSuccess = (res) => {
        //debugger
        // console.log(res)
        //debugger
        if (res.status === 200 ) {
            //debugger;
            /*const currentUid = this.state.currentUid;
            const addedCauseElements = [...this.state.addedCauseElements];
            for (let eIndex = 0; eIndex < addedCauseElements.length; eIndex++) {
                if (currentUid === addedCauseElements[eIndex].uId) {
                    addedCauseElements[eIndex] = {...this.state.causeForm};
                    break;
                }
            }
            this.setState({
                loading: false,
                addedCauseElements,
                causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
                currentUid: "-1",
                isSaveUpdateButtonDisabled: true,
                isTableVisible: true
            });*/

            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "cause",
                    uId: this.state.currentUid
                }
            })
        }
    };
    onUpdateElementFailure = (err) => {
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
            causeForm,
            currentUid,
            isSaveUpdateButtonDisabled,
        } = {...this.state};

        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Cause Configuration"}/>
                    <div className="d-flex justify-content-center mt-5">
                        <div className="config-form-block sm-w-500" style={{margin: "0px auto"}}>
                            <div className="config-form-block-header">
                                Cause Configuration
                            </div>
                            <div>
                                <Form.Group size="sm" as={Col}>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        placeholder="Name"
                                        data-key="name"
                                        onChange={this.onElementValueChange}
                                        value={causeForm["name"]}
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
                                        value={causeForm["description"]}
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
                                    {
                                        (
                                            currentUid === "-1" && (
                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button"
                                                    onClick={this.onAddButtonClick}
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
                                                onClick={this.onUpdateButtonClick}
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
            </SMSidebar>
        );
    }
}

export default NewCauseFormUI;
