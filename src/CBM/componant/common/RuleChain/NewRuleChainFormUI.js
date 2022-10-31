import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {
    createRuleChain,
    createRuleConfig,
    deleteRule,
    getAllParametersOnlyNamesByShip,
    getAllRuleConfigsByShip,
    updateRuleChain,
    updateRuleConfig
} from "../../../../api";
import SmartShipLoader from "../SmartShipLoader";
import CustomAddEditRuleModal from "../../custom/CustomAddEditRuleModal";
import NewCustomRuleTable from "../../custom/NewCustomRuleTable";
import NavigationBar from "../NavigationBar";
import CustomAlert from "../../custom/CustomAlert";
import SMSidebar from "../../../../SMSidebar";
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import {getValidatedValue} from "../validationHelper";
import {defaultPagination} from "../../Constants";

const enumeratedValue = {
    isChecked: false,
    enumeratedValueId: -1,
    currentValue: "",
    selectedListValue: "",
    list: ["-"]
}
const frequencyOptions = [
    {value: 'sec', label: 'sec'},
    {value: 'min', label: 'min'},
    {value: 'hrs', label: 'hrs'},
    {value: 'days', label: 'days'},
];
const defaultRuleConfigForm = {
    ruleConfigId: -1,
    ruleConfigName: "",
    ruleConfigDescription: "",
    selectedParameters: {},
    conditionDropdown: "",
    conditionRadio: "range", /*["range", "SingleValue"],*/
    singleValue: "",
    singleValueCondition: ">=",
    from: "",
    fromCondition: ">=",
    to: "",
    toCondition: ">=",
    calculatedExpression: "",
    enumeratedValue: {...enumeratedValue}
};
const defaultRuleChainForm = {
    ruleChainId: -1,
    ruleChainName: "",
    ruleChainDescription: "",
    ruleConfig: "",// here will be all ids of created rule config
    frequency: "",
    frequencyUnit: "sec",//dropdown
    isNumberOfOccurrencesChecked: false,
    isEvaluationFactorChecked: false,
    numberOfOccurrences: "",
    // ruleConfigs: [...[{...defaultRuleConfigForm}]]
    ruleConfigs: [],
    evaluationFactorUnit: "Probability",
    evaluationFactorValue: "",
    isActivated:false,
};
const advanceOptions = [
    {value: 'Probability', label: 'Probability'},
    {value: 'Standard Deviation', label: 'Standard Deviation'},
    {value: 'Count', label: 'Count'},
    {value: 'Sum', label: 'Sum'},
    {value: 'Increasing', label: 'Increasing'},
    {value: 'Decreasing', label: 'Decreasing'},
    {value: 'IncreasingContinuasly', label: 'IncreasingContinuasly'},
    {value: 'DecreasingContinuasly', label: 'DecreasingContinuasly'},
    {value: 'Average', label: 'Average'}
];

class NewRuleChainFormUI extends React.Component {
    constructor(props) {
        super(props);

        let ruleChainForm = JSON.parse(JSON.stringify(defaultRuleChainForm));
        let ruleChainId = "-1";
        if (props.location.data) {
            ruleChainForm = props.location.data.ruleChainForm;
            ruleChainId = ruleChainForm.hasOwnProperty("ruleChainId") && ruleChainForm.uId;
        }
        this.state = {
            loading: true,
            ruleConfigId: "-1",
            ruleChainId,
            ruleChainForm,
            parameterOptions: [],
            ruleConfigForm: JSON.parse(JSON.stringify(defaultRuleConfigForm)),//new
            ruleConfigList: [],
            isAddUpdateRuleConfigDisabled: true,
            // isRuleConfigTableVisible: true,//new
            isAddUpdateRuleChainDisabled: true,//new
            parametersObj: {},
            prefillSelectedValue: {value: 'NormalRange', label: 'Normal Range'},
            selectedTab: "RuleChain",
            ruleConfigNameForTable: "",
            ruleConfigDescriptionForTable: "",
            ruleConfigListTable: [],
            ruleConfigPagination: defaultPagination,
        }
        this.customAlertRef = React.createRef();
    }

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    componentDidMount() {
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const searchArr = [
            {
                searchKey: "ruleName",
                searchValue: ""
            },
            {
                searchKey: "description",
                searchValue: ""
            },
        ];
        getAllRuleConfigsByShip(this.onGetAllRuleConfigsSuccess, this.onGetAllRuleConfigsFailure, {
            vesselName,
            activePage: 1,
            searchArr
        });
        getAllParametersOnlyNamesByShip(this.onGetParametersSuccess, this.onGetParametersFailure, vesselName)
    }

    /**
     * RULE CONFIG
     * create rule config object for server
     * **/
    getRuleConfigObjectForServer = () => {
        const {
            ruleConfigName,
            selectedParameters,
            ruleConfigDescription,
            conditionRadio,
            from,
            fromCondition,
            to,
            toCondition,
            singleValue,
            singleValueCondition,
            calculatedExpression,
            enumeratedValue,
        } = this.state.ruleConfigForm;

        const objectForServer = {
            ruleName: ruleConfigName,
            parameterId: selectedParameters.value,
            description: ruleConfigDescription,
            isActive: true,
            unit: "degree celsius",
            condition: {
                isRange: conditionRadio === "range",
                range: {
                    from: from,
                    fromOperator: fromCondition,
                    to: to,
                    toOperator: toCondition
                },
                isSingleValue: conditionRadio === "singleValue",
                singleValue: {
                    value: singleValue,
                    valueOperator: singleValueCondition
                },
                isCalculatedExpression: conditionRadio === "calculated",
                calculatedExpression: {
                    expression: calculatedExpression,
                    expressionDetails: ""
                },
                isEnumeratedValue: conditionRadio === "calculated",
            },
            enumeratedValue: {
                "isEnumeratedValue": conditionRadio === "enumerate",
                "values": conditionRadio !== "enumerate" ? [] : enumeratedValue.list.slice(1)
            }
        }
        return objectForServer;
    };

