import {Button, Modal, Form, Row, Col,} from "react-bootstrap";
import React from "react";
import {getItemFromLocalStorage} from "../common/helper";
import {saveCharterFormData} from "../../api";

let flag = false;
let fuelErrors = "";
let speedErrors = "";
let speedData = "";
let fuelData = "";
let responseMsg = "";
let responseFlag = false;

function setFlag(data){
    flag = data;
}

function setFuelErrors(data){
    fuelErrors = data;
}

function setSpeedErrors(data){
    speedErrors = data;
}

function setSpeedData(data){
    speedData = data;
}

function setFuelData(data){
    fuelData = data;
}

function setResponseMsg(data){
    responseMsg = data;
}

function setResponseFlag(data){
    responseFlag = data;
}

export function showCharterPopup(flagValue,sf){
    const specialCharsRegex = RegExp(/^[a-zA-Z0-9. ]*$/);

    setFlag(flagValue);
    function onCharterFormValueChange (e) {
        debugger
        const {name, value} = e.target;
        switch (name) {
            case "fuel":
                if(value.length !== 0) {
                    if (!specialCharsRegex.test(value)) {
                        setFuelErrors("Special characters are not allowed");
                    }
                    else{
                        setFuelErrors("");
                        setFuelData(value);
                    }
                }else{
                    setFuelErrors("This Field can't be Empty");
                }
                break;

            case "speed":
                if(value.length !== 0) {
                    if (!specialCharsRegex.test(value)) {
                        setSpeedErrors("Special characters are not allowed");
                    }
                    else{
                        setSpeedErrors("");
                        setSpeedData(value);
                    }
                }else{
                    setSpeedErrors("This Field can't be Empty");
                }
                break;

            default:
                break;
        }
    }

    function handleClose() {
        sf(false);
    }

    function sendDataFunctionCall(){
        debugger
        if(speedErrors === "" && fuelErrors === "" && speedData !== "" && fuelData !== ""){
            const payload = {
                speedData: speedData,
                fuelData: fuelData,
                vesselId: getItemFromLocalStorage("ssAppVesselId")
            }
            saveCharterFormData(onSaveCharterFormDataSuccess, onSaveCharterFormDataFailure, payload);
        }
    }

    function onSaveCharterFormDataSuccess(res){
        if(res.data){
            setResponseMsg(res.data);
            setResponseFlag(true);
        }
        handleClose()
    }

    function onSaveCharterFormDataFailure(){}
    return (
        <Modal
        size="md"
        show={flag}
        onHide={() => handleClose(false)}
        backdrop="static"
        centered
    >

        <Modal.Header closeButton>
            <h5>{ "Charter Party" }</h5>
        </Modal.Header>
        <Modal.Body>
            <div className="config-form-block sm-w-800">
                <div>
                    <Form id="charterPartyForm">
                        <Row>
                            <Form.Group size="sm" as={Col}>
                                <Form.Label>Charter Party Consumption</Form.Label>
                                <Form.Control
                                    placeholder="Charter Party Consumption"
                                    name="fuel"
                                    autoComplete="off"
                                    onChange={ (event) => onCharterFormValueChange(event)}
                                />
                                <Form.Text className='text-left errorMessage'>
                                    {fuelErrors}
                                </Form.Text>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group size="sm" as={Col}>
                                <Form.Label>Charter Party Speed</Form.Label>
                                <Form.Control
                                    placeholder="Charter Party Speed"
                                    name="speed"
                                    autoComplete="off"
                                    onChange={(event) => onCharterFormValueChange(event)}

                                />
                                <Form.Text className='text-left errorMessage'>
                                    {speedErrors}
                                </Form.Text>
                            </Form.Group>
                        </Row>
                    </Form>
                </div>
            </div>
            <div className="sm-w-800" style={{textAlign: 'center'}}>
                <Button
                    size="sm"
                    className="parameter-add-button"
                    variant="outline-secondary"
                    onClick={() => sendDataFunctionCall()}
                >
                    Save
                </Button>
                <Button
                    size="sm"
                    className="parameter-add-button"
                    variant="outline-secondary"
                    onClick={() => handleClose()}
                >
                    Close
                </Button>
            </div>
        </Modal.Body>
    </Modal>
    )
}




