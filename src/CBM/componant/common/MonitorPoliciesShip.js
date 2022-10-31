import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {getAllShipData} from "../../../api";
import SmartShipLoader from "./SmartShipLoader";
import NavigationBar from "./NavigationBar";
import SMSidebar from "../../../SMSidebar";

class MonitorPoliciesShip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            shipMonitaringPolicyTableData : []
        }
    }
    componentDidMount() {
        getAllShipData(this.onGetAllShipDataSuccess,this.onGetAllShipDataFailure);
    }
    onGetAllShipDataSuccess = (response) => {
        debugger;
        this.setState({
            shipMonitaringPolicyTableData : response.data,
            loading: false
        })
    };
    onGetAllShipDataFailure = (error) => {
        this.setState({
            loading: true
        })
    };
    resetToDefaultView = () => {
        this.props.history.goBack();
    };

    render() {
        const {
            shipMonitaringPolicyTableData
        } = this.state;
        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={false}/>
                    <NavigationBar
                        onBackPress={this.resetToDefaultView}
                        title={"ShipData"}/>\
                    <div className="flex-1 overflow-auto cbm-wrapper d-flex justify-content-center">
                        <div className="config-form-block alarm-form" style={{width: "98%"}}>
                            <Table bordered hover responsive="sm" size="sm" className="sm-alarm-table">
                                <thead>
                                <tr className="tableHeader">
                                    <th>Failure Advisory</th>
                                    <th>Causes</th>
                                    <th>Rule Chain</th>
                                    <th>Rule</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    shipMonitaringPolicyTableData.map((item, index) => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.advisory}</td>
                                                <td>{item.causes.map((item,index)=> {
                                                        return (<tr>{item}</tr>)
                                                    }
                                                )}</td>
                                                <td>{item.ruleBlock.map((item,index)=> {
                                                        return (<tr>{item}</tr>)
                                                    }
                                                )}</td>
                                                <td>{item.ruleconfig.map((item,index)=> {
                                                        return (<tr>{item}</tr>)
                                                    }
                                                )}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </SMSidebar>
        )
    }
}
export default MonitorPoliciesShip;