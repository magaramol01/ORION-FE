import React from 'react';
import {Button, Table} from 'react-bootstrap';
import {getItemFromLocalStorage} from "../../../../RTCM/common/helper";
import Pagination from "react-js-pagination";

const fa_alarm_text = {
    failure_advisory: "Failure",
    alarm: "Alarm",
};

function NewAdvisoryTableUI({
                                pagination,
                                addedElements,
                                onAddNewAdvisoryClick,
                                onAdvisoryEditClick,
                                onAdvisoryDeleteClick,
                                onPageChange
                            }) {

    addedElements = !addedElements ? [] : addedElements;
    return (
        <div className="tableUIWrapper">
            <div className="tableButtonWrapper">
                <Button
                    className="SM-p-button"
                    onClick={onAddNewAdvisoryClick}
                    variant="outline-secondary">
                    <img
                        alt=""
                        width={16}
                        src={require('../../../Images/plus.png')}
                        style={{marginRight: 6}}
                    />
                    Add Advisory
                </Button>
            </div>
            <Table size="sm" className="sm-custom-table">
                <thead>
                <tr>
                </tr>
                </thead>
                <tbody>
                {/*{
                                        JSON.stringify(addedElements)
                                    }*/}
                {
                    addedElements.map((addedElement, index) => {
                        return (
                            <tr key={`singleInputTable` + index}>
                                {/*<td>{JSON.stringify(addedElement)}</td>*/}
                                <td>
                                    <div className="nameText">{addedElement.name}</div>
                                    <div className="descriptionText">{addedElement.description}</div>
                                </td>
                                <td>Advisory: {fa_alarm_text[addedElement.fa_alarm_radio]}</td>
                                {
                                    (getItemFromLocalStorage("editRules")==="true") && (
                                    <td style={{
                                        position: "relative",
                                        maxWidth: 55,
                                        width: 55
                                    }}>
                                        <div className="d-flex flex-row ">
                                            <div
                                                title="Edit Advisory"
                                            >
                                                <img style={{
                                                    width: 18,
                                                    cursor: "pointer"
                                                }}
                                                     alt="Edit Advisory"
                                                     src={require('../../../Images/edit.png')}
                                                     data-index={index}
                                                     data-uid={addedElement.uId}
                                                     onClick={onAdvisoryEditClick}
                                                />
                                            </div>
                                            <div
                                                title="Delete Advisory"
                                                className="ml-2"
                                            >
                                                <img style={{
                                                    width: 18,
                                                    cursor: "pointer"
                                                }}
                                                     alt="Delete Advisory"
                                                     src={require('../../../Images/delete.png')}
                                                     data-index={index}
                                                     data-uid={addedElement.uId}
                                                     onClick={onAdvisoryDeleteClick}
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
                    onChange={(activePage) => onPageChange("advisory", activePage)}
                />}
            </div>
        </div>
    );
}

export default NewAdvisoryTableUI;
