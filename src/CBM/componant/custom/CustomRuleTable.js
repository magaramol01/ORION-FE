import React from "react";
import {Col, Form, Row, Table} from "react-bootstrap";
import CustomAddEditRuleModal from "./CustomAddEditRuleModal";

function CustomRuleTable(props) {
    const {
        parameterOptions,
        ruleConfigForm,
        isAddUpdateRuleConfigDisabled,
        ruleConfigNameForTable,
        ruleConfigDescriptionForTable,
        ruleConfigListTable,
        ruleConfigsOptionsKeys,
        onRuleConfigFormItemValueChange,
        onParameterDropdownChange,
        onPrefieldValueChange,
        onAddRuleConfigClick,
        onRuleConfigItemEdit,
        onRuleConfigItemDuplicate,
        onUpdateRuleConfigClick,
        onCancelRuleConfigClick,
        onModalShow,
        onModalHide,
        onTableSearchInputChange,
        onRuleConfigTableCheckboxChecked
    } = props;


    const handleRuleConfigCheckboxChange = (event) => {
        debugger
        let dataset = event.target.dataset;
        const value = dataset.uid;
        const label = dataset.ruleconfigname;
        const description = dataset.ruleconfigdescription;
        onRuleConfigTableCheckboxChecked({
            isChecked: event.target.checked,
            ruleObject: {
                value,
                label,
                description
            }
        })
    };


    return (
        <Form.Group size="sm" as={Col}>
            <div style={{
                border: "1px solid #cccccc"
            }}>
                <Row style={{padding: "10px 10px 0px 10px"}}>
                    <Form.Group size="sm" as={Col}>
                        {/*{ruleConfigNameForTable}*/}
                        <Form.Control
                            placeholder="Search by Rule Name"
                            data-key="ruleConfigNameForTable"
                            onChange={onTableSearchInputChange}
                            value={ruleConfigNameForTable}
                            autoComplete="off"
                            maxLength={30}
                        />
                    </Form.Group>
                    <Form.Group size="sm" as={Col}>
                        {/*{ruleConfigDescriptionForTable}*/}
                        <Form.Control
                            placeholder="Search by Rule Description"
                            data-key="ruleConfigDescriptionForTable"
                            onChange={onTableSearchInputChange}
                            value={ruleConfigDescriptionForTable}
                            autoComplete="off"
                            maxLength={30}
                        />
                    </Form.Group>
                </Row>
                <div
                    className="mini-rule-table">
                    <Table
                        // key={`${ruleConfigForm.ruleConfigNameForTable}-${ruleConfigForm.ruleConfigDescriptionForTable}`}
                        style={{maxWidth: 700, margin: "0px auto"}} striped bordered hover size="sm">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                            <th>Select</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            ruleConfigListTable.map((ruleConfigItem, index) => {
                                const ruleConfigId = ruleConfigItem.ruleConfigId;
                                return (
                                    <tr key={`ruleConfigRow${index}`}>
                                        {/*<td>{index + 1}</td>*/}
                                        {/*<td>{ruleConfigId}</td>*/}
                                        <td>{ruleConfigItem.ruleConfigName}</td>
                                        <td>{ruleConfigItem.ruleConfigDescription}</td>
                                        <td>
                                            <div className="d-flex flex-row">
                                                <CustomAddEditRuleModal
                                                    ruleModalFor={"EDIT_RULE"}
                                                    ruleConfigId={ruleConfigId}
                                                    parameterOptions={parameterOptions}
                                                    ruleConfigForm={ruleConfigForm}
                                                    isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                                                    onRuleConfigFormItemValueChange={onRuleConfigFormItemValueChange}
                                                    onParameterDropdownChange={onParameterDropdownChange}
                                                    onPrefieldValueChange={onPrefieldValueChange}
                                                    onAddRuleConfigClick={onAddRuleConfigClick}
                                                    onRuleConfigItemEdit={onRuleConfigItemEdit}
                                                    onRuleConfigItemDuplicate={onRuleConfigItemDuplicate}
                                                    onUpdateRuleConfigClick={onUpdateRuleConfigClick}
                                                    onCancelRuleConfigClick={onCancelRuleConfigClick}
                                                    onModalShow={onModalShow}
                                                    onModalHide={onModalHide}
                                                />
                                                <CustomAddEditRuleModal
                                                    ruleModalFor={"DUPLICATE_RULE"}
                                                    ruleConfigId={ruleConfigId}
                                                    parameterOptions={parameterOptions}
                                                    ruleConfigForm={ruleConfigForm}
                                                    isAddUpdateRuleConfigDisabled={isAddUpdateRuleConfigDisabled}
                                                    onRuleConfigFormItemValueChange={onRuleConfigFormItemValueChange}
                                                    onParameterDropdownChange={onParameterDropdownChange}
                                                    onPrefieldValueChange={onPrefieldValueChange}
                                                    onAddRuleConfigClick={onAddRuleConfigClick}
                                                    onRuleConfigItemEdit={onRuleConfigItemEdit}
                                                    onRuleConfigItemDuplicate={onRuleConfigItemDuplicate}
                                                    onUpdateRuleConfigClick={onUpdateRuleConfigClick}
                                                    onCancelRuleConfigClick={onCancelRuleConfigClick}
                                                    onModalShow={onModalShow}
                                                    onModalHide={onModalHide}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Check
                                                    data-uid={ruleConfigItem.ruleConfigId}
                                                    data-ruleconfigname={ruleConfigItem.ruleConfigName}
                                                    data-ruleconfigdescription={ruleConfigItem.ruleConfigDescription}
                                                    type="checkbox"
                                                    label=""
                                                    checked={ruleConfigsOptionsKeys.indexOf(ruleConfigItem.ruleConfigId)!==-1}
                                                    onChange={handleRuleConfigCheckboxChange}
                                                />
                                            </Form.Group>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        </Form.Group>);
}

export default CustomRuleTable;