    /**
     * get all data
     * **/
    onGetAllRuleConfigsSuccess = (response) => {
        const {
            activePage,
            data: ruleConfigData,
            itemsCountPerPage,
            pageRangeDisplayed,
            totalItemsCount,
        } = {...response.data}
        const ruleConfigPagination = {...this.state.ruleConfigPagination};
        ruleConfigPagination.activePage = activePage;
        ruleConfigPagination.itemsCountPerPage = itemsCountPerPage;
        ruleConfigPagination.pageRangeDisplayed = pageRangeDisplayed;
        ruleConfigPagination.totalItemsCount = totalItemsCount;
        const ruleConfigList = Object.entries(ruleConfigData).map(([key, obj]) => {
            {
                const getSelectedRadioOption = (conditionObject) => {
                    return (
                        conditionObject.isRange ? "range"
                            : conditionObject.isSingleValue ? "singleValue"
                            : conditionObject.isCalculatedExpression ? "calculated"
                                : "range"
                    );
                };
                const selectedParameters = {
                    "value": obj.parameterId,
                    "label": obj.parameterId
                };
                const conditionObject = obj.condition;
                const ruleConfigObject = {
                    ruleConfigId: key,
                    ruleConfigName: obj.ruleName,
                    ruleConfigDescription: obj.description,
                    selectedParameters,
                    conditionDropdown: "",
                    conditionRadio: getSelectedRadioOption(conditionObject),
                    singleValue: conditionObject.singleValue.value,
                    singleValueCondition: conditionObject.singleValue.valueOperator,
                    from: conditionObject.range.from,
                    fromCondition: conditionObject.range.fromOperator,
                    to: conditionObject.range.to,
                    toCondition: conditionObject.range.toOperator,
                    calculatedExpression: conditionObject.calculatedExpression.expression,
                    enumeratedValue: {
                        isChecked: obj.hasOwnProperty("enumeratedValue") && obj.enumeratedValue.isEnumeratedValue,
                        enumeratedValueId: -1,
                        currentValue: "",
                        selectedListValue: "",
                        list: obj.hasOwnProperty("enumeratedValue") && ["-", ...obj.enumeratedValue.values]
                    },
                    isActive: false
                };
                return Object.assign({
                    uId: key,
                    ...ruleConfigObject
                })
            }
        });

        const isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(this.state.ruleChainForm);
        this.setState({
            loading: false,
            ruleConfigList,
            ruleConfigListTable: ruleConfigList,
            isAddUpdateRuleChainDisabled,
            // isRuleConfigTableVisible: true,
            ruleConfigPagination
        })
    };
    onGetAllRuleConfigsFailure = (error) => {
        //console.log(error);
        this.setState({
            loading: false
        })
    };

    onGetParametersSuccess = (res) => {
        if (res.status === 200 ) {
            const parametersObj = res.data;
            let parameterOptions = [];

            for (let key in parametersObj) {
                parameterOptions.push({
                    value: parametersObj[key]["key"],
                    label: parametersObj[key]["name"]
                });
            }
            this.setState({
                parameterOptions,
                loading: false,
                parametersObj
            })
        }
    };
    onGetParametersFailure = (error) => {
        console.log(error);
        this.setState({
            loading: false
        })
    };

