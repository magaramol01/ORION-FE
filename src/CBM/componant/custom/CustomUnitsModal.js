import React, {Component} from "react";
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import SmartShipLoader from "../common/SmartShipLoader";
import {createUnit, deleteUnit, updateUnit} from "../../../api";
import CustomAlert from "./CustomAlert";
import NewParametersFormUI from "../common/Parameter/NewParametersFormUI";
import addIcon from '../../Images/downloadedImages/add.png';

class CustomUnitsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            unitName: "",
            show: false,
            isAddUpdateButtonDisabled: true,
            unitOptions: props.unitOptions
        };
        this.customAlertRef = React.createRef();
    }

    showAlert = (messageObject) => {
        this.customAlertRef.current.showAlert(messageObject)
    };

    handleClose = () => {
        this.props.updateUnitOptions(this.state.unitOptions);
        this.setState({
            show: false
        })
    };
    handleShow = () => {
        this.setState({
            show: true
        })
    };

    onAddUnitNameClick = () => {
        const payload = {
            value: this.state.unitName,
            label: this.state.unitName
        };
        createUnit(this.onCreateUnitSuccess, this.onCreateUnitFailure, payload);
    };
    onCreateUnitSuccess = (response) => {
        if(response.data.status) {
            let unitOptions = [
                {
                    id: response.data.id.toString(),
                    value: this.state.unitName,
                    label: this.state.unitName
                },
                ...this.state.unitOptions
            ];
            this.setState({
                loading: false,
                unitOptions,
                unitName: "",
                isAddUpdateButtonDisabled: true
            });
            this.props.parameterChangeUnit(unitOptions[0].value);
            this.showAlert({
                type: "success",
                message: "Unit Added Successfully"
            })
        }
        else {
            if(response.data.id === 0){
                this.showAlert({
                    type: "warning",
                    message: "Unit Already Exists"
                })
            }
        }
    };
    onCreateUnitFailure = () => {
        this.setState({
            loading: false
        });
    };

    onUpdateUnitNameClick = () => {
        const payload = {
            [this.state.id] : {
                value: this.state.unitName,
                label: this.state.unitName
            }
        };
        const onUpdateUnitSuccess = this.onUpdateUnitSuccess(this.state.id);
        updateUnit(onUpdateUnitSuccess, this.onUpdateUnitFailure, payload);
    };
    onUpdateUnitSuccess = (id) => {
        return (response) => {
            if(response.data) {
                let unitOptions = [...this.state.unitOptions];
                for(let uIndex=0; uIndex<unitOptions.length; uIndex++) {
                    if(unitOptions[uIndex].id === id) {
                        unitOptions[uIndex].value = this.state.unitName;
                        unitOptions[uIndex].label = this.state.unitName;
                        break
                    }
                }
                this.setState({
                    loading: false,
                    unitOptions,
                    id: -1,
                    unitName: "",
                    isAddUpdateButtonDisabled: true
                });
                this.showAlert({
                    type: "success",
                    message: "Unit Updated Successfully"
                })
            }
        }
    };
    onUpdateUnitFailure = () => {
        this.setState({
            loading: false
        });
    };

    onEditUnitClick = (event)=> {
        const id = event.target.dataset.id;
        let unitName = "";
        let unitOptions = [...this.state.unitOptions];
        for(let uIndex=0; uIndex<unitOptions.length; uIndex++) {
            if(unitOptions[uIndex].id === id) {
                unitName =unitOptions[uIndex].value;
                break
            }
        }
        this.setState({
            id,
            unitName,
            isAddUpdateButtonDisabled: false
        })
    };
    onUnitNameChange = (event) => {
        const unitName = event.target.value.trim();
        const isAddUpdateButtonDisabled = unitName.length === 0;
        this.setState({
            unitName,
            isAddUpdateButtonDisabled
        })
    };

    onDeleteUnitClick = (event) => {
        const id = event.target.dataset.id;
        const onDeleteUnitSuccess = this.onDeleteUnitSuccess(id);
        deleteUnit(onDeleteUnitSuccess, this.onDeleteUnitFailure, id)
    };
    onDeleteUnitSuccess = (id) => {
        return (response) => {
            let unitOptions = [...this.state.unitOptions];
            for(let uIndex=0; uIndex<unitOptions.length; uIndex++) {
                if(unitOptions[uIndex].id === id) {
                    unitOptions.splice(uIndex, 1);
                    break;
                }
            }
            this.setState({
                unitOptions
            });
            this.showAlert({
                type: "success",
                message: "Unit Deleted Successfully"
            })
        }
    };
    onDeleteUnitFailure = () => {
        this.setState({
            loading: false
        });
    };

    updateUnitOptions = () => {
        this.setState({
            loading: true
        });
        const payload = {
            units: [...this.state.unitOptions]
        };
        createUnit(this.onUpdateUnitsSuccess, this.onUpdateUnitsFailure, payload);
    };
    onUpdateUnitsSuccess = () => {
        this.setState({
            show: false,
            loading: false,
        }, () => {
            this.props.updateUnitOptions(this.state.unitOptions);
        });
    };
    onUpdateUnitsFailure = (err) => {
        //console.log(err);
        this.setState({
            show: true,
            loading: false
        })
    };

    render() {
        const {
            id,
            show,
            unitOptions,
            unitName,
            isAddUpdateButtonDisabled
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
                    title={"Add Custom Units"}
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
                <Modal id="customUnits" show={show} onHide={this.handleClose} animation={false}>
                    <SmartShipLoader isVisible={false} />
                    <Modal.Header closeButton>
                        Custom Units
                    </Modal.Header>
                    <Modal.Body>
                        <div className="config-form-block p-0 m-0">
                            <div className="d-flex flex-row mb-2" size="sm" as={Col} >
                                <Form.Control
                                    placeholder="Unit"
                                    onChange={this.onUnitNameChange}
                                    value={unitName}
                                    autoComplete="off"
                                    autoFocus={true}
                                />
                                {
                                    id === -1 ?  (
                                        <Button
                                            size="sm"
                                            className="parameter-add-button"
                                            onClick={this.onAddUnitNameClick}
                                            variant="outline-secondary"
                                            disabled={isAddUpdateButtonDisabled}
                                        >
                                            Add
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="parameter-add-button"
                                            onClick={this.onUpdateUnitNameClick}
                                            variant="outline-secondary"
                                            disabled={isAddUpdateButtonDisabled}
                                        >
                                            Update
                                        </Button>
                                    )
                                }
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
                                    unitOptions.map((unitItem, index) => {
                                        return (
                                            <tr key={`ptIndex-${index}`}>
                                                {/*<td>{index + 1}</td>*/}
                                                <td style={{width: "100%"}}>{unitItem.value}</td>
                                                <td className="text-right d-flex flex-row justify-content-end">
                                                    {/*{unitItem.id}*/}
                                                    {/*<div
                                                        style={{maxWidth: 50}}
                                                        title="Edit Unit"
                                                    >
                                                        <img style={{width: 18, cursor: "pointer"}}
                                                             alt="Edit Unit"
                                                             data-id={unitItem.id}
                                                             src="https://img.icons8.com/metro/64/000000/edit.png"
                                                             onClick={this.onEditUnitClick}
                                                        />
                                                    </div>*/}
                                                    <div
                                                        style={{maxWidth: 50}}
                                                        title="Delete Unit"
                                                        className="ml-2"
                                                    >
                                                        <img style={{width: 18, cursor: "pointer"}}
                                                             alt="Delete Unit"
                                                             data-id={unitItem.id}
                                                             src={require('../../Images/delete.png')}
                                                             onClick={this.onDeleteUnitClick}
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
                    <Modal.Footer className="d-flex justify-content-start">
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

export default CustomUnitsModal;
