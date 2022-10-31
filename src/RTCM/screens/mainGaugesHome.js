import React, {Component} from 'react';
import '../common/css/App.css';
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import {escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage} from "../common/helper";
import SMSidebar from "../../SMSidebar";
import {addVesselDetailsToSession, getMainGaugesScreenData} from "../../api";
import HederUI from "../common/HederUI";

class MainGaugesHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            otherData: {},
            headerUIRef: React.createRef()
        };

        this.fetchMainGaugesScreenState = this.fetchMainGaugesScreenState.bind(this);
        this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", escFunction, false);
        this.fetchMainGaugesScreenState();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", escFunction, false);
    }

    fetchMainGaugesScreenState() {
        getMainGaugesScreenData(getVesselId(), this.onFetchDataSuccess, function () {});
    }

    onFetchDataSuccess(response) {
        if (response && response.data) {
            const mainGaugesStateJson = response.data.mainGaugesStateJson;
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
                mainGaugesState: mainGaugesStateJson,
                otherData: otherInfo,
            });

            this.state.headerUIRef.current.updateDataInHeaderUI(response.data);


            setItemInLocalStorage("ssAppAllVesselsData", JSON.stringify(response.data.fleetDashboardVesselFilter));
        }
    }

    render() {

        return (
            <SMSidebar history={this.props.history} screenPath={"/MainGaugesHome"}>
                <div className="smartship-app">

                    <div className="main-view">
                        <div className="top-bar-container">
                            <div>

                                <div id="custom-navbar">
                                    <HederUI ref={this.state.headerUIRef}/>
                                </div>

                                <div className="scroll-canvas scroll-canvas--dashboard">
                                    <CustomScrollBar height={'100%'} width={'100%'}>
                                        <div className="dashboard-container">

                                            {
                                                this.state.mainGaugesState ?
                                                    <DashboardGridLayout
                                                        dashboardGridLayoutState={this.state.mainGaugesState}
                                                        socketSubscriberName={"subscribeToMainGauges"}
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

export default MainGaugesHome;
