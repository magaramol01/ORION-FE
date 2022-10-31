import React from "react";
import {Button, Table} from "react-bootstrap";
import editIcon from '../../../Images/downloadedImages/edit.png';
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";

function NewRTDASTableUI({
                             connectionList,
                             onAddNewConnectionClick,
                             onConnectionItemEdit,
                             onConnectionItemDuplicate,
                         }) {
    connectionList = !connectionList ? [] : connectionList;

    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                <Button
                    className="SM-p-button"
                    onClick={onAddNewConnectionClick}
                    variant="outline-secondary">
                    {/*<img*/}
                    {/*    alt=""*/}
                    {/*    width={16}*/}
                    {/*    src={require('../../../Images/plus.png')}*/}
                    {/*    style={{marginRight: 6}}*/}
                    {/*/>*/}
                    Upload RTDAS Parameter CSV
                </Button>
            </div>
            <Table size="sm" className="sm-custom-table">
                <thead>
                <tr>
                    {/*<th>Name</th>*/}
                    {/*<th>Type</th>*/}
                    {/*<th>Database Source</th>*/}
                    {/*<th>Table Name/ Url</th>*/}
                    {/*<th>Action</th>*/}
                    {/*<th>Delete</th>*/}
                </tr>
                </thead>
                <tbody>
                {
                    connectionList.map((connectionItem, index) => {
                        //debugger
                        let name, description, databaseType, tableList;
                        const type = connectionItem.type;
                        if ("DB" === type) {
                            debugger
                            name = connectionItem.dbObject.rtdasName;
                            description = connectionItem.dbObject.rtdasDescription;
                            databaseType = connectionItem.dbObject.databaseType;
                            tableList = connectionItem.dbObject.selectedTable.map((table) => `[${table.label}] `)
                        } else if ("JSON" === type) {
                            debugger
                            const jsonObject = connectionItem.jsonObject;
                            if ("FILE" === jsonObject.type) {
                                name = jsonObject.fileObject.jsonName;
                                description = jsonObject.fileObject.jsonDescription;
                            } else if ("STREAM" === jsonObject.type) {
                                name = jsonObject.streamObject.jsonName;
                                description = jsonObject.streamObject.jsonDescription;
                            }
                        }
                        const connectionId = connectionItem.connectionId;
                        // const tableList = connectionItem.type==="DB" ? connectionItem.selectedTable.map((table) => `[${table.label}] `): [];
                        // const tableList = [];
                        // connectionItem.dbObject;
                        return (
                            <tr key={`cti-${index}`}>
                                <td>
                                    <div className="nameText">{name}</div>
                                    <div className="descriptionText">{description}</div>
                                </td>
                                <td>Type: {type}</td>
                                <td>
                                    {
                                        "DB" === type && (<>
                                            <div>Database Source: {databaseType}</div>
                                            <div>Table Name: {tableList}</div>
                                        </>)
                                    }
                                </td>
                                {
                                    (getItemFromLocalStorage("editRules") === "true") && (
                                        <td style={{
                                            position: "relative",
                                            maxWidth: 60,
                                            width: 60
                                        }}>
                                            <div className="d-flex flex-row">
                                                <div
                                                    title={"Edit RTDAS"}
                                                    // style={{textAlign: "center"}}
                                                >
                                                    <img style={{width: 18, cursor: "pointer"}}
                                                         alt="Edit RTDAS"
                                                         data-index={index}
                                                         data-connectionid={connectionId}
                                                         src={editIcon}
                                                         onClick={onConnectionItemEdit}
                                                    />
                                                </div>
                                                <div
                                                    title={"Duplicate RTDAS"}
                                                    className="ml-2"
                                                >
                                                    <img style={{width: 18, cursor: "pointer"}}
                                                         alt="Duplicate RTDAS"
                                                         data-index={index}
                                                         data-connectionid={connectionId}
                                                         src={require('../../../Images/duplicate.png')}
                                                         onClick={onConnectionItemDuplicate}
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
        </div>
    )
}

export default NewRTDASTableUI;


