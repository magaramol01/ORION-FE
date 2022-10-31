import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {
    createParameter,
    updateParameter,
    getAllRTDASMappingAndUnits
} from "../../../../api";
import SmartShipLoader from "../SmartShipLoader";
import NavigationBar from "../NavigationBar";
import CustomUnitsModal from "../../custom/CustomUnitsModal";
import CustomMachinesModal from "../../custom/CustomMachine";
import {defaultParameterForm, enumeratedValue, rangeText} from "../../Constants";
import SMSidebar from "../../../../SMSidebar";
import addIcon from '../../../Images/downloadedImages/add.png';
import saveIcon from '../../../Images/downloadedImages/save.png';
import deleteIcon from '../../../Images/downloadedImages/delete-forever--v1.png';
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import {getValidatedValue} from "../validationHelper";

const RangeField = function ({
                                 rangeKey,
                                 rangeObject,
                                 onParameterFormValueChange
                             }) {
    /*debugger*/
    return (
        <Form.Group as={Col}>
            <Form.Group controlId="formBasicCheckbox" style={{marginBottom: 0}}>
                <Form.Check
                    type="checkbox"
                    id={`${rangeKey}-checkbox`}
                    label={`${rangeText[rangeKey]} Range`}
                    // label="Specified Range"
                    data-key={rangeKey}
                    checked={rangeObject.isChecked}
                    // onChange={onParameterFormValueChange}
                    onChange={onParameterFormValueChange}
                />
            </Form.Group>
            {
                rangeObject.isChecked && (
                    <div>
                        <div key={`inline-radio`} style={{whiteSpace: "nowrap"}}>
                            <Form.Check
                                name={`${rangeKey}-rangeRadio`} inline
                                label="Range"
                                type="radio"
                                id={`${rangeKey}-inline-radio-1`}
                                data-key={rangeKey}
                                data-radioname="range"
                                checked={rangeObject.selectedRadio === 'range'}
                                onChange={onParameterFormValueChange}
                            />
                            <Form.Check
                                name={`${rangeKey}-rangeRadio`} inline
                                label="Single Value"
                                type="radio"
                                id={`${rangeKey}-inline-radio-2`}
                                data-key={rangeKey}
                                data-radioname="singleValue"
                                checked={rangeObject.selectedRadio === 'singleValue'}
                                onChange={onParameterFormValueChange}
                            />
                            <Form.Check
                                name={`${rangeKey}-rangeRadio`} inline
                                label="Calculated"
                                type="radio"
                                id={`${rangeKey}-inline-radio-3`}
                                data-key={rangeKey}
                                data-radioname="calculated"
                                checked={rangeObject.selectedRadio === 'calculated'}
                                onChange={onParameterFormValueChange}
                            />
                        </div>
                        {
                            (
                                (
                                    rangeObject.selectedRadio === 'range' && (
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row"
                                        }}>
                                            <Form.Control
                                                placeholder="From"
                                                data-key={rangeKey}
                                                data-validation="float"
                                                data-inputname="from"
                                                value={rangeObject["from"]}
                                                onChange={onParameterFormValueChange}
                                                autoComplete="off"
                                            />
                                            {/*<Form.Control
                                    as="select"
                                    value={rangeObject["type"]}
                                    data-key={`${rangeKey}-dropdown`}
                                    // data-dropdownName="operator"
                                    onChange={onParameterFormValueChange}
                                    style={{
                                        marginLeft: 20,
                                        marginRight: 20,
                                        width: 65
                                    }}
                                >
                                    {
                                        comparisonOptions.map((opt) => {
                                            return (
                                                <option>{opt.label}</option>
                                            )
                                        })
                                    }
                                </Form.Control>*/}
                                            <Form.Control
                                                placeholder="To"
                                                data-key={rangeKey}
                                                data-validation="float"
                                                data-inputname="to"
                                                value={rangeObject["to"]}
                                                onChange={onParameterFormValueChange}
                                                autoComplete="off"
                                                style={{marginLeft: 10}}
                                            />
                                        </div>
                                    )
                                ) ||
                                (
                                    rangeObject.selectedRadio === 'singleValue' && (
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row"
                                        }}>
                                            <Form.Control
                                                placeholder="Value"
                                                data-key={rangeKey}
                                                data-validation="float"
                                                data-inputname="singleValue"
                                                value={rangeObject["singleValue"]}
                                                onChange={onParameterFormValueChange}
                                                autoComplete="off"
                                            />
                                            {/*<Form.Control
                                                as="select"
                                                value={rangeObject["type"]}
                                                data-key="type"
                                                onChange={onParameterFormValueChange}
                                                style={{
                                                    marginLeft: 20,
                                                    width: 65
                                                }}
                                            >
                                                {
                                                    comparisonOptions.map((opt) => {
                                                        return (
                                                            <option>{opt.label}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>*/}
                                        </div>
                                    )
                                ) ||
                                (
                                    rangeObject.selectedRadio === 'calculated' && (
                                        <Form.Control
                                            placeholder="Expression"
                                            data-key={rangeKey}
                                            data-inputname="calculatedExpression"
                                            value={rangeObject["calculatedExpression"]}
                                            onChange={onParameterFormValueChange}
                                            autoComplete="off"
                                        />
                                    )
                                )
                            )
                        }
                    </div>
                )
            }
        </Form.Group>
    );
};

