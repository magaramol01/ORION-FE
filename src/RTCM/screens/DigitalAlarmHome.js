import React, {Component} from 'react';
import '../common/css/App.css';
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import {escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage} from "../common/helper";
import SMSidebar from "../../SMSidebar";
import {addVesselDetailsToSession, getDigitalAlarmScreenData} from "../../api";
import HederUI from "../common/HederUI";

class DigitalAlarmHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            otherData: {},
            headerUIRef: React.createRef()
        };

        this.fetchMainEngineScreenState = this.fetchMainEngineScreenState.bind(this);
        this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", escFunction, false);
        this.fetchMainEngineScreenState();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", escFunction, false);
    }

    fetchMainEngineScreenState() {
        getDigitalAlarmScreenData(getVesselId(), this.onFetchDataSuccess, function () {});
    }

    onFetchDataSuccess(response) {
        debugger
        if (response && response.data) {
            const mainEngineStateJson = response.data.digitalAlarmStateJson;
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
                mainEngineState: mainEngineStateJson,
                otherData: otherInfo,
            });

            this.state.headerUIRef.current.updateDataInHeaderUI(response.data);


            setItemInLocalStorage("ssAppAllVesselsData", JSON.stringify(response.data.fleetDashboardVesselFilter));        }
    }

    render() {

        return (
            <SMSidebar history={this.props.history} screenPath={"/DigitalAlarmHome"}>
                <div className="smartship-app">

                    <div className="main-view">
                        <div className="top-bar-container">
                            <div style={{color:'#d8d9da'}}>

                                <div id="custom-navbar">
                                    <HederUI ref={this.state.headerUIRef}/>
                                </div>

                                <div className="scroll-canvas scroll-canvas--dashboard">
                                    <CustomScrollBar height={'610px'} width={'100%'}>
                                        <div className="dashboard-container" >

                                            {
                                                this.state.mainEngineState ?
                                                    <DashboardGridLayout
                                                        dashboardGridLayoutState={this.state.mainEngineState}
                                                        socketSubscriberName={"subscribeToDigitalAlarmME"}
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

export default DigitalAlarmHome;
