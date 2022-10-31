import React, {Component} from 'react';
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap';
import {
    createCause,
    getAllCauses,
    updateCause,
} from "../../../api";
import SmartShipLoader from "./SmartShipLoader";

const defaultCauseForm = {
    uId:"-1",
    name:"",
    description:"",
};

class CauseUI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
            isSaveUpdateButtonDisabled: true,
            addedElements: [],
            currentUid: "-1",
            isCauseTableVisible: true
        }
    }

    componentDidMount() {
        //debugger
        getAllCauses(this.onGetAllElementsSuccess,this.onGetAllElementsFailure)
    }
    onGetAllElementsSuccess = (response) => {
        const addedElements = Object.entries(response.data).map(([key, obj]) => Object.assign(
            {
                uId: key ,
                ...obj,
            }
        ));
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
        } = {...this.state.causeForm};

        return {
            name,
            description,
        }
    };
    getIsSaveUpdateButtonDisabled = (causeForm) => {
        let isSaveUpdateButtonDisabled = false;
        for(let key in causeForm) {
            if(!isSaveUpdateButtonDisabled) {
                isSaveUpdateButtonDisabled = causeForm[key] === "";
            }
        }
        return isSaveUpdateButtonDisabled;
    };

    onAddButtonClick = () => {
        const payload = this.getObjectForServer();
        this.setState({
            loading: true
        });
        createCause(this.onCreateElementSuccess,this.onCreateElementFailure, payload)
    };
    onCreateElementSuccess = (res) => {
        //debugger
        // console.log(res);
        if(res.status === 200 ) {
            //debugger;
            let  causeForm = {...this.state.causeForm};
            causeForm.uId = res.data;
            const addedElements = [causeForm, ...this.state.addedElements];
            this.setState({
                loading: false,
                addedElements,
                causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
                currentUid: "-1",
                isSaveUpdateButtonDisabled: true,
                isCauseTableVisible: true
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

    onUpdateButtonClick = () => {
        //debugger
        const currentUid = this.state.currentUid;
        const causeForm = this.getObjectForServer();
        const payload = {
            [currentUid]: causeForm
        };
        this.setState({
            loading: true
        });

        updateCause(this.onUpdateElementSuccess,this.onUpdateElementFailure, payload)
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
                    addedElements[eIndex] = {...this.state.causeForm};
                    break;
                }
            }
            this.setState({
                loading: false,
                addedElements,
                causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
                currentUid: "-1",
                isSaveUpdateButtonDisabled: true,
                isCauseTableVisible: true
            });

        }
    };
    onUpdateElementFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
        //console.log(err)
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
    onCancelClick = () => {
        this.setState({
            currentUid: "-1",
            causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
            isSaveUpdateButtonDisabled: true,
            isCauseTableVisible: true
        })
    };

    onAddNewCauseClick = () => {
        this.setState({
            isCauseTableVisible: false
        })
    };
    onEditClick = (event) => {
        //debugger
        let causeForm = {};
        let addedElements = [...this.state.addedElements];
        const currentUid = event.target.dataset.uid;
        for (let eIndex = 0; eIndex < addedElements.length; eIndex++) {
            if (currentUid === addedElements[eIndex].uId) {
                causeForm = {...addedElements[eIndex]};
                break;
            }
        }
        this.setState(
            {
                addedElements,
                causeForm,
                currentUid,
                isSaveUpdateButtonDisabled: true,
                isCauseTableVisible: false
            }
        );
    };

    render() {
        const {
            causeForm,
            loading,
            currentUid,
            isSaveUpdateButtonDisabled,
            addedElements,
            isCauseTableVisible
        } = {...this.state};
        return (
            <Container>
                {/*{JSON.stringify(causeForm)}*/}
                <SmartShipLoader isVisible={loading}/>
                {
                    isCauseTableVisible
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
                                        onClick={this.onAddNewCauseClick}
                                        variant="outline-secondary">
                                    <img
                                        alt=""
                                        width={16}
                                        src={require('../../Images/plus.png')}
                                        style={{marginRight: 6}}
                                    />
                                    Add Cause
                                </Button>
                            </div>
                            <Table style={{maxWidth: 700, margin: "0px auto"}} striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
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
                                                <td style={{
                                                    position: "relative",
                                                    maxWidth: 50,
                                                    width: 50
                                                }}>
                                                    <div>
                                                        <div
                                                            // style={{textAlign: "center"}}
                                                            title="Edit Cause"
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
                                    Causes
                                </div>
                                <div style={{padding: 20}}>
                                    <Form.Group size="sm" as={Col}>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            placeholder="Name"
                                            data-key="name"
                                            onChange={this.onElementValueChange}
                                            value={causeForm["name"]}
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
                                            value={causeForm["description"]}
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

            </Container>
        );
    }
}

export default CauseUI;
