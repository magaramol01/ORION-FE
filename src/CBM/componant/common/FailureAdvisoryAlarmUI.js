import React, {Component} from 'react';
import {Button, Card, Col, Container, Form, Row, Tab, Table, Tabs} from 'react-bootstrap';
import {
    createFailureAdvisory,
    getAllFailureAdvisories,
    updateFailureAdvisory,
} from "../../../api";
import SmartShipLoader from "./SmartShipLoader";

const defaultAdvisoryForm = {
    uId:"-1",
    fa_alarm_radio: "failure_advisory",//"alarm"
    name:"",
    description:"",
};
const fa_alarm_text = {
    failure_advisory: "Failure",
    alarm: "Alarm",
};


const tableData = [

    {
        id: 1,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 2,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 3,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 4,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 5,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 6,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 7,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 8,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 9,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 10,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 11,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    },
    {
        id: 12,
        timeStamp: Date(),
        alarmMessageText: "test",
        acknowledgeStatus: "no acknowledge",
        comment: "",
        remarks: "",
        machineName: "test"
    }
];
class FailureAdvisoryAlarmUI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),
            isSaveUpdateButtonDisabled: true,
            addedElements: [],
            currentUid: "-1",
            isAdvisoryTableVisible: true,
            key: "currentAlarm",
        }
    }

    componentDidMount() {
        //debugger
        getAllFailureAdvisories(this.onGetAllElementsSuccess,this.onGetAllElementsFailure)
    }
    onGetAllElementsSuccess = (response) => {
        const addedElements = Object.entries(response.data).map(([key, obj]) => Object.assign(
            {
                uId: key ,
                ...obj,
                fa_alarm_radio: (obj.isFailureAdvisory && "failure_advisory") || (obj.isAlarm && "alarm")
            }
            )).reverse();
        this.setState({
            addedElements,
            loading: false
        })
    };
    onGetAllElementsFailure = (error) => {
        this.setState({
            loading: false
        })
    };

    getObjectForServer = () => {
        const {
            name,
            description,
            fa_alarm_radio,
        } = {...this.state.advisoryForm};

        return {
            name,
            description,
            isFailureAdvisory: fa_alarm_radio === "failure_advisory",
            isAlarm: fa_alarm_radio === "alarm"
        }
    };
    getIsSaveUpdateButtonDisabled = (advisoryForm) => {
        let isSaveUpdateButtonDisabled = false;
        for(let key in advisoryForm) {
            if(!isSaveUpdateButtonDisabled) {
                isSaveUpdateButtonDisabled = advisoryForm[key] === "";
            }
        }
        return isSaveUpdateButtonDisabled;
    };

    getTableData = () => {
        const data = tableData;
        return data.map((item,index)=>{
            return(
                <tr key={item.id}>
                    <td>{index+1}</td>
                    <td>{item.timeStamp}</td>
                    <td>{item.alarmMessageText}</td>
                    <td>{item.acknowledgeStatus}</td>
                    <td>{item.machineName}</td>
                    <td>{item.comment}</td>
                    <td>{item.remarks}</td>
                </tr>
            )})
    }

    setKey = (key)=> {
        this.setState({key});
    }
    onAddClick = () => {
        const payload = this.getObjectForServer();
        this.setState({
            loading: true
        });
        createFailureAdvisory(this.onCreateElementSuccess,this.onCreateElementFailure, payload)
    };
    onCreateElementSuccess = (res) => {
        //debugger
        // console.log(res);
        if(res.status === 200 ) {
            //debugger;
            let  advisoryForm = {...this.state.advisoryForm};
            advisoryForm.uId = res.data;
            const addedElements = [advisoryForm, ...this.state.addedElements];
            this.setState({
                loading: false,
                addedElements,
                advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),
                currentUid: "-1",
                isSaveUpdateButtonDisabled: true,
                isAdvisoryTableVisible: true
            });
        }
    };
    onCreateElementFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
        //console.log(err)
    };

    onUpdateClick = () => {
        //debugger
        const currentUid = this.state.currentUid;
        const advisoryForm = this.getObjectForServer();
        const payload = {
            [currentUid]: advisoryForm
        };
        this.setState({
            loading: true
        });

        updateFailureAdvisory(this.onUpdateElementSuccess,this.onUpdateElementFailure, payload)
    };
    onUpdateElementSuccess = (res) => {
        //debugger
        // console.log(res)
        //debugger
        if(res.status === 200 ) {
            //debugger;
            const currentUid = this.state.currentUid;
            const addedElements = [...this.state.addedElements];
            for (let eIndex = 0; eIndex < addedElements.length; eIndex++) {
                if (currentUid === addedElements[eIndex].uId) {
                    addedElements[eIndex] = {...this.state.advisoryForm};
                    break;
                }
            }
            this.setState({
                loading: false,
                addedElements,
                advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),
                currentUid: "-1",
                isSaveUpdateButtonDisabled: true,
                isAdvisoryTableVisible: true
            });

        }
    };
    onUpdateElementFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
        console.log(err)
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
    onCancelClick = () => {
        this.setState({
            currentUid: "-1",
            advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),
            isSaveUpdateButtonDisabled: true,
            isAdvisoryTableVisible: true
        })
    };
    onRadioValueChange = (event) => {
        //debugger;
        const advisoryForm = {...this.state.advisoryForm};
        advisoryForm.fa_alarm_radio = event.target.dataset.radioname;
        const isSaveUpdateButtonDisabled = this.getIsSaveUpdateButtonDisabled(advisoryForm);
        this.setState({
            advisoryForm,
            isSaveUpdateButtonDisabled
        })
    };

    onEditClick = (event) => {
        //debugger
        let advisoryForm = {};
        let addedElements = [...this.state.addedElements];
        const currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < addedElements.length; eIndex++) {
            if (currentUid === addedElements[eIndex].uId) {
                advisoryForm = {...addedElements[eIndex]};
                break;
            }
        }
        this.setState(
            {
                addedElements,
                advisoryForm,
                currentUid,
                isSaveUpdateButtonDisabled: true,
                isAdvisoryTableVisible: false
            }
        );
    };
    onAddNewAdvisoryClick = () => {
        this.setState({
            isAdvisoryTableVisible: false
        })
    };

    render() {
        const {
            advisoryForm,
            loading,
            currentUid,
            isSaveUpdateButtonDisabled,
            addedElements,
            isAdvisoryTableVisible
        } = {...this.state};
        const failureAdvisoryTableData = this.getTableData();
        return (
            <Container>
                {/*{JSON.stringify(advisoryForm)}*/}
                <SmartShipLoader isVisible={loading}/>
                {
                    isAdvisoryTableVisible
                        ? (<Row ld={8} md={8} xs={16} sm={16}>
                            <div style={{
                                width: "100%",
                                borderWidth: 1,
                                borderColor: "black",
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: 10,
                                maxWidth: 700,
                                margin: "0px auto",
                                paddingBottom: 10
                            }}>
                                <Button className="SM-button"
                                        onClick={this.onAddNewAdvisoryClick}
                                        variant="outline-secondary">
                                    <img
                                        alt=""
                                        width={16}
                                        src={require('../../Images/plus.png')}
                                        style={{marginRight: 6}}
                                    />
                                    Add Advisory
                                </Button>
                            </div>
                            <Table style={{maxWidth: 700, margin: "0px auto"}} striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {/*{
                                        JSON.stringify(addedElements)
                                    }*/}
                                {
                                    addedElements.map((addedElement, index) => {
                                        return (
                                            <tr key={`singleInputTable` + index}>
                                                {/*<td>{index + 1}</td>*/}
                                                <td>{addedElement.name}</td>
                                                <td>{addedElement.description}</td>
                                                <td>{fa_alarm_text[addedElement.fa_alarm_radio]}</td>
                                                <td style={{
                                                    position: "relative",
                                                    maxWidth: 50,
                                                    width: 50
                                                }}>
                                                    <div>
                                                        <div
                                                            // style={{textAlign: "center"}}
                                                            title="Edit Advisory"
                                                        >
                                                            {/*{JSON.stringify(addedElement)}*/}
                                                            <img style={{
                                                                width: 18,
                                                                cursor: "pointer"
                                                            }}
                                                                 alt="Edit Advisory"
                                                                 src={require('../../Images/edit.png')}
                                                                 data-index={index}
                                                                 data-uid={addedElement.uId}
                                                                 onClick={this.onEditClick}
                                                            />
                                                        </div>
                                                        {/*<div
                                                            data-index={index}
                                                            onClick={this.onDeleteClick}
                                                            style={{
                                                                position: "absolute",
                                                                top: "calc(50% - 12px)",
                                                                left: "calc(50% - 5px)",
                                                                cursor: "pointer"
                                                            }}>
                                                            x
                                                        </div>*/}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </Table>
                        </Row>)
                        : (<Row ld={8} md={8} xs={8}>
                            <div id="parametersUI">
                                <div className="cardHeader">
                                    Advisory
                                </div>
                                <div style={{padding: 20}}>
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
                                            maxLength={30}
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
                                        justifyContent: "flex-end",
                                        marginTop: 15
                                    }}>
                                        {
                                            (
                                                currentUid === "-1" && (
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button"
                                                        onClick={this.onAddClick}
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
                                                    onClick={this.onUpdateClick}
                                                    variant="outline-secondary"
                                                    disabled={isSaveUpdateButtonDisabled}
                                                >
                                                    Update
                                                </Button>
                                            )
                                        }
                                        <Button
                                            size="sm"
                                            className="parameter-add-button"
                                            onClick={this.onCancelClick}
                                            variant="outline-secondary"
                                        >
                                            Cancel
                                        </Button>
                                    </Form.Group>
                                </div>
                            </div>
                        </Row>)

                }
                {
                    <div>
                        <Tabs className="MyTabs" defaultActiveKey="currentAlarm"
                              onSelect={key => this.setKey(key)} activeKey={this.state.key}>
                            <Tab eventKey="currentAlarm" title="Current Alarm">
                                <div className="p-1">
                                    <Row>
                                        <Col>
                                            Filter Options
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            Machine Name
                                            <Form.Control
                                                as="select"
                                                value=""
                                                // data-key={`${rangeKey}-dropdown`}
                                                data-key="conditionDropdown"
                                                data-dropdownname="singleValueCondition"
                                                // onChange={onRuleConfigFormItemValueChange}
                                                style={{
                                                    marginRight: 20,
                                                    // width: 65
                                                }}
                                            >

                                                {
                                                    ["a","b","c","d"].map((opt, cpoIndex) => {
                                                        return (
                                                            <option
                                                                key={`cpoIndex-${cpoIndex}`}>{opt}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            Date
                                            <Form.Control type="date"/>
                                        </Col>
                                        <Col>
                                            Status
                                            <Form.Control
                                                as="select"
                                                value=""
                                                // data-key={`${rangeKey}-dropdown`}
                                                data-key="conditionDropdown"
                                                data-dropdownname="singleValueCondition"
                                                // onChange={onRuleConfigFormItemValueChange}
                                                style={{
                                                    marginRight: 20,
                                                    // width: 65
                                                }}
                                            >

                                                {
                                                    ["a","b","c","d"].map((opt, cpoIndex) => {
                                                        return (
                                                            <option
                                                                key={`cpoIndex-${cpoIndex}`}>{opt}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            Remarks
                                            <Form.Control
                                                as="select"
                                                value=""
                                                // data-key={`${rangeKey}-dropdown`}
                                                data-key="conditionDropdown"
                                                data-dropdownname="singleValueCondition"
                                                // onChange={onRuleConfigFormItemValueChange}
                                                style={{
                                                    marginRight: 20,
                                                    // width: 65
                                                }}
                                            >

                                                {
                                                    ["a","b","c","d"].map((opt, cpoIndex) => {
                                                        return (
                                                            <option
                                                                key={`cpoIndex-${cpoIndex}`}>{opt}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button>Apply</Button>
                                        </Col>
                                    </Row>
                                </div>
                                <Card className="p-2">
                                    <Table bordered hover responsive="sm" size="sm">
                                        <thead>
                                        <tr className="tableHeader">
                                            <th>Sr.No</th>
                                            <th>Date Time</th>
                                            <th>Alarm Message</th>
                                            <th>Acknowledge/Status</th>
                                            <th>Machine Name</th>
                                            <th>Comment</th>
                                            <th>Remarks</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {failureAdvisoryTableData}
                                        </tbody>
                                    </Table>
                                </Card>
                            </Tab>
                            <Tab eventKey="systemAlarm" title="System Alarm">
                                <div>todo system Alarm.</div>
                            </Tab>
                        </Tabs>
                    </div>
                }
            </Container>
        );
    }
}

export default FailureAdvisoryAlarmUI;
