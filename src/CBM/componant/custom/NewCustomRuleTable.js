import React from "react";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import CustomAddEditRuleModal from "./CustomAddEditRuleModal";
import Pagination from "react-js-pagination";

function NewCustomRuleTable({
                                parameterOptions,
                                ruleConfigForm,
                                isAddUpdateRuleConfigDisabled,
                                ruleConfigNameForTable,
                                ruleConfigDescriptionForTable,
                                ruleConfigListTable,
                                ruleConfigsOptionsKeys,
                                pagination,
                                onRuleConfigFormItemValueChange,
                                onParameterDropdownChange,
                                onPrefieldValueChange,
                                onAddRuleConfigClick,
                                onRuleConfigItemEdit,
                                onRuleConfigItemDeleteClick,
                                onRuleConfigItemDuplicate,
                                onUpdateRuleConfigClick,
                                onCancelRuleConfigClick,
                                onModalShow,
                                onModalHide,
                                onTableSearchInputChange,
                                onRuleConfigTableCheckboxChecked,
                                onActivateDeactivateRuleConfigClick,
                                onRuleConfigPageChange,
                                onSearchRuleConfigBtnClick
                            }) {

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
                    <Button
                        size="sm"
                        className="parameter-add-button"
                        onClick={onSearchRuleConfigBtnClick}
                        variant="outline-secondary"
                        style={{marginRight: 20}}
                        // disabled={isParameterFormAddDisable}
                    >
                        Search
                    </Button>
                </Row>
                <div
                    className="mini-rule-table pl-3 pr-3">
                    <Table className="sm-custom-table" size="sm">
                        <thead>
                        <tr>
                              {/*<th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                            <th>Select</th>*/}
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
                                        <td>
                                            <div className="nameText">{ruleConfigItem.ruleConfigName}</div>
                                            <div className="descriptionText">{ruleConfigItem.ruleConfigDescription}</div>
                                        </td>
                                        <td style={{ width: 86, maxWidth: 86}}>
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
                                                <div
                                                    title={"Delete Rule Block"}
                                                    className="ml-2"
                                                >
                                                    <img style={{width: 18, cursor: "pointer"}}
                                                         alt="Delete Rule Config"
                                                         data-index={index}
                                                         data-ruleconfigid={ruleConfigItem.ruleConfigId}
                                                         src={require('../../Images/delete.png')}
                                                         onClick={onRuleConfigItemDeleteClick}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: 26, maxWidth: 26}}>
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
                                        {/*<td>
                                            <Form>
                                                {JSON.stringify(ruleConfigItem.isActive)}
                                                <Form.Check
                                                    type="switch"
                                                    id={`custom-switch-${ruleConfigItem.ruleConfigId}`}
                                                    label=" "
                                                    checked={ruleConfigItem.isActive}
                                                    data-uid={ruleConfigItem.ruleConfigId}
                                                    onChange={onActivateDeactivateRuleConfigClick}
                                                />
                                            </Form>
                                        </td>*/}
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-end pr-4">
                        {ruleConfigListTable && <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            activePage={pagination.activePage}
                            itemsCountPerPage={pagination.itemsCountPerPage}
                            totalItemsCount={pagination.totalItemsCount}
                            pageRangeDisplayed={pagination.pageRangeDisplayed}
                            onChange={onRuleConfigPageChange}
                        />}
                    </div>
                </div>
            </div>
        </Form.Group>);
}

export default NewCustomRuleTable;
