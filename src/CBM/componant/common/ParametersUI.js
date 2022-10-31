import React, {Component} from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {
    createParameter,
    getAllParameters,
    updateParameter,
    getAllRTDASMapping, getAllParametersAndRTDASMapping
} from "../../../api";
import SmartShipLoader from "./SmartShipLoader";
import CustomUnitsModal from "../custom/CustomUnitsModal";
import ReactTooltip from 'react-tooltip';
import {defaultParameterForm} from "../Constants";
import addIcon from '../../Images/downloadedImages/add.png';
import editIcon from '../../Images/downloadedImages/edit.png';
import saveIcon from '../../Images/downloadedImages/save.png';
import deleteIcon from '../../Images/downloadedImages/delete-forever--v1.png';

const unitOptions = [
    {value: 'NA', label: 'NA'},
    {value: 'degreeCelsius', label: '°C'},
    {value: 'rpm', label: 'rpm'},
    {value: 'mm', label: 'mm'},
    {value: 'cm', label: 'cm'},
    {value: 'M', label: 'M'},
    {value: 'sec', label: 'sec'},
    {value: 'min', label: 'min'},
    {value: 'hr', label: 'Hr'},
    {value: 'bar', label: 'bar'},
    {value: '%', label: '%'},
    {value: 'variance', label: 'variance'},
]
const rtdasMappingOptions = [
    {value: 'rtdas1', label: 'rtdas1'},
    {value: 'rtdas2', label: 'rtdas2'},
    {value: 'rtdas3', label: 'rtdas3'},
];
/*const comparisonOptions = [
    {value: 'greaterThan', label: '>'},
    {value: 'lessThan', label: '<'},
    {value: 'greaterThanEqual', label: '>='},
    {value: 'lessThanEqual', label: '<='},
];*/
const rangeText = {
    normalRange: "Operating Normal",
    specifiedRange: "OEM Specified",
}

