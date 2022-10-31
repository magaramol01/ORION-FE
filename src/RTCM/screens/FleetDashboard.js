import React, {Component} from 'react';
import '../common/css/App.css';
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import {escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage} from "../common/helper";
import SMSidebar from "../../SMSidebar";
import {addVesselDetailsToSession, getFleetDashboardScreenData} from "../../api";
import NavigationBar from "../../CBM/componant/common/NavigationBar";
import _ from "lodash";

class FleetDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            otherData: {},
            headerUIRef: React.createRef()
        };

        this.fetchFleetDashboardScreenState = this.fetchFleetDashboardScreenState.bind(this);
        this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", escFunction, false);
        this.fetchFleetDashboardScreenState();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", escFunction, false);
    }

    fetchFleetDashboardScreenState() {
        getFleetDashboardScreenData(getVesselId(), this.onFetchDataSuccess, function () {});
    }

    onFetchDataSuccess(response) {
        if (response && response.data) {
            setItemInLocalStorage("ssAppAllVesselsData", JSON.stringify(response.data.fleetDashboardVesselFilter));
            const fleetDashboardStateJson = response.data.fleetDashboardStateJson;
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
                fleetDashboardState: fleetDashboardStateJson,
                otherData: otherInfo,
            });

            this.state.headerUIRef.current.updateDataInHeaderUI(response.data);



           
        }
    }

    render() {

        return (
            <SMSidebar history={this.props.history} screenPath={"/FleetDashboard"}>
                <div className="smartship-app">

                    <div className="main-view">
                        <div className="top-bar-container">
                            <div>


                                {/*<div id="custom-navbar">*/}
                                {/*    /!*<HederUI ref={this.state.headerUIRef}/>*!/*/}
                                {/*    <span>Header Is gere</span>*/}
                                {/*</div>*/}
                                <NavigationBar
                                    title={"Fleet Dashboard"}/>

                                <div className="scroll-canvas scroll-canvas--dashboard">
                                    <CustomScrollBar height={'100%'} width={'100%'}>
                                        <div className="dashboard-container">

                                            {
                                                this.state.fleetDashboardState ?
                                                    <DashboardGridLayout
                                                        dashboardGridLayoutState={this.state.fleetDashboardState}
                                                        socketSubscriberName={"subscribeToFleetDashboard"}
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

export default FleetDashboard;