import React, { Component, useEffect, useState } from "react";
import SMSidebar from "../../../SMSidebar";
import SmartShipLoader from "../common/SmartShipLoader";
import NavigationBar from "../common/NavigationBar";
import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import {
    loadAllVoyageBannerData,
    registerShip,
    deleteVoyageBannerById,
    getVBById,
    updateVBById,
    registerShips
} from './mrvHandler';
import CustomDatePicker from '../Ship/CustomDatePicker';
import CustomAlert from "../custom/CustomAlert";
import Papa from "papaparse";
import { dateFormatter, getItemFromLocalStorage } from "../../../RTCM/common/helper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
const moment = require('moment');

const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
    },
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
});

const shipCatArr = [
    {
        value: "Tanker",
        label: "Tanker",
    },
    {
        value: "Bulker",
        label: "Bulker",
    }
];

const countryList = [
    { value: "China", label: "China" },
    { value: "India", label: "India" },
    { value: "United States", label: "United States" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Brazil", label: "Brazil" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Russia", label: "Russia" },
    { value: "Mexico", label: "Mexico" },
    { value: "Japan", label: "Japan" },
    { value: "Ethiopia", label: "Ethiopia" },
    { value: "Philippines", label: "Philippines" },
    { value: "Egypt", label: "Egypt" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "DR Congo", label: "DR Congo" },
    { value: "Turkey", label: "Turkey" },
    { value: "Iran", label: "Iran" },
    { value: "Germany", label: "Germany" },
    { value: "Thailand", label: "Thailand" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "France", label: "France" },
    { value: "Italy", label: "Italy" },
    { value: "Tanzania", label: "Tanzania" },
    { value: "South Africa", label: "South Africa" },
    { value: "Myanmar", label: "Myanmar" },
    { value: "Kenya", label: "Kenya" },
    { value: "South Korea", label: "South Korea" },
    { value: "Colombia", label: "Colombia" },
    { value: "Spain", label: "Spain" },
    { value: "Uganda", label: "Uganda" },
    { value: "Argentina", label: "Argentina" },
    { value: "Algeria", label: "Algeria" },
    { value: "Singapore", label: "Singapore" }
];
const getDisplayFromDate = (date) => {
    if (date != "") {
        date = date.replace(' 00:00:00', '');
        let dataArr = date.split('-');
        const fDate = dataArr[0];
        const fMonth = dataArr[1];
        const fYear = dataArr[2];
        return `${fYear}-${fMonth}-${fDate}`;
    }
};
const getFormattedFromDate = (date) => {
    const fDate = ("0" + date.getDate()).slice(-2)//date.getDate();
    const fMonth = ("0" + (Number(date.getMonth()) + 1)).slice(-2);
    const fYear = date.getFullYear();
    return `${fYear}-${fMonth}-${fDate} 00:00:00`;
};


