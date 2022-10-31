import React, { Component } from "react";
import SMSidebar from "../../../SMSidebar";
import SmartShipLoader from "../common/SmartShipLoader";
import NavigationBar from "../common/NavigationBar";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import Select from "react-select";
import CustomDatePicker from "./CustomDatePicker";
import {
  deleteShipById,
  getShipById,
  loadAllShips,
  registerShip,
  registerShips,
  updateShipById,
  loadAllSister,
  loadAllFleet,
  deleteSisterShipById,
  deleteFleetById,
} from "./shipHandler";
import CustomAlert from "../custom/CustomAlert";
import Papa from "papaparse";
import { dateFormatter } from "../../../RTCM/common/helper";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import deleteIcon from "../../Images/delete.png";
import editIcon from "../../Images/edit.png";
import addIcon from "../../Images/add-icon.png";
import { createVesselGroup, createFleet } from "../../../api";
import "../../../CBM/css/common.css";

const theme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
  },
  borderRadius: 2,
  baseUnit: 1,
  controlHeight: 35,
  fontSize: 14,
});

const shipCatArr = [
  
  {
    value: "Tanker",
    label: "Tanker",
  },
  {
    value: "Bulker",
    label: "Bulker",
  },
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
  { value: "Singapore", label: "Singapore" },
];
let AllShipSister = [];
let AllFleet = [];

