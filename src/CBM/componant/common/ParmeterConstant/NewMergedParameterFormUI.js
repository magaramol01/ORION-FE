import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {
    createParameter,
    updateParameter,
    getAllRTDASMappingAndUnits,
    getMergeParameterFormData,
    updateOnlyCurrentAndRemarkConstantParameter,
    createConstantParameter
} from "../../../../api";
import SmartShipLoader from "../SmartShipLoader";
import NavigationBar from "../NavigationBar";
import CustomUnitsModal from "../../custom/CustomUnitsModal";
import CustomMachinesModal from "../../custom/CustomMachine";
import {defaultNewParameterConstantForm, enumeratedValue, rangeText, machineOptions} from "../../Constants";
import Select from "react-select";
import addIcon from '../../../Images/downloadedImages/add.png';
import saveIcon from '../../../Images/downloadedImages/save.png';
import deleteIcon from '../../../Images/downloadedImages/delete-forever--v1.png';

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
                {/*{JSON.stringify(disabled)}*/}
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

const durationOptions = [
    {
        label: "min",
        value: "min"
    },
    {
        value: "hrs",
        label: "hrs"
    },
    {
        label: "days",
        value: "days"
    }];

class NewMergedParameterFormUI extends Component {

    constructor(props) {
        debugger
        super(props);
        let parameterForm = JSON.parse(JSON.stringify(defaultNewParameterConstantForm));
        let parameterUId = -1;
        let parameterType = "parameter";
        let isDuplicate = false;

        if (props.location.data) {
            debugger
            const data = props.location.data;
            parameterForm = data.parameterForm;
            parameterType = data.parameterType;
            isDuplicate = !!data.isDuplicate;
            if (parameterForm.hasOwnProperty("uId")) {
                parameterUId = parameterForm.uId;
            }
            parameterForm.isConstantChecked = parameterType==="constant";
        }
        this.state = {
            loading: true,
            parameterUId,
            parameterType,
            parameterForm,
            isDuplicate,
            addedElements: [],
            isEdit: false,
            isParameterFormAddDisable: true,
            isShowUpdateParameterButton: false,
            rtdasMappingOptions: [],
            unitOptions: []
        }
    }

    componentDidMount() {
        // getAllParametersAndRTDASMapping(this.getAllSuccess, this.getAllFailure);
        // getAllRTDASMappingAndUnits(this.getAllSuccess, this.getAllFailure);
        getMergeParameterFormData(this.getMergeParameterFormDataSuccess, this.getMergeParameterFormDataFailure)
    }

    getMergeParameterFormDataSuccess = (unitResponse, rtdasMappingResponse, parameterSourceJsonResponse) => {
        debugger;
        const unitOptions = unitResponse && unitResponse.hasOwnProperty("data") && unitResponse.data.units;
        const RTDASMappingData = rtdasMappingResponse.data.data;
        let rtdasMappingOptions = RTDASMappingData.map((rtdasMappingOption, index) => {
            return {
                value: `${index}`,
                label: rtdasMappingOption
            }
        });

        const parameterSourceOptions = [];
        for (let psKey in parameterSourceJsonResponse.data) {
            parameterSourceOptions.push({
                value: psKey,
                label: parameterSourceJsonResponse.data[psKey].name
            })
        }

        let isParameterFormAddDisable = this.getIsParameterFormAddDisable(this.state.parameterForm);

        debugger
        let parameterForm = {...this.state.parameterForm};
        if(parameterForm.hasOwnProperty("rtdasMapping") && parameterForm.rtdasMapping) {
            let rtdasMapping = {};
            if(RTDASMappingData.indexOf(parameterForm.rtdasMapping)===-1) {
                rtdasMapping = {
                    value: 0,
                    label: RTDASMappingData[0]
                }
            } else {
                rtdasMapping = {
                    value: RTDASMappingData.indexOf(parameterForm.rtdasMapping),
                    label: parameterForm.rtdasMapping
                }
            }
            parameterForm = {
                ...parameterForm,
                rtdasMapping
            }
        }

        this.setState({
            loading: false,
            unitOptions,
            parameterForm,
            rtdasMappingOptions,
            parameterSourceOptions,
            isParameterFormAddDisable
        });
    };
    getMergeParameterFormDataFailure = (error) => {
        debugger;
        console.error(error);
        this.setState({
            loading: false
        })
    };

