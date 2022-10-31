import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {
    createConstantParameter,
    updateParameter,
    updateOnlyCurrentAndRemarkConstantParameter,
    getAllConstantParameters, getParameterSourceJsonAndUnits
} from "../../../../api";
import SmartShipLoader from "../SmartShipLoader";
import CustomUnitsModal from "../../custom/CustomUnitsModal";
import Select from "react-select";
import NavigationBar from "../NavigationBar";
import {
    defaultConstantParameterForm,
    enumeratedValue,
    machineOptions,
    normalRange,
    specifiedRange,
    CurrentValueObject
} from "../../Constants";
import CustomMachinesModal from "../../custom/CustomMachine";
import SMSidebar from "../../../../SMSidebar";
import addIcon from '../../../Images/downloadedImages/add.png';
import saveIcon from '../../../Images/downloadedImages/save.png';
import {getValidatedValue} from "../validationHelper";
const rangeText = {
    normalRange: "Normal",
    specifiedRange: "Specified",
};

const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
        // primary25: "unset",
        // primary: "unset"

        // All possible overrides
        // primary: '#2684FF',
        // primary75: '#4C9AFF',
        // primary50: '#B2D4FF',
        // primary25: '#DEEBFF',

        // danger: '#DE350B',
        // dangerLight: '#FFBDAD',

        // neutral0: 'hsl(0, 0%, 100%)',
        // neutral5: 'hsl(0, 0%, 95%)',
        // neutral10: 'hsl(0, 0%, 90%)',
        // neutral20: 'hsl(0, 0%, 80%)',
        // neutral30: 'hsl(0, 0%, 70%)',
        // neutral40: 'hsl(0, 0%, 60%)',
        // neutral50: 'hsl(0, 0%, 50%)',
        // neutral60: 'hsl(0, 0%, 40%)',
        // neutral70: 'hsl(0, 0%, 30%)',
        // neutral80: 'hsl(0, 0%, 20%)',
        // neutral90: 'hsl(0, 0%, 10%)',
    },
    // Other options you can use
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
    // menuGutter: baseUnit * 2
});

const RangeField = function ({
                                 rangeKey,
                                 rangeObject,
                                 onParameterFormValueChange,
                                 disabled
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
                    disabled={disabled}
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
                                disabled={disabled}
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
                                disabled={disabled}
                            />
                            {/*<Form.Check
                                name={`${rangeKey}-rangeRadio`} inline
                                label="Calculated"
                                type="radio"
                                id={`${rangeKey}-inline-radio-3`}
                                data-key={rangeKey}
                                data-radioname="calculated"
                                checked={rangeObject.selectedRadio === 'calculated'}
                                onChange={onParameterFormValueChange}
                                disabled={disabled}
                            />*/}
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
                                                data-inputname="from"
                                                data-validation="float"
                                                value={rangeObject["from"]}
                                                onChange={onParameterFormValueChange}
                                                autoComplete="off"
                                                disabled={disabled}
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
                                                data-inputname="to"
                                                data-validation="float"
                                                value={rangeObject["to"]}
                                                onChange={onParameterFormValueChange}
                                                autoComplete="off"
                                                style={{marginLeft: 10}}/*todo*/
                                                disabled={disabled}
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
                                                data-inputname="singleValue"
                                                data-validation="float"
                                                value={rangeObject["singleValue"]}
                                                onChange={onParameterFormValueChange}
                                                autoComplete="off"
                                                disabled={disabled}
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
                                ) /*||
                                (
                                    rangeObject.selectedRadio === 'calculated' && (
                                        <Form.Control
                                            placeholder="Expression"
                                            data-key={rangeKey}
                                            data-inputname="calculatedExpression"
                                            value={rangeObject["calculatedExpression"]}
                                            onChange={onParameterFormValueChange}
                                            autoComplete="off"
                                            disabled={disabled}
                                        />
                                    )
                                )*/
                            )
                        }
                    </div>
                )
            }
        </Form.Group>
    );
};

class NewConstantParameterFormUI extends Component {

    constructor(props) {
        debugger
        super(props);
        let parameterForm = JSON.parse(JSON.stringify(defaultConstantParameterForm));
        let parameterUId = -1;
        if (props.location.data) {
            parameterForm = props.location.data.parameterForm;
            parameterUId = parameterForm.hasOwnProperty("uId") && parameterForm.uId;
        }
        this.state = {
            loading: false,
            parameterUId,
            parameterForm,
            uIdCounter: 2,
            isParameterFormAddDisable: true,
            isShowUpdateParameterButton: false,
            unitOptions: [],
            durationOptions: [{label: "min", value: "min"}, {value: "hrs", label: "hrs"}, {
                label: "days",
                value: "days"
            }],
            CurrentValueObject: {...CurrentValueObject},
            parameterSourceOptions: []
        }
    }

    componentDidMount() {
        getParameterSourceJsonAndUnits(this.getAllConstantSuccess, this.getAllConstantFailure);
        // getAllConstantParameters(this.getAllConstantSuccess, this.getAllConstantFailure);
    }

