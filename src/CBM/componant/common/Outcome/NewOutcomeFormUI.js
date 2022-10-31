import React from "react";
import {Accordion, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Select from 'react-select';
import SmartShipLoader from "../SmartShipLoader";
import NavigationBar from "../NavigationBar";
import CreateAdvisoryModal from "./CreateAdvisoryModal";
import SMSidebar from "../../../../SMSidebar";
import addIcon from '../../../Images/downloadedImages/add.png';
import sortUpIcon from '../../../Images/downloadedImages/sort-up.png';
import sortDownIcon from '../../../Images/downloadedImages/sort-down.png';
import editIcon from '../../../Images/downloadedImages/edit.png';
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import {
    createCause,
    createFailureAdvisory,
    getAllRuleEngineDataByShip,
    getAllShips,
    saveConfigureUseCase,
    updateConfigureUseCase
} from "../../../../api"


const defaultDropdownValue = {
    value: "",
    label: ""
};
const defaultRuleChainObject = {
    condition: {
        value: "||",
        label: "OR"
    },
    ruleChain: {...defaultDropdownValue}
};
const defaultSelectedCondition = {
    value: "||",
    label: "OR"
};

let mapped = [];
let shipsList = [];
let selectedShip = ""
const defaultCauseList = [
    {
        cause: {...defaultDropdownValue},
        condition: {...defaultSelectedCondition},
        ruleChainArrList: [
            {
                isAccordionOpen: false,
                arr: [
                    {
                        condition: {...defaultSelectedCondition},
                        ruleChain: {...defaultDropdownValue}
                    }
                ]
            }
        ]
    }
];
const defaultCauseArrObject = {
    isAccordionOpen: true,
    condition: {...defaultSelectedCondition},
    causeList: [...defaultCauseList]
};
const defaultCauseArrObjectFromServer = {
    isAccordionOpen: true,
    condition: {...defaultSelectedCondition},
    causeList: []
};

const defaultConfigForm = {
    configId: -1,
    fa_alarm_radio: "alarm",
    failureAdvisory: null,
    causeArrList: [JSON.parse(JSON.stringify(defaultCauseArrObject))]
};
const defaultSelected = {
    causeArrIndex: 0,
    causeListIndex: 0
};
const conditionOptions = [
    {
        value: "||",
        label: "OR"
    },
    {
        value: "&&",
        label: "AND"
    }
];
const fa_alarm_text = {
    failure_advisory: "Failure",
    alarm: "Alarm",
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


const defaultCauseForm = {
    uId: "-1",
    name: "",
    description: "",
};

const defaultAdvisoryForm = {
    uId: "-1",
    fa_alarm_radio: "failure_advisory",//"alarm"
    name: "",
    description: "",
};

const RemoveButton = ({
                          onRemoveButtonClick,
                          isAccordionButton,
                          isCauseButton
                      }) => {
    const commonCss = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        border: "1px  solid #ced4d9",
        backgroundColor: "white",
        cursor: "pointer"
    }
    const accordionCss = {
        ...commonCss,
        maxHeight: 30,
        right: 16,
        margin: 4,
    };
    const normalCss = {
        ...commonCss,
        maxHeight: 35
    };
    const causeCss = {
        ...commonCss,
        maxHeight: 35
    };
    const joinCss = isAccordionButton
        ? accordionCss : isCauseButton
            ? causeCss : normalCss;
    return (
        <div inline="true"
             style={joinCss}
             title={"Delete"}
             onClick={onRemoveButtonClick}>
            <img style={{
                width: 18
            }}
                 alt="Delete"
                 src={require('../../../Images/delete.png')}
                 data-buttonname="remove"
                 data-key="enumeratedValue"
            />
        </div>
    );
};
const EditButton = ({
                        onClick
                    }) => {
    const commonCss = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        border: "1px  solid #ced4d9",
        backgroundColor: "white",
        maxHeight: 35,
    };
    return (
        <div
            inline="true"
            title="Edit"
            style={commonCss}>
            <img style={{
                width: 18,
                cursor: "pointer"
            }}
                 alt="Edit"
                 src={editIcon}
                 data-buttonname="remove"
                 data-key="enumeratedValue"
                 onClick={onClick}
            />
        </div>
    );
};

const AddButton = ({
                       isAccordionButton,
                       onAddButtonClick,
                       title
                   }) => {
    const accordionCss = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        border: "1px  solid #ced4d9",
        maxHeight: 30,
        margin: 4,
        backgroundColor: "white",
        right: 16
    };
    const normalCss = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        border: "1px  solid #ced4d9",
        maxHeight: 35,
        backgroundColor: "white",
        cursor: "pointer"
    };
    const buttonCss = isAccordionButton ? accordionCss : normalCss;
    return (
        <div
            inline="true"
            style={buttonCss}
            title={title}
            onClick={onAddButtonClick}
        >
            <img style={{
                width: 18
            }}
                 alt=""
                 src={addIcon}
                 data-buttonname="add"
                 data-key="enumeratedValue"
            />
        </div>
    );
};

const UpArrow = () => {
    return (
        <div inline="true" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            maxHeight: 35
        }}>
            <img style={{
                width: 18,
                cursor: "pointer"
            }}
                 alt=""
                 src={sortUpIcon}
                 data-buttonname="add"
                 data-key="enumeratedValue"
            />
        </div>
    );
};

const DownArrow = () => {
    return (
        <div inline="true" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            maxHeight: 35,
        }}>
            <img style={{
                width: 18,
                cursor: "pointer"
            }}
                 alt=""
                 src={sortDownIcon}
                 data-buttonname="add"
                 data-key="enumeratedValue"
            />
        </div>
    );
};

