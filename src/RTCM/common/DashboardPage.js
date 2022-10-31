import React, {Component} from "react";
import SMSidebar from "../../SMSidebar";
import NavigationBar from "../../CBM/componant/common/NavigationBar";
import {getPublishedSheet} from '../../api';
class DashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link:null
        }
    }

    componentDidMount() {
        getPublishedSheet(this.onSuccess,this.onFailure);
    }

    onSuccess = (res)=>{
            this.setState({link:res.data[0]});
    }

    onFailure=(err)=>{
        //console.log("The error is",err);
    }

    render() {
        return  (
            <SMSidebar history={this.props.history} screenPath={"/DashboardPage"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                <NavigationBar
                    title={"Analytics"}/>
                <div style={{"height":"100%"}}>
                    <iframe id={"diFrame"}
                            src={this.state.link}
                            width="100%" height="100%">
                    </iframe>
                </div>
                </div>
            </SMSidebar>


        )
    }
}

export default DashboardPage;