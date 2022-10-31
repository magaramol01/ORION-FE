import React, { Component } from 'react';
import '../common/css/App.css';
import CustomScrollBar from "../components/CustomScrollBar";
import DashboardGridLayout from "../containers/dashboardGridLayout";
import { escFunction, getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage } from "../common/helper";
import SMSidebar from "../../SMSidebar";
import { addVesselDetailsToSession, getMRVScreenData, getMRVScreenDataByDate, getMRVScreenDataByVoyage, getMRVStateByDateAndVoyage } from "../../api";
import HederUI from "../common/HederUI";
var Loader = require('react-loader');
class EEOI extends Component {

    constructor(props) {
        super(props);

        this.state = {
            otherData: {},
            headerUIRef: React.createRef(),
            voyageListByDate: [],
            loaded: true
        };

        this.fetchMRVScreenState = this.fetchMRVScreenState.bind(this);
        this.onFetchDataSuccess = this.onFetchDataSuccess.bind(this);
        this.onFetchDataSuccessOfFilteredData = this.onFetchDataSuccessOfFilteredData.bind(this);
        this.onFetchDataSuccessOfFilteredDataByDateAndVoyage = this.onFetchDataSuccessOfFilteredDataByDateAndVoyage.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", escFunction, false);
        this.fetchMRVScreenState();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", escFunction, false);
    }

    fetchMRVScreenState() {
        getMRVScreenData(getVesselId(), this.onFetchDataSuccess, function () { });
    }

    fetchMRVScreenStateByVoyage(voyage) {
        getMRVScreenDataByVoyage(getVesselId(), voyage, this.onFetchDataSuccessOfFilteredData, function () { });
    }

    fetchMRVScreenStateByDate(fromDate, toDate) {
        getMRVScreenDataByDate(getVesselId(), fromDate, toDate, this.onFetchDataSuccessOfFilteredData, function () { });
    }

    fetchMRVScreenStateByDateAndVoyage(voyage, fromDate, toDate) {
        getMRVStateByDateAndVoyage(getVesselId(), fromDate, toDate, voyage, this.onFetchDataSuccessOfFilteredDataByDateAndVoyage, function () { });
    }



    onFetchDataSuccess(response) {
        if (response && response.data) {

            const mrvStateJson = response.data.mrvStateJson;
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
                mrvState: mrvStateJson,
                otherData: otherInfo,
                loaded: true
            });

            this.state.headerUIRef.current.updateDataInHeaderUI(response.data);



            setItemInLocalStorage("ssAppAllVesselsData", JSON.stringify(response.data.fleetDashboardVesselFilter));
        }
    }

    onFetchDataSuccessOfFilteredData(response) {
        if (response && response.data) {

            // let voyageListByDate=Array.isArray(response.data.mrvStateJson['widget_6.11'].configuration.body.data.voyageData.widgetData.value)==true?response.data.mrvStateJson['widget_6.11'].configuration.body.data.voyageData.widgetData.value:[];

            // this.setState({voyageListByDate:voyageListByDate});

            this.setState({ mrvState: response.data.mrvStateJson, loaded: true });
        }
    }
    onFetchDataSuccessOfFilteredDataByDateAndVoyage(response) {
        if (response && response.data) {


            this.setState({ mrvState: response.data.mrvStateJson, loaded: true });
        }
    }

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
                                    <CustomScrollBar height={'100%'} width={'100%'}>
                                        <div className="dashboard-container">
                                            <Loader loaded={this.state.loaded} lines={15} length={10} width={7} radius={30}
                                                corners={1} rotate={0} direction={1} color="#fff" speed={1}
                                                trail={60} shadow={false} hwaccel={false} className="spinner"
                                                zIndex={2e9} top="50%" left="50%" scale={1.00}
                                                loadedClassName="loadedContent">
                                                {
                                                    this.state.mrvState ?
                                                        <DashboardGridLayout
                                                            voyageListByBetwDate={this.state.voyageListByDate}
                                                            dashboardGridLayoutState={this.state.mrvState}
                                                            socketSubscriberName={"subscribeToMRV"}
                                                            otherData={this.state.otherData}
                                                            dashboardRef={this}
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

export default EEOI;
