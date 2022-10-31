import React from "react";
import {Button, Table} from "react-bootstrap";
import * as PropTypes from "prop-types";
import CustomParameterHistory from "../../custom/CustomParameterHistory";

function NewConstantParameterTableUI({
                                         addedConstantElements,
                                         onAddConstantBtnClick,
                                         onEditConstantClick,
                                         onDuplicateConstantClick,
                                     }) {
    let allConstantParams = !addedConstantElements ? [] : addedConstantElements;
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                {/*TODO : Enable This button after implementing Constant*/}
                <Button
                    className="SM-p-button"
                    onClick={onAddConstantBtnClick}
                    variant="outline-secondary"
                    disabled={true}
                >
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Add Constant
                </Button>
            </div>
            <Table size="sm" className="sm-custom-table">
                <thead>
                <tr>
                    {/*<th>Name</th>
                                        <th>Description</th>
                                        <th>Historical Data</th>
                                        <th>Actions</th>*/}
                </tr>
                </thead>
                <tbody>
                {
                    allConstantParams.map((param, index) => {
                        const parameterUId = param.uId;
                        const parameterId = param.Id;
                        const list = param.enumeratedValue.list;
                        return (
                            <tr key={`ptIndex-${index}`}>
                                <td>
                                    <div className="nameText">{param.variableName}</div>
                                    <div className="descriptionText">{param.description}</div>
                                </td>
                                {/*<td>
                                    Historical Data <CustomParameterHistory parameterUId={parameterUId}/>
                                </td>*/}
                                <td style={{
                                    width: 84,
                                    maxWidth: 84,
                                }}>
                                    <div className="d-flex flex-row">
                                        <CustomParameterHistory parameterUId={parameterUId}/>
                                        <div
                                            title="Edit Constant"
                                            className="ml-2"
                                            // style={{textAlign: "center"}}
                                        >
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Edit Constant"
                                                 data-parameteruid={parameterUId}
                                                 src={require('../../../Images/edit.png')}
                                                 onClick={onEditConstantClick}
                                            />
                                        </div>
                                        <div
                                            title="Duplicate Constant"
                                            className="ml-2"
                                        >
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Duplicate Constant"
                                                 data-parameteruid={parameterUId}
                                                 src={require('../../../Images/duplicate.png')}
                                                 onClick={onDuplicateConstantClick}
                                            />
                                        </div>
                                        {/*<div
                                            title="Delete Constant"
                                            className="ml-2"
                                        >
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Duplicate Constant"
                                                 data-parameteruid={parameterUId}
                                                 src={require('../../../Images/delete.png')}
                                                 // onClick={onDeleteParameterClick}
                                            />
                                        </div>*/}
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
}

NewConstantParameterTableUI.propTypes = {
    isEdit: PropTypes.any,
    parameterForm: PropTypes.any,
    isParameterFormAddDisable: PropTypes.any,
    parameterUId: PropTypes.any,
    allConstantParams: PropTypes.any,
    toggleEditParameters: PropTypes.any,
    showAddParameterForm: PropTypes.any,
    onParameterFormValueChange: PropTypes.any,
    onAddConstantBtnClick: PropTypes.any,
    onEditConstantClick: PropTypes.any,
    onUpdateParameterClick: PropTypes.any,
    onDeleteParameterClick: PropTypes.any
}

export default NewConstantParameterTableUI;


