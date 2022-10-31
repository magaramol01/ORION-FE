import React from 'react';
import {
    HashRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import {CBMLayout} from "./CBM/layout/Layout";
import {RTCMLayout} from "./RTCM/layouts/layout";
import Login from "./CBM/componant/Login/Login";
import temp from "./CBM/componant/temp/temp";
import AddCase from "./CBM/componant/AddCase";
import MonitorPolicies from "./CBM/componant/MonitorPolicies";
import MonitorPoliciesShip from "./CBM/componant/common/MonitorPoliciesShip";
import "bootstrap/dist/css/bootstrap.min.css";
import NewOutcomeFormUI from "./CBM/componant/common/Outcome/NewOutcomeFormUI";
import NewAdvisoryFormUI from "./CBM/componant/common/Advisory/NewAdvisoryFormUI";
import NewCauseFormUI from "./CBM/componant/common/Cause/NewCauseFormUI";
import NewRuleChainFormUI from "./CBM/componant/common/RuleChain/NewRuleChainFormUI";
import NewConstantParameterFormUI from "./CBM/componant/common/Constant/NewConstantParameterFormUI";
import NewRTDASTableUI from "./CBM/componant/common/RTDAS/NewRTDASTableUI";
import NewRTDASFormUI from "./CBM/componant/common/RTDAS/NewRTDASFormUI";
import NewCalculatedExpressionFormUI from "./CBM/componant/common/CalculatedExpression/NewCalculatedExpressionFormUI";
import NewParametersFormUI from "./CBM/componant/common/Parameter/NewParametersFormUI";
import NewMergedParameterFormUI from "./CBM/componant/common/ParmeterConstant/NewMergedParameterFormUI";
//import UserRegistration from './CBM/componant/User/UserRegistration';
import UserLogin from "./CBM/componant/User/UserLogin";
import UnAuthorize from "./CBM/componant/User/UnAuthorize";
import XpressME from "./RTCM/screens/XpressME";
import AsiaME from "./RTCM/screens/MainEngineSF";
import NanjingME from "./RTCM/screens/MainEngineMD";
import BataviaME from "./RTCM/screens/MainEngineYZJ";
import ShipsList from "./CBM/componant/common/ShipsList";
import UserManagement from "./CBM/componant/User/UserManagement";
import FleetDashboard from "./RTCM/screens/FleetDashboard";
import SparIndusME from "./RTCM/screens/SparIndusME";
import DashboardPage from "./RTCM/common/DashboardPage";
import DashboardPage2 from "./RTCM/common/DashboardPage2";
import CIInew from './RTCM/screens/CIInew';
// import {Layout} from "./RTCM/layouts/layout";
// import Login from "./RTCM/screens/login";
import EEOI from "./RTCM/screens/EEOI";
import DashboardHome from "./RTCM/screens/DashboardHome";
import MainEngineHome from "./RTCM/screens/MainEngineCX";
import MainGaugesHome from "./RTCM/screens/mainGaugesHome";
import DigitalAlarmHome from "./RTCM/screens/DigitalAlarmHome";
import mrvbanner from "./CBM/componant/MRVBanner/mrvBanner";
import CompassHome from "./RTCM/screens/compassHome";
import ReportPage from "./RTCM/common/ReportPage";
import "./RTCM/common/css/compassShip.css";

import './RTCM/common/css/App.css';
import './RTCM/common/css/CII.css';


import ChangePassword from "./CBM/componant/PasswordUpdation/ChangePassword";
import ForgotPassword from "./CBM/componant/PasswordUpdation/ForgotPassword";
import ResetPasswordLink from "./CBM/componant/PasswordUpdation/ResetPasswordLink";
import './App.css';
import Alarm from "./CBM/componant/Alarm";
import PrivateRoute from "./CBM/componant/User/PrivateRoute";
import PublicRoute from "./CBM/componant/User/PublicRoute";
import Logout from "./CBM/componant/User/logout";
import Ships from "./CBM/componant/Ship/Ships";
import CompanyEntryTable from "./CBM/componant/common/CompanyEntryUI/CompanyEntryTable";
import ShipRoute from "./CBM/componant/ShipRoute/index";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <div className="d-flex flex-column h-100" style={{backgroundColor: "white", height: "100%"}}>
            <div className="flex-grow-1 flex-shrink-0" style={{backgroundColor: "#ffffff", height: "100%"}}>
                <Router className="d-flex flex-column" style={{height: "100%"}}>

                    <CBMLayout style={{height: "100% !important"}}>
                        <Switch>
                            <PrivateRoute exact path="/DashboardPage" component={DashboardPage}/>
                            <PrivateRoute exact path="/DashboardPage2" component={DashboardPage2}/>
                            <PrivateRoute exact path="/Login" component={Login}/>
                            <PrivateRoute exact path="/ShipsList" component={ShipsList}/>
                            <PrivateRoute exact path="/AddCase" component={AddCase}/>
                            <PrivateRoute exact path="/MonitorPolicies" component={MonitorPolicies}/>
                            <PrivateRoute exact path="/UserManagement" component={UserManagement}/>
                            <PrivateRoute exact path="/MonitorPoliciesShip" component={MonitorPoliciesShip}/>
                            <PrivateRoute exact path="/temp" component={temp}/>
                            <PrivateRoute exact path="/MonitorPolicies/temp" component={temp}/>
                            <PrivateRoute exact path="/NewOutcomeFormUI" component={NewOutcomeFormUI}/>
                            <PrivateRoute exact path="/NewAdvisoryFormUI" component={NewAdvisoryFormUI}/>
                            <PrivateRoute exact path="/NewCauseFormUI" component={NewCauseFormUI}/>
                            <PrivateRoute exact path="/NewRuleChainFormUI" component={NewRuleChainFormUI}/>
                            <PrivateRoute exact path="/NewConstantParameterFormUI" component={NewConstantParameterFormUI}/>
                            <PrivateRoute exact path="/NewRTDASFormUI" component={NewRTDASFormUI}/>
                            <PrivateRoute exact path="/NewCalculatedExpressionFormUI" component={NewCalculatedExpressionFormUI}/>
                            <PrivateRoute exact path="/NewParametersFormUI" component={NewParametersFormUI}/>
                            <PrivateRoute exact path="/NewMergedParameterFormUI" component={NewMergedParameterFormUI}/>
                            {/*<PublicRoute exact path="/UserRegistration" component={UserRegistration}/>*/}
                            <PublicRoute exact path="/UserLogin" component={UserLogin}/>
                            <Route exact path="/UnAuthorize" component={UnAuthorize}/>
				            <PrivateRoute exact path="/Alarm" component={Alarm}/>
                            <PrivateRoute exact path="/logout" component={Logout}/>
                            <PrivateRoute exact path="/Ships" component={Ships}/>
                            <PrivateRoute exact path="/ChangePassword" component={ChangePassword}/>
                            <PublicRoute exact path="/ForgotPassword" component={ForgotPassword}/>
                            <PublicRoute exact path="/ResetPasswordLink/:token" component={ResetPasswordLink}/>
                            <PrivateRoute exact path="/CompanyEntryTable" component={CompanyEntryTable}/>
                            <PrivateRoute exact path="/ShipRoute" component={ShipRoute}/>
                            <PrivateRoute exact path="/VoyageBannerEntry" component={mrvbanner}/>
                            <PrivateRoute exact path="/CII" component={CIInew}/>

                            {/*<Route exact path="/:404" ><NotFound/></Route>*/}
                        </Switch>
                    </CBMLayout>

                    <RTCMLayout style={{height: "100% !important"}}>
                        <Switch>
                            <PrivateRoute exact path="/" component={DashboardHome}/>
                            <PrivateRoute exact path="/EEOI" component={EEOI}/>
                            <PrivateRoute exact path="/FleetDashboard" component={FleetDashboard}/>
                            <PrivateRoute exact path="/XpressME" component={XpressME}/>
                            <PrivateRoute exact path="/MainEngineSF" component={AsiaME}/>
                            <PrivateRoute exact path="/MainEngineMD" component={NanjingME}/>
                            <PrivateRoute exact path="/DashboardHome" component={DashboardHome}/>
                            <PrivateRoute exact path="/MainEngineCX" component={MainEngineHome}/>
                            <PrivateRoute exact path="/MainEngineYZJ" component={BataviaME}/>
                            <PrivateRoute exact path="/MainGaugesHome" component={MainGaugesHome}/>
                            <PrivateRoute exact path="/SparIndusME" component={SparIndusME}/>
                            <PrivateRoute exact path="/DigitalAlarmHome" component={DigitalAlarmHome}/>
                            <PrivateRoute exact path="/Navigation" component={CompassHome}/>
                            <PrivateRoute exact path="/ReportPage" component={ReportPage}/>
                        
                        </Switch>
                    </RTCMLayout>
                </Router>
                <ToastContainer position='top-center'/>
            </div>
        </div>
    );
}
function NotFound() {
    return (
        "404 page not found"
    );
}
export default App;
