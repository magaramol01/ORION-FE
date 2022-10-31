import React, { Component } from "react";
import "../common/css/App.css";
import { Button, Modal } from "react-bootstrap";
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import {
  escFunction,
  getItemFromLocalStorage,
  getShipName,
  getVesselId,
  setItemInLocalStorage,
} from "../common/helper";
import SMSidebar from "../../SMSidebar";
import {
  addVesselDetailsToSession,
  getDashboardScreenData,
  getMRVLatestDataByVesselId,
} from "../../api";
import HederUI from "../common/HederUI";

class DashboardHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otherData: {},
      headerUIRef: React.createRef(),
      counter: 0,
      MRVLatestData: {},
    };

    this.fetchDashboardScreenState = this.fetchDashboardScreenState.bind(this);
    this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
    this.fetchMRVLatestData = this.fetchMRVLatestData.bind(this);
    this.onFetcMRVLatestDataSuccess =
      this.onFetcMRVLatestDataSuccess.bind(this);
    this.onFetchMRVLatestDataFailure =
      this.onFetchMRVLatestDataFailure.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", escFunction, false);
    this.fetchDashboardScreenState();
    this.fetchMRVLatestData();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", escFunction, false);
  }

  //----------------------SSH-53----------------
  // fetchMRVLatestData = () => {
  //   const vessel= localStorage.getItem("sName").toString().replace(/ +/g, "")
  //   getMRVLatestDataByVesselId(this.onFetcMRVLatestDataSuccess,this.onFetchMRVLatestDataFailure,vessel);
  // };
  
  fetchMRVLatestData = () => {
    getMRVLatestDataByVesselId(
      this.onFetcMRVLatestDataSuccess,
      this.onFetchMRVLatestDataFailure,
      {
        //vessel:localStorage.getItem("sName")=="null"?"CHINAEXPRESS": localStorage.getItem("sName").toString().replace(/ +/g, "")
        vessel: localStorage.getItem("sName")
          ? localStorage.getItem("sName").toString().replace(/ +/g, "")
          : "CHINAEXPRESS".toString().replace(/ +/g, ""),
      }
    );
  };
  // fetchMRVLatestData = () => {
  //   getMRVLatestDataByVesselId(this.onFetcMRVLatestDataSuccess, this.onFetchMRVLatestDataFailure, {
  //       vessel:localStorage.getItem("sName")=="null"?"CHINAEXPRESS": localStorage.getItem("sName").toString().replace(/ +/g, "")
  //   });
  // };

  onFetcMRVLatestDataSuccess = (response) => {
    if (response != undefined) {
      debugger;
      const MRVLatestData = response.data.mrvlatestDataJson;
      if (MRVLatestData != undefined) {
        let tempETA = MRVLatestData.etanextport; //format(new Date(MRVLatestData.etanextport), "dd-MM-yyyy");
        let obj = {
          destination: MRVLatestData.destination,
          ETA: tempETA,
          timezone: MRVLatestData.timezone,
          totDist: MRVLatestData.totaldistrun,
          totDistGo: MRVLatestData.disttogo,
          vessel: MRVLatestData.vessel,
          voyage: MRVLatestData.voyage,
          scr: MRVLatestData.scr,
        };
        this.setState({
          MRVLatestData: obj,
        });
      }
    }
  };

  onFetchMRVLatestDataFailure = (response) => {
    console.log(response);
  };

  //---------------------------------------End-------------------------------

  fetchDashboardScreenState() {
    getDashboardScreenData(
      getVesselId(),
      this.onFetchDataSuccess,
      function () {}
    );
  }

  onFetchDataSuccess(response) {
    setItemInLocalStorage(
      "ssAppAllVesselsData",
      JSON.stringify(response.data.fleetDashboardVesselFilter)
    );
    if (response && response.data) {
      const dashboardStateJson = response.data.dashboardStateJson;
      setItemInLocalStorage(
        "lastUpdatedHeaderTime",
        JSON.stringify(response.data.allVesselTimestamps)
      );
      const shipNameData = response.data.shipNameData;
      let defaultIndex = 0;

      // if (shipNameData) {
      //     for (let i = 0; i < shipNameData.length; i++) {
      //         if (shipNameData[i].value === "nova-china-express") {  // for demo we have to keep china express as default in dropdown
      //             defaultIndex = i;
      //         }
      //     }
      // }

      const defShip = shipNameData[defaultIndex];
      const shipNameDataLabel = defShip.label;
      const shipNameDataValue = defShip.value;
      const vesselId = defShip.vesselId;

      if (!getShipName() || !getVesselId()) {
        setItemInLocalStorage("shipName", shipNameDataValue);
        setItemInLocalStorage("sName", shipNameDataLabel);
        setItemInLocalStorage("ssAppVesselId", vesselId);
        this.fetchMRVLatestData();
        addVesselDetailsToSession(
          this.addVesselDetailsToSessionSuccess,
          this.addVesselDetailsToSessionFailure,
          { shipName: shipNameDataValue, vesselId: vesselId }
        );
      } else {
        addVesselDetailsToSession(
          this.addVesselDetailsToSessionSuccess,
          this.addVesselDetailsToSessionFailure,
          {
            shipName: getItemFromLocalStorage("shipName"),
            vesselId: getItemFromLocalStorage("ssAppVesselId"),
          }
        );
      }

      let otherInfo = {
        shipName: getShipName(),
        vesselId: getVesselId(),
        shipDetails:
          dashboardStateJson.widget_1.configuration.body.data.carousel1.group1
            .data,
      };

      this.setState({
        dashboardState: dashboardStateJson,
        otherData: otherInfo,
      });

      this.state.headerUIRef.current.updateDataInHeaderUI(response.data);

      setItemInLocalStorage(
        "ssAppAllVesselsData",
        JSON.stringify(response.data.fleetDashboardVesselFilter)
      );
    }
  }
  onModbusDataStatusReceive(otherData) {
    if (
      this.state.headerUIRef.current &&
      this.state.headerUIRef.current.updateModbusStatusData
    ) {
      this.state.headerUIRef.current.updateModbusStatusData(otherData);
    }
  }

  render() {
    return (
      <SMSidebar history={this.props.history} screenPath={"/DashboardHome"}>
        <div className="smartship-app">
          <div className="main-view">
            <div className="top-bar-container">
              <div>
                <div id="custom-navbar">
                  <HederUI ref={this.state.headerUIRef} />
                </div>

                <div className="scroll-canvas scroll-canvas--dashboard">
                  <CustomScrollBar height={"100%"} width={"100%"}>
                    <div className="dashboard-container">
                      {this.state.dashboardState ? (
                        <DashboardGridLayout
                          dashboardGridLayoutState={this.state.dashboardState}
                          MRVLatestData={this.state.MRVLatestData}
                          socketSubscriberName={"subscribeToDashboard"}
                          otherData={this.state.otherData}
                          dashboardRef={this}
                          counter={this.state.counter}
                        />
                      ) : null}
                    </div>
                  </CustomScrollBar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SMSidebar>
    );
  }
}

export default DashboardHome;
