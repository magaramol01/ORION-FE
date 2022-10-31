import React from "react";
import {Button, Col, Container, Form, OverlayTrigger, Row, Tab, Table, Tabs, Tooltip} from "react-bootstrap";
import Select from 'react-select';
import {
    createRuleChain,
    createRuleConfig,
    getAllParametersOnlyNames,
    getAllRuleChains,
    getAllRuleConfigs, updateRuleChain,
    updateRuleConfig
} from "../../../../api";
import SmartShipLoader from "../SmartShipLoader";
import CustomTooltip from "../../custom/CustomTooltip";
import CustomAddEditRuleModal from "../../custom/CustomAddEditRuleModal";
import {prefieldOptions, comparisonOptions} from "../../Constants";
import {blue} from "color-name";
import CustomRuleTable from "../../custom/CustomRuleTable";

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
    isAdvanceOptionsChecked: false,
    numberOfOccurrences: "",
    // ruleConfigs: [...[{...defaultRuleConfigForm}]]
    ruleConfigs: [],
    advanceOptionUnit: "Probability",
    advanceOptionValue: ""
};
const advanceOptions = [
    {value: 'Probability', label: 'Probability'},
    {value: 'Standard Deviation', label: 'Standard Deviation'},
    {value: 'Count', label: 'Count'},
];

