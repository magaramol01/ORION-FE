import React, { Component } from 'react';
import '../common/css/App.css';
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import { escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage } from "../common/helper";
import { getDashboardScreenData, updateRSHPanelFlag } from "../../api"; //Nawroz
import SMSidebar from "../../SMSidebar";
import { addVesselDetailsToSession, getCompassData, getWindyMapData, getMRVLatestDataByVesselId } from "../../api";
import HederUI from "../common/HederUI";
var Loader = require('react-loader');
class CompassHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            compassState: {},
            dashboardState: {},
            otherData: {},
            windyData: {},
            headerUIRef: React.createRef(),
            lastData: [],
            loaded: false
        };

        this.onFetchDashboardDataSuccess = this.onFetchDashboardDataSuccess.bind(this);
        this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);

        this.fetchDashboardScreenState = this.fetchDashboardScreenState.bind(this);

        this.fetchWindyMapData = this.fetchWindyMapData.bind(this);
        this.onFetchWindyMapDataSuccess = this.onFetchWindyMapDataSuccess.bind(this);
        this.onFetchWindyMapDataFailure = this.onFetchWindyMapDataFailure.bind(this);

        this.fetchMRVLatestData = this.fetchMRVLatestData.bind(this);
        this.onFetcMRVLatestDataSuccess = this.onFetcMRVLatestDataSuccess.bind(this);
        this.onFetchMRVLatestDataFailure = this.onFetchMRVLatestDataFailure.bind(this);

    }

    fetchDashboardScreenState() {
        getDashboardScreenData(getVesselId(), this.onFetchDashboardDataSuccess, function () {
        });
    }

    //Nawroz
    onFetchDashboardDataSuccess(response) {
        console.log("Response from compasshome.js :", response);
        if (response && response.data !== undefined) {
            let weigetData;
            weigetData = response.data.dashboardStateJson;
            const dashboardStateJson = weigetData;
            this.setState({
                dashboardState: dashboardStateJson,
            });
        }
    }

    //Nawroz

    onFetchDataSuccess(response) {

        if (response && response.data) {
            const compassState = response.data.compassStateJson;
            setItemInLocalStorage('lastUpdatedHeaderTime', JSON.stringify(response.data.allVesselTimestamps));
            const shipNameData = response.data.shipNameData;
            let defaultIndex = 0;

            if (shipNameData) {
                for (let i = 0; i < shipNameData.length; i++) {
                    if (shipNameData[i].value === "nova-china-express") {  // for demo we have to keep china express as default in dropdown
                        defaultIndex = i;
                    }
                }
            }

            const defShip = shipNameData[defaultIndex];
            const shipNameDataLabel = defShip.label;
            const shipNameDataValue = defShip.value;
            const vesselId = defShip.vesselId;

            if (!getShipName() || !getVesselId()) {
                setItemInLocalStorage("shipName", shipNameDataValue);
                setItemInLocalStorage("sName", shipNameDataLabel);
                setItemInLocalStorage("ssAppVesselId", vesselId);
                addVesselDetailsToSession(this.addVesselDetailsToSessionSuccess, this.addVesselDetailsToSessionFailure,
                    { shipName: shipNameDataValue, vesselId: vesselId });
            } else {
                addVesselDetailsToSession(this.addVesselDetailsToSessionSuccess, this.addVesselDetailsToSessionFailure,
                    {
                        shipName: getItemFromLocalStorage("shipName"),
                        vesselId: getItemFromLocalStorage("ssAppVesselId")
                    });
            }

            let otherInfo = {
                'shipName': getShipName(),
                'vesselId': getVesselId()
            };

            this.setState({
                compassState: compassState,
                otherData: otherInfo,
            });

            this.state.headerUIRef.current.updateDataInHeaderUI(response.data);


            setItemInLocalStorage("ssAppAllVesselsData", JSON.stringify(response.data.fleetDashboardVesselFilter));
        }
    }

    fetchCompassScreenState() {

        getCompassData(getVesselId(), this.onFetchDataSuccess, function () {
        });
    }

    componentDidMount() {
        this.fetchDashboardScreenState();
        this.fetchCompassScreenState();
        this.fetchWindyMapData();
        this.fetchMRVLatestData();
        document.addEventListener("keydown", escFunction, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", escFunction, false);

    }

    //----------------------New Code----------------
    fetchWindyMapData = () => {

        getWindyMapData(this.onFetchWindyMapDataSuccess, this.onFetchWindyMapDataFailure, {
            vesselId: getVesselId()
        });
    };

    onFetchWindyMapDataSuccess = (response) => {

        if (response && Object.keys(response.data).length !== 0) {
            const windyMapData = response.data;
            //windyMapData.stormGlassData.data[windyMapData.stormGlassData.data.length - 1].nmeaData,//
            this.setState({
                windyData: windyMapData, //JSON.parse('{"packetTs":"2021-12-05 16:19:52","createdTs":"2021-12-05 16:20:44","id":105529,"journeyCounter":5,"lat":"23.97","long":"46.30","weatherData":{"time":"2021-12-05T16:00:00+00:00","windSpeed":{"sg":3.11,"icon":3.11,"noaa":2.82},"waveHeight":{"sg":1.17,"icon":0.66,"noaa":0.83,"meteo":1.17},"swellHeight":{"sg":1.15,"icon":0.66,"noaa":0.83,"meteo":1.15},"swellPeriod":{"sg":6.69,"icon":7.42,"noaa":8.07,"meteo":6.69},"currentSpeed":{"sg":0.07,"meto":0.07},"waveDirection":{"sg":136.72,"icon":136.29,"noaa":142.66,"meteo":136.72},"windDirection":{"sg":180,"icon":140.26,"noaa":134.94},"swellDirection":{"sg":237.12,"icon":136.28,"noaa":140.04,"meteo":187.12},"windWaveHeight":{"sg":0.14,"icon":0.05,"noaa":0.28,"meteo":0.14},"windWavePeriod":{"sg":1.77,"icon":1.43,"noaa":3.11,"meteo":1.77},"currentDirection":{"sg":140,"meto":52.97},"vessalCourseDirection":{"sg":162.97,"meto":52.97}},"nmeaData":{"latDirection":"S","longDirection":"W","vesselHeading":"351.40"},"vesselId":2}'),
                mapTooltipConfiguration: windyMapData.mapTooltipConfiguration,
                loaded: true

            });
        }
    };

    onFetchWindyMapDataFailure = (response) => {
        console.log(response);
    };

    componentWillReceiveProps(nextProps, nextContext) {

        const socketData = nextProps.socketData;
        if (socketData && socketData.vesselId && this.state.vesselId === socketData.vesselId) {
            const newStormGlassWeatherData = socketData.stormGlassWeatherData;
            if (newStormGlassWeatherData && Object.keys(newStormGlassWeatherData).length !== 0 && newStormGlassWeatherData.constructor === Object) {
                this.setState({
                    windyData: newStormGlassWeatherData
                });
            }
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    //--------------------------End--------------------
    //----------------------SSH-53----------------
    fetchMRVLatestData = () => {

        getMRVLatestDataByVesselId(this.onFetcMRVLatestDataSuccess, this.onFetchMRVLatestDataFailure, {
            vessel: localStorage.getItem("sName").toString().replace(/ +/g, "")
        });
    };

    onFetcMRVLatestDataSuccess = (response) => {

        if (response != undefined) {

            const MRVLatestData = response.data.mrvlatestDataJson;
            if (MRVLatestData != undefined) {
                let tempETA = MRVLatestData.etanextport;//format(new Date(MRVLatestData.etanextport), "dd-MM-yyyy");
                let obj = {
                    destination: MRVLatestData.destination,
                    ETA: tempETA,
                    timezone: MRVLatestData.timezone,
                    totDist: MRVLatestData.totaldistrun,
                    vessel: MRVLatestData.vessel,
                    voyage: MRVLatestData.voyage,
                    scr: MRVLatestData.scr,
                }
                this.setState({
                    MRVLatestData: obj
                });
            }

        }
    };

    onFetchMRVLatestDataFailure = (response) => {
        console.log(response);
    };

    //---------------------------------------End-------------------------------
    render1() {

        return (


            <SMSidebar history={this.props.history} screenPath={"/CompassHome"}>
                <div className="smartship-app" >

                    <div className="main-view">
                        <div className="top-bar-container">
                            <div>

                                <div id="custom-navbar">
                                    <HederUI ref={this.state.headerUIRef} />
                                </div>

                                <div className="scroll-canvas scroll-canvas--dashboard">
                                    <CustomScrollBar height={'100%'} width={'100%'}>
                                        <div className="dashboard-container">
                                          
                                                {
                                                    this.state.compassState ?
                                                        <DashboardGridLayout
                                                            windyDataForCompass={this.state.windyData}
                                                            dashboardtStateForCompass={this.state.dashboardState}
                                                            dashboardGridLayoutState={this.state.compassState}
                                                            socketSubscriberName={"subscribeToCompass"}
                                                            otherData={this.state.otherData}
                                                            dashboardRef={this}
                                                            myData='hello'
                                                            MRVLatestData={this.state.MRVLatestData}
                                                        /> : null
                                                }
                                       

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
    render() {

        if (Object.keys(this.state.dashboardState).length !== 0) {

            if (Object.keys(this.state.windyData).length !== 0) {
                return (
                    <SMSidebar history={this.props.history} screenPath={"/CompassHome"}>
                        <div className="smartship-app">

                            <div className="main-view">
                                <div className="top-bar-container">
                                    <div>

                                        <div id="custom-navbar">
                                            <HederUI ref={this.state.headerUIRef} />
                                        </div>

                                        <div className="scroll-canvas scroll-canvas--dashboard">
                                            <CustomScrollBar height={'100%'} width={'100%'}>
                                                <div className="dashboard-container">
                                                    <Loader loaded={this.state.loaded} lines={15} length={10} width={7} radius={30}
                                                        corners={1} rotate={0} direction={1} color="#fff" speed={1}
                                                        trail={60} shadow={false} hwaccel={false} className="spinner"
                                                        zIndex={2e9} top="50%" left="50%" scale={1.00}
                                                        loadedClassName="loadedContent">
                                                        {
                                                            this.state.compassState ?
                                                                <DashboardGridLayout
                                                                    windyDataForCompass={this.state.windyData} state
                                                                    dashboardtStateForCompass={this.state.dashboardState}
                                                                    dashboardGridLayoutState={this.state.compassState}
                                                                    socketSubscriberName={"subscribeToCompass"}
                                                                    otherData={this.state.otherData}
                                                                    dashboardRef={this}
                                                                    MRVLatestData={this.state.MRVLatestData}
                                                                /> : null
                                                        }
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
        return null;

    }
}

export default CompassHome;