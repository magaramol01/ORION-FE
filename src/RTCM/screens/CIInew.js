import React, { Component } from "react";
import "../common/css/App.css";
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
  getMRVScreenData,
  getMRVScreenDataByDate,
  getMRVScreenDataByVoyage,
  getMRVStateByDateAndVoyage,
  getCIIStateDatanew,
  getCIILast90DaysData,
  getCIIStateByVoyage,
  getCIIStateByDate,
  getCIIStateByDemand,
  getCIIStateBySupply,
  getCIIStateByDateAndVoyage,
} from "../../api";
import { AppContext } from "../context/GlobalContext";
import HederUI from "../common/HederUI";
var Loader = require("react-loader");

class CII extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);

    this.state = {
      otherData: {},
      headerUIRef: React.createRef(),
      voyageListByDate: [],
      loaded: true,
      ciiLast90DaysData: [],
      ciiLast90DaysDataForFilter: [],
      year: "2022",
      ciiState: null,
    };

    this.fetchMRVScreenState = this.fetchMRVScreenState.bind(this);
    this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
    this.onFetchDataSuccessOfFilteredData =
      this.onFetchDataSuccessOfFilteredData.bind(this);
    this.onFetchDataSuccessOfFilteredDataByDateAndVoyage =
      this.onFetchDataSuccessOfFilteredDataByDateAndVoyage.bind(this);
  }

  fetchCIIScreenState = (type = "demand") => {
    getCIIStateDatanew(
      getVesselId(),
      type,
      (response) => {
        if (response && response.data) {
          const ciiStateJson = response.data.ciiStateJson;
          // const mrvStateJson = response.data.mrvStateJson;
          const shipNameData = response.data.shipNameData;
          let defaultIndex = 0;

          const defShip = shipNameData[defaultIndex];
          const shipNameDataLabel = defShip.label;
          const shipNameDataValue = defShip.value;
          const vesselId = defShip.vesselId;

          if (!getShipName() || !getVesselId()) {
            setItemInLocalStorage("shipName", shipNameDataValue);
            setItemInLocalStorage("sName", shipNameDataLabel);
            setItemInLocalStorage("ssAppVesselId", vesselId);
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
          };

          this.setState({
            ciiState: ciiStateJson,
            otherData: otherInfo,
            loaded: true,
          });

          this.state.headerUIRef.current.updateDataInHeaderUI(response.data);

          setItemInLocalStorage(
            "ssAppAllVesselsData",
            JSON.stringify(response.data.fleetDashboardVesselFilter)
          );
        }
      },
      (error) => {}
    );
  };

  onFetchCII90DaysDataSuccess = (response) => {
    if (response != undefined)
      this.setState({
        ciiLast90DaysData: response.data,
        ciiLast90DaysDataForFilter: response.data,
      });
  };

  fetchCII90DaysData = (year, type = "demand") => {
    this.setState({
      year: year,
    });
    getCIILast90DaysData(
      getVesselId(),
      year,
      type,
      this.onFetchCII90DaysDataSuccess,
      function () {}
    );
  };

  fetchCII90DaysDataByOption = (flag) => {
    let res = new Array();
    const ciiData = this.state.ciiLast90DaysDataForFilter;
    if (flag === "Ballast") {
      res = ciiData.filter(
        (word) => word.voyage.split(" ")[0].indexOf("L") === -1
      );
    } else if (flag === "Laden") {
      res = ciiData.filter(
        (word) => word.voyage.split(" ")[0].indexOf("B") === -1
      );
    } else {
      res = ciiData;
    }
    this.setState({
      ciiLast90DaysData: res,
    });
  };

  componentDidMount() {
    document.addEventListener("keydown", escFunction, false);
    // this.fetchMRVScreenState();
    this.fetchCIIScreenState();

    // new  for cii
    document.addEventListener("keydown", escFunction, false);
    // this.fetchCII90DaysData(this.state.year);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", escFunction, false);
  }

  fetchMRVScreenState() {
    getMRVScreenData(getVesselId(), this.onFetchDataSuccess, function () {});
  }

  fetchCIIStateByVoyage = (voyage, ciiType) => {
    const { state } = this.context;
    getCIIStateByVoyage(
      getVesselId(),
      voyage,
      ciiType,
      (response) => {
        if (!response.data || !response) return;
        this.setState({ ciiState: response.data.mrvStateJson });
      },
      () => {}
    );
  };

  fetchCIIStateByDate = (fromDate, toDate, type) => {
    getCIIStateByDate(
      getVesselId(),
      fromDate,
      toDate,
      type,
      (response) => {
        if (!response.data || !response) return;
        this.setState({ ciiState: response.data.mrvStateJson });
      },
      () => {}
    );
  };

  fetchMRVScreenStateByVoyage(voyage) {
    getMRVScreenDataByVoyage(
      getVesselId(),
      voyage,
      this.onFetchDataSuccessOfFilteredData,
      function () {}
    );
  }

  fetchMRVScreenStateByDate(fromDate, toDate) {
    getMRVScreenDataByDate(
      getVesselId(),
      fromDate,
      toDate,
      this.onFetchDataSuccessOfFilteredData,
      function () {}
    );
  }

  fetchMRVScreenStateByDateAndVoyage(voyage, fromDate, toDate) {
    getMRVStateByDateAndVoyage(
      getVesselId(),
      fromDate,
      toDate,
      voyage,
      this.onFetchDataSuccessOfFilteredDataByDateAndVoyage,
      function () {}
    );
  }

  fetchCIIStateByDateAndVoyage = (voyage, fromDate, toDate) => {
    getCIIStateByDateAndVoyage(
      getVesselId(),
      fromDate,
      toDate,
      voyage,
      (response) => {
        if (!response || !response.data) return;
        this.setState({ ciiState: response.data.mrvStateJson });
      },
      function () {}
    );
  };

  onFetchDataSuccess(response) {
    if (response && response.data) {
      const mrvStateJson = response.data.mrvStateJson;
      const shipNameData = response.data.shipNameData;
      let defaultIndex = 0;

      const defShip = shipNameData[defaultIndex];
      const shipNameDataLabel = defShip.label;
      const shipNameDataValue = defShip.value;
      const vesselId = defShip.vesselId;
      if (!getShipName() || !getVesselId()) {
        setItemInLocalStorage("shipName", shipNameDataValue);
        setItemInLocalStorage("sName", shipNameDataLabel);
        setItemInLocalStorage("ssAppVesselId", vesselId);
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
      };

      this.setState({
        mrvState: mrvStateJson,
        otherData: otherInfo,
        loaded: true,
      });

      this.state.headerUIRef.current.updateDataInHeaderUI(response.data);
      setItemInLocalStorage(
        "ssAppAllVesselsData",
        JSON.stringify(response.data.fleetDashboardVesselFilter)
      );
    }
  }

  onFetchDataSuccessOfFilteredData(response) {
    if (response && response.data) {
      const mrvResponse = response.data.mrvStateJson;

      const ciiState = {
        ...this.state.ciiState,
        "widget_6.2": mrvResponse["widget_6.2"],
        "widget_6.3": mrvResponse["widget_6.3"],
        "widget_6.4": mrvResponse["widget_6.4"],
        "widget_6.5": mrvResponse["widget_6.5"],
        "widget_6.6": mrvResponse["widget_6.6"],
        "widget_6.7": mrvResponse["widget_6.7"],
        "widget_6.8": mrvResponse["widget_6.8"],
        "widget_6.9": mrvResponse["widget_6.9"],
        "widget_6.10": mrvResponse["widget_6.10"],
      };

      // this.setState({
      //   mrvState: mrvResponse,
      //   ciiState,
      //   loaded: true,
      // });
    }
  }
  onFetchDataSuccessOfFilteredDataByDateAndVoyage(response) {
    if (response && response.data) {
      const mrvResponse = response.data.mrvStateJson;

      const ciiState = {
        ...this.state.ciiState,
        "widget_6.2": mrvResponse["widget_6.2"],
        "widget_6.3": mrvResponse["widget_6.3"],
        "widget_6.4": mrvResponse["widget_6.4"],
        "widget_6.5": mrvResponse["widget_6.5"],
        "widget_6.6": mrvResponse["widget_6.6"],
        "widget_6.7": mrvResponse["widget_6.7"],
        "widget_6.8": mrvResponse["widget_6.8"],
        "widget_6.9": mrvResponse["widget_6.9"],
        "widget_6.10": mrvResponse["widget_6.10"],
      };
      this.setState({
        ciiState: ciiState,
        mrvState: response.data.mrvStateJson,
        loaded: true,
      });
    }
  }

  fetchCIIStateByDemand = () => {
    getCIIStateByDemand(
      getVesselId(),
      (response) => {
        if (!response || !response.data) return;
        this.setState({ ciiState: response.data.ciiStateJson });
      },
      () => {}
    );
  };

  fetchCIIStateBySupply = () => {
    getCIIStateBySupply(
      getVesselId(),
      (response) => {
        if (!response || !response.data) return;
        this.setState({ ciiState: response.data.ciiStateJson });
      },
      () => {}
    );
  };

  render() {
    return (
      <SMSidebar history={this.props.history} screenPath={"/EEOI"}>
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
                      <Loader
                        loaded={this.state.loaded}
                        lines={15}
                        length={10}
                        width={7}
                        radius={30}
                        corners={1}
                        rotate={0}
                        direction={1}
                        color="#fff"
                        speed={1}
                        trail={60}
                        shadow={false}
                        hwaccel={false}
                        className="spinner"
                        zIndex={2e9}
                        top="50%"
                        left="50%"
                        scale={1.0}
                        loadedClassName="loadedContent"
                      >
                        {this.state.ciiState ? (
                          <DashboardGridLayout
                            voyageListByBetwDate={this.state.ciiState}
                            dashboardGridLayoutState={this.state.ciiState}
                            socketSubscriberName={"subscribeToMRV"}
                            otherData={this.state.otherData}
                            dashboardRef={this}
                            ciiLast90DaysData={this.state.ciiLast90DaysData}
                            fetchCII90DaysData={this.fetchCII90DaysData}
                            fetchCII90DaysDataByOption={
                              this.fetchCII90DaysDataByOption
                            }
                          />
                        ) : null}
                      </Loader>
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

export default CII;