const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
};
class mrvbanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            popup: false,
            mrvUpdate: {
                voyageno: "",
                sourceport: "",
                destination: "",
                eta: "",
                etaDisp: "",
                vsltz: "",
                totaldist: "",
                id: "",
                vessel: ""
            },
            MRVData: [],
            MRVDataForFilter: [],
            MRVDataWithOutForFilter: [],
            mrv: {
                voyageno: null,
                sourceport: null,
                destination: null,
                eta: null,
                vsltz: null,
                totaldist: null,
                vessel: null
            },
            allVesselsData: [],
            allVesselsDataForFilter: [],
            selectedFilterVessel: { value: "ALL", label: "ALL" },
            startDate: new Date()
        };
        this.customAlertRef = React.createRef();
    }

    componentDidMount() {
        this.voyageBannerLoader();
        this.returnVesselList();
        // this.setState({allVesselsData: getItemFromLocalStorage("ssAppAllVesselsData")});
    }
    returnVesselList() {
        const vesselData = getItemFromLocalStorage("ssAppAllVesselsData");
        let vesselRes = new Array();
        let vesselResForFilter = new Array({ value: "ALL", label: "ALL" });
        vesselData.forEach(element => {
            vesselRes.push({
                value: element.Name,
                label: element.Name,
            });
            vesselResForFilter.push({
                value: element.Name,
                label: element.Name,
            })
        });
        this.setState({ allVesselsDataForFilter: vesselResForFilter });
        this.setState({ allVesselsData: vesselRes });
    }
    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    voyageBannerLoader = () => {

        this.setState({ loading: true });
        loadAllVoyageBannerData().then(r => {
            if (r != undefined) {
                this.setState({ MRVData: r });
                this.setState({ MRVDataForFilter: r });
                if (r.isSuccess === 2) {
                    this.showAlert({
                        type: "error",
                        message: "Error Occurred While Loading Records"
                    });
                } else if (r.isSuccess === 0) {
                    this.showAlert({
                        type: "warning",
                        message: "No Records Found"
                    });
                }
            }
            this.setState({ loading: false });
        });
    }

    mrvUpdateReset = () => {
        const { mrvUpdate: mrvUpdate, Mrv: Mrv } = this.state;
        mrvUpdate.voyageno = "";
        mrvUpdate.sourceport = "";
        mrvUpdate.destination = "";
        mrvUpdate.eta = "";
        mrvUpdate.vsltz = "";
        mrvUpdate.totaldist = "";
        mrvUpdate.vessel = "";
        this.setState({ mrvUpdate: mrvUpdate });
    }

    mrvReset = () => {
        const { mrv } = this.state;
        mrv.voyageno = null;
        mrv.sourceport = null;
        mrv.destination = null;
        mrv.eta = null;
        mrv.vsltz = null;
        mrv.totaldist = null;
        mrv.vessel = null;
        this.setState({ mrv });
    }

    onFieldChange = (e) => {
        debugger;
        const { value, name } = e.target;
        const { mrv: mrv } = this.state;
        const currentState = mrv;
        currentState[name] = value;
        this.setState({ mrv: currentState });
    }

    onDateInputChange1 = (date) => {
        debugger;

        const dates = date.format("DD MMM YYYY HH:mm").toString().replace(":", "");
        const dispdate = date.format("DD-MM-YYYY HH:mm");
        const { mrv: mrv } = this.state;
        const currentState = mrv;
        currentState['eta'] = dates;
        currentState['etaDisp'] = '';
        this.setState({ mrv: currentState });
    };
    onDateInputChange = (date) => {
        debugger;

        const dates = moment(date).format("DD MMM YYYY HH:mm").toString().replace(":", "");
        const dispdate = moment(date).format("d MMM yyyy Hmm");
        const { mrv: mrv } = this.state;
        const currentState = mrv;
        currentState['eta'] =  moment(date).format("d MMM yyyy Hmm");
        currentState['etaDisp'] = date;
        this.setState({ startDate: date });
        this.setState({ mrv: currentState });
    };
    getFormattedDate = (date) => {
        return dateFormatter(date, "dd-MM-yyyy");
    };
    getFullFormattedDate = (date) => {
        return dateFormatter(date, "dd MMM yyyy");
    };
    getFormattedDateTime = (date) => {
        if (date != undefined) {
            return dateFormatter(date, "dd-MM-yyyy HH:mm");
        }
        else {
            return "";
        }

    };

    setetaDate = (date) => {
        debugger;
        const { mrv, mrvUpdate } = this.state;
        let splitTime = new Date().toLocaleString('en-GB').split(",")[1].toString().trim().split(":");
        let tempeta = this.getFullFormattedDate(date);

        mrv.eta = tempeta + " " + splitTime[0] + splitTime[1];
        mrvUpdate.eta = this.getFormattedDate(tempeta + " " + splitTime[0] + splitTime[1]);
        this.setState({ mrv: mrv });
    };

    onVoyageBannerDeleteClick = (e) => {
        const VoyageBannerID = e.target.dataset.fid;
        this.setState({ loading: true });
        deleteVoyageBannerById({ id: VoyageBannerID }).then(r => {
            if (r === 2) {
                this.showAlert({
                    type: "error",
                    message: "Error Occurred While Deleting Voyage Banner"
                });
            }
            if (r === 1) {
                this.showAlert({
                    type: "success",
                    message: "Voyage Banner Record Deleted Successfully"
                });
                this.voyageBannerLoader();

            } else {
                this.showAlert({
                    type: "warning",
                    message: "Error Occurred While Deleting Voyage Banner Record"
                });
            }
            this.setState({ loading: false });
        });
    }

    onVoaygeBannerEditClick = (e) => {
        this.mrvUpdateReset();
        this.mrvReset();
        const VoyageBannerID = e.target.dataset.fid;
        this.setState({ loading: true });
        getVBById({ id: VoyageBannerID }).then(r => {
            if (r.isSuccess) {
                let obj = {};
                let dispEtaDate = new Date(r.eta).toDateString() + " " + r.eta.split(" ")[3].substring(0, 2) + ":" + r.eta.split(" ")[3].substring(2, 4);
                obj.destination = r.destination;
                obj.eta = r.eta;
                obj.id = r.id;
                obj.isSuccess = r.isSuccess;
                obj.sourceport = r.sourceport;
                obj.totaldist = r.totaldist;
                obj.vessel = r.vessel
                obj.voyageno = r.voyageno;
                obj.vsltz = r.vsltz;
                obj.etaDisp = moment(dispEtaDate).format("d MMM yyyy Hmm");
                this.setState({ mrvUpdate: obj, loading: false, popup: true });
            } else {
                this.showAlert({
                    type: "error",
                    message: "Error Occurred While Obtaining This Record"
                });
                this.setState({ loading: false });
            }
        })

    }

    popupClose = () => {
        document.getElementById("VoyageBannerReg").reset();
        this.setState({ popup: false });
    }

    popupShow = () => {
        this.mrvReset();
        this.mrvUpdateReset();
        this.setState({ popup: true });
    }

    csvFileReader = (e) => {
        if (e.target.files[0]) {
            this.setState({ loading: true });
            Papa.parse(e.target.files[0], {
                complete: this.csvHandler,
                header: true,
                skipEmptyLines: true
            });
        }
        e.target.value = '';
    }

    csvHandler = (result) => {
        const headerFormat = ["Name", "MappingName", "MakingDate", "PurchaseDate", "MakingYard", "RegisteredCountry",
            "HomePort", "Imo", "Mmsi", "CallSign", "Category", "Flag", "Length"];

        if (result.meta.fields.length === 13 && headerFormat.every(r => result.meta.fields.includes(r))) {
            registerShips(result.data).then(r => {
                if (r === 2) {
                    this.showAlert({
                        type: "error",
                        message: "Error Occurred While Importing CSV"
                    });
                } else if (r === 1) {
                    this.showAlert({
                        type: "success",
                        message: "Ships Imported Successfully"
                    });
                    this.voyageBannerLoader();
                } else {
                    this.showAlert({
                        type: "warning",
                        message: "Error Occurred While Importing CSV"
                    });
                }
                this.setState({ loading: false });
            });
        } else {
            this.showAlert({
                type: "error",
                message: "Invalid CSV File!"
            });
            this.setState({ loading: false });
        }
    }

    onSubmitVoyageBannerDetails = (e) => {
        debugger;
        e.preventDefault();
        const { mrv: mrv } = this.state;
        let payload = {
            voyage: mrv.voyageno,
            sourceport: mrv.sourceport,
            destination: mrv.destination,
            eta: mrv.eta,
            totaldist: mrv.totaldist,
            vsltz: mrv.vsltz,
            vessel: mrv.vessel
        };
        this.setState({ loading: true });
        registerShip(payload).then(r => {
            if (r === 2) {
                this.showAlert({
                    type: "error",
                    message: "Error Occurred While Registering Voyage Banner"
                });
            } else if (r === 1) {
                this.setState({ popup: false });
                this.showAlert({
                    type: "success",
                    message: "Voyage Banner Registered Successfully"
                });
                this.voyageBannerLoader();
            } else {
                this.showAlert({
                    type: "warning",
                    message: "Error Occurred While Registering Voyage Banner"
                });
            }
            this.setState({ loading: false });
        });

    }

    onSubmitUpdateVoyageBanner = (e) => {
        const VoyageBannerID = e.target.dataset.fid;
        const { mrv: mrv } = this.state;
        const { mrvUpdate } = this.state;
        let payload = {};

        if (mrv.voyageno) payload.voyage = mrv.voyageno;
        if (mrv.sourceport) payload.sourceport = mrv.sourceport;
        if (mrv.destination) payload.destination = mrv.destination;
        if (mrv.eta) payload.eta = mrv.eta;
        if (mrv.totaldist) payload.totaldist = mrv.totaldist;
        if (mrv.vsltz) payload.vsltz = mrv.vsltz;
        if (mrv.vessel) payload.vessel = mrv.vessel;

        payload.id = VoyageBannerID;

        this.setState({ loading: true });
        updateVBById(payload).then(r => {
            if (r === 2) {
                this.showAlert({
                    type: "error",
                    message: "Error Occurred While Updating Voyage Banner"
                });
            } else if (r === 1) {
                this.showAlert({
                    type: "success",
                    message: "Voyage Banner Updated Successfully"
                });
                this.voyageBannerLoader();
                this.setState({ popup: false });
            } else {
                this.showAlert({
                    type: "warning",
                    message: "No Records Updated!"
                });
            }
        });
        this.setState({ loading: false });
    }

    categorySelector = (e) => {
        const mrv = this.state.mrv;
        mrv.vessel = e.value;
        this.setState({ mrv: mrv });
    };
    categorySelectorForFilter = (e) => {
        let mrvData = this.state.MRVDataForFilter;
        let mrvDataFilterVesselWise;
        if (e.value === "ALL") {
            mrvDataFilterVesselWise = mrvData;
        }
        else {
            mrvDataFilterVesselWise = mrvData.filter(x => x.vessel === e.value);
        }
        this.setState({ MRVData: mrvDataFilterVesselWise });
    };

    render() {
        const {
            MRVData,
            mrvUpdate,
            mrv,
            loading,
            popup,
            allVesselsData,
            allVesselsDataForFilter,
            selectedFilterVessel,
            startDate
        } = this.state;
        debugger;
        return (
            <SMSidebar history={this.props.history} screenPath={"/settings"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading} />
                    <CustomAlert ref={this.customAlertRef} />
                    <NavigationBar
                        title={"Voyage Banner List"} />
                    {
                        <div className="flex-1 overflow-auto cbm-wrapper d-flex justify-content-center">
                            {/* <input type="file" accept=".csv"
                                id='uploadCSV'
                                style={{ width: "0px", opacity: 0, position: "fixed" }}
                                onChange={this.csvFileReader}
                                ref={input => {
                                    this.uploadCSV = input;
                                }}
                            /> */}
                            <div className="config-form-block alarm-form" style={{ width: "98%" }}>
                                <nav
                                    className="MyTabs nav nav-tabs"
                                    style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
                                >
                                    <a
                                        className="nav-item nav-link active"
                                    >Voyage Banner Details
                                    </a>
                                    <div style={{ width: '300px' }}>
                                        <Select
                                            theme={theme}
                                            defaultValue={
                                                selectedFilterVessel
                                            }
                                            options={allVesselsDataForFilter}
                                            onChange={this.categorySelectorForFilter}
                                        /></div>
                                    <div style={{ display: "flex" }}>
                                        {/* <Button
                                            size="sm"
                                            className="parameter-add-button"
                                            variant="outline-secondary"
                                            onClick={() => {
                                                this.uploadCSV.click()
                                            }}
                                        >
                                            Upload CSV
                                        </Button> */}
                                        <Button
                                            size="sm"
                                            className="float-right parameter-add-button"
                                            variant="outline-secondary"
                                            onClick={this.popupShow}
                                        >
                                            Add Voyage Banner Data
                                        </Button>
                                    </div>
                                </nav>
                                <div>
                                    <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table" style={{ textAlign: "center" }}>
                                        <thead>
                                            <tr className="tableHeader">
                                                <th className="align-middle">Sr.No.</th>
                                                <th className="align-middle">Vessel</th>
                                                <th className="align-middle">Voyage No</th>
                                                <th className="align-middle">Source Port</th>
                                                <th className="align-middle">Destination Port</th>
                                                <th className="align-middle">ETA</th>
                                                <th className="align-middle">Total Dist</th>
                                                <th className="align-middle">Vsl Time Zone</th>
                                                <th className="align-middle">Username</th>
                                                <th className="align-middle">Update Time</th>
                                                <th className="align-middle">Edit List</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                MRVData && MRVData.map((item, index) => {

                                                    return (
                                                        <tr key={index + 1}>
                                                            <td className="align-middle">{index + 1}</td>
                                                            <td className="align-middle">{item.vessel}</td>
                                                            <td className="align-middle">{item.voyage}</td>

                                                            <td className="align-middle">{item.sourceport}</td>
                                                            <td className="align-middle">{item.destination}</td>
                                                            <td className="align-middle">{item.eta}</td>
                                                            <td className="align-middle">{item.totaldist}</td>
                                                            <td className="align-middle">{item.vsltz}</td>
                                                            <td className="align-middle">{item.username}</td>
                                                            <td className="align-middle">{this.getFormattedDateTime(item.createdon)}</td>
                                                            <td className="align-middle">
                                                                <div style={{ display: "flex", justifyContent: "space-evenly" }} >
                                                                    <img style={{
                                                                        width: 18,
                                                                        cursor: "pointer"
                                                                    }}
                                                                        alt="Edit Voyage Banner"
                                                                        src={require('../../Images/edit.png')}
                                                                        data-index={index + 1}
                                                                        data-fid={item.mid}
                                                                        onClick={this.onVoaygeBannerEditClick}
                                                                        title={"Edit Voyage Banner"}
                                                                    />
                                                                </div>
                                                                <img style={{
                                                                    width: 18,
                                                                    cursor: "pointer",
                                                                }}
                                                                    alt="Delete Voayge Banner"
                                                                    src={require('../../Images/delete.png')}
                                                                    data-index={index + 1}
                                                                    data-fid={item.mid}
                                                                    onClick={this.onVoyageBannerDeleteClick}
                                                                    title="Delete Ship"
                                                                />
                                                            </td>

                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <Modal
                                    size="lg"
                                    show={popup}
                                    onHide={this.popupClose}
                                    backdrop="static"
                                    centered
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title style={{ color: "#6d6d6c" }}>Voyage Banner Details</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="config-form-block sm-w-800">
                                            <div>
                                                <Form id="VoyageBannerReg">
                                                    <Row>
                                                        <Form.Group size="sm" as={Col} >
                                                            <Form.Label>Vessel</Form.Label>
                                                            <Select
                                                                theme={theme}
                                                                defaultValue={
                                                                    mrvUpdate.vessel === '' ? [] :
                                                                        [
                                                                            {
                                                                                value: mrvUpdate.vessel,
                                                                                label: mrvUpdate.vessel
                                                                            }
                                                                        ]
                                                                }
                                                                options={allVesselsData}
                                                                onChange={this.categorySelector}
                                                            />
                                                        </Form.Group>
                                                    </Row>
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Voyage No</Form.Label>
                                                            <Form.Control
                                                                placeholder="Voyage No"
                                                                name="voyageno"
                                                                autoComplete="off"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={mrvUpdate.voyageno}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Source Port</Form.Label>
                                                            <Form.Control
                                                                placeholder="Source Port"
                                                                name="sourceport"
                                                                autoComplete="off"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={mrvUpdate.sourceport}
                                                            />
                                                        </Form.Group>
                                                    </Row>
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Destination</Form.Label>
                                                            <Form.Control
                                                                placeholder="Source Port"
                                                                name="destination"
                                                                autoComplete="off"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={mrvUpdate.destination}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>ETA</Form.Label>
                                                            {/* <CustomDatePicker
                                                                onDateChange={this.setETADate}
                                                                onDateInputChange={this.onDateInputChange}
                                                                value={mrvUpdate.eta}
                                                                dateName={"eta"}
                                                            /> */}
                                                            {/* <DatePicker className="form-control form-control-sm"
                                                                onChange={this.onDateInputChange}
                                                                name="eta"
                                                                value={mrvUpdate.eta}
                                                                dateName={"eta"}
                                                            /> */}
                                                            {/* <Datetime disabled
                                                                onChange={this.onDateInputChange}

                                                                inputProps={{ placeholder: "eta nextport" }}
                                                                name="etaDisp"

                                                                closeOnClickOutside={true}
                                                                value={mrvUpdate.etaDisp}
                                                                dateName={"etaDisp"} /> */}

                                                            <DatePicker
                                                                className="form-control form-control-sm"
                                                                onChange={(date) => this.onDateInputChange(date)}
                                                                showTimeSelect
                                                                filterTime={filterPassedTime}
                                                                dateFormat="d MMM yyyy Hmm"
                                                                name="etaDisp"
                                                                selected={startDate}

                                                            />
                                                        </Form.Group>
                                                    </Row>
                                                    <Row>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Vessel Time zone</Form.Label>
                                                            <Form.Control
                                                                placeholder="Vessel Time zone"
                                                                autoComplete="off"
                                                                name="vsltz"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={mrvUpdate.vsltz}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group size="sm" as={Col}>
                                                            <Form.Label>Total Dist</Form.Label>
                                                            <Form.Control
                                                                placeholder="Total Dist"
                                                                autoComplete="off"
                                                                name="totaldist"
                                                                onChange={this.onFieldChange}
                                                                defaultValue={mrvUpdate.totaldist}
                                                            />
                                                        </Form.Group>
                                                    </Row>
                                                </Form>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            size="sm"
                                            className="parameter-add-button ml-0"
                                            variant="outline-secondary"
                                            onClick={this.popupClose}
                                        >
                                            Cancel
                                        </Button>
                                        {
                                            (
                                                mrvUpdate.id === "" && (
                                                    <Button
                                                        size="sm"
                                                        className="parameter-add-button ml-0"
                                                        variant="outline-secondary"
                                                        onClick={this.onSubmitVoyageBannerDetails}
                                                    >
                                                        Save
                                                    </Button>
                                                )
                                            )
                                            || (
                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button ml-0"
                                                    variant="outline-secondary"
                                                    data-fid={mrvUpdate.id}
                                                    onClick={this.onSubmitUpdateVoyageBanner}
                                                >
                                                    Update
                                                </Button>
                                            )
                                        }
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </div>
                    }
                </div>
            </SMSidebar>
        )
    }
}
export default mrvbanner;