class Ships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      popup: false,
      ShipUpdate: {
        MappingName: "",
        Imo: "",
        Mmsi: "",
        CallSign: "",
        Flag: "",
        Length: "",
        Category: "",
        HomePort: "",
        MakingDate: "",
        MakingYard: "",
        Name: "",
        PurchaseDate: "",
        RegisteredCountry: "",
        id: "",
        SisterGroup: "",
        Fleet: [],
      },
      isFormValid: false,
      ShipData: [],
      ShipSister: [],
      FleetData: [],
      FleetData1: [],
      Ship: {
        mappingName: "",
        imo: "",
        mmsi: "",
        callSign: "",
        flag: "",
        length: "",
        name: "",
        category: "",
        makingDate: "",
        purchaseDate: "",
        makingYard: "",
        registeredCountry: "",
        homePort: "",
        sisterGroup: "",
        fleet: [],
      },
      show: false,
      showFleetModal: false,
      isAddVesselGroupButtonDisabled: true,
      VesselGroupName: "",
      VesselGroupDescription: "",
      VesselGroupOptions: [],
      fleetName: "",
      fleetDescription: "",
      fleetOption: [],
    };
    this.customAlertRef = React.createRef();
  }

  componentDidMount() {
    this.shipLoader();
    this.sisterGroup();
    this.getFleet();
  }

  showAlert = (message) => {
    this.customAlertRef.current.showAlert(message);
  };

  sisterGroup = () => {
    this.setState({ loading: true });
    loadAllSister().then((r) => {
      this.setState({ ShipSister: r });
      if (r.isSuccess === 1) {
        let shipNameArray = [];
        let temp = [...this.state.ShipSister];
        temp.map((item) => {
          let obj = {};
          obj["label"] = item.vesselgroupname;
          obj["value"] = item.vesselgroupname;
          shipNameArray.push(obj);
        });
        AllShipSister = shipNameArray;
      } else if (r.isSuccess === 0) {
        this.showAlert({
          type: "warning",
          message: "No Records Found",
        });
      }
      this.setState({ loading: false });
    });
  };

  getFleet = () => {
    this.setState({ loading: true });
    loadAllFleet().then((r) => {
      this.setState({ FleetData: r });
      if (r.isSuccess === 1) {
        let fleet = [];
        let temp = [...this.state.FleetData];
        temp.map((item) => {
          let obj = {};
          obj["label"] = item.name;
          obj["value"] = item.id;
          fleet.push(obj);
        });
        AllFleet = fleet;
      } else if (r.isSuccess === 0) {
        this.showAlert({
          type: "warning",
          message: "No Records Found",
        });
      }
      this.setState({ loading: false });
    });
  };

  shipLoader = () => {
    this.setState({ loading: true });
    loadAllShips().then((r) => {
      this.setState({ ShipData: r });
      if (r.isSuccess === 2) {
        this.showAlert({
          type: "error",
          message: "Error Occurred While Loading Records",
        });
      } else if (r.isSuccess === 0) {
        this.showAlert({
          type: "warning",
          message: "No Records Found",
        });
      }
      this.setState({ loading: false });
    });
  };

  shipUpdateReset = () => {
    const { ShipUpdate: ShipUpdate, Ship: Ship } = this.state;
    ShipUpdate.Imo = "";
    ShipUpdate.Mmsi = "";
    ShipUpdate.CallSign = "";
    ShipUpdate.Flag = "";
    ShipUpdate.Length = "";
    ShipUpdate.Category = "";
    ShipUpdate.HomePort = "";
    ShipUpdate.MakingDate = "";
    ShipUpdate.MakingYard = "";
    ShipUpdate.Name = "";
    ShipUpdate.PurchaseDate = "";
    ShipUpdate.RegisteredCountry = "";
    ShipUpdate.MappingName = "";
    ShipUpdate.id = "";
    ShipUpdate.isSuccess = "";
    ShipUpdate.makingDate = "";
    ShipUpdate.purchaseDate = "";
    ShipUpdate.SisterGroup = "";
    ShipUpdate.Fleet = [];
    this.setState({ ShipUpdate: ShipUpdate });
  };

  shipReset = () => {
    const { Ship } = this.state;
    Ship.mappingName = "";
    Ship.imo = "";
    Ship.mmsi = "";
    Ship.callSign = "";
    Ship.flag = "";
    Ship.length = "";
    Ship.name = "";
    Ship.category = "";
    Ship.makingDate = "";
    Ship.purchaseDate = "";
    Ship.makingYard = "";
    Ship.registeredCountry = "";
    Ship.homePort = "";
    Ship.sisterGroup = "";
    Ship.fleet = [];
    this.setState({ Ship });
  };

  onFieldChange = (e) => {
    const { value, name } = e.target;
    const { Ship: Ship } = this.state;
    const currentState = Ship;
    currentState[name] = value;
    this.setState({ Ship: currentState });
  };

  categorySelector = (e) => {
    const Ship = this.state.Ship;
    Ship.category = e.target.value;
    this.setState({ Ship: Ship });
  };

  countrySelector = (e) => {
    const Ship = this.state.Ship;
    Ship.registeredCountry = e.target.value;
    this.setState({ Ship: Ship });
  };

  onDateInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  getFormattedDate = (date) => {
    return dateFormatter(date, "dd-MM-yyyy");
  };

  setMakingDate = (date) => {
    const { Ship: Ship, ShipUpdate: ShipUpdate } = this.state;
    Ship.makingDate = this.getFormattedDate(date);
    ShipUpdate.MakingDate = this.getFormattedDate(date);
    this.setState({ Ship: Ship });
  };

  setPurchaseDate = (date) => {
    const { Ship, ShipUpdate } = this.state;
    Ship.purchaseDate = this.getFormattedDate(date);
    ShipUpdate.PurchaseDate = this.getFormattedDate(date);
    this.setState({ Ship });
  };

  onShipDeleteClick = (e) => {
    const ShipID = e.target.dataset.fid;
    this.setState({ loading: true });
    deleteShipById({ id: ShipID }).then((r) => {
      if (r === 2) {
        this.showAlert({
          type: "error",
          message: "Error Occurred While Deleting Ship",
        });
      }
      if (r === 1) {
        this.showAlert({
          type: "success",
          message: "Ship Record Deleted Successfully",
        });
        this.shipLoader();
      } else {
        this.showAlert({
          type: "warning",
          message: "Error Occurred While Deleting Ship Record",
        });
      }
      this.setState({ loading: false });
    });
  };

  onShipEditClick = (e) => {
    this.shipUpdateReset();
    this.shipReset();
    const ShipID = e.target.dataset.fid;
    this.setState({ loading: true });
    getShipById({ id: ShipID }).then((r) => {
      if (r.isSuccess) {
        console.log(r)
        this.setState({ ShipUpdate: r, loading: false, popup: true });
      } else {
        this.showAlert({
          type: "error",
          message: "Error Occurred While Obtaining This Record",
        });
        this.setState({ loading: false });
      }
    });
  };

  popupClose = () => {
    document.getElementById("ShipReg").reset();
    this.setState({ popup: false, isFormValid:false });
  };

  popupShow = () => {
    this.shipReset();
    this.shipUpdateReset();
    this.setState({ popup: true });
  };

  csvFileReader = (e) => {
    if (e.target.files[0]) {
      this.setState({ loading: true });
      Papa.parse(e.target.files[0], {
        complete: this.csvHandler,
        header: true,
        skipEmptyLines: true,
      });
    }
    e.target.value = "";
  };

  csvHandler = (result) => {
    const headerFormat = [
      "Name",
      "MappingName",
      "MakingDate",
      "PurchaseDate",
      "MakingYard",
      "RegisteredCountry",
      "HomePort",
      "Imo",
      "Mmsi",
      "CallSign",
      "Category",
      "Flag",
      "Length",
    ];

    if (
      result.meta.fields.length === 13 &&
      headerFormat.every((r) => result.meta.fields.includes(r))
    ) {
      registerShips(result.data).then((r) => {
        if (r === 2) {
          this.showAlert({
            type: "error",
            message: "Error Occurred While Importing CSV",
          });
        } else if (r === 1) {
          this.showAlert({
            type: "success",
            message: "Ships Imported Successfully",
          });
          this.shipLoader();
        } else {
          this.showAlert({
            type: "warning",
            message: "Error Occurred While Importing CSV",
          });
        }
        this.setState({ loading: false });
      });
    } else {
      this.showAlert({
        type: "error",
        message: "Invalid CSV File!",
      });
      this.setState({ loading: false });
    }
  };

  validateForm = (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    this.setState({ ...this.state, isFormValid: true });
  };


  onSubmitRegisterShip = (e) => {
    // if (this.state.isFormValid === false) return;

    const { Ship: Ship } = this.state;
    let payload = {
      Name: Ship.name,
      MappingName: Ship.mappingName,
      Category: Ship.category,
      MakingYard: Ship.makingYard,
      MakingDate: Ship.makingDate,
      PurchaseDate: Ship.purchaseDate,
      RegisteredCountry: Ship.registeredCountry,
      HomePort: Ship.homePort,
      Imo: Ship.imo,
      Mmsi: Ship.mmsi,
      CallSign: Ship.callSign,
      Flag: Ship.flag,
      Length: Ship.length,
      SisterGroup: Ship.sisterGroup,
      Fleet: Ship.fleet,
    };

    // Check if all the values in the payload object are truthy and return if not
    const isFormFilled = Object.values(payload).every((k) =>  !k || k.length > 0 );
    console.log(isFormFilled, payload)
    if (!isFormFilled) return;
    // this.setState({ loading: true });

    let sisterGroupVal = Ship.sisterGroup;
    let FleetVal = Ship.fleet;
    let flag = 1;
    if (sisterGroupVal !== null || FleetVal.length > 0) {
      flag = 1;
    } else {
      flag = 0;
      this.showAlert({
        type: "error",
        message: "Select Sister Vessel OR FLeet",
      });
    }

    if (flag == 1) {
      this.setState({ loading: true });
      registerShip(payload).then((r) => {
        if (r === 2) {
          this.showAlert({
            type: "error",
            message: "Error Occurred While Registering Ship",
          });
        } else if (r === 1) {
          this.setState({ popup: false });
          this.showAlert({
            type: "success",
            message: "Ship Registered Successfully",
          });
          this.shipLoader();
        } else {
          this.showAlert({
            type: "warning",
            message: "Error Occurred While Registering Ship",
          });
        }
        this.setState({ loading: false });
      });
    }
  };

  onSubmitUpdateShip = (e) => {
    const ShipID = e.target.dataset.fid;
    const { Ship: Ship } = this.state;
    const { ShipUpdate } = this.state;
    let payload = {};
    if (Ship.name) {
      payload.Name = Ship.name;
      payload.oldShipName = ShipUpdate.Name;
    }
    if (Ship.mappingName) payload.MappingName = Ship.mappingName;
    if (Ship.category) payload.Category = Ship.category;
    if (Ship.makingDate) payload.MakingDate = Ship.makingDate;
    if (Ship.purchaseDate) payload.PurchaseDate = Ship.purchaseDate;
    if (Ship.makingYard) payload.MakingYard = Ship.makingYard;
    if (Ship.registeredCountry)
      payload.RegisteredCountry = Ship.registeredCountry;
    if (Ship.homePort) payload.HomePort = Ship.homePort;
    if (Ship.imo) payload.Imo = Ship.imo;
    if (Ship.mmsi) payload.Mmsi = Ship.mmsi;
    if (Ship.callSign) payload.CallSign = Ship.callSign;
    if (Ship.flag) payload.Flag = Ship.flag;
    if (Ship.length) payload.Length = Ship.length;
    if (Ship.sisterGroup) payload.SisterGroup = Ship.sisterGroup;
    if (Ship.fleet.length > 0) {
      let ids = [];
      AllFleet.map((item) => {
        if (
          Ship.fleet.includes(item.label) ||
          Ship.fleet.includes(item.value)
        ) {
          ids.push(item.value);
        }
      });
      payload.fleet = ids;
    }
    payload.id = ShipID;

    // Check if all the values in the payload object are truthy and return if not
    const isFormFilled = Object.values(payload).every((k) =>   !k || k.length > 0);
    console.log(isFormFilled, payload)

    if (!isFormFilled) return;
    this.setState({loading: true});
    updateShipById(payload).then((r) => {
      if (r === 2) {
        this.showAlert({
          type: "error",
          message: "Error Occurred While Updating Ship",
        });
      } else if (r === 1) {
        this.showAlert({
          type: "success",
          message: "Ship Updated Successfully",
        });
        this.shipLoader();
        this.setState({ popup: false });
      } else {
        this.showAlert({
          type: "warning",
          message: "No Records Updated!",
        });
      }
      this.setState({ loading: false });
    });
    this.setState({ loading: false });
  };

  handleSisterModalShow = () => {
    this.setState({
      show: true,
    });
  };

  handleSisterClose = () => {
    this.setState({
      show: false,
    });
  };

  handleFleetModalClose = () => {
    this.setState({
      showFleetModal: false,
    });
  };

  handleFleetModalShow = () => {
    this.setState({
      showFleetModal: true,
    });
  };

  onVesselGroupChange = (event) => {
    const VesselGroupName = event.target.value.trim();
    var isAddVesselGroupButtonDisabled;
    const VesselGroupDescription = this.state.VesselGroupDescription;

    if (VesselGroupName.length > 0 && VesselGroupDescription.length > 0) {
      this.setState({ isAddVesselGroupButtonDisabled: true });
    } else {
      this.setState({ isAddVesselGroupButtonDisabled: false });
    }
    this.setState({
      VesselGroupName,
      VesselGroupDescription,
    });
  };

  onFleetChange = (event) => {
    const fleetName = event.target.value.trim();
    this.setState({
      fleetName,
    });
  };

  onFleetDescriptionChange = (event) => {
    const fleetDescription = event.target.value.trim();
    this.setState({
      fleetDescription,
    });
  };

  onVesselGroupDescriptionChange = (event) => {
    const VesselGroupDescription = event.target.value.trim();
    var isAddVesselGroupButtonDisabled;
    const VesselGroupName = this.state.VesselGroupName;

    if (VesselGroupName.length > 0 && VesselGroupDescription.length > 0) {
      //isAddVesselGroupButtonDisabled = 'false';
      this.setState({ isAddVesselGroupButtonDisabled: true });
    } else {
      this.setState({ isAddVesselGroupButtonDisabled: false });
    }
    this.setState({
      VesselGroupDescription,
      isAddVesselGroupButtonDisabled,
      VesselGroupName,
    });
  };

  onAddVesselGroupClick = () => {
    const payload = {
      groupname: this.state.VesselGroupName,
      description: this.state.VesselGroupDescription,
    };
    createVesselGroup(
      this.onCreateSisterVesselGroupSuccess,
      this.onCreateUnitFailure,
      payload
    );
  };

  onCreateSisterVesselGroupSuccess = (response) => {
    if (response.data.status) {
      let VesselGroupOptions = [
        {
          id: response.data.id.toString(),
          VesselGroupName: this.state.VesselGroupName,
          VesselGroupDescription: this.state.VesselGroupDescription,
        },
        ...this.state.VesselGroupOptions,
      ];
      this.setState({
        loading: false,
        VesselGroupOptions,
        VesselGroupName: "",
        VesselGroupDescription: "",
        isAddVesselGroupButtonDisabled: true,
      });
      this.sisterGroup();
      this.showAlert({
        type: "success",
        message: "Sister Vessel group Added Successfully",
      });
    } else {
      if (response.data.id === 0) {
        this.showAlert({
          type: "warning",
          message: "Sister Group Already Exists",
        });
      }
    }
  };

  onAddFleetClick = () => {
    const payload = {
      fleetname: this.state.fleetName,
      description: this.state.fleetDescription,
    };
    createFleet(this.onCreateFleetSuccess, this.onCreatefleetFailure, payload);
  };

  onCreatefleetFailure = (response) => {};

  onCreateFleetSuccess = (response) => {
    if (response.data.status) {
      let fleetOption = [
        {
          id: response.data.id.toString(),
          name: this.state.fleetName,
          description: this.state.fleetDescription,
        },
        ...this.state.fleetOption,
      ];
      this.setState({
        loading: false,
        fleetOption,
        fleetName: "",
        fleetDescription: "",
        isAddVesselGroupButtonDisabled: true,
      });
      this.getFleet();
      this.showAlert({
        type: "success",
        message: "Fleet Added Successfully",
      });
    } else {
      if (response.data.id === 0) {
        this.showAlert({
          type: "warning",
          message: "Fleet Already Exists",
        });
      }
    }
  };

  onDeleteSisterClick = (event) => {
    const id = event.target.dataset.id;
    this.setState({ loading: true });
    deleteSisterShipById({ id: id }).then((r) => {
      if (r === 2) {
        this.showAlert({
          type: "error",
          message: "Error Occurred While Deleting Sister Vessel Group ",
        });
      }
      if (r === 1) {
        this.showAlert({
          type: "success",
          message: "Sister Vessel Group Record Deleted Successfully",
        });
        // this.shipLoader();
        this.sisterGroup();
      } else {
        this.showAlert({
          type: "warning",
          message: "Error Occurred While Deleting Sister Vessel Group  Record",
        });
      }
      this.setState({ loading: false });
    });
  };

  onDeleteFleetClick = (event) => {
    const id = event.target.dataset.id;
    this.setState({ loading: true });
    deleteFleetById({ id: id }).then((r) => {
      if (r === 2) {
        this.showAlert({
          type: "error",
          message: "Error Occurred While Deleting Fleet",
        });
      }
      if (r === 1) {
        this.showAlert({
          type: "success",
          message: "Fleet Record Deleted Successfully",
        });
        // this.shipLoader();
        this.getFleet();
      } else {
        this.showAlert({
          type: "warning",
          message: "Error Occurred While Deleting Fleet Record",
        });
      }
      this.setState({ loading: false });
    });
  };

  SisterSelector = (e) => {
    const Ship = this.state.Ship;
    Ship.sisterGroup = e.value;
    this.setState({ Ship: Ship });
  };

  onDropdownMultipleValueChange = (selectedValue) => {
    const Ship = this.state.Ship;

    let selectedValueArr = [];
    let temp = "";
    if (!(selectedValue == null)) {
      for (let i = 0; i < selectedValue.length; i++) {
        selectedValueArr.push(selectedValue[i].value);
        temp += selectedValue[i].value + ",";
      }
    }
    this.setState({ Ship: Ship });

    const currentState = Ship;
    currentState["fleet"] = selectedValueArr;
  };



  render() {
    const {
      ShipData,
      ShipUpdate,
      Ship,
      loading,
      popup,
      show,
      showFleetModal,
      isAddVesselGroupButtonDisabled,
      VesselGroupName,
      VesselGroupDescription,
      VesselGroupOptions,
      fleetName,
      fleetDescription,
      fleetOption,
      ShipSister,
      FleetData,
      EditFleet,
    } = this.state;
    return (
      <SMSidebar history={this.props.history} screenPath={"/settings"}>
        <div className="smartShipBody d-flex flex-column vh-100">
          <SmartShipLoader isVisible={loading} />
          <CustomAlert ref={this.customAlertRef} />
          <NavigationBar title={"Ships"} />
          {
            <div className="flex-1 overflow-auto cbm-wrapper d-flex justify-content-center">
              <input
                type="file"
                accept=".csv"
                id="uploadCSV"
                style={{ width: "0px", opacity: 0, position: "fixed" }}
                onChange={this.csvFileReader}
                ref={(input) => {
                  this.uploadCSV = input;
                }}
              />
              <div
                className="config-form-block alarm-form"
                style={{ width: "98%" }}
              >
                <nav
                  className="MyTabs nav nav-tabs"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <a className="nav-item nav-link active">Ship Details</a>

                  <div style={{ display: "flex" }}>
                    <Button
                      size="sm"
                      className="parameter-add-button"
                      variant="outline-secondary"
                      onClick={() => {
                        this.uploadCSV.click();
                      }}
                    >
                      Upload CSV
                    </Button>
                    <Button
                      size="sm"
                      className="float-right parameter-add-button"
                      variant="outline-secondary"
                      onClick={this.popupShow}
                    >
                      Register Ship
                    </Button>
                  </div>
                </nav>
                <div>
                  <Table
                    bordered
                    hover
                    responsive="sm"
                    size="sm"
                    className="sm-alarm-table"
                    style={{ textAlign: "center" }}
                  >
                    <thead>
                      <tr className="tableHeader">
                        <th className="align-middle">Sr.No.</th>
                        <th className="align-middle">Ship Name</th>
                        <th className="align-middle">Ship Category</th>
                        <th className="align-middle">Making Yard</th>
                        <th className="align-middle">Making Date</th>
                        <th className="align-middle">Purchase Date</th>
                        <th className="align-middle">Registered Country</th>
                        <th className="align-middle">Home Port</th>
                        <th className="align-middle">Edit List</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ShipData &&
                        ShipData.map((item, index) => {
                          return (
                            <tr key={index + 1}>
                              <td className="align-middle">{index + 1}</td>
                              <td className="align-middle">{item.Name}</td>
                              <td className="align-middle">{item.Category}</td>
                              <td className="align-middle">
                                {item.MakingYard}
                              </td>
                              <td className="align-middle">
                                {item.MakingDate}
                              </td>
                              <td className="align-middle">
                                {item.PurchaseDate}
                              </td>
                              <td className="align-middle">
                                {item.RegisteredCountry}
                              </td>
                              <td className="align-middle">{item.HomePort}</td>
                              <td className="align-middle">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  <img
                                    style={{
                                      width: 18,
                                      cursor: "pointer",
                                    }}
                                    alt="Edit Ship"
                                    src={editIcon}
                                    data-index={index + 1}
                                    data-fid={item.id}
                                    onClick={this.onShipEditClick}
                                    title={"Edit Ship"}
                                  />

                                  <img
                                    style={{
                                      width: 18,
                                      cursor: "pointer",
                                    }}
                                    alt="Delete Ship"
                                    src={deleteIcon}
                                    data-index={index + 1}
                                    data-fid={item.id}
                                    onClick={this.onShipDeleteClick}
                                    title="Delete Ship"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
                    <Modal.Title style={{ color: "#6d6d6c" }}>
                      Register Ship
                    </Modal.Title>
                  </Modal.Header>
                  <Form
                    id="ShipReg"
                    noValidate
                    validated={this.state.isFormValid}
                    onSubmit={this.validateForm}
                  >
                    <Modal.Body>
                      <div className="config-form-block sm-w-800">
                        <div>
                          <Row>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                // controlId="validationCustom01"
                                required
                                placeholder="Ship Name"
                                name="name"
                                autoComplete="off"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.Name}
                              />
                              <Form.Control.Feedback type="invalid">
                                Ship Name is required
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Mapping Name</Form.Label>
                              <Form.Control
                                required
                                placeholder="Mapping Name"
                                name="mappingName"
                                autoComplete="off"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.MappingName}
                              />
                              <Form.Control.Feedback type="invalid">
                                Mapping Name is required
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Making Date</Form.Label>
                              <CustomDatePicker
                                required
                                onDateChange={this.setMakingDate}
                                onDateInputChange={this.onDateInputChange}
                                value={ShipUpdate.MakingDate}
                                dateName={"makingDate"}
                              />
                              <Form.Control.Feedback type="invalid">
                                Making Date is required
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Purchase Date</Form.Label>
                              <CustomDatePicker
                                required
                                onDateChange={this.setPurchaseDate}
                                onDateInputChange={this.onDateInputChange}
                                value={ShipUpdate.PurchaseDate}
                                dateName={"purchaseDate"}
                              />
                              <Form.Control.Feedback type="invalid">
                                Purchase Date is required
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Making Yard</Form.Label>
                              <Form.Control
                                required
                                placeholder="Making Yard"
                                autoComplete="off"
                                name="makingYard"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.MakingYard}
                              />
                              <Form.Control.Feedback type="invalid">
                                Making Yard is required
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Registered Country</Form.Label>
                              <Form.Control
                                as="select" 
                                custom
                                onChange={this.countrySelector}
                                defaultValue={
                                  ShipUpdate.RegisteredCountry
                                    ? ShipUpdate.RegisteredCountry
                                    : ""
                                }
                                required
                              >
                                <option value="" disabled selected hidden>Select Registered Country...</option>
                                {countryList.map((country) => {
                                  return (
                                    <option
                                      key={country.label}
                                      label={country.label}
                                      value={country.value}
                                    ></option>
                                  );
                                })}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                Registered Country is required
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Home Port</Form.Label>
                              <Form.Control
                                required
                                placeholder="Port"
                                autoComplete="off"
                                name="homePort"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.HomePort}
                              />
                              <Form.Control.Feedback type="invalid">
                                Home Port is required
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Imo</Form.Label>
                              <Form.Control
                                required
                                placeholder="Imo"
                                autoComplete="off"
                                name="imo"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.Imo}
                              />
                              <Form.Control.Feedback type="invalid">
                                Imo is required
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>MMSI</Form.Label>
                              <Form.Control
                                required
                                placeholder="MMSI"
                                autoComplete="off"
                                name="mmsi"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.Mmsi}
                              />
                              <Form.Control.Feedback type="invalid">
                                MMSI is required
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Call Sign</Form.Label>
                              <Form.Control
                                required
                                placeholder="Call Sign"
                                autoComplete="off"
                                name="callSign"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.CallSign}
                              />
                              <Form.Control.Feedback type="invalid">
                                Call Sign is required
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Category</Form.Label>

                              <Form.Control
                                as="select"
                                placeholder="Select category"
                                custom
                                onChange={this.categorySelector}
                                defaultValue={
                                  ShipUpdate.Category ? ShipUpdate.Category : ""
                                }
                                required
                              >
                                 <option value="" disabled selected hidden>Select Category...</option>
                                {shipCatArr.map((country) => {
                                  return (
                                    <option
                                      key={country.label}
                                      label={country.label}
                                      value={country.value}
                                    ></option>
                                  );
                                })}
                              </Form.Control>

                              <Form.Control.Feedback type="invalid">
                                Category is required
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Flag</Form.Label>
                              <Form.Control
                                required
                                placeholder="Flag"
                                autoComplete="off"
                                name="flag"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.Flag}
                              />
                              <Form.Control.Feedback type="invalid">
                                Flag is required
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group size="sm" as={Col}>
                              <Form.Label>Ship Length</Form.Label>
                              <Form.Control
                                required
                                placeholder="Ship Length"
                                autoComplete="off"
                                name="length"
                                onChange={this.onFieldChange}
                                defaultValue={ShipUpdate.Length}
                              />
                              <Form.Control.Feedback type="invalid">
                                Ship Length is required
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group as={Col}>
                              <Form.Label> Sister Vessel </Form.Label>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <Form.Group size="sm" as={Col}>
                                  <Select
                                    style={{ width: 500 }}
                                    theme={theme}
                                    defaultValue={
                                      ShipUpdate.SisterGroup === ""
                                        ? []
                                        : [
                                            {
                                              value: ShipUpdate.SisterGroup,
                                              label: ShipUpdate.SisterGroup,
                                            },
                                          ]
                                    }
                                    options={AllShipSister}
                                    onChange={this.SisterSelector}
                                    isMulti={false}
                                    closeMenuOnSelect={false}
                                    name=""
                                  />
                                </Form.Group>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 8,
                                    border: "1px  solid #ced4d9",
                                    maxHeight: 35,
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                  title={"Add Custom Units"}
                                  onClick={this.handleSisterModalShow}
                                >
                                  <img
                                    style={{
                                      width: 18,
                                    }}
                                    alt=""
                                    src={addIcon}
                                    data-buttonname="add"
                                    data-key="enumeratedValue"
                                    //onClick={onAddButtonClick}
                                  />
                                </div>
                              </div>
                            </Form.Group>

                            <Form.Group as={Col}>
                              <Form.Label> Fleet </Form.Label>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <Form.Group size="sm" as={Col}>
                                  <Select
                                    style={{ width: 200 }}
                                    theme={theme}
                                    defaultValue={ShipUpdate.Fleet.map(
                                      (item) => {
                                        return {
                                          value: item,
                                          label: item,
                                        };
                                      }
                                    )}
                                    options={AllFleet}
                                    onChange={
                                      this.onDropdownMultipleValueChange
                                    }
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    name=""
                                  />
                                </Form.Group>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 8,
                                    border: "1px  solid #ced4d9",
                                    maxHeight: 35,
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                  }}
                                  title={"Add Custom Units"}
                                  onClick={this.handleFleetModalShow}
                                >
                                  <img
                                    style={{
                                      width: 18,
                                    }}
                                    alt=""
                                    src={addIcon}
                                    data-buttonname="add"
                                    data-key="enumeratedValue"
                                    //onClick={onAddButtonClick}
                                  />
                                </div>
                              </div>
                            </Form.Group>
                          </Row>
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
                    {ShipUpdate.id === "" ? (
                      <Button
                        size="sm"
                        type="submit"
                        className="parameter-add-button ml-0"
                        variant="outline-secondary"
                        onClick={this.onSubmitRegisterShip}
                        disabled={this.state.loading}
                      >
                        Register
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        type="submit"
                        className="parameter-add-button ml-0"
                        variant="outline-secondary"
                        data-fid={ShipUpdate.id}
                        onClick={this.onSubmitUpdateShip}
                        disabled={this.state.loading}
                        >
                        Update
                      </Button>
                    )}
                  </Modal.Footer>
                    </Form>
                </Modal>

                <Modal
                  id="customUnits"
                  show={show}
                  onHide={this.handleSisterClose}
                  animation={true}
                >
                  <SmartShipLoader isVisible={false} />
                  <Modal.Header closeButton>
                    Add Sister Vessel Group
                  </Modal.Header>
                  <Modal.Body>
                    <div className="config-form-block p-0 m-0">
                      <div className="d-flex flex-row mb-2" size="sm" as={Col}>
                        <Form.Control
                          placeholder="name"
                          onChange={this.onVesselGroupChange}
                          value={VesselGroupName}
                          autoComplete="off"
                          autoFocus={true}
                        />
                      </div>
                      <div className="d-flex flex-row mb-2" size="sm" as={Col}>
                        <Form.Control
                          as="textarea"
                          placeholder="Description"
                          onChange={this.onVesselGroupDescriptionChange}
                          value={VesselGroupDescription}
                          autoComplete="off"
                          autoFocus={true}
                        />

                        <Button
                          size="sm"
                          className="parameter-add-button"
                          onClick={this.onAddVesselGroupClick}
                          variant="outline-secondary"
                          disabled={isAddVesselGroupButtonDisabled}
                        >
                          Add
                        </Button>
                      </div>
                      <Table size="sm" className="sm-custom-table mb-0">
                        <thead>
                          <tr>
                            {/*<th>#</th>*/}
                            <th style={{ width: "30%" }}>Group Name</th>
                            <th style={{ width: "70%" }}>Description</th>
                            <th style={{ maxWidth: 180 }}>Delete</th>
                            {/*<th>Delete</th>*/}
                          </tr>
                        </thead>
                        <tbody>
                          {/*{*/}
                          {/*    VesselGroupOptions.map((unitItem, index) => {*/}
                          {/*        return (*/}
                          {/*            <tr key={`ptIndex-${index}`} id={unitItem.id}>*/}

                          {/*                /!*<td>{index + 1}</td>*!/*/}
                          {/*                <td style={{width: "30%"}}>{unitItem.VesselGroupName}</td>*/}
                          {/*                <td style={{width: "70%"}}>{unitItem.VesselGroupDescription}</td>*/}
                          {/*                <td className="text-right d-flex flex-row justify-content-end">*/}
                          {/*                    <div*/}
                          {/*                        style={{maxWidth: 50}}*/}
                          {/*                        title="Delete Unit"*/}
                          {/*                        className="ml-2"*/}
                          {/*                    >*/}
                          {/*                        <img style={{width: 18, cursor: "pointer"}}*/}
                          {/*                             alt="Delete Sister Vessel Group"*/}
                          {/*                             data-id={unitItem.id}*/}
                          {/*                             src={require('../../images/icons/delete-icon.png')}*/}
                          {/*                             onClick={this.onDeleteSisterClick}*/}
                          {/*                        />*/}
                          {/*                    </div>*/}
                          {/*                </td>*/}
                          {/*            </tr>*/}
                          {/*        )*/}
                          {/*    })*/}
                          {/*}*/}

                          {ShipSister.map((unitItem, index) => {
                            return (
                              <tr key={`ptIndex-${index}`} id={unitItem.id}>
                                {/*<td>{index + 1}</td>*/}
                                <td style={{ width: "30%" }}>
                                  {unitItem.vesselgroupname}
                                </td>
                                <td style={{ width: "70%" }}>
                                  {unitItem.description}
                                </td>
                                <td className="text-right d-flex flex-row justify-content-end">
                                  <div
                                    style={{ maxWidth: 50 }}
                                    title="Delete Unit"
                                    className="ml-2"
                                  >
                                    <img
                                      style={{ width: 18, cursor: "pointer" }}
                                      alt="Delete Sister Vessel Group"
                                      data-id={unitItem.id}
                                      src={deleteIcon}
                                      onClick={this.onDeleteSisterClick}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="d-flex justify-content-start">
                    <Button
                      size="sm"
                      className="parameter-add-button"
                      onClick={this.handleSisterClose}
                      variant="outline-secondary"
                      // disabled={false}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  id="customUnits"
                  show={showFleetModal}
                  onHide={this.handleFleetModalClose}
                  animation={true}
                >
                  <SmartShipLoader isVisible={false} />
                  <Modal.Header closeButton>Add Fleet</Modal.Header>
                  <Modal.Body>
                    <div className="config-form-block p-0 m-0">
                      <div className="d-flex flex-row mb-2" size="sm" as={Col}>
                        <Form.Control
                          placeholder="Unit"
                          onChange={this.onFleetChange}
                          value={fleetName}
                          autoComplete="off"
                          autoFocus={true}
                        />
                      </div>
                      <div className="d-flex flex-row mb-2" size="sm" as={Col}>
                        <Form.Control
                          as="textarea"
                          placeholder="Description"
                          onChange={this.onFleetDescriptionChange}
                          value={fleetDescription}
                          autoComplete="off"
                          autoFocus={true}
                        />

                        <Button
                          size="sm"
                          className="parameter-add-button"
                          onClick={this.onAddFleetClick}
                          variant="outline-secondary"
                          disabled=""
                        >
                          Add
                        </Button>
                      </div>
                      <Table size="sm" className="sm-custom-table mb-0">
                        <thead>
                          <tr>
                            {/*<th>#</th>*/}
                            <th style={{ width: "30%" }}>Name</th>
                            <th style={{ width: "70%" }}>Description</th>
                            <th style={{ maxWidth: 180 }}>Delete</th>
                            {/*<th>Delete</th>*/}
                          </tr>
                        </thead>
                        <tbody>
                          {/*{*/}
                          {/*    fleetOption.map((unitItem, index) => {*/}
                          {/*        return (*/}
                          {/*            <tr key={`ptIndex-${index}`}>*/}
                          {/*                /!*<td>{index + 1}</td>*!/*/}
                          {/*                <td style={{width: "30%"}}>{unitItem.name}</td>*/}
                          {/*                <td style={{width: "70%"}}>{unitItem.description}</td>*/}
                          {/*                <td className="text-right d-flex flex-row justify-content-end">*/}
                          {/*                    <div*/}
                          {/*                        style={{maxWidth: 50}}*/}
                          {/*                        title="Delete Unit"*/}
                          {/*                        className="ml-2"*/}
                          {/*                    >*/}
                          {/*                        <img style={{width: 18, cursor: "pointer"}}*/}
                          {/*                             alt="Delete Unit"*/}
                          {/*                             data-id={unitItem.id}*/}
                          {/*                             src={require('../../Images/delete.png')}*/}
                          {/*                             onClick={this.onDeleteUnitClick}*/}
                          {/*                        />*/}
                          {/*                    </div>*/}
                          {/*                </td>*/}
                          {/*            </tr>*/}
                          {/*        )*/}
                          {/*    })*/}
                          {/*}*/}

                          {FleetData.map((unitItem, index) => {
                            return (
                              <tr key={`ptIndex-${index}`}>
                                {/*<td>{index + 1}</td>*/}
                                <td style={{ width: "30%" }}>
                                  {unitItem.name}
                                </td>
                                <td style={{ width: "70%" }}>
                                  {unitItem.description}
                                </td>
                                <td className="text-right d-flex flex-row justify-content-end">
                                  <div
                                    style={{ maxWidth: 50 }}
                                    title="Delete Unit"
                                    className="ml-2"
                                  >
                                    <img
                                      style={{ width: 18, cursor: "pointer" }}
                                      alt="Delete Unit"
                                      data-id={unitItem.id}
                                      src={deleteIcon}
                                      onClick={this.onDeleteFleetClick}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="d-flex justify-content-start">
                    <Button
                      size="sm"
                      className="parameter-add-button"
                      onClick={this.handleFleetModalClose}
                      variant="outline-secondary"
                      // disabled={false}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          }
        </div>
      </SMSidebar>
    );
  }
}

export default Ships;