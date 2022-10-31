import React, {Component} from "react";
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import SmartShipLoader from "../common/SmartShipLoader";
import {deleteMachine,createMachine} from "../../../api";
import CustomAlert from "./CustomAlert";
import NewParametersFormUI from "../common/Parameter/NewParametersFormUI";
import addIcon from '../../Images/downloadedImages/add.png';

class CustomMachinesModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            machineName: "",
            show: false,
            isAddButtonEnabled: true,
            machineOptions: props.machineOptions
        }
        this.customAlertRef = React.createRef();
    }

    showAlert = (messageObject) => {
        this.customAlertRef.current.showAlert(messageObject)
    };

    handleClose = () => {
        this.props.updateMachineOptions(this.state.machineOptions);
        this.setState({
            show: false
        })
    };
    handleShow = () => {
        this.setState({
            show: true
        })
    };

    onAddMachineNameClick = () => {
        const payload = {
            value: this.state.machineName,
            label: this.state.machineName
        };
        createMachine(this.onCreateMachineSuccess, this.onCreateMachineFailure, payload);
    };
    onCreateMachineSuccess = (response) => {
        debugger
        if(response.data) {
            let machineOptions = [
                {
                    id: response.data.toString(),
                    value: this.state.machineName,
                    label: this.state.machineName
                },
                ...this.state.machineOptions
            ];
            this.setState({
                loading: false,
                machineOptions,
                machineName: "",
                isAddButtonEnabled: true
            });
            this.showAlert({
                type: "success",
                message: "Machine Added Successfully"
            })
            this.props.parameterChangeMachine(machineOptions[0].value);
        }
    };
    onCreateMachineFailure = () => {
        debugger
        this.setState({
            loading: false
        });
    };

    onMachineNameChange = (event) => {
        debugger
        const machineName = event.target.value;
        const isAddButtonEnabled = machineName.length === 0;
        this.setState({
            machineName,
            isAddButtonEnabled
        })
    };
    onDeleteMachineClick = (event) => {
        debugger
        const id = event.target.dataset.id;
        const onDeleteMachineSuccess = this.onDeleteMachineSuccess(id);
        deleteMachine(onDeleteMachineSuccess, this.onDeleteMachineFailure, id)
    };
    onDeleteMachineSuccess = (id) => {
        return (response) => {
            let machineOptions = [...this.state.machineOptions];
            for(let uIndex=0; uIndex<machineOptions.length; uIndex++) {
                if(machineOptions[uIndex].id === id) {
                    machineOptions.splice(uIndex, 1);
                    break
                }
            }
            this.setState({
                machineOptions
            });
            this.showAlert({
                type: "success",
                message: "Machine Deleted Successfully"
            })
        }
    };
    onDeleteMachineFailure = () => {
        this.setState({
            loading: false
        });
    };

    render() {
        const {
            show,
            machineOptions,
            machineName,
            isAddButtonEnabled
        } = this.state;
        const disableButtonCss = this.props.disabled ? { pointerEvents: "none"} : null;


        return (
            <>
                <CustomAlert ref={this.customAlertRef}/>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 8,
                        border: "1px  solid #ced4d9",
                        maxHeight: 35,
                        backgroundColor: "white",
                        cursor: "pointer",
                        ...disableButtonCss
                    }}
                    title={"Add Custom Machines"}
                    onClick={this.handleShow}
                >
                    <img style={{
                        width: 18
                    }}
                         alt=""
                         src={addIcon}
                         data-buttonname="add"
                         data-key="enumeratedValue"
                        // onClick={onAddButtonClick}
                    />
                </div>
                <Modal className="smartShipModal" show={show} onHide={this.handleClose} animation={false}>
                    <SmartShipLoader isVisible={false} />
                    <Modal.Header closeButton>
                        Custom Machines
                    </Modal.Header>
                    <Modal.Body>
                        <div className="config-form-block p-0 m-0">
                            <div className="d-flex flex-row mb-2" size="sm" as={Col} >
                            <Form.Control
                                placeholder="Machine"
                                onChange={this.onMachineNameChange}
                                value={machineName}
                                autoComplete="off"
                                autoFocus={true}
                            />
                            <Button
                                size="sm"
                                className="parameter-add-button"
                                onClick={this.onAddMachineNameClick}
                                variant="outline-secondary"
                                disabled={isAddButtonEnabled}
                            >
                                Add
                            </Button>
                        </div>
                            <Table size="sm" className="sm-custom-table mb-0" >
                            <thead>
                            <tr>
                                {/*<th>#</th>*/}
                                <th style={{width: "100%"}}>Name</th>
                                <th style={{maxWidth: 180}}>Delete</th>
                                {/*<th>Delete</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                machineOptions.map((machineItem, index) => {
                                    return (
                                        <tr key={`ptIndex-${index}`}>
                                            {/*<td>{index + 1}</td>*/}
                                            <td style={{width: "100%"}}>{machineItem.value}</td>
                                            <td className="text-right">
                                                <div
                                                    style={{maxWidth: 50}}
                                                    title="Delete Machine"
                                                >
                                                    <img style={{width: 18, cursor: "pointer"}}
                                                         alt="Delete Machine"
                                                         data-id={machineItem.id}
                                                         src={require('../../Images/delete.png')}
                                                         onClick={this.onDeleteMachineClick}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            onClick={this.handleClose}
                            variant="outline-secondary"
                            // disabled={false}
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default CustomMachinesModal;