const RuleChainRow = ({
                          ruleChainListItem,
                          ruleChainsOptions,
                          configForm,
                          isNotLastIndex,
                          causeArrIndex,
                          causeListIndex,
                          ruleChainArrIndex,
                          ruleChainListIndex,
                          onDropdownValueChange,
                          onActionButtonClick
                      }) => {
    const selectedConditionOption = ruleChainListItem.condition && ruleChainListItem.condition.value === "" ? "" : ruleChainListItem.condition;
    const selectedRuleChain = ruleChainListItem.ruleChain && ruleChainListItem.ruleChain.value === "" ? "" : ruleChainListItem.ruleChain;

    const onAddButtonClick = () => {
        onActionButtonClick("add-ruleChain", {causeArrIndex, causeListIndex, ruleChainArrIndex})
    };

    const onRemoveButtonClick = () => {
        onActionButtonClick("remove-ruleChain", {causeArrIndex, causeListIndex, ruleChainArrIndex, ruleChainListIndex})
    };
    return (
        <Row className="mr-0">
            <Form.Group
                inline="true"
                size="sm" as={Col}
            >
                <Select
                    theme={theme}
                    className="min-width-170"
                    options={ruleChainsOptions}
                    data-key="rulechain-ruleChain"
                    closeMenuOnSelect={true}
                    key={"rule-chain" + selectedRuleChain.label}
                    defaultValue={selectedRuleChain}
                    onChange={(selectedOption) => {
                        onDropdownValueChange("rulechain-ruleChain", selectedOption, {
                            causeArrIndex,
                            causeListIndex,
                            ruleChainArrIndex,
                            ruleChainListIndex
                        })
                    }}
                />
            </Form.Group>
            <Form.Group
                size="sm" as={Col}
                className="condition-dropdown"
            >
                <Select
                    theme={theme}
                    options={conditionOptions}
                    data-key="rulechain-condition"
                    closeMenuOnSelect={true}
                    defaultValue={selectedConditionOption}
                    onChange={(selectedOption) => {
                        onDropdownValueChange("rulechain-condition", selectedOption, {
                            causeArrIndex,
                            causeListIndex,
                            ruleChainArrIndex,
                            ruleChainListIndex
                        })
                    }}
                    isDisabled={!isNotLastIndex}
                />
            </Form.Group>
            {
                isNotLastIndex
                    ? <RemoveButton onRemoveButtonClick={onRemoveButtonClick}/>
                    :
                    <div className="d-flex">
                        <RemoveButton onRemoveButtonClick={onRemoveButtonClick}/>
                        <AddButton
                            title={"Add New Group Rule Block"}
                            onAddButtonClick={onAddButtonClick}/>
                    </div>
            }
        </Row>
    )
};
const RuleChainListBlock = ({
                                ruleChainArrArr,
                                ruleChainArrIndex,
                                causeArrIndex,
                                causeListIndex,
                                isNotFirstIndex,
                                ruleChainsOptions,
                                configForm,
                                isLastIndex,
                                causeArrList,
                                index,
                                toggleAccordion,
                                accordionList,
                                onDropdownValueChange,
                                onActionButtonClick
                            }) => {
    const isAccordionOpen = ruleChainArrArr.isAccordionOpen;
    const ruleChainArrList = ruleChainArrArr.arr;
    const condition = ruleChainArrArr.condition;
    const onAddRuleChainArrButtonClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onActionButtonClick("add-new-rule-chain-arr-ruleChain", {causeArrIndex, causeListIndex})
    };
    const onRemoveRuleChainArrButtonClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onActionButtonClick("remove-rule-chain-arr-ruleChain", {causeArrIndex, causeListIndex, ruleChainArrIndex})
    };
    const onRulechainArrConditionDropdownChange = (selectedValue) => {
        onDropdownValueChange("condition-rulechain", selectedValue, {causeArrIndex, causeListIndex, ruleChainArrIndex})
    };

    return (
        causeArrList[causeArrIndex].causeList[causeListIndex].cause.value && (<div key={`${causeListIndex}`}>
            {
                isNotFirstIndex && (
                    <Row className="m-0 d-flex justify-content-center" style={{paddingTop: 7}}>
                        <ConditionDropdownRow
                            onDropdownValueChange={onRulechainArrConditionDropdownChange}
                            selectedConditionValue={condition}
                            index={ruleChainArrIndex}
                        />
                    </Row>
                )
            }
            <Row className="m-0 d-flex">
                <Accordion defaultActiveKey="0" className="rulechain-accordion flex-grow-1">
                    <Card>
                        <Accordion.Toggle
                            as={Card.Header}
                            eventKey="0"
                            onClick={() => {
                                toggleAccordion("ruleChain", {causeArrIndex, causeListIndex, ruleChainArrIndex});
                            }}
                        >
                            <div className="d-flex flex-row">
                                <div>
                                    {
                                        isAccordionOpen ? <UpArrow/> : <DownArrow/>
                                    }
                                </div>
                                <div className="flex-grow-1 configure-acc-card">
                                    Rule Block
                                </div>
                                <div>
                                    {
                                        isLastIndex
                                            ? <RemoveButton
                                                onRemoveButtonClick={onRemoveRuleChainArrButtonClick}
                                                isAccordionButton={true}/> :
                                            <div className="d-flex">
                                                <RemoveButton
                                                    onRemoveButtonClick={onRemoveRuleChainArrButtonClick}
                                                    isAccordionButton={true}/>
                                                <AddButton
                                                    onAddButtonClick={onAddRuleChainArrButtonClick}
                                                    isAccordionButton={true}
                                                    title={"Add New Rule Block"}
                                                />
                                            </div>}
                                </div>
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {
                                    ruleChainArrList.map((ruleChainListItem, ruleChainListIndex) => {
                                        const isNotLastIndex = ruleChainListIndex !== ruleChainArrList.length - 1;
                                        return (<RuleChainRow
                                            key={`rcla-${ruleChainListIndex}`}
                                            ruleChainListItem={ruleChainListItem}
                                            ruleChainsOptions={ruleChainsOptions}
                                            configForm={configForm}
                                            isNotLastIndex={isNotLastIndex}
                                            onDropdownValueChange={onDropdownValueChange}
                                            causeArrIndex={causeArrIndex}
                                            causeListIndex={causeListIndex}
                                            ruleChainArrIndex={ruleChainArrIndex}
                                            ruleChainListIndex={ruleChainListIndex}
                                            onActionButtonClick={onActionButtonClick}
                                        />)
                                    })
                                }
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Row>
        </div>)
    )
};

const ConditionDropdownRow = ({
                                  onDropdownValueChange,
                                  selectedConditionValue,
                                  index,
                                  conditionKey
                              }) => {
    return (
        <Row className="m-0">
            <Form.Group
                size="sm" as={Col}
                className="condition-dropdown"
            >
                <Select
                    theme={theme}
                    options={conditionOptions}
                    data-key="cause-condition"
                    closeMenuOnSelect={true}
                    defaultValue={selectedConditionValue}
                    onChange={onDropdownValueChange}
                />
            </Form.Group>
        </Row>)
}


