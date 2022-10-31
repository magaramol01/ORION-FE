import React, {Component} from "react";
import {Button, Col, Form, Modal, Row, Table} from "react-bootstrap";
import SmartShipLoader from "../common/SmartShipLoader";
import {getConstantParameterHistoricalDataById} from "../../../api";
import visibleIcon from '../../Images/downloadedImages/visible--v1.png';

const parameterHistoryData = [
    /*{
        constantValue: "1",
        remark: "1",
        dateTime: "1",
    },
    {
        constantValue: "2",
        remark: "2",
        dateTime: "2",
    },
    {
        constantValue: "3",
        remark: "3",
        dateTime: "3",
    },
    {
        constantValue: "4",
        remark: "4",
        dateTime: "4",
    },*/
];

class CustomParameterHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            parameterHistoryForm: {},
            parameterHistoryData: [],
            show: false,
            parameterUId: props.parameterUId
        }
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    };
    handleShow = () => {
        this.setState({
            show: true
        });
        const payload = {
            ID: this.props.parameterUId
        };
        getConstantParameterHistoricalDataById(this.onSuccess, this.onFailure, payload);
    };

    onSuccess = (res) => {
        debugger
        console.log(res)
        let parameterHistoryData = [];
        if(res.status ===200 && res.statusText==="OK") {
            const historyData = res.data;
            parameterHistoryData = Object.entries(historyData).map(([key, obj]) => {
                {
                    console.log(key);
                    console.log(obj);
                    const {
                        CONST_VALUE,
                        REMARK,
                        DATETIME
                    } = obj;
                    debugger
                    return Object.assign({
                        constantValue: CONST_VALUE,
                        remark: REMARK,
                        dateTime: DATETIME
                    })
                }
            });
        }
        console.log(parameterHistoryData)
        debugger
        console.log(parameterHistoryData)
        this.setState({
            // show: false,
            loading: false,
            parameterHistoryData
        });
    };

    onFailure = (err) => {
        console.log(err);
        this.setState({
            show: true,
            loading: false
        })
    }

    render() {
        const {
            show,
            parameterHistoryData,
            loading
        } = this.state;

        return (
            <>
                {/*<div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 0,
                        border: "1px  solid #ced4d9",
                        maxHeight: 38,
                        backgroundColor: "white",
                        cursor: "pointer",
                        maxWidth: 76
                    }}
                    title={"View Historical Data"}
                    onClick={this.handleShow}
                >
                    {this.props.parameterUId}
                    View
                </div>*/}
                <div
                    title="View Historical Data"
                    // style={{textAlign: "center"}}
                >
                    <img style={{width: 18, cursor: "pointer"}}
                         alt="View Historical Data"
                         src={visibleIcon}
                         onClick={this.handleShow}
                    />
                </div>
                <Modal className="smartShipModal" show={show} onHide={this.handleClose} animation={false} size="lg">
                    <SmartShipLoader isVisible={loading} />
                    <Modal.Header closeButton>
                        Constant History
                    </Modal.Header>
                    <Modal.Body>
                        {/*{JSON.stringify(parameterHistoryData)}*/}
                        <Table size="sm" className="sm-custom-table">
                            <thead>
                            <tr>
                                {/*<th>#</th>*/}
                                <th style={{whiteSpace: "nowrap"}}>Current Value</th>
                                <th >Remark</th>
                                <th >Date Time</th>
                                {/*<th>Delete</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                parameterHistoryData.map((parameterHistoryItem, index) => {
                                    debugger
                                    const formattedDate = `${new Date(parameterHistoryItem.dateTime).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })} ${new Date(parameterHistoryItem.dateTime).toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                        hour12: true,
                                    })}`;
                                    return (
                                        <tr key={`ptIndex-${index}`}>
                                            {/*<td>{index + 1}</td>*/}
                                            <td>{parameterHistoryItem.constantValue}</td>
                                            <td>{parameterHistoryItem.remark}</td>
                                            <td style={{width: 220,maxWidth: 220}}>{formattedDate}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            onClick={this.handleClose}
                            variant="outline-secondary"
                            // disabled={false}
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default CustomParameterHistory;
