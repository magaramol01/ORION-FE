import {Button, Modal, Table,} from "react-bootstrap";
import React from "react";
import {
    getCommonDateFormat,
    getVesselId,
    dateFormatter,
    getVesselConnectivityMessage,
    getNewDate, getVesselDisplayName
} from "../common/helper";
import {getModbusTrackerDataHistoryByVesselIdAndDates} from "../../api";
import Pagination from "react-js-pagination";
import {defaultPagination} from "../../CBM/componant/Constants";
import _ from "lodash";

class ModbusDataHistoryPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            vesselId: parseInt(getVesselId()),
            modbusTrackerPagination: {...defaultPagination},
        };

        this.onFetchModbusHistoryDataSuccess = this.onFetchModbusHistoryDataSuccess.bind(this);
        this.onFetchModbusHistoryDataFailure = this.onFetchModbusHistoryDataFailure.bind(this);
    }

    fetchModbustHistoryData(activePage) {
        getModbusTrackerDataHistoryByVesselIdAndDates(this.state.vesselId, activePage, this.onFetchModbusHistoryDataSuccess, this.onFetchModbusHistoryDataFailure);
    }

    onFetchModbusHistoryDataSuccess(response) {
        debugger
        this.setState({modbusTrackerPagination: response.data});
    }

    onFetchModbusHistoryDataFailure() {
    }

    togglePopupState() {
        const isShow = this.state.isShow;
        if (!isShow) {
            this.fetchModbustHistoryData(1);
        }
        this.setState(prevState => ({
            isShow: !prevState.isShow
        }));
    }

    onHide() {

    }

    onPaginationChange(activePage) {
        this.fetchModbustHistoryData(activePage);
    }

    static getSrNo(modbusTrackerPagination) {
        return (modbusTrackerPagination.activePage - 1) * modbusTrackerPagination.itemsCountPerPage;
    }

    render() {
        const {isShow, modbusTrackerPagination} = this.state;
        let modbusTrackerData = modbusTrackerPagination.modbusTrackerData;
        modbusTrackerData = _.sortBy(modbusTrackerData, 'fromTime');
        if (!modbusTrackerData) {
            modbusTrackerData = [];
        }
        let srNo = ModbusDataHistoryPopup.getSrNo(modbusTrackerPagination);

        return (
            <Modal size="lg" show={isShow} onHide={() => this.onHide()} backdrop="static" scrollable={true} centered>
                <Modal.Header closeButton onHide={() => this.togglePopupState()}>
                    <Modal.Title>{getVesselDisplayName()} Vessel Connectivity Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="config-form-block sm-w-800">
                        <div>
                            <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table">
                                <thead>
                                <tr className="tableHeader">
                                    <th className="text-center"><b>Sr.No</b></th>
                                    <th className="text-center"><b>Time</b></th>
                                    <th className="text-center"><b>Connectivity Status</b></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    modbusTrackerData.reverse().map((item, index) => {
                                        return (
                                            <tr key={item.id}>
                                                <td className="text-center">{srNo++ + 1}</td>
                                                <td>
                                                    <div className="d-flex flex-row">
                                                        <div
                                                            style={{
                                                                borderRight: "1px solid #e2e2e2"
                                                            }}
                                                            className="pr-1 pl-1"
                                                        >{`Since - ${item.fromTime}`}</div>
                                                        <div
                                                            className="pr-1 pl-1"
                                                        >{`To - ${item.toTime ? item.toTime : dateFormatter(getNewDate(),getCommonDateFormat())}`}</div>
                                                    </div>
                                                </td>
                                                <td className="text-center">{getVesselConnectivityMessage("", item.isNavigationDataReceived, item.isMachineryDataReceived)}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-flex-end">
                        {modbusTrackerPagination.totalItemsCount > 0 && <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            activePage={modbusTrackerPagination.activePage}
                            itemsCountPerPage={modbusTrackerPagination.itemsCountPerPage}
                            totalItemsCount={modbusTrackerPagination.totalItemsCount}
                            pageRangeDisplayed={modbusTrackerPagination.pageRangeDisplayed}
                            onChange={(activePage) => this.onPaginationChange(activePage)}
                        />}
                    </div>
                    <div className="sm-w-800" style={{textAlign: 'center'}}>
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            variant="outline-secondary"
                            onClick={() => this.togglePopupState()}
                        >
                            Close
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

export default ModbusDataHistoryPopup;