const ConfigFormUI = ({
                          ruleChainList,
                          configForm,
                          isAddUpdateConfigDisabled,
                          onSearchableDropdownValueChange,
                          onSaveConfigClick,
                          onCancelConfigClick,
                          onUpdateConfigClick,
                          failureAdvisoryData,
                          causesData,
                          toggleAccordion,
                          onActionButtonClick,
                          onConfigFormItemValueChange,
                          onEditCauseClick,
                          selected,
                          onRadioValueChange,
                          resetToDefaultView,
                      }) => {
    const causeArrList = configForm.causeArrList;
    const ruleChainArrListArr = causeArrList[selected.causeArrIndex].causeList[selected.causeListIndex].ruleChainArrList;
    let selectedRuleChainsArr = [];
    let ruleChainsOptions = [];
    let failureAdvisoryOptions = [];
    let useCaseOptions = [];


    for (let key in configForm.ruleChains) {
        selectedRuleChainsArr.push(configForm.ruleChains[key].value);
    }
    for (let rbIndex = 0; rbIndex < ruleChainList.length; rbIndex++) {
        const ruleChainItem = ruleChainList[rbIndex];
        ruleChainsOptions.push({
            value: `${ruleChainItem.ruleChainId}`,
            label: ruleChainItem.ruleChainName
        })
    }
    for (let rbIndex = 0; rbIndex < failureAdvisoryData.length; rbIndex++) {
        const ruleChainItem = failureAdvisoryData[rbIndex];
        if (
            (configForm.fa_alarm_radio === "failure_advisory" && ruleChainItem.isFailureAdvisory) ||
            (configForm.fa_alarm_radio === "alarm" && ruleChainItem.isAlarm)
        ) {
            failureAdvisoryOptions.push({
                value: `${ruleChainItem.uId}`,
                label: ruleChainItem.label,
                description: ruleChainItem.description,
            })
        }
    }
    for (let rbIndex = 0; rbIndex < causesData.length; rbIndex++) {
        const ruleChainItem = causesData[rbIndex];
        useCaseOptions.push({
            value: `${ruleChainItem.uId}`,
            label: ruleChainItem.label,
            description: ruleChainItem.description,
        })
    }


    const onDropdownValueChange = (key, selectedValue, index) => {
        onSearchableDropdownValueChange(key, selectedValue, index)
    };


    return (
        <Container>
            <Row>
                <Col style={{
                    // border: "1px solid #dfdfdf",
                    borderRightWidth: 0,
                    // paddingTop: 8,
                    // paddingBottom: 15,
                }}
                     className="p-2"
                >
                    <div>
                        <Form.Group size="sm" as={Col} style={{padding: 5}}>
                            <Form.Check
                                name={`fa_alarm_radio`} inline
                                label="Failure Advisory"
                                type="radio"
                                id={`condition-inline-radio-1`}
                                data-key="fa_alarm_radio"
                                data-radioname="failure_advisory"
                                checked={configForm["fa_alarm_radio"] === 'failure_advisory'}
                                onChange={onRadioValueChange}
                                disabled={configForm.configId !== -1?configForm["fa_alarm_radio"] !== "failure_advisory":false}
                            />
                            <Form.Check
                                name={`fa_alarm_radio`} inline
                                label="Alarm Advisory"
                                type="radio"
                                id={`condition-inline-radio-2`}
                                data-key="fa_alarm_radio"
                                data-radioname="alarm"
                                checked={configForm["fa_alarm_radio"] === 'alarm'}
                                onChange={onRadioValueChange}
                                disabled={configForm.configId !== -1?configForm["fa_alarm_radio"] !== "alarm":false}
                            />

                            <Select
                                theme={theme}
                                options={failureAdvisoryOptions}
                                key={configForm["fa_alarm_radio"]}
                                data-key="ruleChains"
                                onChange={(selectedValue) => {
                                    onDropdownValueChange("failureAdvisory", selectedValue)
                                }}
                                isMulti={false}
                                closeMenuOnSelect={true}
                                defaultValue={configForm.failureAdvisory}
                            />
                        </Form.Group>
                    </div>
                    {
                        (configForm.failureAdvisory && configForm.failureAdvisory.label) && (
                            <div style={{
                                margin: 0,
                                marginTop: 16,
                                // padding: 12,
                                // paddingHorizontal: 10,
                                // paddingBottom: 10,
                                borderRadius: 0,
                                borderWidth: 1,
                                borderColor: '#000',
                                position: "relative",
                                border: "1px solid #dfdfdf"
                            }} className="p-1 pt-2">
                                <div style={{
                                    position: 'absolute',
                                    zIndex: 0,
                                    top: -7,
                                    left: 10,
                                    backgroundColor: '#FFFFFF',
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                }}>
                                    <Form.Label>Configure Cause and Rule Blocks</Form.Label>
                                </div>
                                {
                                    causeArrList.map((causeArrObject, causeArrIndex) => {
                                        const isNotFirstCauseArrIndex = causeArrIndex !== 0;
                                        const isLastCauseArrIndex = causeArrIndex === causeArrList.length - 1;
                                        const {
                                            condition,
                                            isAccordionOpen,
                                            causeList
                                        } = causeArrObject;
                                        const onCauseArrConditionDropdownChange = (selectedValue) => {
                                            onDropdownValueChange("cause-causeArrCondition", selectedValue, {causeArrIndex})
                                        };
                                        const onAddCauseArrButtonClick = (event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onActionButtonClick("add-new-cause-arr")
                                        };
                                        const onRemoveCauseArrButtonClick = (event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onActionButtonClick("remove-cause-arr", {causeArrIndex})
                                        };
                                        return (<div key={`${causeArrIndex}-${causeList[0].cause.value}`}>
                                                {
                                                    isNotFirstCauseArrIndex && (
                                                        <Row className="m-0 d-flex justify-content-center"
                                                             style={{paddingTop: 7}}>
                                                            <ConditionDropdownRow
                                                                onDropdownValueChange={onCauseArrConditionDropdownChange}
                                                                selectedConditionValue={condition}
                                                            />
                                                        </Row>
                                                    )
                                                }
                                                <Row className="m-0 d-flex">
                                                    <Accordion defaultActiveKey="0"
                                                               className="rulechain-accordion flex-grow-1">
                                                        <Card>
                                                            <Accordion.Toggle
                                                                as={Card.Header}
                                                                eventKey="0"
                                                                onClick={() => {
                                                                    toggleAccordion("cause", {causeArrIndex});
                                                                }}
                                                            >
                                                                <div className="d-flex flex-row">
                                                                    <div>
                                                                        {
                                                                            isAccordionOpen ? <UpArrow/> :
                                                                                <DownArrow/>
                                                                        }
                                                                    </div>
                                                                    <div className="flex-grow-1 configure-acc-card">
                                                                        Cause
                                                                    </div>
                                                                    <div>
                                                                        {
                                                                            isLastCauseArrIndex
                                                                                ? (
                                                                                    <div className="d-flex">
                                                                                        <RemoveButton
                                                                                            key={"removeCauseButtonKey"}
                                                                                            onRemoveButtonClick={onRemoveCauseArrButtonClick}
                                                                                            isAccordionButton={true}
                                                                                        />
                                                                                        <AddButton
                                                                                            key={"addCauseButtonKey"}
                                                                                            onAddButtonClick={onAddCauseArrButtonClick}
                                                                                            isAccordionButton={true}
                                                                                            title={"Add New Cause"}
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                                : (<RemoveButton
                                                                                    onRemoveButtonClick={onRemoveCauseArrButtonClick}
                                                                                    isAccordionButton={true}
                                                                                />)
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </Accordion.Toggle>
                                                            <Accordion.Collapse eventKey="0">
                                                                <Card.Body>
                                                                    {
                                                                        causeList.map((causeListItem, causeListIndex) => {
                                                                            const isFirstIndex = causeListIndex !== 0;
                                                                            const isLastIndex = causeListIndex === causeList.length - 1;
                                                                            const ruleChainArrListArr = causeListItem.ruleChainArrList;
                                                                            const selectedCause = causeListItem.cause.value === "" ? "" : causeListItem.cause;
                                                                            const selectedCauseConditionValue = causeListItem.condition.value === "" ? "" : causeListItem.condition;
                                                                            const selectedCauseCss = (causeArrIndex === selected.causeArrIndex && causeListIndex === selected.causeListIndex) ? {border: "1px solid #7979ef"} : null;

                                                                            const onCauseConditionDropdownChange = (selectedValue) => {
                                                                                onDropdownValueChange("cause-arrCondition", selectedValue, {
                                                                                    causeArrIndex,
                                                                                    causeListIndex
                                                                                })
                                                                            };
                                                                            const onAddNewCauseButtonClick = () => {
                                                                                onActionButtonClick("add-cause", {causeArrIndex})
                                                                            };
                                                                            const onRemoveCauseButtonClick = () => {
                                                                                onActionButtonClick("remove-cause", {
                                                                                    causeArrIndex,
                                                                                    causeListIndex
                                                                                })
                                                                            };
                                                                            return (
                                                                                <div
                                                                                    key={`cl-${causeListIndex}-${causeList.length}-${causeListItem.cause.value}`}>
                                                                                    {/*{causeList[causeList.length-1].cause.value}*/}
                                                                                    <Row
                                                                                        className="m-0 d-flex justify-content-center "
                                                                                        style={{paddingTop: 7}}
                                                                                    >
                                                                                        {isFirstIndex && (
                                                                                            <ConditionDropdownRow
                                                                                                onDropdownValueChange={onCauseConditionDropdownChange}
                                                                                                selectedConditionValue={selectedCauseConditionValue}
                                                                                                index={causeListIndex}
                                                                                            />
                                                                                        )}
                                                                                    </Row>
                                                                                    <div>
                                                                                        <Row className="mb-0">
                                                                                            <Form.Group
                                                                                                size="sm"
                                                                                                as={Col}
                                                                                                className="mb-0">
                                                                                                <div
                                                                                                    className="d-flex flex-row"
                                                                                                    style={selectedCauseCss}>
                                                                                                    <div
                                                                                                        className={"min-width-170 flex-grow-1"}>
                                                                                                        <Select
                                                                                                            theme={theme}
                                                                                                            options={useCaseOptions}
                                                                                                            data-key="ruleChains"
                                                                                                            onChange={(selectedValue) => {
                                                                                                                onDropdownValueChange("cause", selectedValue, {
                                                                                                                    causeArrIndex,
                                                                                                                    causeListIndex
                                                                                                                })
                                                                                                            }}
                                                                                                            closeMenuOnSelect={true}
                                                                                                            defaultValue={selectedCause}
                                                                                                        />
                                                                                                    </div>
                                                                                                    {/*<EditButton*/}
                                                                                                    {/*    onClick={() => onEditCauseClick({*/}
                                                                                                    {/*        causeArrIndex,*/}
                                                                                                    {/*        causeListIndex*/}
                                                                                                    {/*    })}*/}
                                                                                                    {/*/>*/}
                                                                                                    {
                                                                                                        causeListIndex === causeList.length - 1 ?
                                                                                                            <div
                                                                                                                className="d-flex">
                                                                                                                <RemoveButton
                                                                                                                    onRemoveButtonClick={onRemoveCauseButtonClick}
                                                                                                                    isCauseButton={true}
                                                                                                                />
                                                                                                                <AddButton
                                                                                                                    title={"Add New Group Cause"}
                                                                                                                    onAddButtonClick={onAddNewCauseButtonClick}
                                                                                                                />
                                                                                                            </div> :
                                                                                                            <RemoveButton
                                                                                                                onRemoveButtonClick={onRemoveCauseButtonClick}
                                                                                                                isCauseButton={true}
                                                                                                            />
                                                                                                    }
                                                                                                </div>
                                                                                            </Form.Group>
                                                                                        </Row>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    </Accordion>
                                                </Row>
                                            </div>
                                        )
                                    })
                                }
                            </div>)
                    }
                </Col>
                <Col className="rule-block-wrapper"
                    // className="p-2"
                >
                    {
                        ruleChainArrListArr.map((ruleChainArrArr, ruleChainArrIndex) => {
                            const isNotFirstIndex = ruleChainArrIndex !== 0;
                            const isLastIndex = ruleChainArrIndex === ruleChainArrListArr.length - 1;
                            return (
                                <RuleChainListBlock
                                    key={`rclb-${ruleChainArrIndex}-${selected.causeArrIndex}-${selected.causeListIndex}`}
                                    ruleChainArrArr={ruleChainArrArr}
                                    ruleChainArrIndex={ruleChainArrIndex}
                                    causeArrIndex={selected.causeArrIndex}
                                    causeListIndex={selected.causeListIndex}
                                    isNotFirstIndex={isNotFirstIndex}
                                    ruleChainsOptions={ruleChainsOptions}
                                    configForm={configForm}
                                    isLastIndex={!isLastIndex}
                                    index={3}
                                    toggleAccordion={toggleAccordion}
                                    causeArrList={causeArrList}
                                    onDropdownValueChange={onDropdownValueChange}
                                    onActionButtonClick={onActionButtonClick}
                                />
                            )
                        })
                    }
                </Col>
            </Row>
            <Row style={{marginBottom: 0}}>
                <Form.Group size="sm" as={Col}
                            className="mb-0 p-2"
                            style={{
                                display: "flex",
                                padding: "10px 0px 10px 0px",
                                justifyContent: "space-between"
                            }}
                >
                    <Button
                        size="sm"
                        className="parameter-header-button"
                        onClick={resetToDefaultView}
                        variant="outline-secondary">
                        Cancel
                    </Button>
                    {
                        configForm.configId === -1
                            ? (<Button
                                size="sm"
                                className="parameter-header-button ml-0"
                                onClick={onSaveConfigClick}
                                variant="outline-secondary"
                                disabled={isAddUpdateConfigDisabled}
                            >
                                Save
                            </Button>)
                            : (<Button
                                size="sm"
                                className="parameter-header-button ml-0"
                                onClick={onUpdateConfigClick}
                                variant="outline-secondary"
                                disabled={isAddUpdateConfigDisabled}
                            >
                                Update
                            </Button>)
                    }
                </Form.Group>
            </Row>
        </Container>
    );
};


class NewOutcomeFormUI extends React.Component {
    constructor(props) {
        super(props);
        debugger
        /*const {
            configForm,
            ruleChainList,
            causesData,
            failureAdvisoryData
        } = props;*/
        let configForm = props.location.data && props.location.data.configForm;
        this.state = {
            loading: false,
            configForm: configForm ? configForm : JSON.parse(JSON.stringify(defaultConfigForm)),
            ruleChainList: [],
            causesData: [],
            causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
            currentUid: "-1",
            isSaveCauseButtonDisabled: true,

            isSaveAdvisoryButtonDisabled: true,

            failureAdvisoryData: [],
            advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),

            isConfigUpdate: false,
            isConfigEdit: false,
            ruleChainId: 8,
            configId: 50,
            isAddUpdateConfigDisabled: true,
            isConfigTableVisible: true,
            selectedRuleChainsArr: [],
            selected: JSON.parse(JSON.stringify(defaultSelected))
        }
        this.advisoryModalRef = React.createRef();
        this.causeModalRef = React.createRef();
    }

    componentDidMount() {
        const vesselName = getItemFromLocalStorage("ssAppvesselValue");
        getAllRuleEngineDataByShip(this.getAllData, this.getAllDataFailed, vesselName);
        getAllShips(this.getAllShipsSuccess,this.getAllShipsFail);


    }

    getAllShipsSuccess = (response) => {
        const shipNameArray = response.data;
        shipsList = shipNameArray
    }

    getAllShipsFail = () => {}

        getAllData = (resp) => {
        const ruleConfigJson = resp.data;
        let ruleChainList = resp ? Object.entries(ruleConfigJson.ruleBlockData)
            .map(([key, obj]) => Object.assign({
                ruleChainId: key,
                ruleChainName: ruleConfigJson.ruleBlockData[key].name,
                description: ruleConfigJson.ruleBlockData[key].description,
            })) : [];
        let causesData = resp
            ? Object.entries(ruleConfigJson.causes).map(([key, obj]) => Object.assign({
                    uId: key,
                    label: ruleConfigJson.causes[key].name,
                    description: ruleConfigJson.causes[key].description,
                })
            )
            : [];
        let failureAdvisoryData = resp
            ? Object.entries(ruleConfigJson.failureAdvisories).map(([key, obj]) => Object.assign({
                    uId: key,
                    label: ruleConfigJson.failureAdvisories[key].name,
                    ...ruleConfigJson.failureAdvisories[key]
                })
            )
            : [];
        const isAddUpdateConfigDisabled = this.getIsAddUpdateConfigDisabled(this.state.configForm);
        this.setState({
            causesData,
            failureAdvisoryData,
            ruleChainList,
            isAddUpdateConfigDisabled
        });
    };
    getAllDataFailed = (resp) => {
        console.error(resp);
    }

    /***
     * New Config form functions
     * **/
    getIsAddUpdateConfigDisabled = (configForm) => {
        let isAddUpdateConfigDisabled = false;
        const causeList = configForm.causeList;
        for (let key in configForm) {
            if (!isAddUpdateConfigDisabled && !("ruleChain" === key)) {
                const ConfigFormItem = configForm[key];
                if ("useCase" === key || "failureAdvisory" === key) {
                    isAddUpdateConfigDisabled = ConfigFormItem === null || Object.keys(ConfigFormItem).length === 0;
                } else if ("ruleChains" === key) {
                    isAddUpdateConfigDisabled = configForm.ruleChains ? configForm.ruleChains.length === 0 : true;
                } else if ("causeArrList" === key) {
                    const causeArrList = configForm.causeArrList;
                    for (let cArrIndex = 0; cArrIndex < causeArrList.length; cArrIndex++) {
                        const causeList = causeArrList[cArrIndex].causeList;
                        for (let causeIndex = 0; causeIndex < causeList.length; causeIndex++) {
                            const causeItem = causeList[causeIndex];
                            if (JSON.stringify(causeItem.cause) === JSON.stringify(defaultDropdownValue)) {
                                isAddUpdateConfigDisabled = true
                            }
                            const ruleChainArrList = causeItem.ruleChainArrList;
                            for (let ruleChainIndex in ruleChainArrList) {
                                const ruleChainArrListArr = ruleChainArrList[ruleChainIndex].arr;
                                for (let rcArrItemIndex = 0; rcArrItemIndex < ruleChainArrListArr.length; rcArrItemIndex++) {
                                    const rcArrItem = ruleChainArrListArr[rcArrItemIndex];
                                    if (JSON.stringify(rcArrItem.ruleChain) === JSON.stringify(defaultDropdownValue)) {
                                        isAddUpdateConfigDisabled = true;
                                        break;
                                    }
                                }
                                if (isAddUpdateConfigDisabled === true) {
                                    break;
                                }
                            }
                            if (isAddUpdateConfigDisabled === true) {
                                break;
                            }
                        }
                    }
                } else {
                    isAddUpdateConfigDisabled = ConfigFormItem === "";
                }
            }
        }
        return isAddUpdateConfigDisabled;
    };
    onSearchableDropdownValueChange = (key, selectedValue, index) => {
        let configForm = {...this.state.configForm};
        let selected = {...this.state.selected};
        if (key.indexOf("cause") !== -1) {
            const {causeArrIndex, causeListIndex} = index;
            const ruleChainKey = key.split('-')[1];
            if (key === "cause") {
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex].cause = selectedValue;
                selected = {
                    causeArrIndex: causeArrIndex,
                    causeListIndex: causeListIndex
                }
            } else if (ruleChainKey === "arrCondition") {
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .condition = selectedValue;
            } else if (ruleChainKey === "condition") {
                configForm.causeList[index].condition = selectedValue;
            } else if (ruleChainKey === "causeArrCondition") {
                configForm.causeArrList[causeArrIndex].condition = selectedValue;
            }
        } else if (key.indexOf("rulechain") !== -1) {
            const {
                causeArrIndex,
                causeListIndex,
                ruleChainArrIndex,
                ruleChainListIndex
            } = index;
            if (key === "rulechain-condition") {
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .ruleChainArrList[ruleChainArrIndex]
                    .arr[ruleChainListIndex].condition = selectedValue;
            } else if (key === "condition-rulechain") {
                const {causeListIndex, ruleChainArrIndex} = index;
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .ruleChainArrList[ruleChainArrIndex]
                    .condition = selectedValue;
            } else {
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .ruleChainArrList[ruleChainArrIndex]
                    .arr[ruleChainListIndex].ruleChain = selectedValue;
            }
        } else {
            configForm[key] = selectedValue;
        }

        const isAddUpdateConfigDisabled = this.getIsAddUpdateConfigDisabled(configForm);
        this.setState({
            selected,
            configForm,
            isAddUpdateConfigDisabled
        });
    };
    onSaveConfigClick = () => {
        let configForm = {...this.state.configForm};
        let payload = this.createExpression(configForm);
        payload.vesselName = getItemFromLocalStorage("ssAppvesselValue");
        saveConfigureUseCase(this.onSaveConfigureUseCaseSuccess, this.onSaveConfigureUseCaseFailure, payload)
    };
    onSaveConfigureUseCaseSuccess = (resp) => {
        const configId = resp.data;
        //console.log("The Response is",resp.data)
        this.props.history.push({
            pathname: '/MonitorPolicies',
            data: {
                uId: configId
            }
        })
    };
    onSaveConfigureUseCaseFailure = (resp) => {

    }
    createExpression = (configForm) => {
        let causeCondition = "";
        let causeListCondition = [];
        const causeArrList = configForm.causeArrList;
        for (let cArrIndex = 0; cArrIndex < causeArrList.length; cArrIndex++) {
            const causeList = causeArrList[cArrIndex].causeList;
            for (let index = 0; index < causeList.length; index++) {
                if (causeArrList.length === 1) {
                    if (causeList.length === 1) {
                        causeCondition += "(" + causeList[index].cause.value + ")";
                    } else {
                        if (index === 0) {
                            causeCondition += "(" + causeList[index].cause.value;
                        } else if (index === causeList.length - 1) {
                            causeCondition += causeList[index].condition.value + causeList[index].cause.value + ")";
                        } else {
                            causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                        }
                    }
                } else {
                    if (causeList.length === 1) {
                        const causeBlockCondtion = cArrIndex !== 0 ? causeArrList[cArrIndex].condition.value : "";
                        causeCondition += causeBlockCondtion + "(" + causeList[index].cause.value + ")";
                    } else {
                        if (index === 0) {
                            const causeBlockCondtion = cArrIndex !== 0 ? causeArrList[cArrIndex].condition.value : "";
                            causeCondition += causeBlockCondtion + "(" + causeList[index].cause.value;
                        } else if (index === causeList.length - 1) {
                            causeCondition += causeList[index].condition.value + causeList[index].cause.value + ")";
                        } else {
                            causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                        }
                    }
                }
                let ruleChainArrList = causeList[index].ruleChainArrList;
                let ruleChain = "";
                for (let innerIndex = 0; innerIndex < ruleChainArrList.length; innerIndex++) {
                    let ruleChainSubCondition = "";
                    for (let innerOfInnerIndex = 0; innerOfInnerIndex < ruleChainArrList[innerIndex].arr.length; innerOfInnerIndex++) {
                        if (innerOfInnerIndex === ruleChainArrList[innerIndex].arr.length - 1) {
                            ruleChainSubCondition = ruleChainSubCondition +
                                ruleChainArrList[innerIndex].arr[innerOfInnerIndex].ruleChain.value;
                        } else {
                            ruleChainSubCondition = ruleChainSubCondition +
                                ruleChainArrList[innerIndex].arr[innerOfInnerIndex].ruleChain.value + ruleChainArrList[innerIndex].arr[innerOfInnerIndex].condition.value
                        }
                    }
                    if (innerIndex === 0) {
                        ruleChain = ruleChain + "(" + ruleChainSubCondition + ")";
                    } else {
                        ruleChain = ruleChain + ruleChainArrList[innerIndex].condition.value + "(" + ruleChainSubCondition + ")";
                    }
                }
                let causeRuleChains = {
                    cause: causeList[index].cause.value,
                    ruleChains: ruleChain
                }
                causeListCondition.push(causeRuleChains);
            }
        }
        return {
            "CONFIG_ID": configForm.configId,
            "isFailureAdvisory": configForm.fa_alarm_radio === "failure_advisory",
            "isAlarm": configForm.fa_alarm_radio === "alarm",
            "failureAdvisory": configForm.failureAdvisory.value,
            "causes": causeCondition,
            "causeRuleChain": causeListCondition
        };
    }
    onUpdateConfigClick = () => {
        const configForm = {...this.state.configForm};
        let payload = this.createExpression(configForm);
        payload.vesselName = getItemFromLocalStorage("ssAppvesselValue");
        updateConfigureUseCase(this.onupdateConfigureUseCaseSuccess, this.onupdateConfigureUseCaseFailure, payload);
    };
    onupdateConfigureUseCaseSuccess = (resp) => {
        const configId = resp.data.data;

        this.props.history.push({
            pathname: '/MonitorPolicies',
            data: {
                uId: configId
            }
        })
    }
    onupdateConfigureUseCaseFailure = () => {

    }
    onCancelConfigClick = () => {
        this.toggleConfigTableUI();
    };
    toggleAccordion = (accordionType, {causeArrIndex, causeListIndex, ruleChainArrIndex}) => {
        let configForm = {...this.state.configForm};
        if (accordionType === "cause") {
            configForm
                .causeArrList[causeArrIndex]
                .isAccordionOpen = !configForm
                .causeArrList[causeArrIndex]
                .isAccordionOpen;
        } else if (accordionType === "ruleChain") {
            configForm
                .causeArrList[causeArrIndex]
                .causeList[causeListIndex]
                .ruleChainArrList[ruleChainArrIndex].isAccordionOpen = !configForm
                .causeArrList[causeArrIndex]
                .causeList[causeListIndex]
                .ruleChainArrList[ruleChainArrIndex].isAccordionOpen;
        }
        this.setState({
            configForm
        })
    };
    onActionButtonClick = (actionType, indexes = {}) => {
        const configForm = this.state.configForm;
        let selected = this.state.selected;
        if (actionType.indexOf("cause") !== -1) {
            const {
                causeArrIndex,
                causeListIndex
            } = indexes;
            if (actionType === "add-new-cause-arr") {
                configForm
                    .causeArrList
                    .push(JSON.parse(JSON.stringify(defaultCauseArrObject)));
                selected = {
                    causeArrIndex: configForm.causeArrList.length - 1,
                    causeListIndex: 0
                }
            } else if (actionType === "remove-cause-arr") {
                let selectedCauseArrIndex = selected.causeArrIndex;
                if (configForm.causeArrList.length - 1 === causeArrIndex && causeArrIndex === 0) {
                    configForm.causeArrList.splice(causeArrIndex, 1);
                    configForm
                        .causeArrList
                        .push(JSON.parse(JSON.stringify(defaultCauseArrObject)));
                    selectedCauseArrIndex = configForm.causeArrList.length - 1;
                } else {
                    configForm.causeArrList.splice(causeArrIndex, 1);
                    if (causeArrIndex < selectedCauseArrIndex) {
                        selectedCauseArrIndex -= 1;
                    } else if (causeArrIndex === selectedCauseArrIndex) {
                        selectedCauseArrIndex = configForm.causeArrList.length - 1;
                    }
                }

                selected = {
                    causeArrIndex: selectedCauseArrIndex,
                    causeListIndex: 0
                }
            } else if (actionType === "add-cause") {
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList.push({
                    cause: {...defaultDropdownValue},
                    condition: {...defaultSelectedCondition},
                    ruleChainArrList: [
                        {
                            isAccordionOpen: false,
                            arr: [
                                {
                                    condition: {...defaultSelectedCondition},
                                    ruleChain: {...defaultDropdownValue}
                                }
                            ]
                        }
                    ]
                });
                selected = {
                    causeArrIndex,
                    causeListIndex: configForm.causeArrList[causeArrIndex].causeList.length - 1
                };
            } else if (actionType === "remove-cause") {
                let selectedCauseListIndex = selected.causeListIndex;
                if (causeListIndex === 0 && configForm.causeArrList[causeArrIndex].causeList.length - 1 === causeListIndex) {
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList.splice(causeListIndex, 1)
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList.push({
                        cause: {...defaultDropdownValue},
                        condition: {...defaultSelectedCondition},
                        ruleChainArrList: [
                            {
                                isAccordionOpen: false,
                                arr: [
                                    {
                                        condition: {...defaultSelectedCondition},
                                        ruleChain: {...defaultDropdownValue}
                                    }
                                ]
                            }
                        ]
                    });
                    selected = {
                        causeArrIndex,
                        causeListIndex: configForm
                            .causeArrList[causeArrIndex]
                            .causeList.length - 1
                    };
                } else {
                    if (causeListIndex === selectedCauseListIndex) {
                        selectedCauseListIndex = configForm.causeArrList[causeArrIndex].causeList.length - 2;
                    } else if (causeListIndex < selectedCauseListIndex) {
                        selectedCauseListIndex = selected.causeListIndex - 1;
                    } else if (causeListIndex > selectedCauseListIndex) {
                        // selectedCauseListIndex = selected.causeListIndex - 1;
                    }
                    selected = {
                        causeArrIndex,
                        causeListIndex: selectedCauseListIndex
                    };
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList.splice(causeListIndex, 1)
                }
            }
        } else if (actionType.indexOf("ruleChain") !== -1) {
            const {
                causeArrIndex,
                causeListIndex,
                ruleChainArrIndex,
                ruleChainListIndex
            } = indexes;
            if (actionType === "add-ruleChain") {
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .ruleChainArrList[ruleChainArrIndex].arr.push({...defaultRuleChainObject})
            } else if (actionType === 'remove-ruleChain') {
                if (ruleChainListIndex === 0 && configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .ruleChainArrList[ruleChainArrIndex].arr.length === 1) {
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList[causeListIndex]
                        .ruleChainArrList[ruleChainArrIndex]
                        .arr.splice(ruleChainListIndex, 1);
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList[causeListIndex]
                        .ruleChainArrList[ruleChainArrIndex]
                        .arr.push({...defaultRuleChainObject});
                } else {
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList[causeListIndex]
                        .ruleChainArrList[ruleChainArrIndex]
                        .arr.splice(ruleChainListIndex, 1);
                }
            } else if (actionType === "add-new-rule-chain-arr-ruleChain") {
                configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .ruleChainArrList.push(
                    {
                        isAccordionOpen: false,
                        condition: {...defaultSelectedCondition},
                        arr: [{
                            condition: {...defaultSelectedCondition},
                            ruleChain: {...defaultDropdownValue}
                        }]
                    }
                );
            } else if (actionType === "remove-rule-chain-arr-ruleChain") {
                if (ruleChainArrIndex === 0 && configForm
                    .causeArrList[causeArrIndex]
                    .causeList[causeListIndex]
                    .ruleChainArrList.length === 1) {
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList[causeListIndex]
                        .ruleChainArrList
                        .splice(ruleChainArrIndex, 1);
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList[causeListIndex]
                        .ruleChainArrList
                        .push(
                            {
                                isAccordionOpen: false,
                                condition: {...defaultSelectedCondition},
                                arr: [{
                                    condition: {...defaultSelectedCondition},
                                    ruleChain: {...defaultDropdownValue}
                                }]
                            })
                } else {
                    configForm
                        .causeArrList[causeArrIndex]
                        .causeList[causeListIndex]
                        .ruleChainArrList.splice(ruleChainArrIndex, 1)
                }
            }
        } else {
            const {causeListIndex, ruleChainArrIndex, ruleChainListIndex} = indexes;
            if (actionType === "remove") {
                configForm
                    .causeList[causeListIndex]
                    .ruleChainArrList[ruleChainArrIndex].arr.splice(ruleChainListIndex, 1)
            }
        }
        const isAddUpdateConfigDisabled = this.getIsAddUpdateConfigDisabled(configForm);
        this.setState({
            selected,
            configForm,
            isAddUpdateConfigDisabled
        })
    };
    onConfigFormItemValueChange = (event) => {
        const key = event.target.dataset.key;
        const value = event.target.value;
        let configForm = this.state.configForm;
        configForm[key] = value;
        const isAddUpdateConfigDisabled = this.getIsAddUpdateConfigDisabled(configForm);
        this.setState({
            configForm,
            isAddUpdateConfigDisabled
        })
    };
    onEditCauseClick = (indexes) => {
        const {
            causeArrIndex,
            causeListIndex
        } = indexes;
        let configForm = this.state.configForm;
        let ruleChainArrList = [...configForm.causeArrList[causeArrIndex].causeList[causeListIndex].ruleChainArrList];
        ruleChainArrList.map((ruleChainArrListObj, ralIndex) => {
            const ruleChainArrListObject = ruleChainArrListObj;
            ruleChainArrListObj.isAccordionOpen = true;
            return ruleChainArrListObject
        });
        configForm.causeArrList[causeArrIndex].causeList[causeListIndex].ruleChainArrList = [...ruleChainArrList];
        this.setState({
            configForm,
            selected: {
                causeArrIndex,
                causeListIndex
            },
        })
    };
    onRadioValueChange = (event) => {
        const configForm = {...this.state.configForm};
        configForm.fa_alarm_radio = event.target.dataset.radioname;
        configForm.failureAdvisory = null;
        const isAddUpdateConfigDisabled = this.getIsAddUpdateConfigDisabled(configForm);
        this.setState({
            configForm,
            isAddUpdateConfigDisabled
        })
    };


    /**
     * Config Table Functions
     * **/
    toggleConfigTableUI = () => {
        this.setState({
            isConfigTableVisible: !this.state.isConfigTableVisible
        })
    };


    /**
     * Cause API's
     * ***/
    onCreateCauseButtonClick = (payload) => {
        this.setState({
            loading: true
        });
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload["vesselName"] = "";
        }
        createCause(this.onCreateElementSuccess, this.onCreateElementFailure, payload)
    };
    onCreateElementSuccess = (res) => {
        //debugger
        // console.log(res);
        if (res.status === 200 ) {
            //debugger;
            let causeForm = {...this.state.causeForm};
            causeForm.uId = res.data;
            causeForm.label = causeForm.name;
            const causesData = [{
                uId: res.data,
                label: causeForm.name,
                description: causeForm.description,
            }, ...this.state.causesData];
            this.causeModalRef.current.handleClose();
            this.setState({
                loading: false,
                causesData,
                causeForm: JSON.parse(JSON.stringify(defaultCauseForm)),
                isSaveCauseButtonDisabled: true,
            });
        }
    };
    onCreateElementFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
        console.log(err)
    };

    /**
     * Add Cause Functions
     * ***/
    getCauseObjectForServer = () => {
        const {
            name,
            description,
        } = {...this.state.causeForm};

        return {
            name,
            description,
        }
    };
    getIsCauseSaveButtonDisabled = (causeForm) => {
        let isSaveCauseButtonDisabled = false;
        for (let key in causeForm) {
            if (!isSaveCauseButtonDisabled) {
                isSaveCauseButtonDisabled = causeForm[key] === "";
            }
        }
        return isSaveCauseButtonDisabled;
    };
    onCauseFormValueChange = (event) => {
        //debugger
        const key = event.target.dataset.key;
        const value = event.target.value;
        const causeForm = this.state.causeForm;
        causeForm[key] = value;
        const isSaveCauseButtonDisabled = this.getIsCauseSaveButtonDisabled(causeForm);
        this.setState({
            causeForm,
            isSaveCauseButtonDisabled
        });
    };
    onAddCauseButtonClick = () => {
        debugger
        const payload = this.getCauseObjectForServer();
        this.onCreateCauseButtonClick(payload);
    };


    /**
     * Advisory API's
     * ***/
    getAdvisoryObjectForServer = (advisoryFormState) => {
        debugger
        const {
            name,
            description,
            fa_alarm_radio,
        } = {...advisoryFormState};

        return {
            name,
            description,
            isFailureAdvisory: fa_alarm_radio === "failure_advisory",
            isAlarm: fa_alarm_radio === "alarm"
        }
    };
    onCreateAdvisoryClick = () => {
        debugger
        const payload = this.getAdvisoryObjectForServer(this.state.advisoryForm);
        this.setState({
            loading: true
        });
        debugger
        if(getItemFromLocalStorage("ssAppvesselValue")){
            payload["vesselName"] = getItemFromLocalStorage("ssAppvesselValue");
        }else {
            payload["vesselName"] = "";
        }
        createFailureAdvisory(this.onCreateAdvisorySuccess, this.onCreateAdvisoryFailure, payload)
    };
    onCreateAdvisorySuccess = (res) => {
        debugger
        // console.log(res);
        if (res.status === 200 ) {
            //debugger;
            let advisoryForm = {...this.state.advisoryForm};
            advisoryForm.uId = res.data;
            advisoryForm.label = advisoryForm.name;
            advisoryForm.isFailureAdvisory = advisoryForm.fa_alarm_radio === "failure_advisory";
            advisoryForm.isAlarm = advisoryForm.fa_alarm_radio === "alarm";

            const failureAdvisoryData = [advisoryForm, ...this.state.failureAdvisoryData];
            this.advisoryModalRef.current.handleClose();
            this.setState({
                loading: false,
                failureAdvisoryData,
                advisoryForm: JSON.parse(JSON.stringify(defaultAdvisoryForm)),
                isSaveAdvisoryButtonDisabled: true
            });
        }
    };
    onCreateAdvisoryFailure = (err) => {
        //debugger
        this.setState({
            loading: false
        });
        console.log(err)
    };

    /**
     * Add Advisory function
     * ***/
    getIsSaveAdvisoryButtonDisabled = (advisoryForm) => {
        let isSaveAdvisoryButtonDisabled = false;
        for (let key in advisoryForm) {
            if (!isSaveAdvisoryButtonDisabled) {
                isSaveAdvisoryButtonDisabled = advisoryForm[key] === "";
            }
        }
        return isSaveAdvisoryButtonDisabled;
    };
    onAdvisoryFormValueChange = (event) => {
        //debugger
        const key = event.target.dataset.key;
        const value = event.target.value;
        const advisoryForm = this.state.advisoryForm;
        advisoryForm[key] = value;
        const isSaveAdvisoryButtonDisabled = this.getIsSaveAdvisoryButtonDisabled(advisoryForm);
        this.setState({
            advisoryForm,
            isSaveAdvisoryButtonDisabled
        });
    };
    onAdvisoryRadioChange = (event) => {
        //debugger;
        const advisoryForm = {...this.state.advisoryForm};
        advisoryForm.fa_alarm_radio = event.target.dataset.radioname;
        const isSaveAdvisoryButtonDisabled = this.getIsSaveAdvisoryButtonDisabled(advisoryForm);
        this.setState({
            advisoryForm,
            isSaveAdvisoryButtonDisabled
        })
    };


    resetToDefaultView = () => {
        this.props.history.goBack();
    };


    render() {
        debugger
        const {
            // ruleChainList,
            // configForm,

            loading,

            configForm,///todo uncomment this
            ruleChainList,
            causesData,
            failureAdvisoryData,


            isConfigUpdate,
            isConfigEdit,
            isAddUpdateConfigDisabled,
            isConfigTableVisible,
            accordionList,
            selected,


            causeForm,
            currentUid,
            isSaveCauseButtonDisabled,
            isSaveAdvisoryButtonDisabled,

            advisoryForm,
        } = this.state;


        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    {/*{JSON.stringify(configForm)}*/}
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Configure Condition-based Alarm"}/>
                    {/*{JSON.stringify(failureAdvisoryData)}*/}
                    <div className="pl-3 pr-3 pt-4 flex-1 overflow-auto cbm-wrapper">
                        <Row className="d-flex flex-row">
                            <Col xs={12} md={9} lg={9} className="">
                                {/*{JSON.stringify(causesData)}*/}
                                <div className="config-form-block p-1" style={{maxWidth: "unset"}}>
                                    <div
                                        className="config-form-block-header  mt-1 mb-2 pl-3 d-flex flex-row justify-content-between">
                                        Configure Condition-based Alarm
                                        <div className="d-flex flex-row justify-content-end">
                                            <CreateAdvisoryModal
                                                ref={this.advisoryModalRef}
                                                title={"Create Advisory"}
                                                actionButton={
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button"
                                                        onClick={this.onCreateAdvisoryClick}
                                                        variant="outline-secondary"
                                                        disabled={isSaveAdvisoryButtonDisabled}
                                                    >
                                                        Add
                                                    </Button>
                                                }
                                                modalBody={
                                                    <div className="config-form-block p-0" style={{margin: "0px auto"}}>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Failure Advisory</Form.Label>
                                                            {/*{JSON.stringify(advisoryForm["fa_alarm_radio"])}*/}
                                                            <Form.Check
                                                                name={`fa-fa_alarm_radio`} inline
                                                                label="Failure"
                                                                type="radio"
                                                                id={`fa-condition-inline-radio-1`}
                                                                data-key="fa_alarm_radio"
                                                                data-radioname="failure_advisory"
                                                                checked={advisoryForm["fa_alarm_radio"] === 'failure_advisory'}
                                                                // data-ruleconfigid={ruleIndex}
                                                                onChange={this.onAdvisoryRadioChange}
                                                            />
                                                            <Form.Check
                                                                name={`fa-fa_alarm_radio`} inline
                                                                label="Alarm"
                                                                type="radio"
                                                                id={`fa-condition-inline-radio-2`}
                                                                data-key="fa_alarm_radio"
                                                                data-radioname="alarm"
                                                                checked={advisoryForm["fa_alarm_radio"] === 'alarm'}
                                                                // data-ruleconfigid={ruleIndex}
                                                                onChange={this.onAdvisoryRadioChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Name</Form.Label>
                                                            <Form.Control
                                                                // placeholder="Name"
                                                                data-key="name"
                                                                onChange={this.onAdvisoryFormValueChange}
                                                                value={advisoryForm["name"]}
                                                                autoComplete="off"
                                                            />
                                                        </Form.Group>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Description</Form.Label>
                                                            <Form.Control
                                                                as="textarea" aria-label="With textarea"
                                                                // placeholder="Description"
                                                                data-key="description"
                                                                onChange={this.onAdvisoryFormValueChange}
                                                                value={advisoryForm["description"]}
                                                                autoComplete="off"
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                }
                                            />
                                            <CreateAdvisoryModal
                                                ref={this.causeModalRef}
                                                title={"Create Cause"}
                                                actionButton={
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button"
                                                        onClick={this.onAddCauseButtonClick}
                                                        variant="outline-secondary"
                                                        disabled={isSaveCauseButtonDisabled}
                                                    >
                                                        Add
                                                    </Button>
                                                }
                                                    modalBody={
                                                    <div className="config-form-block p-0">
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Name</Form.Label>
                                                            <Form.Control
                                                                // placeholder="Name"
                                                                data-key="name"
                                                                onChange={this.onCauseFormValueChange}
                                                                value={causeForm["name"]}
                                                                autoComplete="off"
                                                            />
                                                        </Form.Group>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Description</Form.Label>
                                                            <Form.Control
                                                                as="textarea" aria-label="With textarea"
                                                                // placeholder="Description"
                                                                data-key="description"
                                                                onChange={this.onCauseFormValueChange}
                                                                value={causeForm["description"]}
                                                                autoComplete="off"
                                                            />
                                                        </Form.Group>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>
                                    <ConfigFormUI
                                        ruleChainList={ruleChainList}
                                        configForm={configForm}
                                        isConfigUpdate={isConfigUpdate}
                                        isConfigEdit={isConfigEdit}
                                        isAddUpdateConfigDisabled={isAddUpdateConfigDisabled}
                                        isConfigTableVisible={isConfigTableVisible}
                                        causesData={causesData}
                                        failureAdvisoryData={failureAdvisoryData}
                                        accordionList={accordionList}
                                        selected={selected}
                                        onSearchableDropdownValueChange={this.onSearchableDropdownValueChange}
                                        onSaveConfigClick={this.onSaveConfigClick}
                                        onCancelConfigClick={this.onCancelConfigClick}
                                        onUpdateConfigClick={this.onUpdateConfigClick}
                                        toggleAccordion={this.toggleAccordion}
                                        onActionButtonClick={this.onActionButtonClick}
                                        onConfigFormItemValueChange={this.onConfigFormItemValueChange}
                                        onEditCauseClick={this.onEditCauseClick}
                                        onRadioValueChange={this.onRadioValueChange}
                                        resetToDefaultView={this.resetToDefaultView}
                                    />
                                </div>
                            </Col>
                            <Col xs={12} md={3} lg={3}
                                 className="p-0 d-flex justify-content-center justify-content-lg-start justify-content-md-start outcome-summery">
                                <div className="config-form-block p-1 pb-3 "
                                     style={{
                                         backgroundColor: "unset"
                                     }}
                                >
                                    <div className="summary-header mb-1">
                                        Summary
                                    </div>
                                    <div>
                                        {
                                            (configForm.failureAdvisory && configForm.failureAdvisory.label) && (
                                                <div>
                                                    <div className="policy-elem-text">
                                                        Advisory
                                                    </div>
                                                    <span className="policy-text advisory-text pr-1">
                                                        {configForm.failureAdvisory && configForm.failureAdvisory.label}
                                                    </span>
                                                </div>
                                            )
                                        }
                                        <div style={{
                                            // border: "1px solid",
                                            marginTop: 5
                                        }}>
                                            {
                                                configForm.causeArrList.map((causeArrObj, caoIndex) => {
                                                    const {causeList, condition} = causeArrObj;
                                                    return (
                                                        <div>
                                                            <div>
                                                                {/*{JSON.stringify(causeList)}*/}
                                                                <div>
                                                                    <div className="policy-text">
                                                                        {/*{causeList.condition.label}*/}
                                                                        {caoIndex !== 0 && condition.label}
                                                                    </div>
                                                                </div>
                                                                {
                                                                    causeList.map((causeObj, coIndex) => {
                                                                        return (
                                                                            <div>
                                                                                {
                                                                                    causeObj.cause.label && (
                                                                                        <div className="cause-block-css">
                                                                                            <div className="policy-text"
                                                                                                 style={{
                                                                                                     paddingTop: 3,
                                                                                                     paddingBottom: 3,
                                                                                                 }}>
                                                                                                {coIndex !== 0 && causeObj.condition.label}
                                                                                            </div>
                                                                                            <div style={{
                                                                                                marginLeft: 10,
                                                                                                paddingLeft: 5
                                                                                            }}
                                                                                                 className="cause-css"
                                                                                            >
                                                                                                {/*{JSON.stringify(causeObj)}*/}
                                                                                                {/*{JSON.stringify(causeObj.condition)}*/}
                                                                                                <div
                                                                                                    className="policy-elem-text">
                                                                                                    Cause
                                                                                                </div>
                                                                                                <span
                                                                                                    className="policy-text cause-text pr-1">
                                                                                                    {causeObj.cause.label}
                                                                                                </span>
                                                                                                {
                                                                                                    causeObj.ruleChainArrList[0].arr[0].ruleChain.label && (
                                                                                                        <div>
                                                                                                            <div
                                                                                                                className="policy-elem-text">
                                                                                                                Rule Block
                                                                                                            </div>
                                                                                                            {causeObj.ruleChainArrList.map((ruleChainArrObj, rcaIndex) => {
                                                                                                                const {arr, condition} = ruleChainArrObj;
                                                                                                                return (
                                                                                                                    <div>
                                                                                                                        <div
                                                                                                                            className="policy-text"
                                                                                                                            style={{
                                                                                                                                paddingTop: 3,
                                                                                                                                paddingBottom: 3,
                                                                                                                            }}>
                                                                                                                            {rcaIndex !== 0 && condition.label}
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            style={{paddingLeft: 5}}>
                                                                                                                            <div
                                                                                                                                className="rule-block-css"
                                                                                                                                style={{paddingLeft: 5}}>
                                                                                                                                {arr.map((ruleChainObject, rchainoIndex) => {
                                                                                                                                    const {ruleChain, condition} = ruleChainObject;
                                                                                                                                    return (
                                                                                                                                        <div key={`rule-block-${rchainoIndex}`}>
                                                                                                                                            {/*{JSON.stringify(ruleChainObject)}*/}
                                                                                                                                            <span
                                                                                                                                                className="policy-text rule-block-text pr-1">
                                                                                                                    {ruleChain.label}
                                                                                                                </span>
                                                                                                                                            <span
                                                                                                                                                className="policy-text">
                                                                                                                    {rchainoIndex !== arr.length - 1 && condition.label}
                                                                                                                </span>
                                                                                                                                        </div>)
                                                                                                                                })}
                                                                                                                            </div>
                                                                                                                            {/*arr.map()*/}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            })}
                                                                                                        </div>)
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {/*{JSON.stringify(configForm)}*/}
                    </div>
                </div>
            </SMSidebar>
        )
    }
}

export default NewOutcomeFormUI;


