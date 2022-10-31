import React, {Component} from 'react';
import NavigationBar from "../common/NavigationBar";
import ParametersUI from "../common/ParametersUI";
import Sidebar from "react-sidebar";
import SidebarUI from "../common/SidebarUI";
import RuleChainUI from "../common/RuleChainUI";
import ConfigUI from "../common/ConfigUI";
import RTDASRegistrationUI from "../common/RTDASRegistration";
import CauseUI from "../common/CauseUI";
import FailureAdvisoryAlarmUI from "../common/FailureAdvisoryAlarmUI";
import ConstantParameter from "../common/ConstantParameter";
import CalculatedExpressionUI from "../common/CalculatedExpressionUI";
import logo from "../../Images/smart-ship-logo-white.png";


class AddCase extends Component {
    constructor(props) {
        debugger
        super(props);
        this.state = {
            sidebarOpen: false,
            selectedNavOption: "ADVISORY",
            inputValue: "",
            uIdCounter: 2,
            currentUid: -1,
            selectedOption: null,//todo
            isRuleChainEdit: false,//todo
            isShowUpdateParameterButton: false,
            indexId: -1
        }
    }

    onVesselNavbarOptionClick = (event) => {
        const navOption = event.target.dataset.navname;
        this.setState({
            selectedNavOption: navOption,
            inputValue: "",
            sidebarOpen: !this.state.sidebarOpen,
        })
    };

    onSetSidebarOpen = (open) => {
        this.setState({sidebarOpen: open});
    }

    render() {
        // console.log(this.state.selectedNavOption);
        const {
            selectedNavOption,
            indexId,
            isRuleChainEdit,
            // allParams
        } = {...this.state};
        return (
            <Sidebar
                sidebar={<SidebarUI
                    onNavClick={this.onVesselNavbarOptionClick}
                    selectedNavOption={this.state.selectedNavOption}/>}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                // styles={{sidebar: {background: "yellow"}}}
                styles={
                    {
                        root: {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: "hidden"
                        },
                        sidebar: {
                            zIndex: 2,
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            transition: "transform .3s ease-out",
                            WebkitTransition: "-webkit-transform .3s ease-out",
                            willChange: "transform",
                            overflowY: "auto",
                            maxWidth: 216
                        }
                    }
                }
            >
                {/*<div className="sideBarIcon" onClick={() => this.onSetSidebarOpen(true)}>
                    <img
                        alt=""
                        width={36}
                        src="https://img.icons8.com/pastel-glyph/64/000000/circled-right.png"/>
                </div>*/}
                <div className="smartShipBody d-flex flex-column h-100">
                    <NavigationBar/>
                    <div
                        id="mainContainer"
                        className="flex-1 overflow-auto"
                        style={{
                            borderWidth: 1,
                            borderColor: "white",
                            flex: 1,
                            padding: 50,
                            paddingTop: 20,
                            paddingBottom: 20,
                            // position: "relative"
                            // background: "yellow"
                        }}>
                        <div>
                            {
                                (selectedNavOption === "RTDAS_REGISTRATION" && (
                                    <RTDASRegistrationUI/>
                                )) || (selectedNavOption === "RULE_CHAIN" && (
                                    <RuleChainUI
                                        isEdit={isRuleChainEdit}
                                        indexId={indexId}
                                    />
                                )) || (selectedNavOption === "PARAMETERS" && (
                                    <ParametersUI
                                        key={selectedNavOption}
                                        selectedNavOption={selectedNavOption}
                                    />
                                )) || (selectedNavOption === "OUTCOME" && (
                                    <ConfigUI />
                                ))  || (selectedNavOption === "CAUSES" && (
                                    <CauseUI/>
                                )) ||  (selectedNavOption === "ADVISORY" && (
                                    <FailureAdvisoryAlarmUI />
                                ))||  (selectedNavOption === "CONSTANT" && (
                                    <ConstantParameter/>
                                )) ||  (selectedNavOption === "CALCULATED_EXPRESSION" && (
                                    <CalculatedExpressionUI />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Sidebar>
        );
    }
}

export default AddCase;
