import React from 'react';
import {Button, Table} from 'react-bootstrap';
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import Pagination from "react-js-pagination";

function NewCauseTableUI({
                             addedElements,
                             pagination,
                             onAddNewCauseClick,
                             onEditCauseClick,
                             onCauseDeleteClick,
                             onPageChange
                         }) {
    addedElements = !addedElements ? [] : addedElements;
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                <Button
                    className="SM-p-button"
                    onClick={onAddNewCauseClick}
                    variant="outline-secondary">
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Create Cause
                </Button>
            </div>
            <Table size="sm" className="sm-custom-table">
                <thead>
                <tr>
                    {/*
                    <th>Name</th>
                    <th>Description</th>
                    <th>Action</th>
                    */}
                </tr>
                </thead>
                <tbody>
                {/*{ JSON.stringify(addedElements) }*/}
                {
                    addedElements.map((addedElement, index) => {
                        return (
                            <tr key={`singleInputTable` + index}>
                                {/*<td>{index + 1}</td>*/}
                                <td>
                                    <div className="nameText">{addedElement.name}</div>
                                    <div className="descriptionText">{addedElement.description}</div>
                                </td>
                                {
                                    (getItemFromLocalStorage("editRules")==="true") && (
                                    <td style={{
                                        position: "relative",
                                        maxWidth: 55,
                                        width: 55
                                    }}>
                                        <div className="d-flex flex-row">
                                            <div
                                                // style={{textAlign: "center"}}
                                                title="Edit Cause"
                                            >
                                                {/*{JSON.stringify(addedElement)}*/}
                                                <img style={{
                                                    width: 18,
                                                    cursor: "pointer"
                                                }}
                                                     alt="Edit Advisory"
                                                     src={require('../../../Images/edit.png')}
                                                     data-index={index}
                                                     data-uid={addedElement.uId}
                                                     onClick={onEditCauseClick}
                                                />
                                            </div>
                                            <div
                                                // style={{textAlign: "center"}}
                                                title="Delete Cause"
                                                className="ml-2"
                                            >
                                                {/*{JSON.stringify(addedElement)}*/}
                                                <img style={{
                                                    width: 18,
                                                    cursor: "pointer"
                                                }}
                                                     alt="Edit Advisory"
                                                     src={require('../../../Images/delete.png')}
                                                     data-index={index}
                                                     data-uid={addedElement.uId}
                                                     onClick={onCauseDeleteClick}
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
                {pagination.totalItemsCount > 0 && <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={pagination.activePage}
                    itemsCountPerPage={pagination.itemsCountPerPage}
                    totalItemsCount={pagination.totalItemsCount}
                    pageRangeDisplayed={pagination.pageRangeDisplayed}
                    onChange={(activePage) => onPageChange("cause", activePage)}
                />}
            </div>
        </div>
    );
}

export default NewCauseTableUI;
