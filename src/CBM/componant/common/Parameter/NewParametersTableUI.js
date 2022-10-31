import React from "react";
import {Button, Table} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import Pagination from "react-js-pagination";

function NewParametersTableUI({
                                  addedElements,
                                  parameterPagination,
                                  showAddParameterForm,
                                  onEditParameterClick,
                                  onDuplicateParameterClick,
                                  onDeleteParameterClick,
                                  onPageChange
                              }) {
    const allParams = !addedElements ? [] : addedElements;
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                <Button
                    className="SM-p-button"
                    onClick={showAddParameterForm}
                    variant="outline-secondary">
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Add Parameter
                </Button>
            </div>
            <Table size="sm" size="sm" className="sm-custom-table">
                <thead>
                <tr>
                    {/*<th>Name</th>
                                        <th>Description</th>
                                        <th>Unit</th>
                                        <th style={{whiteSpace: "nowrap"}}>RTDAS Mapping</th>
                                        <th>Actions</th>*/}
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
                                <td>
                                    {/*<div className="nameText">{param.variableName}</div>*/}
                                    {/*<div className="descriptionText">{param.description}</div>*/}
                                    <div className="nameText">{param.description}</div>
                                </td>
                                <td>
                                    <div>Unit: {param.variableUnit}</div>
                                    <div>
                                        <div
                                            data-tip={param.rtdasMapping}
                                            data-multiline={true}
                                        >
                                            RTDAS Mapping: {param.rtdasMapping}
                                        </div>
                                    </div>
                                </td>
                                {
                                    (getItemFromLocalStorage("editRules") === "true") && (
                                        <td>
                                            <div className="d-flex flex-row">
                                                <div
                                                    title="Edit Parameter"
                                                >
                                                    <img style={{width: 18, cursor: "pointer"}}
                                                         alt="Edit Parameter"
                                                         data-parameteruid={parameterUId}
                                                         src={require('../../../Images/edit.png')}
                                                         onClick={onEditParameterClick}
                                                    />
                                                </div>
                                                <div
                                                    title="Duplicate Parameter"
                                                    className="ml-2"
                                                >
                                                    <img style={{width: 18, cursor: "pointer"}}
                                                         alt="Duplicate Parameter"
                                                         data-parameteruid={parameterUId}
                                                         src={require('../../../Images/duplicate.png')}
                                                         onClick={onDuplicateParameterClick}
                                                    />
                                                </div>
                                                <div
                                                    title="Delete Parameter"
                                                    className="ml-2"
                                                >
                                                    <img style={{width: 18, cursor: "pointer"}}
                                                         alt="Duplicate Parameter"
                                                         data-parameteruid={parameterUId}
                                                         src={require('../../../Images/delete.png')}
                                                         onClick={onDeleteParameterClick}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    )
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            <div className="d-flex justify-content-end pr-4">
                {parameterPagination.totalItemsCount > 0 && <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={parameterPagination.activePage}
                    itemsCountPerPage={parameterPagination.itemsCountPerPage}
                    totalItemsCount={parameterPagination.totalItemsCount}
                    pageRangeDisplayed={parameterPagination.pageRangeDisplayed}
                    onChange={(activePage) => onPageChange("parameter", activePage)}
                />}
            </div>
        </div>
    )
}

NewParametersTableUI.propTypes = {
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

export default NewParametersTableUI;


