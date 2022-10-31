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
} from "../../../api";
import SmartShipLoader from "./SmartShipLoader";
import CustomTooltip from "../custom/CustomTooltip";
import CustomAddEditRuleModal from "../custom/CustomAddEditRuleModal";
import {prefieldOptions, comparisonOptions} from "../Constants";
import {blue} from "color-name";
import CustomRuleTable from "../custom/CustomRuleTable";
import saveIcon from '../../Images/downloadedImages/save.png';
import addIcon from '../../Images/downloadedImages/add.png';
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

const RuleChainFormUI = ({
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
    if(ruleChainForm.ruleConfigs) {
        for(let rckIndex=0;rckIndex<ruleChainForm.ruleConfigs.length;rckIndex++) {
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
                            <Form.Group size="sm" as={Col} >
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
                            <Form.Group size="sm" as={Col} >
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
                            <Form.Group size="sm" as={Col} >
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
                            <Form.Group size="sm" as={Col} >
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
                            <Form.Group size="sm" as={Col} >
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
                            <Form.Group size="sm" as={Col} >
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

const RuleConfigFormUI = ({
                             parameterOptions,
                             ruleConfigForm,
                             isAddUpdateRuleConfigDisabled,
                             onRuleConfigFormItemValueChange,
                             onParameterDropdownChange,
                              onPrefieldValueChange,
                             onAddRuleConfigClick,
                             onUpdateRuleConfigClick,
                             onCancelRuleConfigClick,
                         }) => {
    let selectedParametersArr = Object.keys(ruleConfigForm.selectedParameters).length === 0 ? null : ruleConfigForm.selectedParameters;
    let selectedPrefillArr =       {value: 'NormalRange', label: 'Normal Range'};

    return (
        <div>
            {/*{JSON.stringify(ruleConfigForm.selectedParameters)}*/}
            <Container>
                <Row ld={8} md={8} xs={8}>
                <div id="parametersUI">
                        <div className="cardHeader">
                            Rule
                        </div>
                        <div style={{
                            width: "100%",
                            paddingTop: 15,
                            paddingRight: 15,
                            paddingLeft: 15,
                            paddingBottom: 0
                        }}>
                            <Form>
                                {/*{JSON.stringify(ruleChainForm)}*/}
                                <Row>
                                    <Form.Group size="sm" as={Col} >
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            placeholder="Name"
                                            data-key="ruleConfigName"
                                            // data-ruleconfigid={ruleIndex}
                                            onChange={onRuleConfigFormItemValueChange}
                                            value={ruleConfigForm["ruleConfigName"]}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                    <Form.Group size="sm" as={Col} >
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            placeholder="Description"
                                            data-key="ruleConfigDescription"
                                            // data-ruleconfigid={ruleIndex}
                                            onChange={onRuleConfigFormItemValueChange}
                                            value={ruleConfigForm["ruleConfigDescription"]}
                                            autoComplete="off"
                                        />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group size="sm" as={Col} >
                                        <Form.Label>Parameter</Form.Label>
                                        {
                                            // JSON.stringify(ruleConfigForm.selectedParameters)
                                        }
                                        <Select
                                            options={parameterOptions}
                                            data-key="parameters"
                                            key={`${ruleConfigForm.ruleConfigId}-${ruleConfigForm.selectedParameters.id}`}
                                            data-ruleconfigid={`${ruleConfigForm.ruleConfigId}-${ruleConfigForm.selectedParameters.id}`}
                                            onChange={onParameterDropdownChange}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            defaultValue={selectedParametersArr}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group size="sm" as={Col} >
                                        <Form.Label>Prefill</Form.Label>
                                        <Select
                                            options={prefieldOptions}
                                            data-key="parameters"
                                            key={`${ruleConfigForm.ruleConfigId}-${ruleConfigForm.selectedParameters.id}`}
                                            data-ruleconfigid={`${ruleConfigForm.ruleConfigId}-${ruleConfigForm.selectedParameters.id}`}
                                            onChange={onPrefieldValueChange}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            defaultValue={selectedPrefillArr}
                                        />
                                    </Form.Group>
                                        </Row>
                                <Row>
                                    <Form.Group size="sm" as={Col} >
                                        <Form.Label>Condition</Form.Label>
                                        <div>
                                            <div key={`inline-radio`} style={{whiteSpace: "nowrap"}}>
                                                <Form.Check
                                                    name={`conditionRadio`} inline
                                                    label="Range"
                                                    type="radio"
                                                    id={`condition-inline-radio-1`}
                                                    data-key="conditionRadio"
                                                    data-radioname="range"
                                                    checked={ruleConfigForm.conditionRadio === 'range'}
                                                    // data-ruleconfigid={ruleIndex}
                                                    onChange={onRuleConfigFormItemValueChange}
                                                />
                                                <Form.Check
                                                    name={`conditionRadio`} inline
                                                    label="Single Value"
                                                    type="radio"
                                                    id={`condition-inline-radio-2`}
                                                    data-key="conditionRadio"
                                                    data-radioname="singleValue"
                                                    checked={ruleConfigForm.conditionRadio === 'singleValue'}
                                                    // data-ruleconfigid={ruleIndex}
                                                    onChange={onRuleConfigFormItemValueChange}
                                                />
                                                {/*<Form.Check
                                                    name={`conditionRadio`} inline
                                                    label="Calculated"
                                                    type="radio"
                                                    id={`condition-inline-radio-3`}
                                                    data-key="conditionRadio"
                                                    data-radioname="calculated"
                                                    checked={ruleConfigForm.conditionRadio === 'calculated'}
                                                    // data-ruleconfigid={ruleIndex}
                                                    onChange={onRuleConfigFormItemValueChange}
                                                />*/}
                                                <Form.Check
                                                    name={`conditionRadio`} inline
                                                    label="Enumerate"
                                                    type="radio"
                                                    id={`condition-inline-radio-4`}
                                                    data-key="conditionRadio"
                                                    data-radioname="enumerate"
                                                    checked={ruleConfigForm.conditionRadio === 'enumerate'}
                                                    // data-ruleconfigid={ruleIndex}
                                                    onChange={onRuleConfigFormItemValueChange}
                                                />
                                            </div>
                                            {
                                                (
                                                    ruleConfigForm.conditionRadio === 'range' && (
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "row"
                                                        }}>
                                                            <Form.Control
                                                                as="select"
                                                                value={ruleConfigForm["fromCondition"]}
                                                                data-key="conditionDropdown"
                                                                data-dropdownname="fromCondition"
                                                                onChange={onRuleConfigFormItemValueChange}
                                                                style={{
                                                                    marginRight: 20,
                                                                    width: 65
                                                                }}
                                                            >
                                                                {
                                                                    comparisonOptions.map((opt, index) => {
                                                                        return (
                                                                            <option
                                                                                key={`comp-1-${index}`}>{opt.label}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </Form.Control>
                                                            <Form.Control
                                                                placeholder="From"
                                                                data-key="from"
                                                                data-inputname="from"
                                                                value={ruleConfigForm["from"]}
                                                                // data-ruleconfigid={ruleIndex}
                                                                onChange={onRuleConfigFormItemValueChange}
                                                                autoComplete="off"
                                                                style={{
                                                                    marginRight: 15
                                                                }}
                                                            />
                                                            <Form.Control
                                                                as="select"
                                                                value={ruleConfigForm["toCondition"]}
                                                                // data-key={`${rangeKey}-dropdown`}
                                                                data-key="conditionDropdown"
                                                                data-dropdownname="toCondition"
                                                                onChange={onRuleConfigFormItemValueChange}
                                                                style={{
                                                                    marginLeft: 20,
                                                                    marginRight: 20,
                                                                    width: 65
                                                                }}
                                                            >
                                                                {
                                                                    comparisonOptions.map((opt, index) => {
                                                                        return (
                                                                            <option key={`compOpt-${index}`}>{opt.label}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </Form.Control>
                                                            <Form.Control
                                                                placeholder="To"
                                                                data-key="to"
                                                                data-inputname="to"
                                                                value={ruleConfigForm["to"]}
                                                                // data-ruleconfigid={ruleIndex}
                                                                onChange={onRuleConfigFormItemValueChange}
                                                                autoComplete="off"
                                                                // style={{marginLeft: 10}}
                                                            />
                                                        </div>
                                                    ) ||
                                                    (
                                                        ruleConfigForm.conditionRadio === 'singleValue' && (
                                                            <div style={{
                                                                display: "flex",
                                                                flexDirection: "row"
                                                            }}>
                                                                <Form.Control
                                                                    as="select"
                                                                    value={ruleConfigForm["singleValueCondition"]}
                                                                    // data-key={`${rangeKey}-dropdown`}
                                                                    data-key="conditionDropdown"
                                                                    data-dropdownname="singleValueCondition"
                                                                    onChange={onRuleConfigFormItemValueChange}
                                                                    style={{
                                                                        marginRight: 20,
                                                                        width: 65
                                                                    }}
                                                                >
                                                                    {
                                                                        comparisonOptions.map((opt, cpoIndex) => {
                                                                            return (
                                                                                <option key={`cpoIndex-${cpoIndex}`}>{opt.label}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Form.Control>
                                                                <Form.Control
                                                                    placeholder="Value"
                                                                    data-key="singleValue"
                                                                    data-inputname="singleValue"
                                                                    value={ruleConfigForm["singleValue"]}
                                                                    // data-ruleconfigid={ruleIndex}
                                                                    onChange={onRuleConfigFormItemValueChange}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                        )
                                                    ) ||
                                                    /*(
                                                        ruleConfigForm.conditionRadio === 'calculated' && (
                                                            <Form.Control
                                                                placeholder="Expression"
                                                                data-key="calculatedExpression"
                                                                data-inputname="calculatedExpression"
                                                                value={ruleConfigForm["calculatedExpression"]}
                                                                onChange={onRuleConfigFormItemValueChange}
                                                                autoComplete="off"
                                                            />
                                                        )
                                                    ) ||*/
                                                    (
                                                        ruleConfigForm.conditionRadio === 'enumerate' && (
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
                                                                        value={ruleConfigForm["enumeratedValue"].currentValue}
                                                                        onChange={onRuleConfigFormItemValueChange}
                                                                        autoComplete="off"
                                                                    />
                                                                    {
                                                                        ruleConfigForm["enumeratedValue"].enumeratedValueId === -1
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
                                                                                         onClick={onRuleConfigFormItemValueChange}
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
                                                                                             onClick={onRuleConfigFormItemValueChange}
                                                                                        />
                                                                                    </div>),
                                                                                    (<div
                                                                                        style={{
                                                                                            display: "flex",
                                                                                            justifyContent: "center",
                                                                                            alignItems: "center",
                                                                                            padding: 10,
                                                                                            border: "1px  solid #ced4d9",
                                                                                            maxHeight: 37
                                                                                        }}
                                                                                        title={"Delete"}
                                                                                    >
                                                                                        <img style={{
                                                                                            width: 18,
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                             alt="Delete"
                                                                                             src={require('../../Images/delete.png')}
                                                                                             data-buttonname="delete"
                                                                                             data-key="enumeratedValue"
                                                                                             onClick={onRuleConfigFormItemValueChange}
                                                                                        />
                                                                                    </div>)
                                                                                ]
                                                                            )
                                                                    }
                                                                    <Form.Control
                                                                        as="select"
                                                                        value={ruleConfigForm["enumeratedValue"].selectedListValue}
                                                                        data-dropdownname="selectedListValue"
                                                                        data-key="enumeratedValue"
                                                                        onChange={onRuleConfigFormItemValueChange}
                                                                        style={{marginLeft: 10}}
                                                                        disabled={ruleConfigForm["enumeratedValue"].list.length === 1}
                                                                    >
                                                                        {
                                                                            ruleConfigForm["enumeratedValue"].list.map((opt,rcfIndex) => {
                                                                                return (
                                                                                    <option
                                                                                        key={`rcfIndex-${rcfIndex}`}
                                                                                        data-l={opt}>{opt}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Form.Control>
                                                                </Form.Group>
                                                            </Row>
                                                        )
                                                    )
                                                )
                                            }
                                        </div>
                                    </Form.Group>
                                </Row>
                                <Row style={{
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    {/*{
                                        JSON.stringify(ruleConfigForm.ruleConfigId)
                                    }*/}
                                    {
                                        (
                                            ruleConfigForm.ruleConfigId === -1 && (
                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button"
                                                    onClick={onAddRuleConfigClick}
                                                    variant="outline-secondary"
                                                    disabled={isAddUpdateRuleConfigDisabled}
                                                >
                                                    Add
                                                </Button>
                                            )
                                        )
                                        || (
                                            <Button
                                                size="sm"
                                                className="parameter-add-button"
                                                onClick={onUpdateRuleConfigClick}
                                                variant="outline-secondary"
                                                disabled={isAddUpdateRuleConfigDisabled}
                                            >
                                                Update
                                            </Button>
                                        )
                                    }
                                    <Button
                                        size="sm"
                                        className="parameter-header-button"
                                        onClick={onCancelRuleConfigClick}
                                        variant="outline-secondary">
                                        Cancel
                                    </Button>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </Row>
            </Container>
        </div>)
};

const RuleChainTableUI = ({
                              ruleChainList,
                              onRuleChainItemEdit,
                              onRuleChainItemDuplicate,
                              onRuleChainItemDelete,
                              onAddNewRuleChainClick,
                          }) => {
    return (
        <Container>
            <Row ld={8} md={8} xs={8}>
                <div style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "black",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 10,
                    maxWidth: 880,
                    margin: "0px auto",
                    paddingBottom: 10
                }}>
                    <Button className="SM-button" onClick={onAddNewRuleChainClick}
                            variant="outline-secondary">
                        <img
                            alt=""
                            width={16}
                            src={require('../../Images/plus.png')}
                            style={{marginRight: 6}}
                        />
                        Add Rule Block
                    </Button>
                </div>
                {/*{JSON.stringify(ruleChainList)}*/}
                <Table style={{maxWidth: 880, margin: "0px auto"}} striped bordered hover size="sm">
                    <thead>
                    <tr>
                        {/*<th>#</th>*/}
                        {/*<th>Id</th>*/}
                        <th>Name</th>
                        <th>Description</th>
                        {/*<th>Rule Chain Name</th>*/}
                        <th>Rules</th>
                        <th>Periodicity</th>
                        <th>Number of Occurrence</th>
                        {/*<th>Advance Option</th>*/}
                        <th>Action</th>
                        {/*<th>Delete</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        ruleChainList.map((ruleChainItem, index) => {
                            const ruleChainId = ruleChainItem.ruleChainId;
                            let selectedRuleConfigsArr = "";
                            for(let rIndex=0; rIndex<ruleChainItem.ruleConfigs.length; rIndex++) {
                                selectedRuleConfigsArr += `[${ruleChainItem.ruleConfigs[rIndex].label}] `;
                            }
                            /*for (let key in ruleChainItem.ruleConfigs) {
                                debugger
                                selectedRuleConfigsArr += `[${ruleChainItem.ruleConfigs[key].value}] `;
                            }*/
                            const advanceOptionText = ruleChainItem.advanceOptionValue &&  ruleChainItem.advanceOptionUnit
                                ? `${ruleChainItem.advanceOptionValue} [${ruleChainItem.advanceOptionUnit}]`
                                :"-";
                            return (
                                <tr key={`ruleChainRow${index}`}>
                                    <td>{ruleChainItem.ruleChainName}</td>
                                    <td>{ruleChainItem.ruleChainDescription}</td>
                                    <td>
                                        <div style={{display: "flex", flexDirection: "row", flexWrap:"wrap"}}>
                                            {
                                                ruleChainItem.ruleConfigs.map((ruleConfig, rcIndex) => {
                                                    return <div key={`rcTooltip-${rcIndex}`}>
                                                        <CustomTooltip
                                                            description={ruleConfig.description}
                                                            label={ruleConfig.label}
                                                        />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </td>
                                    <td>{`${ruleChainItem.frequency} ${ruleChainItem.frequencyUnit}`}</td>
                                    <td>
                                        {ruleChainItem.isNumberOfOccurrencesChecked ? ruleChainItem.numberOfOccurrences : "NA"}
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
                                                     src={require('../../Images/edit.png')}
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
                                                     src={require('../../Images/duplicate.png')}
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
            </Row>
        </Container>
    )
};

class RuleChainUI extends React.Component {
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
            parametersObj:{},
            prefillSelectedValue:{value: 'NormalRange', label: 'Normal Range'},
            selectedTab: "RuleChain",
            ruleConfigNameForTable: "",
            ruleConfigDescriptionForTable: "",
            ruleConfigListTable: []
        }
    }

    componentDidMount() {
        getAllRuleConfigs(this.onGetAllRuleConfigsSuccess,this.onGetAllRuleConfigsFailure);
        this.getParametersAndShowRuleConfigFormUI(
            (res) => {
                if(res.status === 200 ) {
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
                    uId:key,
                    ...ruleConfigObject})
            }
        });
        const {ruleConfigDescriptionForTable, ruleConfigNameForTable} = this.state;
        const ruleConfigListTable = ruleConfigList.filter((ruleConfig) => {
            return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase())!==-1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase())!==-1
        });
        this.setState({
            ruleConfigList,
            ruleConfigListTable,
            isRuleConfigTableVisible: true,
            loading: false
        })
    };
    onGetAllRuleConfigsFailure = (error) => {
       // console.log(error);
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
        createRuleConfig(this.onCreateRuleConfigSuccess,this.onCreateRuleConfigFailure, payload)
    };
    onCreateRuleConfigSuccess = (res) => {
        debugger
        if(res.status === 200 ) {
            let ruleConfigForm = {...this.state.ruleConfigForm};
            ruleConfigForm.ruleConfigId = res.data;
            let ruleConfigList = [...this.state.ruleConfigList, ruleConfigForm];

            let ruleChainForm = {...this.state.ruleChainForm};
            let isAddUpdateRuleChainDisabled = this.state.isAddUpdateRuleChainDisabled;
            let isAddUpdateRuleConfigDisabled = true;
            let isRuleConfigTableVisible = true;

            if(this.state.selectedTab === "RuleChain") {
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
                return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase())!==-1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase())!==-1
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
        //console.log(err)
    };

    /**
     * update
     * **/
    updateElement = () => {
        const ruleConfigId  = this.state.ruleConfigForm.ruleConfigId;
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
        if(res.status === 200 ) {
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
                return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase())!==-1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase())!==-1
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
            //console.log(error);
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
                //console.log(this.state.ruleConfigList);
                const ruleConfigList = this.state.ruleConfigList;
                for(let rcIndex=0; rcIndex<ruleConfigList.length; rcIndex++) {
                    const currentConfig = ruleConfigList[rcIndex];
                    if(obj.rules.indexOf(currentConfig.uId) > -1) {
                        ruleConfigs.push({
                            value: currentConfig.uId,
                            label: currentConfig.ruleConfigName,
                            description: currentConfig.ruleConfigDescription
                        })
                    }
                    if(obj.rules.length === ruleConfigs.length) {
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
                    advanceOptionValue:obj.advanceOptionValue,
                    advanceOptionUnit: obj.advanceOptionUnit
                };

                return Object.assign({
                    uId:key,
                    ...ruleChainObject})
            }
        }).reverse();
        this.setState({
            ruleChainList,
            loading: false,
            isRuleChainTableVisible: true
        })
    };
    onGetAllRuleChainFailure = (error) => {
        //console.log(error);
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
        createRuleChain(this.onCreateRuleChainSuccess,this.onCreateRuleChainFailure, payload)
    };
    onCreateRuleChainSuccess = (res) => {
        if(res.status === 200 ) {
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
        //console.log(err);
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
        if(res.status === 200 ) {
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
                    } else if(ruleConfigForm.conditionRadio === "enumerate") {
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
        },() =>{this.onPrefieldValueChange(this.state.prefillSelectedValue)});
    };
    onPrefieldValueChange = (selectedValue) =>{debugger
        let configForm = {...this.state.ruleConfigForm};
        const parametersObj = this.state.parametersObj;
        if(Object.keys(configForm.selectedParameters).length !== 0){
            let parameter = {};
            for(let key in parametersObj){
                if(parametersObj[key]["name"] === configForm.selectedParameters.value){
                    parameter = parametersObj[key];
                    break;
                }
            }
            if(selectedValue.value === "SpecifiedRange") {
                    if ( parameter.specifiedRange.isRange ) {
                        configForm.conditionRadio = "range";
                        configForm.from = parameter.specifiedRange.range.from;
                        configForm.to = parameter.specifiedRange.range.to;
                    } else if ( parameter.specifiedRange.isSingleValue ) {
                        configForm.conditionRadio = "singleValue";
                        configForm.singleValue = parameter.specifiedRange.singleValue.value;
                    }else if(parameter.specifiedRange.isCalculatedExpression){
                        configForm.conditionRadio = "calculated";
                        configForm.calculatedExpression = parameter.normalRange.calculatedExpression.expression;
                    }else if(parameter.enumeratedValue.isEnumeratedValue){
                        configForm.conditionRadio = "enumerate";
                        let list = ["-"];
                        list = [...list,...parameter.enumeratedValue.values];
                        configForm.enumeratedValue = {
                            isChecked: true,
                            enumeratedValueId: list.length,
                            currentValue: "",
                            selectedListValue: "",
                            list: list
                        }
                    }
            }else {
                    if(parameter.normalRange.isRange){
                        configForm.conditionRadio = "range";
                        configForm.from = parameter.normalRange.range.from;
                        configForm.to = parameter.normalRange.range.to;
                    }else if(parameter.normalRange.isSingleValue){
                        configForm.conditionRadio = "singleValue";
                        configForm.singleValue = parameter.normalRange.singleValue.value;
                    }else if(parameter.normalRange.isCalculatedExpression){
                        configForm.conditionRadio = "calculated";
                        configForm.calculatedExpression = parameter.normalRange.calculatedExpression.expression;
                    }else if(parameter.enumeratedValue.isEnumeratedValue){
                        configForm.conditionRadio = "enumerate";
                        let list = ["-"];
                        list = [...list,...parameter.enumeratedValue.values];
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
        this.setState({ruleConfigForm:configForm,isAddUpdateRuleConfigDisabled,prefillSelectedValue:selectedValue})
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
        const ruleConfigId = typeof(event) === "string" ? event : event.target.dataset.ruleconfigid;
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
        const ruleConfigId = typeof(event) === "string" ? event : event.target.dataset.ruleconfigid;
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
                    if(ruleChainFormItem) {
                        isAddUpdateRuleChainDisabled = ruleChainForm.advanceOptionValue==="" || ruleChainForm.advanceOptionUnit ==="";
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
            ruleChainForm.isAdvanceOptionsChecked= event.target.checked;
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
        ruleChainForm.ruleConfigs = selectedValue===null ? [] : selectedValue;
        const isAddUpdateRuleChainDisabled = this.getIsAddUpdateRuleChainDisabled(ruleChainForm);
        this.setState({
            ruleChainForm,
            isAddUpdateRuleChainDisabled
        });
    };
    onRuleConfigTableCheckboxChecked = ({isChecked, ruleObject}) => {
        debugger
        let ruleChainForm = {...this.state.ruleChainForm};
        if(isChecked) {
            //add
            ruleChainForm.ruleConfigs = [...ruleChainForm.ruleConfigs, {...ruleObject}];
        } else {
            //remove
            for(let rcIndex=0; rcIndex<ruleChainForm.ruleConfigs.length; rcIndex++) {
                if(ruleChainForm.ruleConfigs[rcIndex].value === ruleObject.value) {
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
        if(key === "ruleConfigNameForTable") {
            ruleConfigNameForTable = event.target.value;
        } else if(key === "ruleConfigDescriptionForTable") {
            ruleConfigDescriptionForTable = event.target.value;
        }

        let ruleConfigListTable = [...this.state.ruleConfigList];
        ruleConfigListTable = ruleConfigListTable.filter((ruleConfig) => {
            return ruleConfig.ruleConfigDescription.toLocaleLowerCase().indexOf(ruleConfigDescriptionForTable.toLocaleLowerCase())!==-1 && ruleConfig.ruleConfigName.toLocaleLowerCase().indexOf(ruleConfigNameForTable.toLocaleLowerCase())!==-1
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
        if(selectedTab === "RuleConfig") {
            this.setState({
                loading: true,
                selectedTab
            });
            getAllRuleConfigs(this.onGetAllRuleConfigsSuccess,this.onGetAllRuleConfigsFailure);
            /*this.setState({
                isRuleConfigTableVisible: true
            }, () => {alert("RuleConfig")});*/
        } else if(selectedTab === "RuleChain"){
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
                {/*{JSON.stringify(this.state.ruleConfigList)}*/}
                {/*{JSON.stringify(ruleConfigForm)}*/}
                <SmartShipLoader isVisible={loading} />
                {/*<Tabs
                    id="controlled-tab-example"
                    // activeKey={"RuleConfig"}//todo rule chain
                    // activeKey={"RuleChain"}//todo revert this
                    onSelect={this.onRuleRuleConfigTabSelect}
                >
                    <Tab eventKey="RuleConfig" title="Rule">
                        {
                            isRuleConfigTableVisible
                                ? (<RuleConfigTableUI
                                    ruleConfigList={ruleConfigList}
                                    onRuleConfigItemEdit={this.onRuleConfigItemEdit}
                                    onRuleConfigItemDelete={this.onRuleConfigItemDelete}
                                    onAddNewRuleConfigClick={this.onAddNewRuleConfigClick}
                                />)
                                : (<RuleConfigFormUI
                                    parameterOptions={parameterOptions}
                                    ruleConfigForm={ruleConfigForm}
                                    isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                                    onRuleConfigFormItemValueChange={this.onRuleConfigFormItemValueChange}
                                    onParameterDropdownChange={this.onParameterDropdownChange}
                                    onAddRuleConfigClick={this.onAddRuleConfigClick}
                                    onUpdateRuleConfigClick={this.onUpdateRuleConfigClick}
                                    onCancelRuleConfigClick={this.onCancelRuleConfigClick}
                                    onPrefieldValueChange={this.onPrefieldValueChange}
                                />)
                        }
                    </Tab>
                    <Tab eventKey="RuleChain" title="Rule Block">
                        {JSON.stringify(this.state.ruleChainList)}
                        {
                            isRuleChainTableVisible
                                ? (<RuleChainTableUI
                                    ruleChainList={ruleChainList}
                                    onRuleChainItemEdit={this.onRuleChainItemEdit}
                                    onRuleChainItemDelete={this.onRuleChainItemDelete}
                                    onAddNewRuleChainClick={this.onAddNewRuleChainClick}
                                />)
                                : (<RuleChainFormUI
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
                    </Tab>
                </Tabs>*/}
                {
                    isRuleChainTableVisible
                        ? (<RuleChainTableUI
                            ruleChainList={ruleChainList}
                            onRuleChainItemEdit={this.onRuleChainItemEdit}
                            onRuleChainItemDuplicate={this.onRuleChainItemDuplicate}
                            onRuleChainItemDelete={this.onRuleChainItemDelete}
                            onAddNewRuleChainClick={this.onAddNewRuleChainClick}
                        />)
                        : (<RuleChainFormUI
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

export default RuleChainUI;