const RangeField = function ({
                                 rangeKey,
                                 rangeObject,
                                 onParameterFormValueChange
                             }) {
    /*debugger*/
    return (
        <Form.Group as={Col} >
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


const specifiedRange = {
    key: "specifiedRange",
    isChecked: false,
    selectedRadio: "range",
    singleValue: "",
    from: "",
    to: "",
    operator: "",
    calculatedExpression: "",
};
const normalRange = {
    key: "normalRange",
    isChecked: false,
    selectedRadio: "range",
    singleValue: "",
    from: "",
    to: "",
    operator: "",
    calculatedExpression: "",
};
const enumeratedValue = {
    isChecked: false,
    enumeratedValueId: -1,
    currentValue: "",
    selectedListValue: "",
    list: ["-"]
}
/*const defaultParameterForm = Object.freeze({
    variableName: "",
    description: "",
    variableUnit: "cm",
    // informationSource: "",
    // type: "Digital",
    precision: "",
    scale: "",
    isScaleChecked: false,
    rtdasMapping: "rtdas1",
    specifiedRange: {...specifiedRange},
    normalRange: {...normalRange},
    enumeratedValue: {...enumeratedValue}
    // dataSource: "calculated",
});*/

class ParametersUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            addedElements: [],
            uIdCounter: 2,
            currentUid: -1,
            isEdit: false,
            parameterForm: {...defaultParameterForm},
            isParameterFormAddDisable: true,
            isShowUpdateParameterButton: false,
            parameterUId: -1,
            rtdasMappingOptions:[],
            unitOptions: []
        }
    }

    componentDidMount() {
        getAllParametersAndRTDASMapping(this.getAllSuccess, this.getAllFailure);
    }

    getAllSuccess = (parameterResponse, RTDASMappingResponse, unitsResponse) => {
        const unitOptions = unitsResponse && unitsResponse.hasOwnProperty("data") && unitsResponse.data.units;
        const addedElements = Object.entries(parameterResponse.data).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (rangeObj) => {
                    return (
                        rangeObj.isRange ? "range"
                            : rangeObj.isSingleValue ? "singleValue"
                            : rangeObj.isCalculatedExpression ? "calculated" : "range"
                    );
                };

                const specifiedRangeObj = obj.specifiedRange;
                const normalRangeObj = obj.normalRange;
                const enumeratedValueObj = obj.enumeratedValue;

                const parameterObject = {
                    uId:key,
                    variableName: obj.name,
                    description: obj.description,
                    variableUnit: obj.unit,
                    informationSource: obj.informationSource,
                    type: obj.signalType,
                    precision: obj.precision,
                    rtdasMapping: obj.rtdasMapping,//todo
                    dataSource: obj.dataSource, //todo
                    specifiedRange: {
                        key: "specifiedRange",
                        isChecked: specifiedRangeObj.isSpecifiedRange,
                        selectedRadio: getSelectedRadioOption(specifiedRangeObj),
                        singleValue: specifiedRangeObj.singleValue.value,
                        from: specifiedRangeObj.range.from,
                        to: specifiedRangeObj.range.to,
                        operator: "",
                        calculatedExpression: specifiedRangeObj.calculatedExpression.expression
                    },
                    normalRange: {
                        key: "normalRange",
                        isChecked: normalRangeObj.isNormalRange,
                        selectedRadio: getSelectedRadioOption(normalRangeObj),
                        singleValue: normalRangeObj.singleValue.value,
                        from: normalRangeObj.range.from,
                        to: normalRangeObj.range.to,
                        operator: "",
                        calculatedExpression: normalRangeObj.calculatedExpression.expression
                    },
                    enumeratedValue: {
                        isChecked: enumeratedValueObj.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: ["-", ...enumeratedValueObj.values]
                    }
                };
                return Object.assign({
                    uId:key,
                    variableName: obj.name,
                    ...parameterObject})
            }
        }).reverse();
        let rtdasMappingOptions = RTDASMappingResponse ? Object.entries(RTDASMappingResponse.data.data).map(([key, obj]) => Object.assign({ value: key ,label: RTDASMappingResponse.data.data[key]})): [];
        // debugger;
        this.setState({
            loading: false,
            addedElements,
            rtdasMappingOptions,
            unitOptions
        });
    };
    getAllFailure = (error)=> {
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
            "informationSource": informationSource,
            "unit": variableUnit,
            "signalType": type,
            "precision": precision,
            "isRealValue": "true",//todo
            "isFixedValue": "false",//todo
            "isCalculatedValue": "false",//todo
            "rtdasMapping": rtdasMapping,
            "specifiedRange": {
                "isSpecifiedRange": specifiedRange.isChecked,
                "isRange": specifiedRange.selectedRadio==="range",
                "range": {
                    "from": specifiedRange.from,
                    "to": specifiedRange.to
                },
                "isSingleValue": specifiedRange.selectedRadio==="singleValue",
                "singleValue": {
                    "value": specifiedRange.singleValue
                },
                "isCalculatedExpression": specifiedRange.selectedRadio==="calculated",
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
        const payload = this.getParameterObjectForServer();
        createParameter(this.onCreateParameterSuccess,this.onCreateParameterFailure, payload)
    };
    onCreateParameterSuccess = (res) => {
        // debugger
        // console.log(res);
        if(res.status === 200 ) {
            let addedElements = [this.state.parameterForm, ...this.state.addedElements];
            this.setState({
                loading: false,
                isEdit: !this.state.isEdit,
                parameterForm: {...defaultParameterForm},
                isParameterFormAddDisable: true,
                addedElements
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
    updateElement = () => {
        // debugger
        const parameterUId  = this.state.parameterUId;
        const parameterObject = this.getParameterObjectForServer();
        const payload = {
            [parameterUId]: {...parameterObject}
        };

        this.setState({
            loading: true
        });

        updateParameter(this.onUpdateParamterSuccess, this.onUpdateParameterFailure, payload)
    };
    onUpdateParamterSuccess = (res) => {
        // debugger
        // console.log(res)
        // debugger
        if(res.status === 200 ) {
            // debugger
            let addedElements = [...this.state.addedElements];
            const parameterForm = {...this.state.parameterForm};
            const parameterUId = this.state.parameterUId;
            for(let eIndex=0 ;eIndex<addedElements.length; eIndex++) {
                if(addedElements[eIndex].uId === parameterUId) {
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
    toggleEditParameters = () => {
        this.setState({
            // parameterForm: {...defaultParameterForm}
            isEdit: !this.state.isEdit,
            parameterUId: -1,
        })
    };
    showAddParameterForm = () => {
        // debugger
        let parameterForm = {...defaultParameterForm};
        parameterForm.specifiedRange = {...specifiedRange};
        parameterForm.normalRange = {...normalRange};
        parameterForm.enumeratedValue = {...enumeratedValue};
        this.setState({
            parameterForm: {...parameterForm},
            isEdit: !this.state.isEdit,
            isParameterFormAddDisable: true,
        })
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
            // console.log(defaultParameterForm);
            if ("checkbox" === event.target.type) {
                parameterForm[key].isChecked = !parameterForm[key].isChecked
                // console.log(defaultParameterForm);
            } else if ("radio" === event.target.type) {
                parameterForm[key].selectedRadio = dataset.radioname;
            } else if (dataset.hasOwnProperty("inputname")) {
                // debugger
                parameterForm[key][dataset.inputname] = event.target.value;
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
        this.setState({
            parameterForm,
            isParameterFormAddDisable
        })
    };
    onAddParameterBtnClick = () => {
        this.addParameter();
    };
    onEditParameterClick = (event) => {
        // debugger
        let parameterForm;
        const parameterUId = event.target.dataset.parameteruid;
        let addedElements = this.state.addedElements;
        for(let eIndex=0; eIndex<addedElements.length; eIndex++) {
            if(addedElements[eIndex].uId === parameterUId) {
                parameterForm = {...addedElements[eIndex]};
                break;
            }
        }
        // let parameterForm = {...[...addedElements][parameterUId]};
        // debugger
        this.setState({
            parameterForm,
            isEdit: true,
            isParameterFormAddDisable: false,
            parameterUId
        })
    };
    onDuplicateParameterClick = (event) => {
        debugger
        let parameterForm;
        let parameterUId = event.target.dataset.parameteruid;
        let addedElements = this.state.addedElements;
        for(let eIndex=0; eIndex<addedElements.length; eIndex++) {
            if(addedElements[eIndex].uId === parameterUId) {
                debugger
                parameterForm = {...addedElements[eIndex]};
                parameterForm.uId = -1;
                parameterForm.variableName = `copy ${parameterForm.variableName}`;
                parameterUId = -1
                break;
            }
        }
        // let parameterForm = {...[...addedElements][parameterUId]};
        // debugger
        this.setState({
            parameterForm,
            isEdit: true,
            isParameterFormAddDisable: false,
            parameterUId
        })
    };
    onUpdateParameterClick = () => {
        // debugger
        this.updateElement();
    };

    updateUnitOptions = (newUnitOptions) => {
        this.setState({
            unitOptions: newUnitOptions
        });
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
            unitOptions
        } = this.state;
        let allParams = [...this.state.addedElements];
        return (
            <div>
                <SmartShipLoader isVisible={loading} />
                {
                    isEdit ? (<Container>
                            <Row ld={8} md={8} xs={8}>
                                <div id="parametersUI">
                                    <div className="cardHeader">
                                        Parameters
                                    </div>
                                    <div style={{width: "100%", paddingLeft: 15, paddingRight: 15, paddingTop: 15}}>
                                        {/*---------------------
                                        {JSON.stringify(parameterForm)}
                                        {JSON.stringify(this.state.allParams)}
                                        ---------------------*/}
                                        <Form>
                                            <Row>
                                                <Form.Group size="sm" as={Col} >
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control
                                                        placeholder="Name"
                                                        data-key="variableName"
                                                        onChange={this.onParameterFormValueChange}
                                                        value={parameterForm["variableName"]}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>
                                                <Form.Group size="sm" as={Col} >
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
                                                <Form.Group as={Col} >
                                                    <Form.Label>Unit</Form.Label>
                                                    <div style={{display: "flex", flexDirection: "row"}}>
                                                        <Form.Control
                                                            as="select"
                                                            value={parameterForm["variableUnit"]}
                                                            data-key="variableUnit"
                                                            onChange={this.onParameterFormValueChange}
                                                        >
                                                            {
                                                                unitOptions.map((opt,index) => {
                                                                    return (
                                                                        <option key={`vuindex-${index}`}>{opt.label}</option>
                                                                    )
                                                                })
                                                            }
                                                        </Form.Control>
                                                        <CustomUnitsModal
                                                            unitOptions={unitOptions}
                                                            updateUnitOptions={this.updateUnitOptions}
                                                        />
                                                    </div>
                                                </Form.Group>
                                                <Form.Group as={Col} >
                                                    <Form.Label>Precision</Form.Label>
                                                    <Form.Control
                                                        placeholder="Precision"
                                                        data-key="precision"
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
                                                <Form.Group as={Col} >

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
                                                <Form.Group as={Col} >
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
                                                <Form.Group as={Col} >
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
                                            <Row style={{
                                                display: "flex",
                                                justifyContent: "center"
                                            }}>
                                                {
                                                    (
                                                        (parameterUId === -1) && (
                                                            <Button
                                                                size="sm"
                                                                className="parameter-add-button"
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
                                                            className="parameter-add-button"
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
                                                    onClick={this.toggleEditParameters}
                                                    variant="outline-secondary">
                                                    Cancel
                                                </Button>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </Row>
                        </Container>)
                        : (
                            <Container>
                                <Row ld={8} md={8} xs={8}>
                                    <div style={{
                                        width: "100%",
                                        borderWidth: 1,
                                        borderColor: "black",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        margin: "0px auto",
                                        maxWidth: 850,
                                        marginBottom: 10
                                    }}>
                                        <Button className="SM-button" onClick={this.showAddParameterForm}
                                                variant="outline-secondary">
                                            <img
                                                alt=""
                                                width={16}
                                                src={require('../../Images/plus.png')}
                                                style={{marginRight: 6}}
                                            />
                                            Add Parameter
                                        </Button>
                                    </div>
                                    {/*{JSON.stringify(allParams)}*/}
                                    <Table striped bordered hover size="sm" style={{
                                        maxWidth: 850,
                                        margin: "0px auto"
                                    }}>
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Unit</th>
                                            <th style={{whiteSpace: "nowrap"}}>RTDAS Mapping</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            allParams.map((param, index) => {
                                                // debugger
                                                // console.log(allParams)
                                                const parameterUId = param.uId;
                                                const list = param.enumeratedValue.list;
                                                return (
                                                    <tr key={`ptIndex-${index}`}>
                                                        <td>{param.variableName}</td>
                                                        <td>{param.description}</td>
                                                        <td>{param.variableUnit}</td>
                                                        <td>
                                                            <ReactTooltip/>
                                                            <div
                                                                data-tip={param.rtdasMapping}
                                                                data-multiline={true}
                                                                className={"sm_ellipsis"}
                                                            >
                                                                {param.rtdasMapping}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex flex-row">
                                                                <div
                                                                    title="Edit Parameter"
                                                                >
                                                                    <img style={{width: 18, cursor: "pointer"}}
                                                                         alt="Edit Parameter"
                                                                         data-parameteruid={parameterUId}
                                                                         src={editIcon}
                                                                         onClick={this.onEditParameterClick}
                                                                    />
                                                                </div>
                                                                <div
                                                                    title="Duplicate Parameter"
                                                                    className="ml-2"
                                                                >
                                                                    <img style={{width: 18, cursor: "pointer"}}
                                                                         alt="Duplicate Parameter"
                                                                         data-parameteruid={parameterUId}
                                                                         src={require('../../Images/duplicate.png')}
                                                                         onClick={this.onDuplicateParameterClick}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </Table>
                                </Row>
                            </Container>
                        )
                }
            </div>
        )
    }
}

ParametersUI.propTypes = {
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

export default ParametersUI;