const NewRuleChainForm = ({
                              ruleConfigList,
                              ruleChainForm,
                              isAddUpdateRuleChainDisabled,
                              ruleConfigNameForTable,
                              ruleConfigDescriptionForTable,
                              ruleConfigListTable,
                              onRuleConfigsDropdownChange,
                              onRuleConfigTableCheckboxChecked,
                              onRuleChainFormItemValueChange,
                              onAddRuleChainClick,
                              onCancelRuleChainClick,
                              onUpdateRuleChainClick,
                              parameterOptions,
                              ruleConfigForm,
                              isAddUpdateRuleConfigDisabled,
                              onRuleConfigItemEdit,
                              onRuleConfigItemDuplicate,
                              onRuleConfigFormItemValueChange,
                              onParameterDropdownChange,
                              onPrefieldValueChange,
                              onAddRuleConfigClick,
                              onUpdateRuleConfigClick,
                              onCancelRuleConfigClick,
                              onModalShow,
                              onModalHide,
                              onTableSearchInputChange
                          }) => {
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
        <Container>
            {/*{JSON.stringify(ruleChainForm)}*/}
            <Row ld={8} md={8} xs={8}>
                <div id="parametersUI">
                    <div className="cardHeader">
                        Rule Block
                    </div>
                    <div style={{
                        width: "100%",
                        paddingTop: 15,
                        paddingRight: 15,
                        paddingLeft: 15,
                        paddingBottom: 0
                    }}>
                        <Row>
                            <Form.Group size="sm" as={Col}>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    placeholder="Name"
                                    data-key="ruleChainName"
                                    onChange={onRuleChainFormItemValueChange}
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
                                    onChange={onRuleChainFormItemValueChange}
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
                                    // JSON.stringify(ruleChainForm.selectedParameters)
                                }
                                <div className="d-flex flex-row">
                                    <div className="w-100"
                                         style={{
                                             border: "1px solid #cccccc",
                                             display: "flex",
                                             flexFlow: "row wrap",
                                             padding: 3,
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
                                                        <div className="selectedRulesUIText">
                                                            {ruleConfigItem.label}
                                                        </div>
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
                                            onRuleConfigFormItemValueChange={onRuleConfigFormItemValueChange}
                                            onParameterDropdownChange={onParameterDropdownChange}
                                            onPrefieldValueChange={onPrefieldValueChange}
                                            onAddRuleConfigClick={onAddRuleConfigClick}
                                            onUpdateRuleConfigClick={onUpdateRuleConfigClick}
                                            onCancelRuleConfigClick={onCancelRuleConfigClick}
                                            onModalShow={onModalShow}
                                            onModalHide={onModalHide}
                                        />
                                    </div>
                                </div>
                            </Form.Group>
                        </Row>
                        <Row>
                            {/*{JSON.stringify(ruleConfigListTable)}*/}
                            <CustomRuleTable
                                ruleConfigList={ruleConfigList}
                                parameterOptions={parameterOptions}
                                ruleConfigForm={ruleConfigForm}
                                isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                                ruleConfigNameForTable={ruleConfigNameForTable}
                                ruleConfigDescriptionForTable={ruleConfigDescriptionForTable}
                                ruleConfigListTable={ruleConfigListTable}
                                ruleConfigsOptionsKeys={ruleConfigsOptionsKeys}
                                onRuleConfigItemEdit={onRuleConfigItemEdit}
                                onRuleConfigItemDuplicate={onRuleConfigItemDuplicate}
                                onRuleConfigFormItemValueChange={onRuleConfigFormItemValueChange}
                                onParameterDropdownChange={onParameterDropdownChange}
                                onPrefieldValueChange={onPrefieldValueChange}
                                onAddRuleConfigClick={onAddRuleConfigClick}
                                onUpdateRuleConfigClick={onUpdateRuleConfigClick}
                                onCancelRuleConfigClick={onCancelRuleConfigClick}
                                onModalShow={onModalShow}
                                onModalHide={onModalHide}
                                onTableSearchInputChange={onTableSearchInputChange}
                                onRuleConfigTableCheckboxChecked={onRuleConfigTableCheckboxChecked}
                            />
                        </Row>
                        <Row>
                            <Form.Group size="sm" as={Col}>
                                <Form.Label>Periodicity</Form.Label>
                                <Form.Row>
                                    <Col>
                                        <Form.Control
                                            placeholder="Periodicity"
                                            data-key="frequency"
                                            onChange={onRuleChainFormItemValueChange}
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
                                            onChange={onRuleChainFormItemValueChange}
                                        >
                                            {
                                                frequencyOptions.map((opt, index) => {
                                                    return (
                                                        <option key={`comp-freq-1-${index}`}>{opt.label}</option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group size="sm" as={Col}>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="Number of Occurrence"
                                        data-key="isNumberOfOccurrencesChecked"
                                        onChange={onRuleChainFormItemValueChange}
                                        checked={ruleChainForm.isNumberOfOccurrencesChecked}
                                    />
                                </Form.Group>
                                <Form.Control
                                    placeholder="Number of Occurrence"
                                    data-key="numberOfOccurrences"
                                    onChange={onRuleChainFormItemValueChange}
                                    value={ruleChainForm.numberOfOccurrences}
                                    autoComplete="off"
                                    disabled={!ruleChainForm.isNumberOfOccurrencesChecked}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group size="sm" as={Col}>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label=""
                                        data-key="isAdvanceOptionsChecked"
                                        onChange={onRuleChainFormItemValueChange}
                                        checked={ruleChainForm.isAdvanceOptionsChecked}
                                    />
                                </Form.Group>
                                {/*{JSON.stringify(ruleChainForm.isAdvanceOptionsChecked)}*/}
                                <Form.Row>
                                    <Col>
                                        <Form.Control
                                            as="select"
                                            autoComplete="off"
                                            value={ruleChainForm.advanceOptionUnit}
                                            data-key="advanceOptionUnit"
                                            onChange={onRuleChainFormItemValueChange}
                                            disabled={!ruleChainForm.isAdvanceOptionsChecked}
                                        >
                                            {
                                                advanceOptions.map((opt, index) => {
                                                    return (
                                                        <option key={`comp-freq-1-${index}`}>{opt.label}</option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            placeholder="value"
                                            data-key="advanceOptionValue"
                                            onChange={onRuleChainFormItemValueChange}
                                            value={ruleChainForm.advanceOptionValue}
                                            autoComplete="off"
                                            disabled={!ruleChainForm.isAdvanceOptionsChecked}
                                        />
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                        </Row>

                        <Row style={{marginBottom: 0}}>
                            <Form.Group size="sm" as={Col}
                                        style={{display: "flex", padding: 10, justifyContent: "center"}}>
                                {
                                    ruleChainForm.ruleChainId === -1 ? (<Button
                                            size="sm"
                                            className="parameter-header-button"
                                            onClick={onAddRuleChainClick}
                                            variant="outline-secondary"
                                            disabled={isAddUpdateRuleChainDisabled}
                                        >
                                            Add
                                        </Button>)
                                        : (<Button
                                            size="sm"
                                            className="parameter-header-button"
                                            onClick={onUpdateRuleChainClick}
                                            variant="outline-secondary"
                                            disabled={isAddUpdateRuleChainDisabled}
                                        >
                                            Update
                                        </Button>)
                                }
                                <Button
                                    size="sm"
                                    className="parameter-header-button"
                                    onClick={onCancelRuleChainClick}
                                    variant="outline-secondary">
                                    Cancel
                                </Button>
                            </Form.Group>
                        </Row>
                    </div>
                </div>
            </Row>
        </Container>
    )
};


const RuleChainTableUI = ({
                              ruleChainList,
                              onRuleChainItemEdit,
                              onRuleChainItemDuplicate,
                              onRuleChainItemDelete,
                              onAddNewRuleChainClick,
                          }) => {
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                <Button
                    className="SM-p-button"
                    onClick={onAddNewRuleChainClick}
                    variant="outline-secondary">
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Create Rule Block
                </Button>
            </div>
            {/*{JSON.stringify(ruleChainList)}*/}
            <Table size="sm" className="sm-custom-table">
                <thead>
                {/*<tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Rules</th>
                        <th>Periodicity</th>
                        <th>Number of Occurrence</th>
                        <th>Action</th>
                    </tr>*/}
                </thead>
                <tbody>
                {
                    ruleChainList.map((ruleChainItem, index) => {
                        const ruleChainId = ruleChainItem.ruleChainId;
                        let selectedRuleConfigsArr = "";
                        for (let rIndex = 0; rIndex < ruleChainItem.ruleConfigs.length; rIndex++) {
                            selectedRuleConfigsArr += `[${ruleChainItem.ruleConfigs[rIndex].label}] `;
                        }
                        const ruleChaiListUI = ruleChainItem.ruleConfigs.map((ruleConfig, rcIndex) => {
                            return <div key={`rcTooltip-${rcIndex}`}>
                                <CustomTooltip
                                    description={ruleConfig.description}
                                    label={ruleConfig.label}
                                />
                            </div>
                        })
                        return (
                            <tr key={`ruleChainRow${index}`}>
                                <td>
                                    <div className="nameText">{ruleChainItem.ruleChainName}</div>
                                    <div className="descriptionText">{ruleChainItem.ruleChainDescription}</div>
                                </td>
                                <td>
                                    <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                                        <div className="pt-1">Rules:</div>
                                        { ruleChaiListUI }
                                    </div>
                                    <div>
                                        Periodicity: {`${ruleChainItem.frequency} ${ruleChainItem.frequencyUnit}`}
                                    </div>
                                    <div>
                                        No. of Occurrences: {ruleChainItem.isNumberOfOccurrencesChecked ? ruleChainItem.numberOfOccurrences : "NA"}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-row">
                                        <div
                                            title={"Edit Rule Block"}
                                            // style={{textAlign: "center"}}
                                        >
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Edit Rule Block"
                                                 data-index={index}
                                                 data-rulechainid={ruleChainId}
                                                 src={require('../../../Images/edit.png')}
                                                 onClick={onRuleChainItemEdit}
                                            />
                                        </div>
                                        <div
                                            title={"Duplicate Rule Block"}
                                            className="ml-2"
                                        >
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Duplicate Rule Block"
                                                 data-index={index}
                                                 data-rulechainid={ruleChainId}
                                                 src={require('../../../Images/duplicate.png')}
                                                 onClick={onRuleChainItemDuplicate}
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
        </div>
    )
};

class NewRuleChainUI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isRuleConfigEdit: true,
            isRuleConfigUpdate: false,
            isRuleChainUpdate: false,
            isRuleChainEdit: false,
            ruleChainList: [],
            ruleConfigId: 8,
            ruleChainId: 0,
            parameterOptions: [],//new
            ruleConfigForm: JSON.parse(JSON.stringify(defaultRuleConfigForm)),//new
            ruleChainForm: JSON.parse(JSON.stringify(defaultRuleChainForm)),//new
            ruleConfigList: [],//new
            isAddUpdateRuleConfigDisabled: true,//new
            isRuleConfigTableVisible: true,//new
            isAddUpdateRuleChainDisabled: true,//new
            isRuleChainTableVisible: true,
            parametersObj: {},
            prefillSelectedValue: {value: 'NormalRange', label: 'Normal Range'},
            selectedTab: "RuleChain",
            ruleConfigNameForTable: "",
            ruleConfigDescriptionForTable: "",
            ruleConfigListTable: []
        }
    }

    componentDidMount() {
        getAllRuleConfigs(this.onGetAllRuleConfigsSuccess, this.onGetAllRuleConfigsFailure);
        this.getParametersAndShowRuleConfigFormUI(
            (res) => {
                if (res.status === 200 ) {
                    const parametersObj = res.data;
                    let parameterOptions = [];
                    debugger
                    for (let key in parametersObj) {
                        parameterOptions.push({
                            value: parametersObj[key]["name"],
                            label: parametersObj[key]["name"]
                        });
                    }
                    this.setState({
                        parameterOptions,
                        loading: false,
                        parametersObj
                    })
                }
            }
        )
        getAllRuleChains(this.onGetAllRuleChainSuccess, this.onGetAllRuleChainFailure);
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
        const ruleConfigList = Object.entries(response.data).map(([key, obj]) => {
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
                    }
                };
                return Object.assign({
                    uId: key,
                    ...ruleConfigObject
                })
            }
        });
        const {ruleConfigDescriptionForTable, ruleConfigNameForTable} = this.state;
        const ruleConfigListTable = ruleConfigList.filter((ruleConfig) => {
            return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase()) !== -1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase()) !== -1
        });
        this.setState({
            ruleConfigList,
            ruleConfigListTable,
            isRuleConfigTableVisible: true,
            loading: false
        })
    };
    onGetAllRuleConfigsFailure = (error) => {
        //console.log(error);
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
        createRuleConfig(this.onCreateRuleConfigSuccess, this.onCreateRuleConfigFailure, payload)
    };
    onCreateRuleConfigSuccess = (res) => {
        debugger
        if (res.status === 200 ) {
            let ruleConfigForm = {...this.state.ruleConfigForm};
            ruleConfigForm.ruleConfigId = res.data;
            let ruleConfigList = [...this.state.ruleConfigList, ruleConfigForm];

            let ruleChainForm = {...this.state.ruleChainForm};
            let isAddUpdateRuleChainDisabled = this.state.isAddUpdateRuleChainDisabled;
            let isAddUpdateRuleConfigDisabled = true;
            let isRuleConfigTableVisible = true;

            if (this.state.selectedTab === "RuleChain") {
                ruleChainForm.ruleConfigs = [...ruleChainForm.ruleConfigs, {
                    value: ruleConfigForm.ruleConfigId,
                    label: ruleConfigForm.ruleConfigName,
                    description: ruleConfigForm.ruleConfigDescription
                }];
                isAddUpdateRuleConfigDisabled = this.state.isAddUpdateRuleConfigDisabled;
                isRuleConfigTableVisible = this.state.isRuleConfigTableVisible;
                isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(ruleChainForm);
            }
            const {ruleConfigDescriptionForTable, ruleConfigNameForTable} = this.state;
            const ruleConfigListTable = ruleConfigList.filter((ruleConfig) => {
                return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase()) !== -1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase()) !== -1
            });
            this.setState({
                loading: false,
                ruleConfigForm: JSON.parse(JSON.stringify(defaultRuleConfigForm)),
                isAddUpdateRuleConfigDisabled,
                isRuleConfigTableVisible,
                ruleConfigList,
                ruleConfigListTable,
                ruleChainForm,
                isAddUpdateRuleChainDisabled
            })
        }
    };
    onCreateRuleConfigFailure = (err) => {
        this.setState({
            loading: false
        });
        //.log(err)
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
            const {ruleConfigDescriptionForTable, ruleConfigNameForTable} = this.state;
            const ruleConfigListTable = ruleConfigList.filter((ruleConfig) => {
                return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase()) !== -1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase()) !== -1
            });
            this.setState({
                // ruleConfigForm: {...defaultRuleConfigForm},
                loading: false,
                ruleConfigList,
                ruleConfigListTable,
                isAddUpdateRuleConfigDisabled: true,
                isRuleConfigTableVisible: true
            })
        }
    };
    onUpdateRuleConfigFailure = (err) => {
        //console.log(err);
        this.setState({
            loading: false
        });
    };

    /**
     *
     * **/
    getParametersAndShowRuleConfigFormUI = (onGetParametersSuccessCallback) => {
        this.setState({
            loading: true
        });
        getAllParametersOnlyNames(onGetParametersSuccessCallback, (error) => {
           // console.log(error);
            this.setState({
                loading: false
            })
        })
    }


    /**
     * RULE CHAIN
     * rule chain apis hits
     * **/
    getRuleChainList = (selectedTab) => {
        this.setState({
            loading: true,
            selectedTab,
            ruleConfigForm: JSON.parse(JSON.stringify(defaultRuleConfigForm))
        });
        getAllRuleChains(this.onGetAllRuleChainSuccess, this.onGetAllRuleChainFailure);
    };
    onGetAllRuleChainSuccess = (response) => {
        debugger
        const ruleChainList = Object.entries(response.data).map(([key, obj]) => {
            {

                debugger
                let ruleConfigs = [];
                // const ruleConfigs = obj.rules;
                // const rules = obj.rules;
                /*for(let rIndex=0; rIndex<rules.length; rIndex++) {
                    const currentValue = rules[rIndex];
                    ruleConfigs.push({
                        value: currentValue,
                        label: currentValue
                    })
                }*/
                debugger
                console.log(this.state.ruleConfigList);
                const ruleConfigList = this.state.ruleConfigList;
                for (let rcIndex = 0; rcIndex < ruleConfigList.length; rcIndex++) {
                    const currentConfig = ruleConfigList[rcIndex];
                    if (obj.rules.indexOf(currentConfig.uId) > -1) {
                        ruleConfigs.push({
                            value: currentConfig.uId,
                            label: currentConfig.ruleConfigName,
                            description: currentConfig.ruleConfigDescription
                        })
                    }
                    if (obj.rules.length === ruleConfigs.length) {
                        break;
                    }
                }


                const periodicity = obj.evaluationMethod.periodicity;
                const noOfOccurrences = obj.evaluationMethod.noOfOccurrences;
                const ruleChainObject = {
                    loading: false,
                    ruleChainId: key,
                    ruleChainName: obj.name,
                    ruleChainDescription: obj.description,
                    "ruleConfig": "",
                    frequency: periodicity.value,
                    frequencyUnit: periodicity.unit,
                    isNumberOfOccurrencesChecked: noOfOccurrences.isChecked,
                    numberOfOccurrences: noOfOccurrences.value,
                    ruleConfigs,
                    isAdvanceOptionsChecked: obj.hasOwnProperty('isAdvanceOptionsChecked') ? obj.isAdvanceOptionsChecked : false,
                    advanceOptionValue: obj.advanceOptionValue,
                    advanceOptionUnit: obj.advanceOptionUnit
                };

                return Object.assign({
                    uId: key,
                    ...ruleChainObject
                })
            }
        }).reverse();
        this.setState({
            ruleChainList,
            loading: false,
            isRuleChainTableVisible: true
        })
    };
    onGetAllRuleChainFailure = (error) => {
        console.log(error);
        this.setState({
            loading: false
        })
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
            isAdvanceOptionsChecked,
            advanceOptionValue,
            advanceOptionUnit,
        } = this.state.ruleChainForm;
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
            isAdvanceOptionsChecked,
            advanceOptionValue,
            advanceOptionUnit
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
        createRuleChain(this.onCreateRuleChainSuccess, this.onCreateRuleChainFailure, payload)
    };
    onCreateRuleChainSuccess = (res) => {
        if (res.status === 200 ) {
            const ruleChainId = res.data;
            let ruleChainForm = {...this.state.ruleChainForm};
            ruleChainForm.ruleChainId = ruleChainId;
            let ruleChainList = [ruleChainForm, ...this.state.ruleChainList];
            this.setState({
                loading: false,
                ruleChainForm: {...defaultRuleChainForm},
                isAddUpdateRuleChainDisabled: true,
                isRuleChainTableVisible: true,
                ruleChainList,
                ruleChainId
            })
        }
    };
    onCreateRuleChainFailure = (err) => {
        console.log(err);
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
        this.setState({
            loading: true
        });
        updateRuleChain(this.onUpdateRuleChainSuccess, this.onUpdateRuleChainFailure, payload)
    };
    onUpdateRuleChainSuccess = (res) => {
        if (res.status === 200 ) {
            const ruleChainForm = {...this.state.ruleChainForm};
            let ruleChainList = [...this.state.ruleChainList];
            const ruleChainId = ruleChainForm.ruleChainId;
            for (let rbIndex = 0; rbIndex < ruleChainList.length; rbIndex++) {
                const ruleChainItem = {...ruleChainList[rbIndex]};
                if (ruleChainId === ruleChainItem.ruleChainId) {
                    ruleChainList[rbIndex] = ruleChainForm;
                    break;
                }
            }
            this.setState({
                // ruleChainForm: {...defaultRuleChainForm},
                loading: false,
                ruleChainList,
                isAddUpdateRuleChainDisabled: true,
                isRuleChainTableVisible: true
            })
        }
    };
    onUpdateRuleChainFailure = (err) => {
        console.log(err);
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
                    ruleConfigForm[key][dataset.inputname] = event.target.value;
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
            ruleConfigForm[key] = event.target.value;
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
        debugger
        let configForm = {...this.state.ruleConfigForm};
        const parametersObj = this.state.parametersObj;
        if (Object.keys(configForm.selectedParameters).length !== 0) {
            let parameter = {};
            for (let key in parametersObj) {
                if (parametersObj[key]["name"] === configForm.selectedParameters.value) {
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
                    debugger
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
     * Rule Config Table Functions
     * **/
    onRuleConfigItemEdit = (event) => {
        debugger
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
            isRuleConfigTableVisible: false,
            isAddUpdateRuleConfigDisabled: false
        });
    };
    onRuleConfigItemDuplicate = (event) => {
        debugger
        const ruleConfigId = typeof (event) === "string" ? event : event.target.dataset.ruleconfigid;
        const ruleConfigList = [...this.state.ruleConfigList];
        let ruleConfigForm = {};
        for (let rbIndex = 0; rbIndex < ruleConfigList.length; rbIndex++) {
            const ruleConfigItem = ruleConfigList[rbIndex];
            if (ruleConfigId === ruleConfigItem.ruleConfigId) {
                debugger
                ruleConfigForm = JSON.parse(JSON.stringify(ruleConfigList[rbIndex]));
                ruleConfigForm.ruleConfigId = -1;
                ruleConfigForm.ruleConfigName = `copy ${ruleConfigForm.ruleConfigName}`;
                break;
            }
        }

        this.setState({
            loading: false,
            ruleConfigForm,
            isRuleConfigTableVisible: false,
            isAddUpdateRuleConfigDisabled: false
        });
    };
    onRuleConfigItemDelete = (event) => {
        const ruleConfigId = parseInt(event.target.dataset.ruleconfigid);
        const oldruleConfigList = [...this.state.ruleConfigList];
        const ruleConfigList = oldruleConfigList.filter((ruleConfigItem) => ruleConfigId !== ruleConfigItem.ruleConfigId);

        this.setState({
            ruleConfigList
        })
    };
    onAddNewRuleConfigClick = () => {
        this.setState({
            ruleConfigForm: JSON.parse(JSON.stringify(defaultRuleConfigForm)),
            isRuleConfigTableVisible: false
        });
    };
    toggleRuleConfigTableUI = () => {
        this.setState({
            isRuleConfigTableVisible: !this.state.isRuleConfigTableVisible
        })
    };

    /***
     * New Rule Chain form functions
     * **/
    getIsAddUpdateRuleChainDisabled = (ruleChainForm) => {
        debugger
        let isAddUpdateRuleChainDisabled = false;
        for (let key in ruleChainForm) {
            if (!isAddUpdateRuleChainDisabled && !(key === "numberOfOccurrences" || key === "advanceOptionUnit" || key === "advanceOptionValue")) {
                const ruleChainFormItem = ruleChainForm[key];
                if ("isNumberOfOccurrencesChecked" === key) {
                    if (ruleChainForm.isNumberOfOccurrencesChecked) {
                        isAddUpdateRuleChainDisabled = ruleChainForm.numberOfOccurrences === "";
                    }
                } else if ("ruleConfig" === key) {
                    isAddUpdateRuleChainDisabled = !ruleChainForm.ruleConfigs || (ruleChainForm.ruleConfigs && ruleChainForm.ruleConfigs.length === 0);
                } else if ("isAdvanceOptionsChecked" === key) {
                    debugger
                    if (ruleChainFormItem) {
                        isAddUpdateRuleChainDisabled = ruleChainForm.advanceOptionValue === "" || ruleChainForm.advanceOptionUnit === "";
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
        if (key === "isNumberOfOccurrencesChecked") {
            ruleChainForm.isNumberOfOccurrencesChecked = event.target.checked;
            ruleChainForm.numberOfOccurrences = "";
        } else if (key === "isAdvanceOptionsChecked") {
            ruleChainForm.isAdvanceOptionsChecked = event.target.checked;
            ruleChainForm.advanceOptionValue = "";
            ruleChainForm.advanceOptionUnit = "Probability";
        } else if (key === "conditionDropdown") {
            ruleChainForm[dataset.dropdownname] = event.target.value;
        } else {
            ruleChainForm[key] = event.target.value;
        }
        const isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(ruleChainForm);
        this.setState({
            ruleChainForm,
            isAddUpdateRuleChainDisabled
        })
    };
    onRuleConfigsDropdownChange = (selectedValue) => {
        debugger
        let ruleChainForm = {...this.state.ruleChainForm};
        ruleChainForm.ruleConfigs = selectedValue === null ? [] : selectedValue;
        const isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(ruleChainForm);
        this.setState({
            ruleChainForm,
            isAddUpdateRuleChainDisabled
        });
    };
    onRuleConfigTableCheckboxChecked = ({isChecked, ruleObject}) => {
        debugger
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
    onCancelRuleChainClick = () => {
        this.toggleRuleChainTableUI();
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
        debugger
        const key = event.target.dataset.key;
        let {ruleConfigNameForTable, ruleConfigDescriptionForTable} = this.state;
        if (key === "ruleConfigNameForTable") {
            ruleConfigNameForTable = event.target.value;
        } else if (key === "ruleConfigDescriptionForTable") {
            ruleConfigDescriptionForTable = event.target.value;
        }

        let ruleConfigListTable = [...this.state.ruleConfigList];
        ruleConfigListTable = ruleConfigListTable.filter((ruleConfig) => {
            return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase()) !== -1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase()) !== -1
        });
        this.setState({
            ruleConfigNameForTable,
            ruleConfigDescriptionForTable,
            ruleConfigListTable
        })
    };


    /**
     * Rule Chain Table Functions
     * **/
    onRuleChainItemEdit = (event) => {
        const ruleChainId = event.target.dataset.rulechainid;
        const ruleChainList = [...this.state.ruleChainList];
        let ruleChainForm = {};
        for (let rbIndex = 0; rbIndex < ruleChainList.length; rbIndex++) {
            const ruleChainItem = ruleChainList[rbIndex];
            if (ruleChainId === ruleChainItem.ruleChainId) {
                ruleChainForm = ruleChainList[rbIndex];
                break;
            }
        }

        this.setState({
            ruleChainForm,
            isRuleChainTableVisible: false
        })
    };
    onRuleChainItemDuplicate = (event) => {
        debugger
        const ruleChainId = event.target.dataset.rulechainid;
        const ruleChainList = [...this.state.ruleChainList];
        let ruleChainForm = {};
        for (let rbIndex = 0; rbIndex < ruleChainList.length; rbIndex++) {
            const ruleChainItem = ruleChainList[rbIndex];
            if (ruleChainId === ruleChainItem.ruleChainId) {
                ruleChainForm = JSON.parse(JSON.stringify(ruleChainList[rbIndex]));
                ruleChainForm.uId = -1;
                ruleChainForm.ruleChainId = -1;
                ruleChainForm.ruleChainName = "copy " + ruleChainForm.ruleChainName;
                debugger
                break;
            }
        }

        this.setState({
            ruleChainForm,
            isRuleChainTableVisible: false,
            isAddUpdateRuleChainDisabled: false
        })
    };
    onRuleChainItemDelete = (event) => {
        const ruleChainId = parseInt(event.target.dataset.rulechainid);
        const oldRuleChainList = [...this.state.ruleChainList];
        const ruleChainList = oldRuleChainList.filter((ruleChainItem) => ruleChainId !== ruleChainItem.ruleChainId);

        this.setState({
            ruleChainList
        })
    };
    onAddNewRuleChainClick = () => {
        this.setState({
            ruleChainForm: {...defaultRuleChainForm},
            isRuleChainTableVisible: false
        })
    };
    toggleRuleChainTableUI = () => {
        this.setState({
            isRuleChainTableVisible: !this.state.isRuleChainTableVisible
        })
    };

    onRuleRuleConfigTabSelect = (selectedTab) => {
        if (selectedTab === "RuleConfig") {
            this.setState({
                loading: true,
                selectedTab
            });
            getAllRuleConfigs(this.onGetAllRuleConfigsSuccess, this.onGetAllRuleConfigsFailure);
            /*this.setState({
                isRuleConfigTableVisible: true
            }, () => {alert("RuleConfig")});*/
        } else if (selectedTab === "RuleChain") {
            this.getRuleChainList(selectedTab)
        }
    };

    render() {
        const {
            loading,
            parameterOptions,
            ruleConfigForm,
            ruleConfigList,
            isAddUpdateRuleConfigDisabled,
            isRuleConfigTableVisible,
            ruleChainForm,
            isRuleChainUpdate,
            isRuleChainEdit,
            isAddUpdateRuleChainDisabled,
            isRuleChainTableVisible,
            ruleChainList,
            ruleConfigNameForTable,
            ruleConfigDescriptionForTable,
            ruleConfigListTable
        } = this.state;

        return (
            <div>
                <SmartShipLoader isVisible={loading}/>
                {
                    isRuleChainTableVisible
                        ? (<RuleChainTableUI
                            ruleChainList={ruleChainList}
                            onRuleChainItemEdit={this.onRuleChainItemEdit}
                            onRuleChainItemDuplicate={this.onRuleChainItemDuplicate}
                            onRuleChainItemDelete={this.onRuleChainItemDelete}
                            onAddNewRuleChainClick={this.onAddNewRuleChainClick}
                        />)
                        : (<NewRuleChainForm
                            ruleConfigList={ruleConfigList}
                            ruleChainForm={ruleChainForm}
                            isRuleChainUpdate={isRuleChainUpdate}
                            isRuleChainEdit={isRuleChainEdit}
                            isAddUpdateRuleChainDisabled={isAddUpdateRuleChainDisabled}
                            isRuleChainTableVisible={isRuleChainTableVisible}
                            parameterOptions={parameterOptions}
                            ruleConfigForm={ruleConfigForm}
                            ruleConfigNameForTable={ruleConfigNameForTable}
                            ruleConfigDescriptionForTable={ruleConfigDescriptionForTable}
                            ruleConfigListTable={ruleConfigListTable}
                            isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                            onRuleConfigItemEdit={this.onRuleConfigItemEdit}
                            onRuleConfigItemDuplicate={this.onRuleConfigItemDuplicate}
                            onRuleChainFormItemValueChange={this.onRuleChainFormItemValueChange}
                            onRuleConfigsDropdownChange={this.onRuleConfigsDropdownChange}
                            onRuleConfigTableCheckboxChecked={this.onRuleConfigTableCheckboxChecked}
                            onAddRuleChainClick={this.onAddRuleChainClick}
                            onCancelRuleChainClick={this.onCancelRuleChainClick}
                            onUpdateRuleChainClick={this.onUpdateRuleChainClick}
                            onRuleConfigFormItemValueChange={this.onRuleConfigFormItemValueChange}
                            onParameterDropdownChange={this.onParameterDropdownChange}
                            onAddRuleConfigClick={this.onAddRuleConfigClick}
                            onUpdateRuleConfigClick={this.onUpdateRuleConfigClick}
                            onCancelRuleConfigClick={this.onCancelRuleConfigClick}
                            onPrefieldValueChange={this.onPrefieldValueChange}
                            onModalShow={this.onModalShow}
                            onModalHide={this.onModalHide}
                            onTableSearchInputChange={this.onTableSearchInputChange}
                        />)
                }
            </div>
        )
    }
};

export default NewRuleChainUI;


