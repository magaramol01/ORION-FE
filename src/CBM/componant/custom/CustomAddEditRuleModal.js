import React, {Component} from "react";
import {Button, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import SmartShipLoader from "../common/SmartShipLoader";
import Select from "react-select";
import {prefieldOptions, comparisonOptions} from "../Constants";
import addIcon from '../../Images/downloadedImages/add.png';
import saveIcon from '../../Images/downloadedImages/save.png';

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

const RuleConfigFormUI = ({
                              parameterOptions,
                              ruleConfigForm,
                              onRuleConfigFormItemValueChange,
                              onParameterDropdownChange,
                              onPrefieldValueChange,
                          }) => {
    let selectedParametersArr = Object.keys(ruleConfigForm.selectedParameters).length === 0 ? null : ruleConfigForm.selectedParameters;
    let selectedPrefillArr = {value: 'NormalRange', label: 'Normal Range'};

    return (
        <div className="config-form-block p-0 m-0">
            <div style={{
                width: "100%",
                paddingTop: 0,
                paddingRight: 15,
                paddingLeft: 15,
                paddingBottom: 0
            }}>
                <Form>
                    {/*{JSON.stringify(ruleConfigForm)}*/}
                    <Row>
                        <Form.Group size="sm" as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                placeholder="Name"
                                data-key="ruleConfigName"
                                onChange={onRuleConfigFormItemValueChange}
                                value={ruleConfigForm["ruleConfigName"]}
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group size="sm" as={Col}>
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
                        <Form.Group size="sm" as={Col}>
                            <Form.Label>Parameter</Form.Label>
                            <Select
                                theme={theme}
                                options={parameterOptions}
                                data-key="parameters"
                                key={JSON.stringify(selectedParametersArr)}
                                data-ruleconfigid={`${ruleConfigForm.ruleConfigId}-${ruleConfigForm.selectedParameters.id}`}
                                onChange={onParameterDropdownChange}
                                isMulti={false}
                                closeMenuOnSelect={true}
                                defaultValue={selectedParametersArr}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group size="sm" as={Col}>
                            <Form.Label>Prefill</Form.Label>
                            <Select
                                theme={theme}
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
                        <Form.Group size="sm" as={Col}>
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
                                    <Form.Check
                                        name={`conditionRadio`} inline
                                        label="Calculated"
                                        type="radio"
                                        id={`condition-inline-radio-3`}
                                        data-key="conditionRadio"
                                        data-radioname="calculated"
                                        checked={ruleConfigForm.conditionRadio === 'calculated'}
                                        // data-ruleconfigid={ruleIndex}
                                        onChange={onRuleConfigFormItemValueChange}
                                    />
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
                                                    data-validation="float"
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
                                                    data-validation="float"
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
                                                                    <option
                                                                        key={`cpoIndex-${cpoIndex}`}>{opt.label}</option>
                                                                )
                                                            })
                                                        }
                                                    </Form.Control>
                                                    <Form.Control
                                                        placeholder="Value"
                                                        data-key="singleValue"
                                                        data-inputname="singleValue"
                                                        data-validation="float"
                                                        value={ruleConfigForm["singleValue"]}
                                                        // data-ruleconfigid={ruleIndex}
                                                        onChange={onRuleConfigFormItemValueChange}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            )
                                        ) ||
                                        (
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
                                        ) ||
                                        (
                                            ruleConfigForm.conditionRadio === 'enumerate' && (
                                                <Row>
                                                    <Form.Group as={Col}
                                                                className="d-flex flex-row mb-0">
                                                        <Form.Control
                                                            placeholder="Value"
                                                            data-key="enumeratedValue"
                                                            data-inputname="currentValue"
                                                            data-validation="integer"
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
                                                                        padding: 8,
                                                                        border: "1px  solid #ced4d9",
                                                                        maxHeight: 35
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
                                                                ruleConfigForm["enumeratedValue"].list.map((opt, rcfIndex) => {
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
                </Form>
            </div>
        </div>)
};


class CustomAddEditRuleModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    handleAdd = () => {
        this.setState({
            show: false
        }, this.props.onAddRuleConfigClick)
    };

    handleUpdate = () => {
        this.setState({
            show: false
        }, this.props.onUpdateRuleConfigClick)
    };
    handleClose = () => {
        this.setState({
            show: false
        }, this.props.onModalHide)
    };
    handleShow = () => {
        this.setState({
            show: true
        })
    };

    handleEditShowClick = (event) => {
        const ruleconfigid = event.target.dataset.ruleconfigid;
        this.setState({
            show: true
        }, (ruleconfigid => {
            this.props.onRuleConfigItemEdit(ruleconfigid)
        })(ruleconfigid));
    };
    handleDuplicateShowClick = (event) => {
        const ruleconfigid = event.target.dataset.ruleconfigid;
        this.setState({
            show: true
        }, (ruleconfigid => {
            this.props.onRuleConfigItemDuplicate(ruleconfigid)
        })(ruleconfigid));
    };

    render() {
        const {
            show
        } = this.state;
        const {
            ruleModalFor,
            ruleConfigId,
            parameterOptions,
            ruleConfigForm,
            isAddUpdateRuleConfigDisabled,
            onRuleConfigFormItemValueChange,
            onParameterDropdownChange,
            onPrefieldValueChange,
            onAddRuleConfigClick,
            onUpdateRuleConfigClick,
            onCancelRuleConfigClick,
            onModalShow,
            onRuleConfigItemEdit
        } = this.props;
        const isAddNewRule = ruleConfigForm.ruleConfigId === -1;
        const modalTitle = isAddNewRule ? "Add New Rule" : "Edit Rule";
        return (
            <>
                {
                    (ruleModalFor === "ADD_RULE" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 9,
                                border: "1px  solid #ced4d9",
                                maxHeight: 36,
                                backgroundColor: "white",
                                cursor: "pointer"
                            }}
                            title={modalTitle}
                            onClick={this.handleShow}
                        >
                            <img style={{
                                width: 18
                            }}
                                 alt=""
                                 src={addIcon}
                                 data-buttonname="add"
                                 data-key="enumeratedValue"
                                // onClick={onAddButtonClick}
                            />
                        </div>
                    )) || (
                        ruleModalFor === "EDIT_RULE" && (
                            <div
                                title={"Edit Rule"}
                                onClick={this.handleEditShowClick}
                                // style={{textAlign: "center"}}
                            >
                                <img style={{width: 18, cursor: "pointer"}}
                                     alt="Edit Rule"
                                    // data-index={index}
                                     data-ruleconfigid={ruleConfigId}
                                     src={require('../../Images/edit.png')}
                                    // onClick={onRuleConfigItemEdit}
                                />
                            </div>
                        )
                    ) || (
                        ruleModalFor === "DUPLICATE_RULE" && (
                            <div
                                title={"Duplicate and Add Rule"}
                                onClick={this.handleDuplicateShowClick}
                                className="ml-2"
                            >
                                <img style={{width: 18, cursor: "pointer"}}
                                     alt="Duplicate Rule"
                                     data-ruleconfigid={ruleConfigId}
                                     src={require('../../Images/duplicate.png')}
                                />
                            </div>
                        )
                    )
                }
                <Modal size={"md"} id="customUnits" show={show} onHide={this.handleClose} onShow={onModalShow}
                       animation={false}>
                    <SmartShipLoader isVisible={false}/>
                    <Modal.Header closeButton>
                        {modalTitle}
                    </Modal.Header>
                    <Modal.Body>
                        {/*{JSON.stringify(parameterOptions)}*/}
                        {/*{JSON.stringify(ruleConfigForm)}*/}
                        <RuleConfigFormUI
                            parameterOptions={parameterOptions}
                            ruleConfigForm={ruleConfigForm}
                            isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                            onRuleConfigFormItemValueChange={onRuleConfigFormItemValueChange}
                            onParameterDropdownChange={onParameterDropdownChange}
                            onAddRuleConfigClick={onAddRuleConfigClick}
                            onUpdateRuleConfigClick={onUpdateRuleConfigClick}
                            onCancelRuleConfigClick={onCancelRuleConfigClick}
                            onPrefieldValueChange={onPrefieldValueChange}
                        />
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            // onClick={onCancelRuleConfigClick}
                            onClick={this.handleClose}
                            variant="outline-secondary"
                            // disabled={false}
                        >
                            Cancel
                        </Button>
                        {
                            isAddNewRule ? (<Button
                                    size="sm"
                                    className="parameter-add-button"
                                    onClick={this.handleAdd}
                                    variant="outline-secondary"
                                    disabled={isAddUpdateRuleConfigDisabled}
                                >
                                    Add
                                </Button>)
                                : (<Button
                                    size="sm"
                                    className="parameter-header-button"
                                    onClick={this.handleUpdate}
                                    variant="outline-secondary"
                                >
                                    Update
                                </Button>)
                        }
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default CustomAddEditRuleModal;
