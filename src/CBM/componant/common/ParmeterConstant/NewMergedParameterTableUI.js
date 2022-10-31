import React from "react";
import {Button, Table} from "react-bootstrap";
import * as PropTypes from "prop-types";
import CustomParameterHistory from "../../custom/CustomParameterHistory";
import deleteIcon from '../../../Images/downloadedImages/delete-forever--v1.png';

function NewMergedParameterTableUI({
                                         addedElements,
                                         addedConstantElements,
                                         onAddNewParameterClick,
                                         onEditParameterConstantBtnClick,
                                         onDuplicateParameterConstantBtnClick,
                                         onDeleteParameterConstantBtnClick
                                     }) {
    const allParams = !addedElements ? [] : addedElements;
    let allConstantParams = !addedConstantElements ? [] : addedConstantElements;
    return (
        <div>
            <div className="tableUIWrapper">
                <div className="tableButtonWrapper d-flex flex-row">
                    <Button
                        className="SM-p-button"
                        onClick={onAddNewParameterClick}
                        variant="outline-secondary">
                        <img
                            alt=""
                            width={16}
                            src={require('../../../Images/plus.png')}
                            style={{marginRight: 6}}
                        />
                        Add New Parameter
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
                                        <div className="nameText">{param.variableName}</div>
                                        <div className="descriptionText">{param.description}</div>
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
                                    <td>
                                        <div className="d-flex flex-row">
                                            <div
                                                title="Edit Parameter"
                                            >
                                                <img style={{width: 18, cursor: "pointer"}}
                                                     alt="Edit Parameter"
                                                     data-parametertype="parameter"
                                                     data-parameteruid={parameterUId}
                                                     src={require('../../../Images/edit.png')}
                                                     onClick={onEditParameterConstantBtnClick}
                                                />
                                            </div>
                                            <div
                                                title="Duplicate Parameter"
                                                className="ml-2"
                                            >
                                                <img style={{width: 18, cursor: "pointer"}}
                                                     alt="Duplicate Parameter"
                                                     data-parametertype="parameter"
                                                     data-parameteruid={parameterUId}
                                                     src={require('../../../Images/duplicate.png')}
                                                     onClick={onDuplicateParameterConstantBtnClick}
                                                />
                                            </div>
                                            <div
                                                title="Delete Parameter"
                                                className="ml-2"
                                            >
                                                <img style={{width: 18, cursor: "pointer"}}
                                                     alt="Duplicate Parameter"
                                                     data-parametertype="parameter"
                                                     data-parameteruid={parameterUId}
                                                     src={deleteIcon}
                                                     onClick={onDeleteParameterConstantBtnClick}
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
            <div className="tableUIWrapper">
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
                                    <td>
                                        {JSON.stringify(param.precision)}
                                </td>
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
                                                     data-parametertype="constant"
                                                     data-parameteruid={parameterUId}
                                                     src={require('../../../Images/edit.png')}
                                                     onClick={onEditParameterConstantBtnClick}
                                                />
                                            </div>
                                            <div
                                                title="Duplicate Constant"
                                                className="ml-2"
                                            >
                                                <img style={{width: 18, cursor: "pointer"}}
                                                     alt="Duplicate Constant"
                                                     data-parametertype="constant"
                                                     data-parameteruid={parameterUId}
                                                     src={require('../../../Images/duplicate.png')}
                                                     onClick={onDuplicateParameterConstantBtnClick}
                                                />
                                            </div>
                                            {/*<div
                                            title="Delete Constant"
                                            className="ml-2"
                                        >
                                            <img style={{width: 18, cursor: "pointer"}}
                                                 alt="Duplicate Constant"
                                                 data-parametertype="constant"
                                                 data-parameteruid={parameterUId}
                                                 src={require('../../../Images/delete.png')}
                                                 // onClick={onDeleteParameterConstantBtnClick}
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
        </div>
    )
}

export default NewMergedParameterTableUI;