class NewParametersFormUI extends Component {

    constructor(props) {
        super(props);
        let parameterForm = JSON.parse(JSON.stringify(defaultParameterForm));
        let parameterUId = -1;
        if (props.location.data) {
            parameterForm = props.location.data.parameterForm;
            if (parameterForm.hasOwnProperty("uId")) {
                parameterUId = parameterForm.uId;
            }
        }
        this.state = {
            loading: true,
            parameterUId,
            parameterForm,
            addedElements: [],
            isEdit: false,
            isParameterFormAddDisable: true,
            isShowUpdateParameterButton: false,
            rtdasMappingOptions: [],
            unitOptions: [],
            machineOptions: [],
            allScaling: []
        }
    }

    componentDidMount() {
        // getAllParametersAndRTDASMapping(this.getAllSuccess, this.getAllFailure);
        getAllRTDASMappingAndUnits(this.getAllSuccess, this.getAllFailure);
    }

    changeStateOfUnit = (changedUnitValue) => {
        debugger
        let parameterForm = this.state.parameterForm;
        parameterForm["variableUnit"] = changedUnitValue;
        this.setState({
            parameterForm
        });
        debugger
    }

    changeStateOfMachine = (changeMachineValue) => {
        debugger
        let parameterForm = this.state.parameterForm;
        parameterForm["machine"] = changeMachineValue;
        this.setState({
            parameterForm
        });
        debugger
    }
    // getAllSuccess = (parameterResponse, RTDASMappingResponse, unitsResponse) => {
    getAllSuccess = (parameterResponse) => {
        debugger
        const {
            machines,
            units,
            rtds: RTDASMappingResponse,
            scalings
        } = parameterResponse.data;
        // console.log("RTDASMappingResponseRTDASMappingResponseRTDASMappingResponseRTDASMappingResponse");
        // console.log(RTDASMappingResponse);
        // const unitOptions = unitsResponse && unitsResponse.hasOwnProperty("data") && unitsResponse.data.units;
        let unitOptions = Object.entries(units).map(([key, obj]) => Object.assign({
            id: key,
            ...obj
        }));
        let machineOptions = Object.entries(machines).map(([key, obj]) => Object.assign({
            id: key,
            ...obj
        }));
        let rtdasMappingOptions = RTDASMappingResponse.map((rtdasMappingOption, index) => {
            return {
                value: `${index}`,
                label: rtdasMappingOption
            }
        });
        let allScalingData = Object.entries(scalings).map(([key, obj]) => Object.assign({
            ...obj
        }));
        let parameterForm = this.state.parameterForm;
        if(machineOptions.length!=0 && !parameterForm.machine){
            parameterForm["machine"] = machineOptions[0].value;
        }
        if(unitOptions.length!=0 && !parameterForm.variableUnit){
            parameterForm["variableUnit"] = unitOptions[0].value;
        }
        if(rtdasMappingOptions.length!=0 && !parameterForm.rtdasMapping){
            parameterForm["rtdasMapping"] = rtdasMappingOptions[0].label;
        }
        if(allScalingData.length!=0 && !parameterForm.scale){
            parameterForm["isScaleChecked"]=true;
            parameterForm["scale"] = Object.values(allScalingData[0])[0];
        }
        let isParameterFormAddDisable = this.getIsParameterFormAddDisable(this.state.parameterForm);

        this.setState({
            loading: false,
            isParameterFormAddDisable,
            rtdasMappingOptions,
            unitOptions,
            machineOptions,
            allScaling : allScalingData
        });
    };
    getAllFailure = (error) => {
        //console.log(error);
        // debugger;
        this.setState({
            loading: false
        });
    };