    /**
     * Create
     * **/
    addElement = () => {
        this.setState({
            loading: true
        });
        const payload = this.getRuleConfigObjectForServer();
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload["vesselName"] = "";
        }
        createRuleConfig(this.onCreateRuleConfigSuccess, this.onCreateRuleConfigFailure, payload)
    };
    onCreateRuleConfigSuccess = (res) => {

        if (res.status === 200 ) {
            let ruleConfigForm = {...this.state.ruleConfigForm};
            ruleConfigForm.ruleConfigId = res.data.toString();
            let ruleConfigList = [...this.state.ruleConfigList, ruleConfigForm];

            let ruleChainForm = {...this.state.ruleChainForm};
            let isAddUpdateRuleChainDisabled = this.state.isAddUpdateRuleChainDisabled;
            let isAddUpdateRuleConfigDisabled = true;
            // let isRuleConfigTableVisible = true;

            if (this.state.selectedTab === "RuleChain") {
                ruleChainForm.ruleConfigs = [...ruleChainForm.ruleConfigs, {
                    value: ruleConfigForm.ruleConfigId,
                    label: ruleConfigForm.ruleConfigName,
                    description: ruleConfigForm.ruleConfigDescription
                }];
                isAddUpdateRuleConfigDisabled = this.state.isAddUpdateRuleConfigDisabled;
                // isRuleConfigTableVisible = this.state.isRuleConfigTableVisible;
                isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(ruleChainForm);
            }

            this.setState({
                loading: false,
                ruleConfigForm: JSON.parse(JSON.stringify(defaultRuleConfigForm)),
                isAddUpdateRuleConfigDisabled,
                // isRuleConfigTableVisible,
                ruleConfigList,
                ruleConfigListTable: ruleConfigList,
                ruleChainForm,
                isAddUpdateRuleChainDisabled
            })
        }
    };
    onCreateRuleConfigFailure = (err) => {
        this.setState({
            loading: false
        });
        console.log(err)
    };

    /**
     * update
     * **/
    updateElement = () => {
        const ruleConfigId = this.state.ruleConfigForm.ruleConfigId;
        const ruleConfigObject = this.getRuleConfigObjectForServer();
        const payload = {
            [ruleConfigId]: {...ruleConfigObject}
        };
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload[ruleConfigId]["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload[ruleConfigId]["vesselName"] = "";
        }
        this.setState({
            loading: true
        });
        updateRuleConfig(this.onUpdateRuleConfigSuccess, this.onUpdateRuleConfigFailure, payload)
    };
    onUpdateRuleConfigSuccess = (res) => {
        if (res.status === 200 ) {
            const ruleConfigForm = {...this.state.ruleConfigForm};
            let ruleConfigList = [...this.state.ruleConfigList];
            const ruleConfigId = ruleConfigForm.ruleConfigId;
            for (let rbIndex = 0; rbIndex < ruleConfigList.length; rbIndex++) {
                const ruleConfigItem = {...ruleConfigList[rbIndex]};
                if (ruleConfigId === ruleConfigItem.ruleConfigId) {
                    ruleConfigList[rbIndex] = ruleConfigForm;
                    break;
                }
            }

            this.setState({
                // ruleConfigForm: {...defaultRuleConfigForm},
                loading: false,
                ruleConfigList,
                ruleConfigListTable: ruleConfigList,
                isAddUpdateRuleConfigDisabled: true,
                // isRuleConfigTableVisible: true
            })
        }
    };
    onUpdateRuleConfigFailure = (err) => {
        console.log(err);
        this.setState({
            loading: false
        });
    };


    /**
     * rule chain object for server
     * ***/
    getRuleChainObjectForServer = () => {
        const {
            ruleChainName,
            ruleChainDescription,
            ruleConfigs,
            frequency,
            frequencyUnit,
            numberOfOccurrences,
            isNumberOfOccurrencesChecked,
            isEvaluationFactorChecked,
            evaluationFactorValue,
            evaluationFactorUnit,
        } = this.state.ruleChainForm;
        const ActivationStatus = this.state.ruleChainForm.isActivated;
        const rules = ruleConfigs.map((ruleConfigObj) => {
                return {
                    value: ruleConfigObj.value,
                    label: ruleConfigObj.label
                }
            }
        );
        const ruleChainObject = {
            name: ruleChainName,
            description: ruleChainDescription,
            isActivated: ActivationStatus?true:false,
            rules,
            evaluationMethod: {
                periodicity: {
                    value: frequency,
                    unit: frequencyUnit
                },
                noOfOccurrences: {
                    isChecked: isNumberOfOccurrencesChecked,
                    value: numberOfOccurrences
                }
            },
            evaluationFactor: {
                isEvaluationFactorChecked: isEvaluationFactorChecked,
                type: evaluationFactorUnit,
                value: evaluationFactorValue
            }
        };
        return ruleChainObject;
    };

    /**
     * Create
     * **/
    addRuleChainElement = () => {
        const payload = this.getRuleChainObjectForServer();
        this.setState({
            loading: true
        });
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload["vesselName"] = "";
        }
        createRuleChain(this.onCreateRuleChainSuccess, this.onCreateRuleChainFailure, payload)
    };
    onCreateRuleChainSuccess = (res) => {
        if (res.status === 200 ) {
            const ruleChainId = res.data;
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "cause",
                    uId: ruleChainId
                }
            })
        }
    };
    onCreateRuleChainFailure = (err) => {
       // console.log(err);
        this.setState({
            loading: false
        });
    };

    /**
     * update
     * **/
    updateRuleChainElement = () => {
        const ruleChainId = this.state.ruleChainForm.ruleChainId;
        const ruleChainObject = this.getRuleChainObjectForServer();
        const payload = {
            [ruleChainId]: {...ruleChainObject}
        };
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload[ruleChainId]["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload[ruleChainId]["vesselName"] = "";
        }
        this.setState({
            loading: true
        });
        updateRuleChain(this.onUpdateRuleChainSuccess, this.onUpdateRuleChainFailure, payload)
    };
    onUpdateRuleChainSuccess = (res) => {
        if (res.status === 200 ) {
            this.props.history.push({
                pathname: '/MonitorPolicies',
                data: {
                    type: "cause",
                    uId: this.state.ruleChainForm.ruleChainId
                }
            })
        }
    };
    onUpdateRuleChainFailure = (err) => {
        //console.log(err);
        this.setState({
            loading: false
        })
    };

    /***
     * New Rule Config form functions
     * **/
    getIsAddUpdateRuleConfigDisabled = (ruleConfigForm) => {
        let isAddUpdateRuleConfigDisabled = false;
        for (let key in ruleConfigForm) {
            if (
                !isAddUpdateRuleConfigDisabled &&
                !(
                    key === "singleValue"
                    || key === "from"
                    || key === "to"
                    || key === "conditionDropdown"
                    || key === "calculatedExpression"
                    || key === "singleValueCondition"
                    || key === "fromCondition"
                    || key === "toCondition"
                    || key === "enumeratedValue"
                )) {
                const ruleConfigFormItem = ruleConfigForm[key];
                if (key === "selectedParameters") {
                    isAddUpdateRuleConfigDisabled = Object.keys(ruleConfigForm.selectedParameters).length === 0;
                } else if (key === "conditionRadio") {
                    if (ruleConfigForm.conditionRadio === "range") {
                        isAddUpdateRuleConfigDisabled = ruleConfigForm.from === "" || ruleConfigForm.to === "";
                    } else if (ruleConfigForm.conditionRadio === "singleValue") {
                        isAddUpdateRuleConfigDisabled = ruleConfigForm.singleValue === "";
                    } else if (ruleConfigForm.conditionRadio === "calculated") {
                        isAddUpdateRuleConfigDisabled = ruleConfigForm.calculatedExpression === "";
                    } else if (ruleConfigForm.conditionRadio === "enumerate") {
                        isAddUpdateRuleConfigDisabled = ruleConfigForm.enumeratedValue.list.length === 1;
                    }
                } else {
                    isAddUpdateRuleConfigDisabled = ruleConfigFormItem === "";
                }
            }
        }
        return isAddUpdateRuleConfigDisabled;
    };
    onRuleConfigFormItemValueChange = (event) => {
        let ruleConfigForm = {...this.state.ruleConfigForm};
        const dataset = event.target.dataset;
        const key = dataset.key;
        if (key === "conditionDropdown") {
            ruleConfigForm[dataset.dropdownname] = event.target.value;
        } else if (key === "conditionRadio") {
            ruleConfigForm.conditionRadio = dataset.radioname;
        } else if ("enumeratedValue" === key) {
            if (dataset.hasOwnProperty("inputname")) {
                const currentValue = ruleConfigForm[key].currentValue.trim();
                if (event.keyCode == 13) {
                    const list = [...ruleConfigForm[key].list, currentValue];
                    ruleConfigForm[key].list = list;
                    ruleConfigForm[key].currentValue = "";
                    ruleConfigForm[key].enumeratedValueId = -1;
                    ruleConfigForm[key].selectedListValue = "";
                } else {
                    const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
                    if(validatedValue ==="" || validatedValue) {
                        ruleConfigForm[key][dataset.inputname] = validatedValue;
                    }
                }
            } else if (dataset.hasOwnProperty("dropdownname")) {
                const value = event.target.value;
                ruleConfigForm[key][dataset.dropdownname] = value;
                if (value === "-") {
                    ruleConfigForm[key].currentValue = "";
                    ruleConfigForm[key].enumeratedValueId = -1;
                    ruleConfigForm[key].selectedListValue = "-";
                } else {
                    ruleConfigForm[key].enumeratedValueId = ruleConfigForm[key].list.indexOf(value);
                    ruleConfigForm[key].currentValue = value;
                }
            } else if (dataset.hasOwnProperty("buttonname")) {
                if ("add" === dataset.buttonname) {
                    const currentValue = ruleConfigForm[key].currentValue.trim();
                    if (currentValue) {
                        const list = [...ruleConfigForm[key].list, currentValue];
                        ruleConfigForm[key].list = list;
                        ruleConfigForm[key].currentValue = "";
                        ruleConfigForm[key].enumeratedValueId = -1;
                        ruleConfigForm[key].selectedListValue = "-";
                    }
                } else if ("update" === dataset.buttonname) {
                    const enumeratedValueId = ruleConfigForm[key].enumeratedValueId;
                    const currentValue = ruleConfigForm[key].currentValue;
                    let list = [...ruleConfigForm[key].list];
                    list[enumeratedValueId] = currentValue;
                    ruleConfigForm[key].list = list;
                    ruleConfigForm[key].currentValue = "";
                    ruleConfigForm[key].enumeratedValueId = -1;
                    ruleConfigForm[key].selectedListValue = "-";
                } else if ("delete" === dataset.buttonname) {
                    const enumeratedValueId = ruleConfigForm[key].enumeratedValueId;
                    // const currentValue = ruleConfigForm[key].currentValue;
                    let list = [...ruleConfigForm[key].list];
                    list.splice(enumeratedValueId, 1);
                    ruleConfigForm[key].list = list;
                    ruleConfigForm[key].currentValue = "";
                    ruleConfigForm[key].enumeratedValueId = -1;
                    ruleConfigForm[key].selectedListValue = "-";
                }
            }
        } else {
            const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
            if(validatedValue ==="" || validatedValue) {
                ruleConfigForm[key] = validatedValue;
            }
        }

        const isAddUpdateRuleConfigDisabled = this.getIsAddUpdateRuleConfigDisabled(ruleConfigForm);
        this.setState({
            ruleConfigForm,
            isAddUpdateRuleConfigDisabled
        })
    };
    onParameterDropdownChange = (selectedValue) => {
        let ruleConfigForm = {...this.state.ruleConfigForm};
        ruleConfigForm.selectedParameters = {...selectedValue};
        const isAddUpdateRuleConfigDisabled = this.getIsAddUpdateRuleConfigDisabled(ruleConfigForm);
        this.setState({
            ruleConfigForm,
            isAddUpdateRuleConfigDisabled
        }, () => {
            this.onPrefieldValueChange(this.state.prefillSelectedValue)
        });
    };
    onPrefieldValueChange = (selectedValue) => {
        let configForm = {...this.state.ruleConfigForm};
        const parametersObj = this.state.parametersObj;
        if (Object.keys(configForm.selectedParameters).length !== 0) {
            let parameter = {};
            for (let key in parametersObj) {
                if (parametersObj[key]["key"] === configForm.selectedParameters.value) {
                    parameter = parametersObj[key];
                    break;
                }
            }
            if (selectedValue.value === "SpecifiedRange") {
                if (parameter.specifiedRange.isRange) {
                    configForm.conditionRadio = "range";
                    configForm.from = parameter.specifiedRange.range.from;
                    configForm.to = parameter.specifiedRange.range.to;
                } else if (parameter.specifiedRange.isSingleValue) {
                    configForm.conditionRadio = "singleValue";
                    configForm.singleValue = parameter.specifiedRange.singleValue.value;
                } else if (parameter.specifiedRange.isCalculatedExpression) {
                    configForm.conditionRadio = "calculated";
                    configForm.calculatedExpression = parameter.normalRange.calculatedExpression.expression;
                } else if (parameter.enumeratedValue.isEnumeratedValue) {
                    configForm.conditionRadio = "enumerate";
                    let list = ["-"];
                    list = [...list, ...parameter.enumeratedValue.values];
                    configForm.enumeratedValue = {
                        isChecked: true,
                        enumeratedValueId: list.length,
                        currentValue: "",
                        selectedListValue: "",
                        list: list
                    }
                }
            } else {
                if (parameter.normalRange.isRange) {
                    configForm.conditionRadio = "range";
                    configForm.from = parameter.normalRange.range.from;
                    configForm.to = parameter.normalRange.range.to;
                } else if (parameter.normalRange.isSingleValue) {
                    configForm.conditionRadio = "singleValue";
                    configForm.singleValue = parameter.normalRange.singleValue.value;
                } else if (parameter.normalRange.isCalculatedExpression) {
                    configForm.conditionRadio = "calculated";
                    configForm.calculatedExpression = parameter.normalRange.calculatedExpression.expression;
                } else if (parameter.enumeratedValue.isEnumeratedValue) {
                    configForm.conditionRadio = "enumerate";
                    let list = ["-"];
                    list = [...list, ...parameter.enumeratedValue.values];

                    configForm.enumeratedValue = {
                        isChecked: true,
                        enumeratedValueId: list.length,
                        currentValue: "",
                        selectedListValue: "",
                        list: list
                    }
                }
            }
        }
        const isAddUpdateRuleConfigDisabled = this.getIsAddUpdateRuleConfigDisabled(configForm);
        this.setState({ruleConfigForm: configForm, isAddUpdateRuleConfigDisabled, prefillSelectedValue: selectedValue})
        return "";
    }
    onAddRuleConfigClick = () => {
        this.addElement();
    };
    onUpdateRuleConfigClick = () => {
        this.updateElement();
    };
    onCancelRuleConfigClick = () => {
        this.toggleRuleConfigTableUI();
    };

    /**
     * Rule Config Pagination functions
     * **/
    onRuleConfigPageChange = (activePage) => {
        debugger
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const ruleConfigPagination = {...this.state.ruleConfigPagination};
        const {ruleConfigNameForTable, ruleConfigDescriptionForTable} = this.state;
        ruleConfigPagination.activePage = activePage;
        const searchArr = [
            {
                searchKey: "ruleName",
                searchValue: ruleConfigNameForTable
            },
            {
                searchKey: "description",
                searchValue: ruleConfigDescriptionForTable
            },
        ];
        this.setState({ruleConfigPagination}, () => {
            getAllRuleConfigsByShip(this.onGetAllRuleConfigsSuccess, this.onGetAllRuleConfigsFailure, {
                vesselName,
                activePage,
                searchArr
            });
        });
    }

    onSearchRuleConfigBtnClick = () => {
        const {
            ruleConfigNameForTable,
            ruleConfigDescriptionForTable
        } = this.state;

        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        const ruleConfigPagination = {...this.state.ruleConfigPagination};
        ruleConfigPagination.activePage = {...defaultPagination};
        const searchArr = [
            {
                searchKey: "ruleName",
                searchValue: ruleConfigNameForTable
            },
            {
                searchKey: "description",
                searchValue: ruleConfigDescriptionForTable
            },
        ];
        this.setState({ruleConfigPagination}, () => {
            getAllRuleConfigsByShip(this.onGetAllRuleConfigsSuccess, this.onGetAllRuleConfigsFailure, {
                vesselName,
                activePage: 1,
                searchArr
            });
        });
    }

    /**
     * Rule Config Table Functions
     * **/
    onRuleConfigItemEdit = (event) => {
        const ruleConfigId = typeof (event) === "string" ? event : event.target.dataset.ruleconfigid;
        const ruleConfigList = [...this.state.ruleConfigList];
        let ruleConfigForm = {};
        for (let rbIndex = 0; rbIndex < ruleConfigList.length; rbIndex++) {
            const ruleConfigItem = ruleConfigList[rbIndex];
            if (ruleConfigId === ruleConfigItem.ruleConfigId) {
                ruleConfigForm = ruleConfigList[rbIndex];
                break;
            }
        }

        this.setState({
            loading: false,
            ruleConfigForm,
            // isRuleConfigTableVisible: false,
            isAddUpdateRuleConfigDisabled: false
        });
    };
    onRuleConfigItemDuplicate = (event) => {
        const ruleConfigId = typeof (event) === "string" ? event : event.target.dataset.ruleconfigid;
        const ruleConfigList = [...this.state.ruleConfigList];
        let ruleConfigForm = {};
        for (let rbIndex = 0; rbIndex < ruleConfigList.length; rbIndex++) {
            const ruleConfigItem = ruleConfigList[rbIndex];
            if (ruleConfigId === ruleConfigItem.ruleConfigId) {
                ruleConfigForm = JSON.parse(JSON.stringify(ruleConfigList[rbIndex]));
                ruleConfigForm.ruleConfigId = -1;
                ruleConfigForm.ruleConfigName = `copy ${ruleConfigForm.ruleConfigName}`;
                break;
            }
        }

        this.setState({
            loading: false,
            ruleConfigForm,
            // isRuleConfigTableVisible: false,
            isAddUpdateRuleConfigDisabled: false
        });
    };
    toggleRuleConfigTableUI = () => {
        this.setState({
            // isRuleConfigTableVisible: !this.state.isRuleConfigTableVisible
        })
    }
    onRuleConfigItemDeleteClick = (event) => {
        const ruleConfigId = typeof (event) === "string" ? event : event.target.dataset.ruleconfigid;
        const onCauseDeleteSuccess = this.onRuleConfigItemDeleteSuccess(ruleConfigId);
        deleteRule(onCauseDeleteSuccess, this.onRuleConfigItemDeleteFailure, ruleConfigId)
    };
    onRuleConfigItemDeleteSuccess = (ruleConfigId) => {
        return (resp) => {
            if(true === resp.data) {
                let ruleConfigList = [...this.state.ruleConfigList];
                ruleConfigList = ruleConfigList.filter((ruleConfigItem) => ruleConfigId !== ruleConfigItem.ruleConfigId);
                // alert("delete successfule")
                this.setState({
                    loading: false,
                    ruleConfigList
                })
                window.location.reload(false);
            } else {
                this.showAlert({
                    type: "error",
                    message: resp.data
                });
                this.setState({
                    loading: false
                })
            }
        };
    };
    onRuleConfigItemDeleteFailure = (resp) => {
        //console.log(resp);
        this.setState({
            loading: false
        })
    };

    /***
     * New Rule Chain form functions
     * **/
    getIsAddUpdateRuleChainDisabled = (ruleChainForm) => {
        let isAddUpdateRuleChainDisabled = false;
        for (let key in ruleChainForm) {
            if (!isAddUpdateRuleChainDisabled && !(key === "numberOfOccurrences" || key === "evaluationFactorUnit" || key === "evaluationFactorValue")) {
                const ruleChainFormItem = ruleChainForm[key];
                if ("isNumberOfOccurrencesChecked" === key) {
                    if (ruleChainForm.isNumberOfOccurrencesChecked) {
                        isAddUpdateRuleChainDisabled = ruleChainForm.numberOfOccurrences === "";
                    }
                } else if ("ruleConfig" === key) {
                    isAddUpdateRuleChainDisabled = !ruleChainForm.ruleConfigs || (ruleChainForm.ruleConfigs && ruleChainForm.ruleConfigs.length === 0);
                } else if ("isEvaluationFactorChecked" === key) {
                    if (ruleChainFormItem && ruleChainForm.evaluationFactorUnit !== "Increasing" && ruleChainForm.evaluationFactorUnit !== "Decreasing" && ruleChainForm.evaluationFactorUnit !== "IncreasingContinuasly" && ruleChainForm.evaluationFactorUnit !== "DecreasingContinuasly") {
                        isAddUpdateRuleChainDisabled = ruleChainForm.evaluationFactorValue === "" || ruleChainForm.evaluationFactorUnit === "";
                    }
                } else {
                    isAddUpdateRuleChainDisabled = ruleChainFormItem === "";
                }
            }
        }
        return isAddUpdateRuleChainDisabled;
    };
    onRuleChainFormItemValueChange = (event) => {
        let ruleChainForm = {...this.state.ruleChainForm};
        const dataset = event.target.dataset;
        const key = dataset.key;
        if(key === 'isActivated') {
            ruleChainForm.isActivated = event.target.checked;
        } else if (key === "isNumberOfOccurrencesChecked") {
            ruleChainForm.isNumberOfOccurrencesChecked = event.target.checked;
            ruleChainForm.numberOfOccurrences = "";
        } else if (key === "isEvaluationFactorChecked") {
            ruleChainForm.isEvaluationFactorChecked = event.target.checked;
            ruleChainForm.evaluationFactorValue = "";
            ruleChainForm.evaluationFactorUnit = "Probability";
        } else if (key === "conditionDropdown") {
            ruleChainForm[dataset.dropdownname] = event.target.value;
        } else {
            const validatedValue = getValidatedValue(event.target.value, event.target.dataset.validation);
            if(validatedValue ==="" || validatedValue) {
                ruleChainForm[key] = validatedValue;
            }
        }
        const isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(ruleChainForm);
        this.setState({
            ruleChainForm,
            isAddUpdateRuleChainDisabled
        })
    };

    onRuleConfigTableCheckboxChecked = ({isChecked, ruleObject}) => {
        let ruleChainForm = {...this.state.ruleChainForm};
        if (isChecked) {
            //add
            ruleChainForm.ruleConfigs = [...ruleChainForm.ruleConfigs, {...ruleObject}];
        } else {
            //remove
            for (let rcIndex = 0; rcIndex < ruleChainForm.ruleConfigs.length; rcIndex++) {
                if (ruleChainForm.ruleConfigs[rcIndex].value === ruleObject.value) {
                    ruleChainForm.ruleConfigs.splice(rcIndex, 1);
                    break;
                }
            }
        }
        const isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(ruleChainForm);
        this.setState({
            ruleChainForm,
            isAddUpdateRuleChainDisabled
        });
    };
    onAddRuleChainClick = () => {
        this.addRuleChainElement()
    };
    onUpdateRuleChainClick = () => {
        this.updateRuleChainElement();
    };
    onActivateDeactivateRuleConfigClick = (event) => {
        const uId = event.target.dataset.uid;
        let ruleConfigList = [...this.state.ruleConfigList];
        for(let rcIndex=0; rcIndex<ruleConfigList.length; rcIndex++) {
            if(uId === ruleConfigList[rcIndex].ruleConfigId) {
                ruleConfigList[rcIndex].isActive = !ruleConfigList[rcIndex].isActive;
                break;
            }
        }
        this.setState({
            ruleConfigList
        })
    };

    onModalShow = () => {
        /*this.setState({
            ruleConfigForm: {...defaultRuleConfigForm}
        })*/
    };
    onModalHide = () => {
        this.setState({
            ruleConfigForm: JSON.parse(JSON.stringify(defaultRuleConfigForm))
        })
    };
    onTableSearchInputChange = (event) => {
        const key = event.target.dataset.key;
        let {ruleConfigNameForTable, ruleConfigDescriptionForTable} = this.state;
        if (key === "ruleConfigNameForTable") {
            ruleConfigNameForTable = event.target.value;
        } else if (key === "ruleConfigDescriptionForTable") {
            ruleConfigDescriptionForTable = event.target.value;
        }

        this.setState({
            ruleConfigNameForTable,
            ruleConfigDescriptionForTable,
            // ruleConfigListTable
        })
    };

    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        const {
            loading,
            parameterOptions,
            ruleConfigForm,
            ruleConfigList,
            isAddUpdateRuleConfigDisabled,
            // isRuleConfigTableVisible,
            ruleChainForm,
            isAddUpdateRuleChainDisabled,
            ruleConfigNameForTable,
            ruleConfigDescriptionForTable,
            ruleConfigListTable,
            ruleConfigPagination
        } = this.state;


        /*const {
            currentUid,
            ruleConfigList,
            ruleConfigListTable,
            parameterOptions,
            parametersObj,
            resetToDefaultView
        } = this.props;*/


        let selectedRuleConfigsArr = [];
        for (let key in ruleChainForm.ruleConfigs) {
            selectedRuleConfigsArr.push(ruleChainForm.ruleConfigs[key].value);
        }
        let ruleConfigsOptions = [];
        for (let rbIndex = 0; rbIndex < ruleConfigList.length; rbIndex++) {
            const ruleConfigItem = ruleConfigList[rbIndex];
            ruleConfigsOptions.push({
                value: ruleConfigItem.ruleConfigId,
                label: ruleConfigItem.ruleConfigName,
                description: ruleConfigItem.ruleConfigDescription,
            })
        }
        let ruleConfigsOptionsKeys = [];
        if (ruleChainForm.ruleConfigs) {
            for (let rckIndex = 0; rckIndex < ruleChainForm.ruleConfigs.length; rckIndex++) {
                const ruleConfigItem = ruleChainForm.ruleConfigs[rckIndex];
                ruleConfigsOptionsKeys.push(ruleConfigItem.value);
            }
        }

        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100 ">
                    <SmartShipLoader isVisible={loading}/>
                    <CustomAlert ref={this.customAlertRef}/>

                    <NavigationBar title={"Rule / Rule Block Configuration"}/>

                    <div className="pb-4 pt-5 pr-2 pl-2 overflow-auto cbm-wrapper">
                        <div style={{flex: 1}}>
                            <div className="config-form-block sm-w-800 " style={{margin: "0px auto"}}>
                                <div>
                                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                                        <div className="config-form-block-header">
                                            Rule / Rule Block Configuration
                                        </div>
                                        <div className="customSwitch">
                                            <input
                                                type="checkbox"
                                                checked={ruleChainForm.isActivated}
                                                data-key="isActivated"
                                                className={"customSwitch customSwitchInput"}
                                                id="customSwitch"
                                                onClick={this.onRuleChainFormItemValueChange}
                                                title={"Activate/Deactivate Rule Block"}
                                            />
                                            <label className="customSwitchLabel customSwitchToggle" htmlFor="customSwitch" />
                                        </div>
                                    </div>
                                    <div>
                                        <Row>
                                            <Form.Group size="sm" as={Col}>
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    placeholder="Name"
                                                    data-key="ruleChainName"
                                                    onChange={this.onRuleChainFormItemValueChange}
                                                    value={ruleChainForm["ruleChainName"]}
                                                    autoComplete="off"
                                                    maxLength={30}
                                                />
                                            </Form.Group>
                                            <Form.Group size="sm" as={Col}>
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    placeholder="Description"
                                                    data-key="ruleChainDescription"
                                                    onChange={this.onRuleChainFormItemValueChange}
                                                    value={ruleChainForm["ruleChainDescription"]}
                                                    autoComplete="off"
                                                    // readOnly={true}
                                                />
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group size="sm" as={Col}>
                                                <Form.Label>Select Rules</Form.Label>
                                                {
                                                    // JSON.stringify(ruleChainForm.ruleConfigs)
                                                }
                                                <div className="d-flex flex-row">
                                                    <div className="w-100"
                                                         style={{
                                                             border: "1px solid #cccccc",
                                                             display: "flex",
                                                             flexFlow: "row wrap",
                                                             padding: 2,
                                                         }}
                                                    >
                                                        {/*{JSON.stringify(ruleChainForm.ruleConfigs)}*/}
                                                        {/*{JSON.stringify(ruleConfigsOptionsKeys)}*/}
                                                        {/*<Select
                                                options={ruleConfigsOptions}
                                                data-key="ruleConfigs"
                                                key={JSON.stringify(ruleChainForm.ruleConfigs)}
                                                data-ruleconfigid={ruleChainForm.ruleChainId}
                                                onChange={onRuleConfigsDropdownChange}
                                                isMulti={true}
                                                closeMenuOnSelect={false}
                                                defaultValue={ruleChainForm.ruleConfigs}
                                                style={{width: "100%"}}
                                            />*/}
                                                        {
                                                            ruleChainForm.ruleConfigs.map((ruleConfigItem, rcfIndex) => {
                                                                return (
                                                                    <div className="selectedRulesUI" key={`${rcfIndex}`}>
                                                                        <span className="selectedRulesUIText">
                                                                            {ruleConfigItem.label}
                                                                        </span>
                                                                        <span
                                                                            className="selectedRulesUIText removeRuleConfigIcon pl-0 pt-0">
                                                                            ×
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                        <CustomAddEditRuleModal
                                                            ruleModalFor={"ADD_RULE"}
                                                            ruleConfigId={-1}
                                                            parameterOptions={parameterOptions}
                                                            ruleConfigForm={ruleConfigForm}
                                                            isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                                                            onRuleConfigFormItemValueChange={this.onRuleConfigFormItemValueChange}
                                                            onParameterDropdownChange={this.onParameterDropdownChange}
                                                            onPrefieldValueChange={this.onPrefieldValueChange}
                                                            onAddRuleConfigClick={this.onAddRuleConfigClick}
                                                            onUpdateRuleConfigClick={this.onUpdateRuleConfigClick}
                                                            onCancelRuleConfigClick={this.onCancelRuleConfigClick}
                                                            onModalShow={this.onModalShow}
                                                            onModalHide={this.onModalHide}
                                                        />
                                                    </div>
                                                </div>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            {/*{JSON.stringify(ruleConfigListTable)}*/}
                                            <NewCustomRuleTable
                                                ruleConfigList={ruleConfigList}
                                                parameterOptions={parameterOptions}
                                                ruleConfigForm={ruleConfigForm}
                                                isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                                                ruleConfigNameForTable={ruleConfigNameForTable}
                                                ruleConfigDescriptionForTable={ruleConfigDescriptionForTable}
                                                ruleConfigListTable={ruleConfigListTable}
                                                ruleConfigsOptionsKeys={ruleConfigsOptionsKeys}
                                                pagination={ruleConfigPagination}
                                                onRuleConfigItemEdit={this.onRuleConfigItemEdit}
                                                onRuleConfigItemDeleteClick={this.onRuleConfigItemDeleteClick}
                                                onRuleConfigItemDuplicate={this.onRuleConfigItemDuplicate}
                                                onRuleConfigFormItemValueChange={this.onRuleConfigFormItemValueChange}
                                                onParameterDropdownChange={this.onParameterDropdownChange}
                                                onPrefieldValueChange={this.onPrefieldValueChange}
                                                onAddRuleConfigClick={this.onAddRuleConfigClick}
                                                onUpdateRuleConfigClick={this.onUpdateRuleConfigClick}
                                                onCancelRuleConfigClick={this.onCancelRuleConfigClick}
                                                onModalShow={this.onModalShow}
                                                onModalHide={this.onModalHide}
                                                onTableSearchInputChange={this.onTableSearchInputChange}
                                                onRuleConfigTableCheckboxChecked={this.onRuleConfigTableCheckboxChecked}
                                                onActivateDeactivateRuleConfigClick={this.onActivateDeactivateRuleConfigClick}
                                                onRuleConfigPageChange={this.onRuleConfigPageChange}
                                                onSearchRuleConfigBtnClick={this.onSearchRuleConfigBtnClick}
                                            />
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={4}>
                                                <Form.Group size="sm">
                                                    <Form.Label>Periodicity</Form.Label>
                                                    <Form.Row style={{marginTop: 14, paddingRight: 8}}>
                                                        <Col>
                                                            <Form.Control
                                                                placeholder="Periodicity"
                                                                data-key="frequency"
                                                                data-validation="float"
                                                                onChange={this.onRuleChainFormItemValueChange}
                                                                value={ruleChainForm.frequency}
                                                                autoComplete="off"
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                autoComplete="off"
                                                                value={ruleChainForm.frequencyUnit}
                                                                data-key="frequencyUnit"
                                                                onChange={this.onRuleChainFormItemValueChange}
                                                            >
                                                                {
                                                                    frequencyOptions.map((opt, index) => {
                                                                        return (
                                                                            <option
                                                                                key={`comp-freq-1-${index}`}>{opt.label}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </Form.Control>
                                                        </Col>
                                                    </Form.Row>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <Form.Group size="sm" style={{paddingRight: 8}}>
                                                    <Form.Group controlId="nooCheckbox">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Number of Occurrence"
                                                            data-key="isNumberOfOccurrencesChecked"
                                                            onChange={this.onRuleChainFormItemValueChange}
                                                            checked={ruleChainForm.isNumberOfOccurrencesChecked}
                                                        />
                                                    </Form.Group>
                                                    <Form.Control
                                                        placeholder="Number of Occurrence"
                                                        data-key="numberOfOccurrences"
                                                        data-validation="integer"
                                                        onChange={this.onRuleChainFormItemValueChange}
                                                        value={ruleChainForm.numberOfOccurrences}
                                                        autoComplete="off"
                                                        disabled={!ruleChainForm.isNumberOfOccurrencesChecked}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} md={5}>
                                                <Form.Group size="sm">
                                                    <Form.Group controlId="evaluationFactorCheckbox">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="."
                                                            data-key="isEvaluationFactorChecked"
                                                            onChange={this.onRuleChainFormItemValueChange}
                                                            checked={ruleChainForm.isEvaluationFactorChecked}
                                                        />
                                                    </Form.Group>
                                                    {/*{JSON.stringify(ruleChainForm.isEvaluationFactorChecked)}*/}
                                                    <Form.Row>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                autoComplete="off"
                                                                value={ruleChainForm.evaluationFactorUnit}
                                                                data-key="evaluationFactorUnit"
                                                                onChange={this.onRuleChainFormItemValueChange}
                                                                disabled={!ruleChainForm.isEvaluationFactorChecked}
                                                            >
                                                                {
                                                                    advanceOptions.map((opt, index) => {
                                                                        return (
                                                                            <option
                                                                                key={`comp-freq-1-${index}`}>{opt.label}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </Form.Control>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                placeholder="value"
                                                                data-key="evaluationFactorValue"
                                                                onChange={this.onRuleChainFormItemValueChange}
                                                                value={ruleChainForm.evaluationFactorValue}
                                                                autoComplete="off"
                                                                disabled={!ruleChainForm.isEvaluationFactorChecked}
                                                            />
                                                        </Col>
                                                    </Form.Row>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row style={{marginBottom: 0}}>
                                            <Form.Group size="sm" as={Col}
                                                        style={{
                                                            display: "flex",
                                                            padding: 10,
                                                            justifyContent: "space-between"
                                                        }}>
                                                <Button
                                                    size="sm"
                                                    className="parameter-header-button"
                                                    onClick={this.resetToDefaultView}
                                                    variant="outline-secondary">
                                                    Cancel
                                                </Button>
                                                {
                                                    ruleChainForm.ruleChainId === -1 ? (<Button
                                                            size="sm"
                                                            className="parameter-header-button"
                                                            onClick={this.onAddRuleChainClick}
                                                            variant="outline-secondary"
                                                            disabled={isAddUpdateRuleChainDisabled}
                                                        >
                                                            Add
                                                        </Button>)
                                                        : (<Button
                                                            size="sm"
                                                            className="parameter-header-button"
                                                            onClick={this.onUpdateRuleChainClick}
                                                            variant="outline-secondary"
                                                            disabled={isAddUpdateRuleChainDisabled}
                                                        >
                                                            Update
                                                        </Button>)
                                                }
                                            </Form.Group>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SMSidebar>
        )
    }
}

export default NewRuleChainFormUI;


