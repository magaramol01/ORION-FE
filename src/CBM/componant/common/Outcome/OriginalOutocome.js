import React from "react";
import {Accordion, Button, Card, Col, Container, Form, Row, Table} from "react-bootstrap";
import Select from 'react-select';
import {getRuleConfigAllData, saveConfigureUseCase, updateConfigureUseCase} from "../../../../api"
import CustomTooltip from "../../custom/CustomTooltip";
import addIcon from '../../../Images/downloadedImages/add.png';
import deleteIcon from '../../../Images/downloadedImages/delete-forever--v1.png';
import sortUpIcon from '../../../Images/downloadedImages/sort-up.png';
import sortDownIcon from '../../../Images/downloadedImages/sort-down.png';
import editIcon from '../../../Images/downloadedImages/edit.png';

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
    fa_alarm_radio: "failure_advisory",
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
        maxHeight: 38
    };
    const causeCss = {
        ...commonCss,
        maxHeight: 38
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
        padding: 10,
        border: "1px  solid #ced4d9",
        backgroundColor: "white",
        maxHeight: 38,
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
        padding: 10,
        border: "1px  solid #ced4d9",
        maxHeight: 38,
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
            padding: 10,
            maxHeight: 38
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
            padding: 10,
            maxHeight: 38,
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
                                <div className="flex-grow-1"
                                     style={{padding: 7}}
                                >
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
                          onRadioValueChange
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
            <Row ld={8} md={8} xs={16} sm={16}>
                <div id="parametersUI" style={{maxWidth: "unset"}}>
                    <div className="cardHeader">
                        Configure Condition-based Alarm
                    </div>
                    <div style={{
                        width: "100%",
                        paddingTop: 15,
                        paddingRight: 15,
                        paddingLeft: 15,
                        paddingBottom: 0
                    }}>
                        <Container>
                            <Row>
                                <Col style={{
                                    border: "1px solid #dfdfdf",
                                    borderRightWidth: 0,
                                    paddingTop: 8,
                                    paddingBottom: 15,
                                }}>
                                    <Row>
                                        <Form.Group size="sm" as={Col}>
                                            <Form.Check
                                                name={`fa_alarm_radio`} inline
                                                label="Failure Advisory"
                                                type="radio"
                                                id={`condition-inline-radio-1`}
                                                data-key="fa_alarm_radio"
                                                data-radioname="failure_advisory"
                                                checked={configForm["fa_alarm_radio"] === 'failure_advisory'}
                                                onChange={onRadioValueChange}
                                            />
                                            <Form.Check
                                                name={`fa_alarm_radio`} inline
                                                label="Alarm"
                                                type="radio"
                                                id={`condition-inline-radio-2`}
                                                data-key="fa_alarm_radio"
                                                data-radioname="alarm"
                                                checked={configForm["fa_alarm_radio"] === 'alarm'}
                                                onChange={onRadioValueChange}
                                            />
                                            <Select
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
                                    </Row>
                                    <div style={{
                                        margin: 0,
                                        marginTop: 16,
                                        padding: 12,
                                        paddingHorizontal: 10,
                                        paddingBottom: 10,
                                        borderRadius: 0,
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        position: "relative",
                                        border: "1px solid #66696f"
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            zIndex: 0,
                                            top: -14,
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
                                                                            <div className="flex-grow-1"
                                                                                 style={{padding: 7}}
                                                                            >
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
                                                                                                            <EditButton
                                                                                                                onClick={() => onEditCauseClick({
                                                                                                                    causeArrIndex,
                                                                                                                    causeListIndex
                                                                                                                })}
                                                                                                            />
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
                                    </div>
                                    <Row style={{marginBottom: 0}}>
                                        <Form.Group size="sm" as={Col}
                                                    style={{display: "flex", padding: 10, justifyContent: "center"}}>
                                            {
                                                configForm.configId === -1
                                                    ? (<Button
                                                        size="sm"
                                                        className="parameter-header-button"
                                                        onClick={onSaveConfigClick}
                                                        variant="outline-secondary"
                                                        disabled={isAddUpdateConfigDisabled}
                                                    >
                                                        Save
                                                    </Button>)
                                                    : (<Button
                                                        size="sm"
                                                        className="parameter-header-button"
                                                        onClick={onUpdateConfigClick}
                                                        variant="outline-secondary"
                                                        disabled={isAddUpdateConfigDisabled}
                                                    >
                                                        Update
                                                    </Button>)
                                            }
                                            <Button
                                                size="sm"
                                                className="parameter-header-button"
                                                onClick={onCancelConfigClick}
                                                variant="outline-secondary">
                                                Cancel
                                            </Button>
                                        </Form.Group>
                                    </Row>
                                </Col>
                                <Col style={{
                                    border: "1px solid #dfdfdf",
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                }}>
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
                        </Container>
                    </div>
                </div>
            </Row>
        </Container>
    );
};

const ConfigTableUI = ({
                           configList,
                           onConfigItemEdit,
                           onConfigItemDelete,
                           onAddNewConfigClick,
                           onConfigItemDuplicate,
                           createExpression,
                           getCauseExpressionTableUI,
                       }) => {
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                <Button
                    className="SM-p-button"
                    onClick={onAddNewConfigClick}
                    variant="outline-secondary">
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Configure Condition-based Alarm
                </Button>
            </div>
            <Table size="sm" className="sm-custom-table">
                <thead>
                <tr>
                    {/*<th className="min-width-66">Advisory</th>
                    <th className="min-width-66">Outcome</th>
                    <th className="min-width-66">Causes</th>
                    <th>Actions</th>*/}
                </tr>
                </thead>
                <tbody>
                {
                    configList.map((configItem, index) => {
                        let causeListItemUI = [];
                        const configId = configItem.configId;
                        causeListItemUI = getCauseExpressionTableUI(configItem);
                        return (
                            <tr
                                key={`ctable-${index}`}>
                                <td>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <div className="pt-1">
                                            {fa_alarm_text[configItem.fa_alarm_radio]}:
                                        </div>
                                        <CustomTooltip
                                            customKey={`ctooltip-${index}`}
                                            description={configItem.failureAdvisory.description}
                                            label={configItem.failureAdvisory.label}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                                        {causeListItemUI}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-row">
                                        <div title="Edit Outcome">
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Edit Outcome"
                                                 data-index={index}
                                                 data-configid={configId}
                                                 src={editIcon}
                                                 onClick={onConfigItemEdit}
                                            />
                                        </div>
                                        <div title="Duplicate Outcome" className="ml-2">
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Duplicate Outcome"
                                                 data-index={index}
                                                 data-configid={configId}
                                                 src={require('../../../Images/duplicate.png')}
                                                 onClick={onConfigItemDuplicate}
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

class NewOutcomeTableUI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isConfigUpdate: false,
            isConfigEdit: false,
            configList: [],
            ruleChainId: 8,
            configId: 50,
            configForm: JSON.parse(JSON.stringify(defaultConfigForm)),
            ruleChainList: [],
            isAddUpdateConfigDisabled: true,
            isConfigTableVisible: true,
            selectedRuleChainsArr: [],
            causesData: [],
            failureAdvisoryData: [],
            selected: JSON.parse(JSON.stringify(defaultSelected))
        }
    }

    componentDidMount() {
        getRuleConfigAllData(this.getAllData, this.getAllDataFailed);
    }

    getRCStringArrFromString = (ruleChainString) => {
        let ruleChainStringArr = [];
        let letter = "";
        let word = "";
        for (let rcsIndex = 0; rcsIndex < ruleChainString.length; rcsIndex++) {
            letter = ruleChainString[rcsIndex];
            if (letter === "(" || letter === ")") {
                if (word) {
                    ruleChainStringArr.push(word);
                }
                word = "";
                ruleChainStringArr.push(letter);
            } else if (letter === "|" || letter === "&") {
                if (word.indexOf("|") === -1 && word.indexOf("&") === -1) {
                    if (word) {
                        ruleChainStringArr.push(word);
                    }
                    word = "";
                }
                word += letter
                if (word === "||" || word === "&&") {
                    ruleChainStringArr.push(word)
                    word = "";
                }
            } else {
                word += letter
            }
        }
        return ruleChainStringArr;
    };

    getCauseExpressionStringArrFromString = (causeExpressionString) => {
        let ruleChainStringArr = [];
        let letter = "";
        let word = "";
        for (let ceIndex = 0; ceIndex < causeExpressionString.length; ceIndex++) {
            letter = causeExpressionString[ceIndex];
            if (letter === "(" || letter === ")") {
                if (word) {
                    ruleChainStringArr.push(word);
                }
                word = "";
                ruleChainStringArr.push(letter);
            } else {
                word += letter
            }
        }
        return ruleChainStringArr;
    };

    getCauseStringArrFromString = (string) => {
        let causeNamesArr = [];
        const orArr = string.split("||");
        for (let cnIndex = 0; cnIndex < orArr.length; cnIndex++) {
            if (cnIndex !== 0) {
                causeNamesArr.push("||");
            }
            if (orArr[cnIndex].indexOf("&&") !== -1) {
                const andArr = orArr[cnIndex].split("&&");
                for (let aIndex = 0; aIndex < andArr.length; aIndex++) {
                    if (aIndex !== 0) {
                        causeNamesArr.push("&&");
                    }
                    causeNamesArr.push(andArr[aIndex]);
                }
            } else {
                causeNamesArr.push(orArr[cnIndex]);
            }
        }
        return causeNamesArr;
    };

    getSelectedCauseById = (causeId, causeList) => {
        let selectedCause = {
            value: causeId,
            label: causeList[causeId].name,
            description: causeList[causeId].description,
        };
        return selectedCause;
    };

    getSelectedConditionObject = (operatorContion) => {
        let selectedConditionObject = {};
        if (operatorContion === "||") {
            selectedConditionObject = {
                value: "||",
                label: "OR"
            }
        } else if (operatorContion === "&&") {
            selectedConditionObject = {
                value: "&&",
                label: "AND"
            }
        } else {
            selectedConditionObject = {
                value: "||",
                label: "OR"
            }
        }
        return selectedConditionObject;
    };

    getRuleChain = (ruleChainName, ruleChainList) => {
        let ruleChainItem = {
            value: ruleChainName,
            label: ""
        };
        for (let rcIndex = 0; rcIndex < ruleChainList.length; rcIndex++) {
            if (ruleChainList[rcIndex].ruleChainId === ruleChainName) {
                ruleChainItem.value = ruleChainList[rcIndex].ruleChainId;
                ruleChainItem.label = ruleChainList[rcIndex].ruleChainName;
                break;
            }
        }
        return ruleChainItem
    };

    getRuleChainByCauseId = (causeId, causeRuleChain) => {
        let ruleChainString = "";
        for (let crIndex = 0; crIndex < causeRuleChain.length; crIndex++) {
            if (causeRuleChain[crIndex].cause === causeId) {
                ruleChainString = causeRuleChain[crIndex].ruleChains;
                break;
            }
        }
        return ruleChainString;
    };

    getAllData = (resp, configObjectFromServer) => {

        let configList = [];
        let failureAdvisory = {};
        let configId = 8; //todo from server

        let ruleChainList = resp ? Object.entries(resp.data.ruleConfigJson.ruleBlockData)
            .map(([key, obj]) => Object.assign({
                ruleChainId: key,
                ruleChainName: resp.data.ruleConfigJson.ruleBlockData[key].name,
                description: resp.data.ruleConfigJson.ruleBlockData[key].description,
            })) : [];
        let causesData = resp
            ? Object.entries(resp.data.ruleConfigJson.causes).map(([key, obj]) => Object.assign({
                    uId: key,
                    label: resp.data.ruleConfigJson.causes[key].name,
                    description: resp.data.ruleConfigJson.causes[key].description,
                })
            )
            : [];
        let failureAdvisoryData = resp
            ? Object.entries(resp.data.ruleConfigJson.failureAdvisories).map(([key, obj]) => Object.assign({
                    uId: key,
                    label: resp.data.ruleConfigJson.failureAdvisories[key].name,
                    ...resp.data.ruleConfigJson.failureAdvisories[key]
                })
            )
            : [];

        const objFromServer = configObjectFromServer.data.ruleConfigJson;

        try {
            objFromServer.map((ruleConfigItem) => {
                const fauilureAdvisoryId = ruleConfigItem.FA;
                let causeArr = [];
                const fa_alarm_radio = (ruleConfigItem.isFailureAdvisory && "failure_advisory") || (ruleConfigItem.isAlarm && "alarm");

                const failureAdvisoryDataItem = resp.data.ruleConfigJson.failureAdvisories[fauilureAdvisoryId];
                failureAdvisory = {
                    value: fauilureAdvisoryId,
                    label: failureAdvisoryDataItem.name,
                    description: failureAdvisoryDataItem.description
                };
                const causeExpressionStringArr = this.getCauseExpressionStringArrFromString(ruleConfigItem.Causes);
                const causeArrList = [];
                for (let ceIndex = 0; ceIndex < causeExpressionStringArr.length; ceIndex++) {
                    let causeArrListObject = [];
                    const causeExpressionString = causeExpressionStringArr[ceIndex];
                    if (causeExpressionString === "(") {
                        causeArrListObject = JSON.parse(JSON.stringify(defaultCauseArrObjectFromServer));
                        if (ceIndex !== 0) {
                            causeArrListObject.condition = this.getSelectedConditionObject(causeExpressionStringArr[ceIndex - 1])
                        }
                        ceIndex += 1;
                        const causes = causeExpressionStringArr[ceIndex];
                        if (causes.indexOf("&&") === -1 && causes.indexOf("||") === -1) {
                            causeArr.push(causes);
                        } else {
                            causeArr = this.getCauseStringArrFromString(causes)
                        }
                        for (let cIndex = 0; cIndex < causeArr.length; cIndex++) {
                            if (cIndex % 2 !== 0) {
                                continue;
                            }
                            let ruleChainArrList = [];
                            const causeId = causeArr[cIndex];
                            const selectedCauseObject = this.getSelectedCauseById(causeId, resp.data.ruleConfigJson.causes);
                            let selectedConditionObject = {
                                value: "",
                                label: ""
                            };
                            if (cIndex !== 0 && cIndex % 2 === 0) {
                                selectedConditionObject = this.getSelectedConditionObject(causeArr[cIndex - 1]);
                            }

                            const causeRuleChain = this.getRuleChainByCauseId(causeId, ruleConfigItem.causeRuleChain);
                            const ruleChainArr = this.getRCStringArrFromString(causeRuleChain);
                            let ruleChainsItem = {
                                isAccordionOpen: true,
                                arr: []
                            };

                            for (let rcaIndex = 0; rcaIndex < ruleChainArr.length; rcaIndex++) {
                                const ruleChainName = ruleChainArr[rcaIndex];
                                if (ruleChainName === "(") {
                                    if (rcaIndex !== 0) {
                                        const prevRuleChainName = ruleChainArr[rcaIndex - 1];
                                        const condition = this.getSelectedConditionObject(prevRuleChainName);
                                        ruleChainsItem = {
                                            isAccordionOpen: true,
                                            condition,
                                            arr: []
                                        };
                                    } else {
                                        ruleChainsItem = {
                                            isAccordionOpen: true,
                                            condition: {},
                                            arr: []
                                        };
                                    }
                                } else if (ruleChainName === ")") {
                                    ruleChainArrList.push(ruleChainsItem);
                                } else if (ruleChainName === "&&" || ruleChainName === "||") {
                                    const prevRuleChainName = ruleChainArr[rcaIndex - 1];
                                    if (prevRuleChainName === ")") {
                                        continue;
                                    } else {
                                        /*ruleChainsItem.arr.push({
                                            condition: this.getSelectedCondtionObject(ruleChainName),
                                            ruleChain: this.getRuleChain(nextRuleChainName, ruleChainList)
                                        });   */
                                    }
                                } else {
                                    const nextRuleChainName = ruleChainArr[rcaIndex + 1];
                                    let conditionName = "";
                                    if (nextRuleChainName === "&&" || nextRuleChainName === "||") {
                                        conditionName = nextRuleChainName;
                                        rcaIndex += 1;
                                    }
                                    ruleChainsItem.arr.push({
                                        condition: this.getSelectedConditionObject(conditionName),
                                        ruleChain: this.getRuleChain(ruleChainName, ruleChainList)
                                    });
                                }
                            }
                            const causeObject = {
                                cause: selectedCauseObject,
                                condition: selectedConditionObject,
                                ruleChainArrList: ruleChainArrList
                            };
                            causeArrListObject.causeList.push(causeObject);
                        }
                        causeArrList.push(causeArrListObject);
                        causeArrListObject = {
                            isAccordionOpen: true,
                            condition: {...defaultSelectedCondition},
                            causeList: []
                        };
                        causeArr = [];
                    } else if (causeExpressionString === ")") {
                        continue;
                    } else {

                    }
                }

                configId = ruleConfigItem.CONFIG_ID;//todo from server
                let configListItem = {
                    configId,
                    fa_alarm_radio,
                    failureAdvisory,
                    causeArrList: [...causeArrList]
                };
                configList = [configListItem, ...configList];
            });
        } catch (e) {
            console.log(e);
        }

        this.setState({
            causesData,
            failureAdvisoryData,
            ruleChainList,
            configList
        });
    }
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
        saveConfigureUseCase(this.onSaveConfigureUseCaseSuccess, this.onSaveConfigureUseCaseFailure, payload)
    };
    onSaveConfigureUseCaseSuccess = (resp) => {
        const configId = resp.data;
        let configForm = {...this.state.configForm};
        configForm.configId = configId;
        let configList = [configForm, ...this.state.configList];
        this.setState({
            configForm: JSON.parse(JSON.stringify(defaultConfigForm)),
            selected: JSON.parse(JSON.stringify(defaultSelected)),
            isAddUpdateConfigDisabled: false,
            isConfigTableVisible: true,
            configList,
            configId
        })
    }
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
        updateConfigureUseCase(this.onupdateConfigureUseCaseSuccess, this.onupdateConfigureUseCaseFailure, payload);
    };
    onupdateConfigureUseCaseSuccess = (resp) => {
        const configForm = {...this.state.configForm};
        let configList = [...this.state.configList];
        const configId = resp.data.data;
        for (let rbIndex = 0; rbIndex < configList.length; rbIndex++) {
            const configItem = {...configList[rbIndex]};
            if (configId === configItem.configId) {
                configList[rbIndex] = configForm;
                break;
            }
        }
        this.setState({
            configList,
            isAddUpdateConfigDisabled: true,
            isConfigTableVisible: true
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
    onConfigItemEdit = (event) => {
        const configId = event.target.dataset.configid;
        const configList = [...this.state.configList];
        let configForm = {};
        for (let rbIndex = 0; rbIndex < configList.length; rbIndex++) {
            const configItem = configList[rbIndex];
            if (configId === configItem.configId) {
                configForm = configList[rbIndex];
                break;
            }
        }

        this.setState({
            configForm,
            isConfigTableVisible: false
        })
    };
    onConfigItemDelete = (event) => {

        const configId = event.target.dataset.configid;
        const oldConfigList = [...this.state.configList];
        const configList = oldConfigList.filter((configItem) => configId !== configItem.configId);

        this.setState({
            configList
        })
    };
    onAddNewConfigClick = () => {
        this.setState({
            configForm: JSON.parse(JSON.stringify(defaultConfigForm)),
            selected: JSON.parse(JSON.stringify(defaultSelected)),
            isConfigTableVisible: false
        })
    };
    onConfigItemDuplicate = (event) => {
        debugger
        const configId = event.target.dataset.configid;
        const configList = [...this.state.configList];
        let configForm = {};
        for (let rbIndex = 0; rbIndex < configList.length; rbIndex++) {
            const configItem = configList[rbIndex];
            if (configId === configItem.configId) {
                configForm = JSON.parse(JSON.stringify(configList[rbIndex]));
                configForm.configId = -1;
                debugger
                break;
            }
        }

        this.setState({
            configForm,
            isConfigTableVisible: false
        })
    };
    toggleConfigTableUI = () => {
        this.setState({
            isConfigTableVisible: !this.state.isConfigTableVisible
        })
    };
    getCauseExpressionTableUI = (configForm) => {
        let causeCondition = [];
        const causeArrList = configForm.causeArrList;
        for (let cArrIndex = 0; cArrIndex < causeArrList.length; cArrIndex++) {
            const causeList = causeArrList[cArrIndex].causeList;
            for (let index = 0; index < causeList.length; index++) {
                if (causeArrList.length === 1) {
                    if (causeList.length === 1) {
                        // causeCondition += "(" + causeList[index].cause.value + ")";
                        causeCondition.push([
                            (<div className={"causeCondition"} key={`${index}-(`}>(</div>),
                            (<div key={`${index}-${causeList[index].cause.value}`}>
                                <CustomTooltip
                                    description={causeList[index].cause.description}
                                    label={causeList[index].cause.label}
                                />
                            </div>),
                            (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                        ])
                    } else {
                        if (index === 0) {
                            // causeCondition += "(" + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"} key={`${index}-(`}>(</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        } else if (index === causeList.length - 1) {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value + ")";
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                                (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                            ])
                        } else {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        }
                    }
                } else {
                    if (causeList.length === 1) {
                        const causeBlockCondtion = cArrIndex !== 0 ? causeArrList[cArrIndex].condition.value : "";
                        // causeCondition += causeBlockCondtion + "(" + causeList[index].cause.value + ")";
                        causeCondition.push([
                            (<div className={"causeCondition"}
                                  key={`${index}-${causeBlockCondtion}`}>{causeBlockCondtion}</div>),
                            (<div className={"causeCondition"} key={`${index}-${"("}`}>(</div>),
                            (<div key={`${index}-${causeList[index].cause.value}`}>
                                <CustomTooltip
                                    description={causeList[index].cause.description}
                                    label={causeList[index].cause.label}
                                />
                            </div>),
                            (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                        ]);
                    } else {
                        if (index === 0) {
                            const causeBlockCondtion = cArrIndex !== 0 ? causeArrList[cArrIndex].condition.value : "";
                            // causeCondition += causeBlockCondtion + "(" + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeBlockCondtion}`}>{causeBlockCondtion}</div>),
                                (<div className={"causeCondition"} key={`${index}-${"("}`}>(</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        } else if (index === causeList.length - 1) {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value + ")";
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                                (<div className={"causeCondition"} key={`${index}-)`}>)</div>)
                            ]);
                        } else {
                            // causeCondition += causeList[index].condition.value + causeList[index].cause.value;
                            causeCondition.push([
                                (<div className={"causeCondition"}
                                      key={`${index}-${causeList[index].condition.value}`}>{causeList[index].condition.value}</div>),
                                (<div key={`${index}-${causeList[index].cause.value}`}>
                                    <CustomTooltip
                                        description={causeList[index].cause.description}
                                        label={causeList[index].cause.label}
                                    />
                                </div>),
                            ]);
                        }
                    }
                }
            }
        }
        return causeCondition;
    };


    render() {
        const {
            ruleChainList,
            configForm,
            isConfigUpdate,
            isConfigEdit,
            isAddUpdateConfigDisabled,
            isConfigTableVisible,
            configList,
            accordionList,
            selected
        } = this.state;
        return (
            <div>
                {
                    isConfigTableVisible
                        ? (<ConfigTableUI
                            configList={configList}
                            onConfigItemEdit={this.onConfigItemEdit}
                            onConfigItemDelete={this.onConfigItemDelete}
                            onAddNewConfigClick={this.onAddNewConfigClick}
                            onConfigItemDuplicate={this.onConfigItemDuplicate}
                            createExpression={this.createExpression}
                            getCauseExpressionTableUI={this.getCauseExpressionTableUI}
                        />)
                        : (<ConfigFormUI
                            ruleChainList={ruleChainList}
                            configForm={configForm}
                            isConfigUpdate={isConfigUpdate}
                            isConfigEdit={isConfigEdit}
                            isAddUpdateConfigDisabled={isAddUpdateConfigDisabled}
                            isConfigTableVisible={isConfigTableVisible}
                            onSearchableDropdownValueChange={this.onSearchableDropdownValueChange}
                            onSaveConfigClick={this.onSaveConfigClick}
                            onCancelConfigClick={this.onCancelConfigClick}
                            onUpdateConfigClick={this.onUpdateConfigClick}
                            causesData={this.state.causesData}
                            failureAdvisoryData={this.state.failureAdvisoryData}
                            accordionList={accordionList}
                            toggleAccordion={this.toggleAccordion}
                            onActionButtonClick={this.onActionButtonClick}
                            onConfigFormItemValueChange={this.onConfigFormItemValueChange}
                            onEditCauseClick={this.onEditCauseClick}
                            selected={selected}
                            onRadioValueChange={this.onRadioValueChange}
                        />)
                }
            </div>
        )
    }
}

export default NewOutcomeTableUI;


