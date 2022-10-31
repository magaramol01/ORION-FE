import React, {Component} from 'react';
import '../common/css/App.css';
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import {escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage} from "../common/helper";
import SMSidebar from "../../SMSidebar";
import {addVesselDetailsToSession, getCharterPartyScreenData} from "../../api";
import HederUI from "../common/HederUI";
import {Button, Modal} from "react-bootstrap";

class CharterPartyHome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            otherData: {},
            headerUIRef: React.createRef(),
        };

        this.fetchDashboardScreenState = this.fetchDashboardScreenState.bind(this);
        this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", escFunction, false);
        this.fetchDashboardScreenState();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", escFunction, false);
    }

    fetchDashboardScreenState() {
        getCharterPartyScreenData(getVesselId(), this.onFetchDataSuccess, function () {});
    }

    onFetchDataSuccess(response) {
        if (response && response.data) {
            const charterPartyStateJson = response.data.charterPartyStateJson;
            setItemInLocalStorage('lastUpdatedHeaderTime', JSON.stringify(response.data.allVesselTimestamps));
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
                charterPartyState: charterPartyStateJson,
                otherData: otherInfo,
            });

            this.state.headerUIRef.current.updateDataInHeaderUI(response.data);
        }
    }

    render() {

        return (
            <SMSidebar history={this.props.history} screenPath={"/CharterPartyHome"}>
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
                                                this.state.charterPartyState ?
                                                    <DashboardGridLayout
                                                        dashboardGridLayoutState={this.state.charterPartyState}
                                                        socketSubscriberName={"subscribeToCharterParty"}
                                                        otherData={this.state.otherData}
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

export default CharterPartyHome;
