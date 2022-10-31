import React from "react";
import {Button, Form, Table} from "react-bootstrap";
import '../../../css/customSwitch.css';
import CustomTooltip from "../../custom/CustomTooltip";
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import Pagination from "react-js-pagination";

function NewRuleChainTableUI({
                                 ruleChainList,
                                 pagination,
                                 onAddNewRuleChainClick,
                                 onRuleChainItemDuplicate,
                                 onRuleChainItemDeleteClick,
                                 onEditRuleChainClick,
                                 onActivateDeactivateRuleChainClick,
                                 onPageChange
                             }) {
    ruleChainList = !ruleChainList ? [] : ruleChainList;

    return (
        <div>
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
                                            {ruleChaiListUI}
                                        </div>
                                        <div>
                                            Periodicity: {`${ruleChainItem.frequency} ${ruleChainItem.frequencyUnit}`}
                                        </div>
                                        <div>
                                            No. of
                                            Occurrences: {ruleChainItem.isNumberOfOccurrencesChecked ? ruleChainItem.numberOfOccurrences : "NA"}
                                        </div>
                                    </td>
                                    {/*<td>*/}
                                    {/*    /!*ruleChainItem TODO REMOVE THIS*!/*/}
                                    {/*    {JSON.stringify(ruleChainItem.ruleConfigs)}*/}
                                    {/*</td>*/}
                                    {
                                        (getItemFromLocalStorage("editRules") === "true") && (
                                    <td style={{width: 130, maxWidth: 130}}>
                                        <div className="d-flex flex-row">
                                            <div className="customSwitch">
                                                <input
                                                    type="checkbox"
                                                    checked={ruleChainItem.isActivated}
                                                    data-rulechainid={ruleChainId}
                                                    className={"customSwitch customSwitchInput"}
                                                    id={index+1}
                                                    onClick={onActivateDeactivateRuleChainClick}
                                                    title={"Activate/Deactivate Rule Block"}
                                                />
                                                <label className="customSwitchLabel customSwitchToggle" htmlFor={index+1} />
                                            </div>
                                            <div
                                                title={"Edit Rule Block"}
                                                // style={{textAlign: "center"}}
                                            >
                                                <img style={{width: 18, cursor: "pointer"}}
                                                     alt="Edit Rule Block"
                                                     data-index={index}
                                                     data-rulechainid={ruleChainId}
                                                     src={require('../../../Images/edit.png')}
                                                     onClick={onEditRuleChainClick}
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
                                            <div
                                                title={"Delete Rule Block"}
                                                className="ml-2"
                                            >
                                                <img style={{width: 18, cursor: "pointer"}}
                                                     alt="Delete Rule Block"
                                                     data-index={index}
                                                     data-rulechainid={ruleChainId}
                                                     src={require('../../../Images/delete.png')}
                                                     onClick={onRuleChainItemDeleteClick}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                        )
                                    }
                                    {/*<td>
                                        <Form>
                                            {JSON.stringify(ruleChainItem.isActivate)}
                                            <Form.Check
                                                type="switch"
                                                id={`custom-switch-${ruleChainId}`}
                                                label=" "
                                                value={ruleChainItem}
                                                data-index={index}
                                                data-rulechainid={ruleChainId}
                                                onChange={onActivateDeactivateRuleChainClick}
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
                    {pagination.totalItemsCount > 0 && <Pagination
                        itemClass="page-item"
                        linkClass="page-link"
                        activePage={pagination.activePage}
                        itemsCountPerPage={pagination.itemsCountPerPage}
                        totalItemsCount={pagination.totalItemsCount}
                        pageRangeDisplayed={pagination.pageRangeDisplayed}
                        onChange={(activePage) => onPageChange("rule", activePage)}
                    />}
                </div>
            </div>
        </div>
    )
};

export default NewRuleChainTableUI;