    // getAllSuccess = (parameterResponse, RTDASMappingResponse, unitsResponse) => {
    getAllSuccess = (parameterResponse) => {
        debugger
        const {
            units: unitOptions,
            rtds: RTDASMappingResponse
        } = parameterResponse.data;
        // alert(JSON.stringify(RTDASMappingResponse));
        // console.log("RTDASMappingResponseRTDASMappingResponseRTDASMappingResponseRTDASMappingResponse");
        // console.log(RTDASMappingResponse);
        // const unitOptions = unitsResponse && unitsResponse.hasOwnProperty("data") && unitsResponse.data.units;
        let rtdasMappingOptions = RTDASMappingResponse.map((rtdasMappingOption, index) => {
            return {
                value: `${index}`,
                label: rtdasMappingOption
            }
        });
        debugger;
        let isParameterFormAddDisable = this.getIsParameterFormAddDisable(this.state.parameterForm);

        this.setState({
            loading: false,
            isParameterFormAddDisable,
            rtdasMappingOptions,
            unitOptions
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
        } = this.state.parameterForm;
        // debugger
        const parameterObject = {
            "name": variableName,
            "description": description,
            // "informationSource": informationSource,
            "unit": variableUnit,
            "machine": machine,
            "signalType": type,
            "precision": precision,
            "isRealValue": "true",//todo
            "isFixedValue": "false",//todo
            "isCalculatedValue": "false",//todo
            "rtdasMapping": rtdasMapping.label,
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
    onAddParameterBtnClick = () => {
        debugger
        this.setState({
            loading: true
        });
        if("parameter" === this.state.parameterType) {
            const payload = this.getParameterObjectForServer();
            debugger
            createParameter(this.onCreateParameterSuccess, this.onCreateParameterFailure, payload)
        } else {
            const payload = this.getConstantObjectForServer();
            debugger
            createConstantParameter(this.onCreateParameterSuccess, this.onCreateParameterFailure, payload)
        }
    };
    onCreateParameterSuccess = (res) => {
        debugger;
        if (res.status === 200 ) {
            /*let addedElements = [this.state.parameterForm, ...this.state.addedElements];
            this.setState({
                loading: false,
                isEdit: !this.state.isEdit,
                parameterForm: {...defaultNewParameterConstantForm},
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
        debugger
        this.setState({
            loading: false
        });
        //console.log(err)
    };

    /**
     * update
     * **/
    onUpdateParameterClick = () => {
        debugger
        this.setState({
            loading: true
        });
        const parameterUId = this.state.parameterUId;
        if("parameter" === this.state.parameterType) {
            const parameterObject = this.getParameterObjectForServer();
            const payload = {
                [parameterUId]: {...parameterObject}
            };
            debugger
            updateParameter(this.onUpdateParameterSuccess, this.onUpdateParameterFailure, payload)
        } else {
            const {currentValueOfParameter, remark} = this.state.parameterForm;
            const payload = {
                "ID": parameterUId,
                "currentValueOfParameter": currentValueOfParameter,
                "remark": remark
            };
            debugger
            updateOnlyCurrentAndRemarkConstantParameter(this.onUpdateParameterSuccess, this.onUpdateParameterFailure, payload)
        }
    };
    onUpdateParameterSuccess = (res) => {
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
                parameterForm: {...defaultNewParameterConstantForm},
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
        //console.log(err)
    };

    /**
     * parameters functions
     * */
    getIsParameterFormAddDisable = (parameterForm) => {
        debugger
        let isParameterFormAddDisable = false;
        for (let key in parameterForm) {
            debugger
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
                } else {
                    if ("currentValueOfParameter" === key
                        || "remark" === key
                        || "durationUnit" === key
                        || "informationSource" === key
                        || "duration" === key) {
                        //Input Specific to Constant only
                        if (parameterForm.isConstantChecked && parameterForm[key] === "") {
                            debugger
                            isParameterFormAddDisable = true;
                            break;
                        }
                    } else {
                        //Input Specific to Parameter only
                        if (!parameterForm.isConstantChecked && parameterForm[key] === "") {
                            debugger
                            isParameterFormAddDisable = true;
                            break;
                        }
                    }
                }
            }
        }
        return isParameterFormAddDisable
    }
    onParameterFormValueChange = (event) => {
        // debugger
        const dataset = event.target.dataset;
        const key = dataset.key;
        let parameterForm = {...this.state.parameterForm};
        if (key === "isScaleChecked" || key === "isConstantChecked") {
            parameterForm[key] = !parameterForm[key];
        } else if (key === "dataSource") {
            parameterForm[key] = dataset.radioname;
        } else if (key.indexOf("specifiedRange") !== -1 || key.indexOf("normalRange") !== -1) {
            // debugger
            // console.log(defaultNewParameterConstantForm);
            if ("checkbox" === event.target.type) {
                parameterForm[key].isChecked = !parameterForm[key].isChecked
                // console.log(defaultNewParameterConstantForm);
            } else if ("radio" === event.target.type) {
                parameterForm[key].selectedRadio = dataset.radioname;
            } else if (dataset.hasOwnProperty("inputname")) {
                // debugger
                parameterForm[key][dataset.inputname] = event.target.value;
            }
            // console.log(defaultNewParameterConstantForm);
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
                    parameterForm[key][dataset.inputname] = event.target.value;
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
            parameterForm[key] = event.target.value;
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


    onSearchableDropdownValueChange = (selectedOption, type) => {
        let parameterForm = {...this.state.parameterForm};
        parameterForm[type] = selectedOption;
        const isParameterFormAddDisable = this.getIsParameterFormAddDisable(parameterForm);
        this.setState({
            parameterForm,
            isParameterFormAddDisable
        })
    };

    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        let {
            loading,
            isEdit,
            isDuplicate,
            parameterForm,
            parameterType,
            isParameterFormAddDisable,
            parameterUId,
            // allParams,
            unitOptions,
            rtdasMappingOptions,
            parameterSourceOptions,
        } = this.state;
        let allParams = [...this.state.addedElements];
        const isConstantChecked = parameterForm["isConstantChecked"];
        const isUpdateConstantParameter = "constant" === parameterType && parameterUId !== -1;
        return (
            <div className="smartShipBody d-flex flex-column h-100">
                <SmartShipLoader isVisible={loading}/>
                <NavigationBar
                    onBackPress={this.resetToDefaultView}
                    title={"Parameter"}/>
                <div className="d-flex justify-content-center mt-5 mb-4">
                    <div className="config-form-block sm-w-700" style={{margin: "0px auto"}}>
                        <div className="config-form-block-header">
                            Parameter
                        </div>
                        <div style={{width: "100%", paddingLeft: 15, paddingRight: 15, paddingTop: 15}}>
                            <Form>
                                <Row>
                                    {/*{JSON.stringify(parameterForm["isConstantChecked"])}*/}
                                    <Form.Group as={Col}>
                                        <Form.Group controlId="formBasicCheckbox" style={{marginBottom: 0}}>
                                            <Form.Check
                                                type="checkbox"
                                                id={`isConstant-checkbox`}
                                                label="Constant"
                                                // label="Specified Range"
                                                data-key="isConstantChecked"
                                                checked={parameterForm["isConstantChecked"]}
                                                // onChange={this.onParameterFormValueChange}
                                                onChange={this.onParameterFormValueChange}
                                                disabled={parameterUId !== -1 || isDuplicate}
                                            />
                                        </Form.Group>
                                    </Form.Group>
                                </Row>
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
                                    {
                                        isConstantChecked
                                            ? (<Form.Group as={Col}>
                                                <Form.Label>Parameter Source</Form.Label>
                                                <Select
                                                    theme={theme}
                                                    options={parameterSourceOptions}
                                                    data-key="rulechain-condition"
                                                    closeMenuOnSelect={true}
                                                    defaultValue={parameterForm["informationSource"]}
                                                    onChange={(selectedOption) => {
                                                        this.onSearchableDropdownValueChange(selectedOption, "informationSource")
                                                    }}
                                                    // isDisabled={isUpdateConstantParameter}
                                                    // isDisabled={isConstantChecked}
                                                    isDisabled={isUpdateConstantParameter}
                                                />
                                            </Form.Group>)
                                            : (<Form.Group as={Col}>
                                                <Form.Label>Precision</Form.Label>
                                                <Form.Control
                                                    placeholder="Precision"
                                                    data-key="precision"
                                                    onChange={this.onParameterFormValueChange}
                                                    value={parameterForm["precision"]}
                                                    autoComplete="off"
                                                />
                                            </Form.Group>)
                                    }
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
                                {
                                    !isConstantChecked && (
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
                                                    onChange={this.onParameterFormValueChange}
                                                    value={parameterForm["scale"]}
                                                    autoComplete="off"
                                                    disabled={!parameterForm.isScaleChecked}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col}>
                                                <Form.Label>RTDAS Mapping</Form.Label>
                                                <Select
                                                    theme={theme}
                                                    options={rtdasMappingOptions}
                                                    data-key="rtdasMapping-condition"
                                                    closeMenuOnSelect={true}
                                                    key={parameterForm["rtdasMapping"]}
                                                    defaultValue={parameterForm["rtdasMapping"]}
                                                    onChange={(selectedOption) => {
                                                        this.onSearchableDropdownValueChange(selectedOption, "rtdasMapping")
                                                    }}
                                                    // isDisabled={isUpdateConstantParameter}
                                                    // isDisabled={isConstantChecked}
                                                />
                                            </Form.Group>
                                        </Row>
                                    )
                                }
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

                                {
                                    isConstantChecked && (
                                        <>
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
                                                                    <option
                                                                        key={`vuindex-${index}`}>{opt.label}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Select Snapshot</Form.Label>
                                                    <input type="file" accept="application/pdf,image/jpeg"
                                                        // onChangeCapture={}
                                                           disabled={isUpdateConstantParameter}
                                                    />
                                                </Form.Group>
                                            </Row>
                                        </>
                                    )
                                }
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
                                                disabled={isUpdateConstantParameter}
                                                // updateUnitOptions={this.updateUnitOptions}
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
                                        <Button
                                            size="sm"
                                            className="parameter-header-button"
                                            onClick={this.resetToDefaultView}
                                            variant="outline-secondary">
                                            Cancel
                                        </Button>
                                    </Form.Group>

                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

NewMergedParameterFormUI.propTypes = {
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

export default NewMergedParameterFormUI;