    /**
     * create object for server
     * **/
    getParameterObjectForServer = () => {
        const {
            variableName,
            description,
            informationSource,
            variableUnit,
            machine,
            type,
            precision,
            rtdasMapping,
            specifiedRange,
            normalRange,
            enumeratedValue,
            scale
        } = this.state.parameterForm;
        // debugger
        const parameterObject = {
            "name": variableName,
            "description": description,
            "informationSource": informationSource,
            "unit": variableUnit,
            "machine": machine,
            "signalType": type,
            "precision": precision,
            "isRealValue": "true",//todo
            "isFixedValue": "false",//todo
            "isCalculatedValue": "false",//todo
            "rtdasMapping": rtdasMapping,
            "specifiedRange": {
                "isSpecifiedRange": specifiedRange.isChecked,
                "isRange": specifiedRange.selectedRadio === "range",
                "range": {
                    "from": specifiedRange.from,
                    "to": specifiedRange.to
                },
                "isSingleValue": specifiedRange.selectedRadio === "singleValue",
                "singleValue": {
                    "value": specifiedRange.singleValue
                },
                "isCalculatedExpression": specifiedRange.selectedRadio === "calculated",
                "calculatedExpression": {
                    "expression": specifiedRange.calculatedExpression,
                    "expressionDetails": ""
                }
            },
            "normalRange": {
                "isNormalRange": normalRange.isChecked,
                "isRange": normalRange.selectedRadio === "range",
                "range": {
                    "from": normalRange.from,
                    "to": normalRange.to
                },
                "isSingleValue": normalRange.selectedRadio === "singleValue",
                "singleValue": {
                    "value": normalRange.singleValue
                },
                "isCalculatedExpression": normalRange.selectedRadio === "calculated",
                "calculatedExpression": {
                    "expression": normalRange.calculatedExpression,
                    "expressionDetails": ""
                }
            },
            "enumeratedValue": {
                "isEnumeratedValue": enumeratedValue.isChecked,
                "values": enumeratedValue.list.slice(1)
            },
            "scale":scale
        };
        return parameterObject;
    };


