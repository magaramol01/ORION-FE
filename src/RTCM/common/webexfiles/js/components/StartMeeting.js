import React, {Component} from "react";
import SMSidebar from "../../../../../SMSidebar";
import NavigationBar from "../../../../../CBM/componant/common/NavigationBar";
import Button from "react-bootstrap/Button";
import {weblink} from '../WebexConferencing'


let weblink1 = "";
class StartMeeting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link : ""
        }
        console.log("controll comes in start meeting!!!");
        // weblink1 = "https://demowebex-15783.web.app/?weblink="+weblink;
         weblink1 = "https://www.smartshipweb.com/__oriondemowebex_V1/?weblink="+weblink;
    }

    render() {
        return  (
            <SMSidebar history={this.props.history} screenPath={"/WebexConferencing"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <NavigationBar
                        title={"Remote Inspection and Diagnostic"}/>
                    <div style={{"height":"100%","width":"100%"}}>
                        {/*<iframe title={"hello"} allow="camera;microphone" src="https://my-webex-integration.web.app/" width="100%" height="100%" />*/}
                        <iframe title={"hello"} allow="camera;microphone" src={weblink1} width="100%" height="100%" />
                    </div>
                </div>
            </SMSidebar>

        )
    }
}

export default StartMeeting;
