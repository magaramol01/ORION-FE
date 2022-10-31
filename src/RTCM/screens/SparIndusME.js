import React, {Component} from 'react';
import '../common/css/App.css';
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import {escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage} from "../common/helper";
import SMSidebar from "../../SMSidebar";
import {addVesselDetailsToSession, getSparIndusMainEngineScreenData} from "../../api";
import HederUI from "../common/HederUI";

class SparIndusME extends Component {

    constructor(props) {
        super(props);

        this.state = {
            otherData: {},
            headerUIRef: React.createRef()
        };

        this.fetchSparIndusMainEngineScreenState = this.fetchSparIndusMainEngineScreenState.bind(this);
        this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", escFunction, false);
        this.fetchSparIndusMainEngineScreenState();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", escFunction, false);
    }

    fetchSparIndusMainEngineScreenState() {
        getSparIndusMainEngineScreenData(getVesselId(), this.onFetchDataSuccess, function () {});
    }

    onFetchDataSuccess(response) {
        debugger
        if (response && response.data) {
            const sparIndusStateJson = response.data.sparIndusStateJson;
            setItemInLocalStorage('lastUpdatedHeaderTime', JSON.stringify(response.data.allVesselTimestamps));
            const shipNameData = response.data.shipNameData;
            let defaultIndex = 0;

            if (shipNameData) {
                for (let i = 0; i < shipNameData.length; i++) {
                    if (shipNameData[i].value === "spar-indus") {  // for demo we have to keep china express as default in dropdown
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
                    {shipName: shipNameDataValue, vesselId: vesselId});
            } else {
                addVesselDetailsToSession(this.addVesselDetailsToSessionSuccess, this.addVesselDetailsToSessionFailure,
                    {shipName: getItemFromLocalStorage("shipName"), vesselId: getItemFromLocalStorage("ssAppVesselId")});
            }

            let otherInfo = {
                'shipName': getShipName(),
                'vesselId': getVesselId()
            };

            this.setState({
                sparIndusMEState: sparIndusStateJson,
                otherData: otherInfo,
            });

            this.state.headerUIRef.current.updateDataInHeaderUI(response.data);


            setItemInLocalStorage("ssAppAllVesselsData", JSON.stringify(response.data.fleetDashboardVesselFilter));        }
    }

    render() {

        return (
            <SMSidebar history={this.props.history} screenPath={"/SparIndusME"}>
                <div className="smartship-app">

                    <div className="main-view">
                        <div className="top-bar-container">
                            <div style={{color:'#d8d9da'}}>

                                <div id="custom-navbar">
                                    <HederUI ref={this.state.headerUIRef}/>
                                </div>

                                <div className="scroll-canvas scroll-canvas--dashboard">
                                    <CustomScrollBar height={'100%'} width={'100%'}>
                                        <div className="dashboard-container">

                                            {
                                                this.state.sparIndusMEState ?
                                                    <DashboardGridLayout
                                                        dashboardGridLayoutState={this.state.sparIndusMEState}
                                                        socketSubscriberName={"subscribeToSparIndusME"}
                                                        otherData={this.state.otherData}
                                                        dashboardRef={this}
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
}

export default SparIndusME;