    // getAllConstantSuccess = (unitsResponse, parameterSourceJsonResponse) => {
    getAllConstantSuccess = (constantResponse) => {
        debugger

        const {
            parametersSource,
            units,
        } = constantResponse.data;
        let unitOptions = Object.entries(units).map(([key, obj]) => Object.assign({
            id: key,
            ...obj
        }));
        let parameterSourceOptions = parametersSource.map((rtdasMappingOption, index) => {
            return {
                value: `${index}`,
                label: rtdasMappingOption
            }
        });
        const isParameterFormAddDisable = this.getIsParameterFormAddDisable(this.state.parameterForm);
        this.setState({
            loading: false,
            unitOptions,
            parameterSourceOptions,
            isParameterFormAddDisable
        });
    };
    getAllConstantFailure = (error) => {
        //console.log(error);
        // debugger;
        this.setState({
            loading: false
        });
    };

    /**
     * create object for server
     * **/
    getConstantObjectForServer = () => {
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
            parameterSource,
            currentValueOfParameter,
            remark,
            durationUnit,
            duration,
            ID
        } = this.state.parameterForm;
        // debugger
        const parameterObject = {
            "ID": ID,
            "name": variableName,
            "description": description,
            "informationSource": informationSource,
            "parameterSource": parameterSource,
            "remark": remark,
            "currentValueOfParameter": currentValueOfParameter,
            "durationUnit": durationUnit,
            "duration": duration,
            "unit": variableUnit,
            "machine": machine,
            "signalType": type,
            "precision": precision.label,//todo (instead of label it should be Id)
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
            }
        };
        return parameterObject;
    };


    /**
     * Create
     * **/
    addParameter = () => {
        // debugger
        this.setState({
            loading: true
        });
        const payload = this.getConstantObjectForServer();
        createConstantParameter(this.onCreateParameterSuccess, this.onCreateParameterFailure, payload)
    };
    onCreateParameterSuccess = (res) => {
        // debugger
        // console.log(res);
        if (res.status === 200 ) {
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "constant_parameter",
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
    onUpdateParamterSuccess = (res) => {
        // debugger
        // console.log(res)
        // debugger
        if (res.status === 200 ) {
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "constant_parameter",
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
        //console.log(err)
    };

    updateCurrentValueAndRemark = () => {
        debugger
        this.setState({
            loading: true
        });
        const parameterUId = this.state.parameterUId;
        const {currentValueOfParameter, remark} = this.state.parameterForm;
        const payload = {
            "ID": parameterUId,
            "currentValueOfParameter": currentValueOfParameter,
            "remark": remark
        };
        updateOnlyCurrentAndRemarkConstantParameter(this.onUpdateCurrentValueAndRemarkSuccess, this.onUpdateCurrentValueAndRemarkFailure, payload)
    };
    onUpdateCurrentValueAndRemarkSuccess = (res) => {
        debugger
        if (res.status === 200 ) {
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "constant_parameter",
                    uId: this.state.parameterUId
                }
            })
        }
    };
    onUpdateCurrentValueAndRemarkFailure = (err) => {
        this.setState({
            loading: false,
        });
        //console.log(err)
    };

    /**
     * parameters functions
     * */
    getIsParameterFormAddDisable = (parameterForm) => {
        let isParameterFormAddDisable = false;
        for (let key in parameterForm) {
            if (!isParameterFormAddDisable) {
                if ((key === "specifiedRange" || key === "normalRange")) {
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
                } else if (key === "precision") {
                    isParameterFormAddDisable = parameterForm[key] === null;
                } else if (parameterForm[key] === "") {
                    isParameterFormAddDisable = true
                }
            }
        }
        return isParameterFormAddDisable;
    };
    onParameterFormValueChange = (event) => {
        // debugger
        const dataset = event.target.dataset;
        const key = dataset.key;
        let parameterForm = {...this.state.parameterForm};
        if (key === "isScaleChecked") {
            parameterForm.isScaleChecked = !parameterForm.isScaleChecked;
        } else if (key === "dataSource") {
            parameterForm[key] = dataset.radioname;
        } else if (key.indexOf("specifiedRange") !== -1 || key.indexOf("normalRange") !== -1) {
            // debugger
            // console.log(defaultConstantParameterForm);
            if ("checkbox" === event.target.type) {
                parameterForm[key].isChecked = !parameterForm[key].isChecked
                // console.log(defaultConstantParameterForm);
            } else if ("radio" === event.target.type) {
                parameterForm[key].selectedRadio = dataset.radioname;
            } else if (dataset.hasOwnProperty("inputname")) {
                const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
                if(validatedValue ==="" || validatedValue) {
                    parameterForm[key][dataset.inputname] = validatedValue;
                }
            }
            // console.log(defaultConstantParameterForm);
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
                parameterForm[key] = validatedValue;
            }
        }
        const isParameterFormAddDisable = this.getIsParameterFormAddDisable(parameterForm);
        this.setState({
            parameterForm,
            isParameterFormAddDisable
        })
    };
    onParameterSourceDropdownValueChange = (selectedOption) => {
        let parameterForm = {...this.state.parameterForm};
        parameterForm.precision = selectedOption;
        const isParameterFormAddDisable = this.getIsParameterFormAddDisable(parameterForm);
        this.setState({
            parameterForm,
            isParameterFormAddDisable
        })
    };
    onAddParameterBtnClick = () => {
        this.addParameter();
    };
    onUpdateParameterClick = () => {
        debugger
        this.updateCurrentValueAndRemark();
    };

    updateUnitOptions = (newUnitOptions) => {
        this.setState({
            unitOptions: newUnitOptions
        });
    };


    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        let {
            loading,
            parameterForm,
            isParameterFormAddDisable,
            parameterUId,
            unitOptions,
            durationOptions,
            parameterSourceOptions
        } = this.state;
        debugger
        const isUpdateConstantParameter = parameterUId !== -1;
        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    {/*{JSON.stringify(isUpdateConstantParameter)}*/}
                    {/*{JSON.stringify(parameterForm)}*/}
                    <NavigationBar
                        title={"Constant"}/>
                    <div className="d-flex justify-content-center pt-5 overflow-auto cbm-wrapper">
                        <div className="config-form-block sm-w-700" style={{margin: "0px auto"}}>
                            <div className="config-form-block-header">
                                Constant
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
                                                disabled={isUpdateConstantParameter}
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
                                                disabled={isUpdateConstantParameter}
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
                                                    disabled={isUpdateConstantParameter}
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
                                                    key={unitOptions.length}
                                                    unitOptions={unitOptions}
                                                    updateUnitOptions={this.updateUnitOptions}
                                                    disabled={isUpdateConstantParameter}
                                                />
                                            </div>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Parameter Source</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={parameterForm["rtdasMapping"]}
                                                data-key="rtdasMapping"
                                                onChange={this.onParameterFormValueChange}
                                            >
                                                {
                                                    parameterSourceOptions.map((opt, index) => {
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
                                            disabled={isUpdateConstantParameter}
                                        />
                                        <RangeField
                                            data-key="normalRange"
                                            rangeKey="normalRange"
                                            rangeObject={parameterForm["normalRange"]}
                                            onParameterFormValueChange={this.onParameterFormValueChange}
                                            disabled={isUpdateConstantParameter}
                                        />
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col}>
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
                                                            disabled={isUpdateConstantParameter}
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
                                                                        disabled={isUpdateConstantParameter}
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
                                                                                         disabled={isUpdateConstantParameter}
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
                                                                                             src={require('../../../Images/delete.png')}
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
                                                                        disabled={isUpdateConstantParameter || parameterForm["enumeratedValue"].list.length === 1}
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
                                        <Form.Group as={Col}>
                                            <Form.Label>Current Value</Form.Label>
                                            <Form.Control
                                                placeholder="Current value"
                                                data-key="currentValueOfParameter"
                                                onChange={this.onParameterFormValueChange}
                                                value={parameterForm["currentValueOfParameter"]}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Remark</Form.Label>
                                            <Form.Control
                                                placeholder="Remark"
                                                data-key="remark"
                                                onChange={this.onParameterFormValueChange}
                                                value={parameterForm["remark"]}
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group size="sm" as={Col}>
                                            <Form.Label>Change Duration</Form.Label>
                                            <Form.Control
                                                placeholder="Duration"
                                                data-key="duration"
                                                data-validation="float"
                                                onChange={this.onParameterFormValueChange}
                                                value={parameterForm["duration"]}
                                                autoComplete="off"
                                                disabled={isUpdateConstantParameter}
                                            />
                                        </Form.Group>
                                        <Form.Group size="sm" as={Col}>
                                            <Form.Label>Duration Unit</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={parameterForm["durationUnit"]}
                                                data-key="durationUnit"
                                                onChange={this.onParameterFormValueChange}
                                                disabled={isUpdateConstantParameter}
                                            >
                                                {
                                                    durationOptions.map((opt, index) => {
                                                        return (
                                                            <option key={`vuindex-${index}`}>{opt.label}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group size="sm" as={Col}>
                                            <Form.Label>Select Snapshot</Form.Label>
                                            <br/>
                                            <input type="file" accept="application/pdf,image/jpeg"
                                                // onChangeCapture={}
                                                   disabled={isUpdateConstantParameter}
                                            />
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
                                                    disabled={isUpdateConstantParameter}
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
                                                    machineOptions={machineOptions}
                                                    // updateUnitOptions={this.updateUnitOptions}
                                                    disabled={isUpdateConstantParameter}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Row>
                                    <Row >
                                        <Form.Group size="sm" as={Col} className="d-flex flex-row justify-content-between mt-3">
                                            <Button
                                                size="sm"
                                                className="parameter-header-button"
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
                                                            disabled={false}
                                                        >
                                                            Add
                                                        </Button>
                                                    )
                                                )
                                                || (
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button  ml-0"
                                                        onClick={this.onUpdateParameterClick}
                                                        variant="outline-secondary"
                                                        disabled={isParameterFormAddDisable}
                                                    >
                                                        Update
                                                    </Button>
                                                )
                                            }
                                        </Form.Group>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </SMSidebar>
        )
    }
}

NewConstantParameterFormUI.propTypes = {
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

export default NewConstantParameterFormUI;


