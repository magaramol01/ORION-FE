import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import {Layout} from "./layout/Layout";
import Login from "./componant/Login/Login";
import temp from "./componant/temp/temp";
import AddCase from "./componant/AddCase";
import MonitorPolicies from "./componant/MonitorPolicies";
import "bootstrap/dist/css/bootstrap.min.css";
import NewOutcomeFormUI from "./componant/common/Outcome/NewOutcomeFormUI";
import NewAdvisoryFormUI from "./componant/common/Advisory/NewAdvisoryFormUI";
import NewCauseFormUI from "./componant/common/Cause/NewCauseFormUI";
import NewRuleChainFormUI from "./componant/common/RuleChain/NewRuleChainFormUI";
import NewConstantParameterFormUI from "./componant/common/Constant/NewConstantParameterFormUI";
import NewRTDASTableUI from "./componant/common/RTDAS/NewRTDASTableUI";
import NewRTDASFormUI from "./componant/common/RTDAS/NewRTDASFormUI";
import NewCalculatedExpressionFormUI from "./componant/common/CalculatedExpression/NewCalculatedExpressionFormUI";
import NewParametersFormUI from "./componant/common/Parameter/NewParametersFormUI";
import NewMergedParameterFormUI from "./componant/common/ParmeterConstant/NewMergedParameterFormUI";

class RuleegineIndex extends React.Component {

    render() {
        return (
            <div className="d-flex flex-column h-100" style={{backgroundColor:"white",height: "100%"}}>
                <div className="flex-grow-1 flex-shrink-0" style={{backgroundColor:"#ffffff", height: "100%"}}>
                    <Router className="d-flex flex-column"  style={{height: "100%"}}>
                        <Layout style={{height: "100% !important"}}>
                            <Switch>
                                <Route exact path="/Login" component={Login}/>
                                <Route exact path="/" component={MonitorPolicies}/>
                                <Route exact path="/AddCase" component={AddCase}/>
                                <Route exact path="/MonitorPolicies" component={MonitorPolicies}/>
                                <Route exact path="/temp" component={temp}/>
                                <Route exact path="/MonitorPolicies/temp" component={temp}/>
                                <Route exact path="/NewOutcomeFormUI" component={NewOutcomeFormUI}/>
                                <Route exact path="/NewAdvisoryFormUI" component={NewAdvisoryFormUI}/>
                                <Route exact path="/NewCauseFormUI" component={NewCauseFormUI}/>
                                <Route exact path="/NewRuleChainFormUI" component={NewRuleChainFormUI}/>
                                <Route exact path="/NewConstantParameterFormUI" component={NewConstantParameterFormUI}/>
                                <Route exact path="/NewRTDASFormUI" component={NewRTDASFormUI}/>
                                <Route exact path="/NewCalculatedExpressionFormUI" component={NewCalculatedExpressionFormUI}/>
                                <Route exact path="/NewParametersFormUI" component={NewParametersFormUI}/>
                                <Route exact path="/NewMergedParameterFormUI" component={NewMergedParameterFormUI}/>
                            </Switch>
                        </Layout>
                    </Router>
                </div>
            </div>
        );
    }
}

export default RuleegineIndex;