    /**
     * Create
     * **/
    onAddParameterBtnClick = () => {
        // debugger
        this.setState({
            loading: true
        });
        const payload = this.getParameterObjectForServer();
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload["vesselName"] = "";
        }
        createParameter(this.onCreateParameterSuccess, this.onCreateParameterFailure, payload)
    };
    onCreateParameterSuccess = (res) => {
        // debugger
        // console.log(res);
        if (res.status === 200 ) {
            /*let addedElements = [this.state.parameterForm, ...this.state.addedElements];
            this.setState({
                loading: false,
                isEdit: !this.state.isEdit,
                parameterForm: {...defaultParameterForm},
                isParameterFormAddDisable: true,
                addedElements
            })*/
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "parameter",
                    uId: res.data
                }
            })
        }
    };
    onCreateParameterFailure = (err) => {
        // debugger
        this.setState({
            loading: false
        });
        //console.log(err)
    };

    /**
     * update
     * **/
    onUpdateParameterClick = () => {
        // debugger
        const parameterUId = this.state.parameterUId;
        const parameterObject = this.getParameterObjectForServer();
        const payload = {
            [parameterUId]: {...parameterObject}
        };
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload[parameterUId]["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload[parameterUId]["vesselName"] = "";
        }
        this.setState({
            loading: true
        });

        updateParameter(this.onUpdateParamterSuccess, this.onUpdateParameterFailure, payload)
    };
    onUpdateParamterSuccess = (res) => {
        // debugger
        // console.log(res)
        // debugger
        if (res.status === 200 ) {
            // debugger
            /*let addedElements = [...this.state.addedElements];
            const parameterForm = {...this.state.parameterForm};
            const parameterUId = this.state.parameterUId;
            for (let eIndex = 0; eIndex < addedElements.length; eIndex++) {
                if (addedElements[eIndex].uId === parameterUId) {
                    addedElements[eIndex] = parameterForm;
                    break;
                }
            }
            this.setState({
                // allParams,
                loading: false,
                isEdit: false,
                parameterForm: {...defaultParameterForm},
                isParameterFormAddDisable: true,
                parameterUId: -1,
                addedElements
            })*/

            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "parameter",
                    uId: this.state.parameterUId
                }
            })
        }
    };
    onUpdateParameterFailure = (err) => {
        // debugger
        this.setState({
            loading: false,
        });
       // console.log(err)
    };

    /**
     * parameters functions
     * */
    getIsParameterFormAddDisable = (parameterForm) => {
        let isParameterFormAddDisable = false;
        for (let key in parameterForm) {
            // debugger
            if (!isParameterFormAddDisable && !(key === "scale" || key === "precision")) {
                if (key === "isScaleChecked") {
                    if (parameterForm[key]) {
                        isParameterFormAddDisable = parameterForm.scale === "";
                    }
                } else if ((key === "specifiedRange" || key === "normalRange")) {
                    // debugger
                    if (parameterForm[key].isChecked) {
                        const rangeObject = parameterForm[key];
                        if (parameterForm[key].selectedRadio === "range") {
                            isParameterFormAddDisable = (rangeObject.from === "" || rangeObject.to === "");
                        } else if (parameterForm[key].selectedRadio === "singleValue") {
                            isParameterFormAddDisable = rangeObject.singleValue === "";
                        } else if (parameterForm[key].selectedRadio === "calculated") {
                            isParameterFormAddDisable = rangeObject.calculatedExpression === "";
                        }
                    }
                } else if (key === "enumeratedValue") {
                    if (parameterForm[key].isChecked) {
                        isParameterFormAddDisable = parameterForm[key].list.length === 1;
                    }
                } else if (parameterForm[key] === "") {
                    // debugger
                    isParameterFormAddDisable = true
                }
            }
        }
        return isParameterFormAddDisable
    }
    onParameterFormValueChange = (event) => {
         debugger
        const dataset = event.target.dataset;
        const key = dataset.key;
        let parameterForm = {...this.state.parameterForm};
        if(key === "rtdasMapping") {
            parameterForm[key] = event.target.value;
            for(let i=0;i<this.state.allScaling.length;i++){
                if(!!this.state.allScaling[i][event.target.value]){
                    parameterForm["isScaleChecked"]=true;
                    parameterForm['scale'] = this.state.allScaling[i][event.target.value];
                    break
                }
            }
        }else if (key === "isScaleChecked") {
            parameterForm.isScaleChecked = !parameterForm.isScaleChecked;
        } else if (key === "dataSource") {
            parameterForm[key] = dataset.radioname;
        } else if (key.indexOf("specifiedRange") !== -1 || key.indexOf("normalRange") !== -1) {
            // debugger
            // console.log(defaultParameterForm);
            if ("checkbox" === event.target.type) {
                parameterForm[key].isChecked = !parameterForm[key].isChecked
                // console.log(defaultParameterForm);
            } else if ("radio" === event.target.type) {
                parameterForm[key].selectedRadio = dataset.radioname;
            } else if (dataset.hasOwnProperty("inputname")) {
                const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
                if(validatedValue ==="" || validatedValue) {
                    parameterForm[key][dataset.inputname] = validatedValue;
                }
            }
            // console.log(defaultParameterForm);
        } else if ("enumeratedValue" === key) {
            // debugger;
            if ("checkbox" === event.target.type) {
                if (parameterForm[key].isChecked) {
                    parameterForm[key] = {...enumeratedValue}
                } else {
                    parameterForm[key].isChecked = !parameterForm[key].isChecked;
                }
            } else if (dataset.hasOwnProperty("inputname")) {
                const currentValue = parameterForm[key].currentValue.trim();
                if (event.keyCode == 13) {
                    const list = [...parameterForm[key].list, currentValue];
                    parameterForm[key].list = list;
                    parameterForm[key].currentValue = "";
                    parameterForm[key].enumeratedValueId = -1;
                    parameterForm[key].selectedListValue = "";
                } else {
                    const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
                    if(validatedValue ==="" || validatedValue) {
                        parameterForm[key][dataset.inputname] = validatedValue;
                    }
                }
            } else if (dataset.hasOwnProperty("dropdownname")) {
                const value = event.target.value;
                parameterForm[key][dataset.dropdownname] = value;
                if (value === "-") {
                    parameterForm[key].currentValue = "";
                    parameterForm[key].enumeratedValueId = -1;
                    parameterForm[key].selectedListValue = "-";
                } else {
                    parameterForm[key].enumeratedValueId = parameterForm[key].list.indexOf(value);
                    parameterForm[key].currentValue = value;
                }
            } else if (dataset.hasOwnProperty("buttonname")) {
                // debugger
                if ("add" === dataset.buttonname) {
                    const currentValue = parameterForm[key].currentValue.trim();
                    if (currentValue) {
                        const list = [...parameterForm[key].list, currentValue];
                        parameterForm[key].list = list;
                        parameterForm[key].currentValue = "";
                        parameterForm[key].enumeratedValueId = -1;
                        parameterForm[key].selectedListValue = "-";
                    }
                } else if ("update" === dataset.buttonname) {
                    const enumeratedValueId = parameterForm[key].enumeratedValueId;
                    const currentValue = parameterForm[key].currentValue;
                    let list = [...parameterForm[key].list];
                    list[enumeratedValueId] = currentValue;
                    parameterForm[key].list = list;
                    parameterForm[key].currentValue = "";
                    parameterForm[key].enumeratedValueId = -1;
                    parameterForm[key].selectedListValue = "-";
                } else if ("delete" === dataset.buttonname) {
                    // debugger
                    const enumeratedValueId = parameterForm[key].enumeratedValueId;
                    // const currentValue = parameterForm[key].currentValue;
                    let list = [...parameterForm[key].list];
                    list.splice(enumeratedValueId, 1);
                    parameterForm[key].list = list;
                    parameterForm[key].currentValue = "";
                    parameterForm[key].enumeratedValueId = -1;
                    parameterForm[key].selectedListValue = "-";
                }
            }
        } else {
            const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
            if(validatedValue ==="" || validatedValue) {
                parameterForm[key] = validatedValue
            }
        }
        let isParameterFormAddDisable = this.getIsParameterFormAddDisable(parameterForm);
        this.setState({
            parameterForm,
            isParameterFormAddDisable
        })
    };
    updateUnitOptions = (newUnitOptions) => {
        this.setState({
            unitOptions: newUnitOptions
        });
    };

    updateMachineOptions = (newMachineOptions) => {
        this.setState({
            machineOptions: newMachineOptions
        });
    };

    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        let {
            loading,
            isEdit,
            parameterForm,
            isParameterFormAddDisable,
            parameterUId,
            // allParams,
            rtdasMappingOptions,
            unitOptions,
            machineOptions
        } = this.state;
        let allParams = [...this.state.addedElements];

        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Parameter Configuration"}/>
                    <div className="d-flex justify-content-center pt-5 overflow-auto cbm-wrapper">
                        <div className="config-form-block sm-w-700" style={{margin: "0px auto"}}>
                            <div className="config-form-block-header">
                                Parameter Configuration
                            </div>
                            <div style={{width: "100%", paddingLeft: 15, paddingRight: 15, paddingTop: 15}}>
                                <Form>
                                    <Row>
                                        <Form.Group size="sm" as={Col}>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                placeholder="Name"
                                                data-key="variableName"
                                                onChange={this.onParameterFormValueChange}
                                                value={parameterForm["variableName"]}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group size="sm" as={Col}>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                placeholder="Description"
                                                data-key="description"
                                                onChange={this.onParameterFormValueChange}
                                                value={parameterForm["description"]}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Unit</Form.Label>
                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                <Form.Control
                                                    as="select"
                                                    value={parameterForm["variableUnit"]}
                                                    data-key="variableUnit"
                                                    onChange={this.onParameterFormValueChange}
                                                >
                                                    {
                                                        unitOptions.map((opt, index) => {
                                                            return (
                                                                <option key={`vuindex-${index}`}>{opt.label}</option>
                                                            )
                                                        })
                                                    }
                                                </Form.Control>
                                                <CustomUnitsModal
                                                    parameterChangeUnit={this.changeStateOfUnit}
                                                    key={unitOptions.length}
                                                    unitOptions={unitOptions}
                                                    updateUnitOptions={this.updateUnitOptions}
                                                />
                                            </div>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Precision</Form.Label>
                                            <Form.Control
                                                placeholder="Precision"
                                                data-key="precision"
                                                data-validation="float"
                                                onChange={this.onParameterFormValueChange}
                                                value={parameterForm["precision"]}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        {/*<Form.Group as={Col} >
                                                        <Form.Label>RTDAS Mapping</Form.Label>
                                                        <Form.Control
                                                            placeholder="RTDAS Mapping"
                                                            data-key="rtdasMapping"
                                                            onChange={this.onParameterFormValueChange}
                                                            value={parameterForm["rtdasMapping"]}
                                                            autoComplete="off"
                                                        />
                                                    </Form.Group>*/}
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col}>

                                            <Form.Group controlId="formBasicCheckbox" style={{marginBottom: 0}}>
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`Scale-checkbox`}
                                                    label="Scale"
                                                    // label="Specified Range"
                                                    data-key="isScaleChecked"
                                                    checked={parameterForm["isScaleChecked"]}
                                                    // onChange={this.onParameterFormValueChange}
                                                    onChange={this.onParameterFormValueChange}
                                                />
                                            </Form.Group>
                                            <Form.Control
                                                placeholder="Scale"
                                                data-key="scale"
                                                data-validation="float"
                                                onChange={this.onParameterFormValueChange}
                                                value={parameterForm["scale"]}
                                                autoComplete="off"
                                                disabled={!parameterForm.isScaleChecked}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>RTDAS Mapping</Form.Label>
                                            {/*<Select options={typeOptions} />*/}
                                            <Form.Control
                                                as="select"
                                                value={parameterForm["rtdasMapping"]}
                                                data-key="rtdasMapping"
                                                onChange={this.onParameterFormValueChange}
                                            >
                                                {
                                                    rtdasMappingOptions.map((opt, index) => {
                                                        return (
                                                            <option key={`rtdas-index-${index}`}>{opt.label}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <RangeField
                                            data-key="specifiedRange"
                                            rangeKey="specifiedRange"
                                            rangeObject={parameterForm["specifiedRange"]}
                                            onParameterFormValueChange={this.onParameterFormValueChange}
                                        />
                                        <RangeField
                                            data-key="normalRange"
                                            rangeKey="normalRange"
                                            rangeObject={parameterForm["normalRange"]}
                                            onParameterFormValueChange={this.onParameterFormValueChange}
                                        />
                                        {/*<Form.Group as={Col} >
                                                        <Form.Group controlId="formBasicCheckbox">
                                                            <Form.Check type="checkbox" label="Normal Range" />
                                                        </Form.Group>
                                                    </Form.Group>*/}
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col}>
                                            {/*{JSON.stringify(parameterForm["enumeratedValue"])}*/}
                                            <Form.Group controlId="formBasicCheckbox" style={{marginBottom: 0}}>
                                                <Form.Group controlId="formBasicCheckbox">
                                                    <Form.Group controlId="formBasicCheckbox">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id="enumerate-checkbox"
                                                            label="Enumerate"
                                                            data-key="enumeratedValue"
                                                            checked={parameterForm["enumeratedValue"].isChecked}
                                                            onChange={this.onParameterFormValueChange}
                                                        />
                                                    </Form.Group>
                                                    {
                                                        parameterForm["enumeratedValue"].isChecked && (
                                                            <Row>
                                                                <Form.Group as={Col}
                                                                            style={{
                                                                                display: "flex",
                                                                                flexDirection: "row"
                                                                            }}>
                                                                    <Form.Control
                                                                        placeholder="Value"
                                                                        data-key="enumeratedValue"
                                                                        data-inputname="currentValue"
                                                                        data-validation="integer"
                                                                        value={parameterForm["enumeratedValue"].currentValue}
                                                                        onChange={this.onParameterFormValueChange}
                                                                        autoComplete="off"
                                                                    />
                                                                    {
                                                                        parameterForm["enumeratedValue"].enumeratedValueId === -1
                                                                            ? (<div style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    padding: 10,
                                                                                    border: "1px  solid #ced4d9",
                                                                                    maxHeight: 37
                                                                                }}>
                                                                                    <img style={{
                                                                                        width: 18,
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                         alt=""
                                                                                         src={addIcon}
                                                                                         data-buttonname="add"
                                                                                         data-key="enumeratedValue"
                                                                                         onClick={this.onParameterFormValueChange}
                                                                                    />
                                                                                </div>
                                                                            )
                                                                            : (
                                                                                [
                                                                                    (<div style={{
                                                                                        display: "flex",
                                                                                        justifyContent: "center",
                                                                                        alignItems: "center",
                                                                                        padding: 10,
                                                                                        border: "1px  solid #ced4d9",
                                                                                        maxHeight: 37
                                                                                    }}>
                                                                                        <img style={{
                                                                                            width: 18,
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                             alt=""
                                                                                             src={saveIcon}
                                                                                             data-buttonname="update"
                                                                                             data-key="enumeratedValue"
                                                                                             onClick={this.onParameterFormValueChange}
                                                                                        />
                                                                                    </div>),
                                                                                    (<div style={{
                                                                                        display: "flex",
                                                                                        justifyContent: "center",
                                                                                        alignItems: "center",
                                                                                        padding: 10,
                                                                                        border: "1px  solid #ced4d9",
                                                                                        maxHeight: 37
                                                                                    }}>
                                                                                        <img style={{
                                                                                            width: 18,
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                             alt=""
                                                                                             src={deleteIcon}
                                                                                             data-buttonname="delete"
                                                                                             data-key="enumeratedValue"
                                                                                             onClick={this.onParameterFormValueChange}
                                                                                        />
                                                                                    </div>)
                                                                                ]
                                                                            )
                                                                    }
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={parameterForm["enumeratedValue"].selectedListValue}
                                                                        data-dropdownname="selectedListValue"
                                                                        data-key="enumeratedValue"
                                                                        onChange={this.onParameterFormValueChange}
                                                                        style={{marginLeft: 10}}
                                                                        disabled={parameterForm["enumeratedValue"].list.length === 1}
                                                                    >
                                                                        {
                                                                            parameterForm["enumeratedValue"].list.map((opt) => {
                                                                                return (
                                                                                    <option
                                                                                        data-l={opt}>{opt}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Form.Control>
                                                                </Form.Group>
                                                            </Row>
                                                        )
                                                    }
                                                </Form.Group>
                                            </Form.Group>
                                        </Form.Group>
                                    </Row>

                                    <Row>
                                        <Form.Group as={Col} sm={12} md={6} lg={6}>
                                            <Form.Label>Machine</Form.Label>
                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                {/*{JSON.stringify(parameterForm)}*/}
                                                <Form.Control
                                                    as="select"
                                                    value={parameterForm["machine"]}
                                                    data-key="machine"
                                                    onChange={this.onParameterFormValueChange}
                                                >
                                                    {
                                                        machineOptions.map((opt, index) => {
                                                            return (
                                                                <option key={`vuindex-${index}`}>{opt.label}</option>
                                                            )
                                                        })
                                                    }
                                                </Form.Control>
                                                <CustomMachinesModal
                                                    parameterChangeMachine={this.changeStateOfMachine}
                                                    key={machineOptions.length}
                                                    machineOptions={machineOptions}
                                                    updateMachineOptions={this.updateMachineOptions}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Row>
                                    {/*<Row>
                                                    <Form.Group as={Col} >
                                                        <Form.Label>Data Source</Form.Label>
                                                        <div key={`inline-radio`} style={{whiteSpace: "nowrap"}}>
                                                            <Form.Check
                                                                name="dataSourceRadio" inline
                                                                label="Device"
                                                                type="radio"
                                                                id={`inline-radio-1`}
                                                                data-key="dataSource"
                                                                data-radioname="device"
                                                                checked={parameterForm.dataSource === 'device'}
                                                                onChange={this.onParameterFormValueChange}
                                                            />
                                                            <Form.Check
                                                                name="dataSourceRadio" inline
                                                                label="Constant"
                                                                type="radio"
                                                                id={`inline-radio-2`}
                                                                data-key="dataSource"
                                                                data-radioname="constant"
                                                                checked={parameterForm.dataSource === 'constant'}
                                                                onChange={this.onParameterFormValueChange}
                                                            />
                                                            <Form.Check
                                                                name="dataSourceRadio" inline
                                                                label="Calculated"
                                                                type="radio"
                                                                id={`inline-radio-3`}
                                                                data-key="dataSource"
                                                                data-radioname="calculated"
                                                                checked={parameterForm.dataSource === 'calculated'}
                                                                onChange={this.onParameterFormValueChange}
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Row>*/}
                                    <div>
                                        <Form.Group className="d-flex flex-row justify-content-between mt-3">
                                            <Button
                                                size="sm"
                                                className="parameter-header-button ml-0"
                                                onClick={this.resetToDefaultView}
                                                variant="outline-secondary">
                                                Cancel
                                            </Button>
                                            {
                                                (
                                                    (parameterUId === -1) && (
                                                        <Button
                                                            size="sm"
                                                            className="parameter-add-button ml-0"
                                                            onClick={this.onAddParameterBtnClick}
                                                            variant="outline-secondary"
                                                            disabled={isParameterFormAddDisable}
                                                        >
                                                            Add
                                                        </Button>
                                                    )
                                                )
                                                || (
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button ml-0"
                                                        onClick={this.onUpdateParameterClick}
                                                        variant="outline-secondary"
                                                        disabled={isParameterFormAddDisable}
                                                    >
                                                        Update
                                                    </Button>
                                                )
                                            }
                                        </Form.Group>

                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </SMSidebar>
        )
    }
}

NewParametersFormUI.propTypes = {
    isEdit: PropTypes.any,
    parameterForm: PropTypes.any,
    isParameterFormAddDisable: PropTypes.any,
    parameterUId: PropTypes.any,
    allParams: PropTypes.any,
    toggleEditParameters: PropTypes.any,
    showAddParameterForm: PropTypes.any,
    onParameterFormValueChange: PropTypes.any,
    onAddParameterBtnClick: PropTypes.any,
    onEditParameterClick: PropTypes.any,
    onUpdateParameterClick: PropTypes.any,
    onDeleteParameterClick: PropTypes.any
}

export default NewParametersFormUI;


