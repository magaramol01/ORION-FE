import React, {Component} from "react";
import {Button, Table, Modal, Col, Form, Row, Tab, Tabs} from 'react-bootstrap';
import SMSidebar from "../../../SMSidebar";
import NavigationBar from "../common/NavigationBar";
import Select from "react-select";
import {
    getAllShips,
    saveShipRoute,
    updateShipRoute,
    getShipRoute,
    updatedRouteHistoryData,
    insertRedPoint
} from "../../../api";
import {getAlarmVesselName, setItemInLocalStorage, getItemFromLocalStorage} from '../../../RTCM/common/helper';
import CustomAlert from "../custom/CustomAlert";

const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,

    },
    // Other options you can use
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
    // menuGutter: baseUnit * 2
});

class ShipRoute extends Component {

    constructor(props) {
        super(props);
        // this.state = {};
        this.state = {
            loading: true,
            key: "Alarm",
            alarmVesselShipList: [],
            alarmVesselValue: null,
            alarmVesselLabel: null,
            updateVesselValue: null,
            updateVesselLabel: null,
            shipRoute: "",
            shipUpdateRoute: "",
            submitdisableStatus: 'true',
            updatedisableStatus: 'true',
            shipDataById:[],
            popup:false,
            popupUpdate:false,
            popupRouteData:null,
            popupDataForUpdateRoute:null,
            updateHistoryData:[],
            redPointVesselLabel: null,
            redPointVesselValue: null,
            preDateAndTime: " ",
            currDateAndTime: "  ",
            preJC: " ",
            currJC: " ",
            maxJC: ""
        }
        this.customAlertRef = React.createRef();
    }

    componentDidMount() {
        getAllShips(this.getAllShipsSuccess,this.getAllShipsFail);
    }

    showAlert = (message) => {
        this.customAlertRef.current.showAlert(message)
    };

    getAllShipsSuccess = (response) => {

        const shipNameData = response.data;
        const shipNameDataLabel = shipNameData[0].label;
        const shipNameDataValue = shipNameData[0].value;
        debugger;

        this.setState({
            alarmVesselShipList: response.data,
            alarmVesselLabel: shipNameDataLabel,
            alarmVesselValue: shipNameDataValue,
            updateVesselLabel: shipNameDataLabel,
            updateVesselValue: shipNameDataValue,
            redPointVesselLabel: shipNameDataLabel,
            redPointVesselValue: shipNameDataValue
        });

        updatedRouteHistoryData(this.shipUpdatedHistoryData,this.shipUpdateFailedHistoryData,{"vesselLabel":response.data[0].value});
        getShipRoute(this.getShipData,this.failedGetShipData,{"vesselLabel": response.data[0].value});
    };


    OnChnageRoute = (event) => {

        const value = event.target.value;
        if(value.length > 0) {
            this.setState({submitdisableStatus:false})
        } else {
            this.setState({submitdisableStatus:true})
        }
        this.setState({shipRoute:value});

    }


    onAlarmVesselChange = (e) => {
        const vesselValue = e.value;
        const vesselLabel = e.label;

        this.setState({
            alarmVesselLabel: vesselLabel,
            alarmVesselValue: vesselValue,
            redPointVesselLabel: vesselLabel,
            redPointVesselValue: vesselValue
        });

        let payload={
            "vesselLabel":e.value
        }

         getShipRoute(this.getShipData,this.failedGetShipData,payload);

        setItemInLocalStorage("ssAppAlarmVesselLabel", vesselLabel);
        setItemInLocalStorage("ssAppAlarmVesselValue", vesselValue);
        const vesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");

    }

    onVesselChange = (e) => {
        const vesselValue = e.value;
        const vesselLabel = e.label;
        this.setState({toggleRouteData:false})

        this.setState({
            // loading: true,
            updateVesselLabel: vesselLabel,
            updateVesselValue: vesselValue,
        });
        let payload={
            "vesselLabel":e.value
        }
        updatedRouteHistoryData(this.shipUpdatedHistoryData,this.shipUpdateFailedHistoryData,payload)
    }


    onUpdateClick = (e) => {

        const vesselLabel = this.state.updateVesselLabel;
        const vesselValue = this.state.updateVesselValue;
        const Route =  this.state.shipUpdateRoute;
        const vesselName = vesselValue;

        let payload = {
            "vesselLabel": vesselName,
            "route": Route,
            "response":"update"
        };
        updateShipRoute(this.saveShipRouteSuccess,this.saveShipRouteFailure,payload);

    }

    OnChnageUpdateRoute = (e) => {

        const value = e.target.value;
        if(value.length > 0) {
            this.setState({updatedisableStatus:false})
        } else {
            this.setState({updatedisableStatus:true})
        }
        this.setState({shipUpdateRoute:value})

    }


    onApplyClick = (e) => {

        const vesselLabel = this.state.alarmVesselValue;
        const vesselValue = this.state.alarmVesselValue;
        setItemInLocalStorage("ssAppAlarmVesselLabel", vesselLabel);
        setItemInLocalStorage("ssAppAlarmVesselValue", vesselValue);
        const vesselName = getItemFromLocalStorage("ssAppAlarmVesselValue");
        const Route =  this.state.shipRoute;
        let payload = {
            "vesselLabel": vesselName,
            "route": Route,
            "response":"insert"
        };
        saveShipRoute(this.saveShipRouteSuccess,this.saveShipRouteFailure,payload);

    }

    saveShipRouteSuccess = () => {
        this.showAlert({
            type: "success",
            message: "Rout update Successfully!!"
        });
        this.setState({
            shipRoute : "",
            shipUpdateRoute: ""
        })
    }

    setKey = (key) => {
        this.setState({key});
    };

    onClickForUrp = () => {
        this.setState({key: "RedPoint"});
    }

    saveShipRouteFailure = () => {
        this.showAlert({
            type: "error",
            message: "Rout not updated !!!"
        });
    }

    getShipData=(response)=>{

        this.showAlert({
            type: "success",
            message: "Data fetched !!!"
        });
        console.log(response.data);
        this.setState({
            shipDataById:response.data,

        });

        let cdt;
        const mJC = response.data.reduce(function (acc, curr) {
            if (curr.journeycounter >= acc) {
                acc = curr.journeycounter;
                cdt = curr.res_timestamp;
            }
            return acc;
        }, 0)
        this.setState({maxJC: mJC});
        this.setState({currJC: mJC});
        let dt = this.convertDateAndTime(cdt);
        this.setState({currDateAndTime: dt});
    }
    failedGetShipData=()=>{

        this.showAlert({
            type: "error",
            message:"Data not fetched!!!"
        });
    }


    shipUpdatedHistoryData = (response) => {
        this.setState({updateHistoryData:response.data});
    }

    shipUpdateFailedHistoryData=()=> {
        console.log("updated data did not fetch");
    }



    openpopUp=(e)=>{
        this.setState({popup:true})

        this.state.shipDataById.map(data=>{
            if(data.id == e.target.value){
                this.setState({popupRouteData:data.route})
            }
        })
    }
    openpopUpForUpdate=(e)=>{

        this.setState({popupUpdate:true})

        this.state.updateHistoryData.map(data=>{
            if(data.id == e.target.value){
                this.setState({popupDataForUpdateRoute:data.route})
            }
        })

    }
    popupClose =()=> {

        this.setState({popup:false});
        this.setState({popupRouteData:null})

    }
    popupCloseUpdate=()=>{

        this.setState({popupUpdate:false});
        this.setState({popupDataForUpdateRoute:null})
    }

    convertDateAndTime=(date1)=>{
        const date_ob=new Date(date1);

        function dateAndTime(date_ob) {
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = ("0" + date_ob.getHours()).slice(-2)
            let minutes = ("0" + date_ob.getMinutes()).slice(-2)
            let seconds = ("0" + date_ob.getSeconds()).slice(-2)
            return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
        }

        return dateAndTime(date_ob);
    }

    preDateAndTimeChange = (e) => {
        this.setState({preDateAndTime: e.target.value});
        console.log(this.state.preDateAndTime);
    }

    currDateAndTimeChange = (e) => {
        this.setState({currDateAndTime: e.target.value});
    }
    onPreJC = (e) => {
        this.setState({preJC: e.target.value});
    }
    onCurrJC = (e) => {
        this.setState({currJC: e.target.value});
    }

    onClickForRedPoint = () => {
        const vesselvalue = this.state.redPointVesselValue;
        const preDT = this.state.preDateAndTime;
        const currDT = this.state.currDateAndTime;
        const preJC = this.state.preJC;
        const currJC = this.state.currJC;
        let payload = {
            vesselLabel: vesselvalue,
            preDT: preDT,
            currDT: currDT,
            preJC: preJC,
            currJC: currJC
        }
        if (preDT == " " && preJC == " ") {
            this.showAlert({
                type: "failed",
                message: "Please enter all field value"
            });
        } else {
            if (this.isDateTime(preDT.trim()) && this.isDateTime(currDT.trim())) {
                insertRedPoint(this.redPointInserted, this.onFailToInsertRedPoint, payload);
            } else {
                alert("enter valid date and time")
            }
        }
    }

    redPointInserted = (response) => {
        if (response) {
            this.showAlert({
                type: "success",
                message: "Red point update Successfully!!"
            });
            this.setState({preDateAndTime: " "});
            this.setState({preJC: " "});
            this.setState({redPointVesselValue:null})
            this.setState({redPointVesselLabel:null})
            console.log("red point  inserted into table");
        } else {
            console.log("red point not inserted")
        }
    }
    onFailToInsertRedPoint = () => {
        console.log("red point not inserted into table");
    }

    isDateTime = (date1) => {
        return /^(19\d{2}|20\d{2})-(0\d|1[0-2])-([0-2]\d|3[01]) ([0-1]\d|2[0-3]):([0-5]\d|60):([0-5]\d|60)$/.test(date1);
    }

    render() {
        const {
            loading,
            alarmVesselShipList,
            alarmVesselLabel,
            alarmVesselValue,
            submitdisableStatus,
            updateVesselLabel,
            updateVesselValue,
            shipUpdateRoute,
            alarmVesselLabel2,
            alarmVesselValue2,
            shipDataById,
            popup,
            updatedShipDataById,
            popupRouteData,
            popupDataForUpdateRoute,
            updateHistoryData,
            popupUpdate,
            preDateAndTime,
            currDateAndTime,
            preJC,
            currJC,
            maxJC,

        } = this.state;

        return (
            <SMSidebar history={this.props.history} screenPath={"/Alarm"}>
                <div className="smartShipBody d-flex flex-column vh-100">
                    {/*<SmartShipLoader isVisible={loading}/>*/}
                    <CustomAlert ref={this.customAlertRef}/>
                    <NavigationBar
                        title={"Ship Route"}
                        redirectMethod={this.redirectMethod}
                    />
                    {
                        <div className="flex-1  mt-4 d-flex justify-content-center">
                            <div className="config-form-block alarm-form" style={{width: "98%"}}
                                 >
                                <Tabs className="MyTabs" defaultActiveKey="Alarm"
                                      onSelect={key => this.setKey(key)} activeKey={this.state.key}

                                    >
                                    <Tab eventKey="Alarm" title="Insert Ship Route">
                                        <div className="p-1 pt-2 mb-3">
                                            <Row className="justify-content-end pr-2">
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>Select Ship</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={alarmVesselShipList}
                                                        name="shipName"
                                                        onChange={this.onAlarmVesselChange}
                                                        isMulti={false}
                                                        closeMenuOnSelect={true}
                                                        value={
                                                            [
                                                                {
                                                                    label: alarmVesselLabel,
                                                                    value: alarmVesselValue
                                                                }
                                                            ]
                                                        }
                                                    />
                                                </Form.Group>


                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Route</Form.Label>
                                                    <Form.Control
                                                        as="textarea" aria-label="With textarea"
                                                        placeholder="Route"
                                                        data-key="description"
                                                        onChange={this.OnChnageRoute}
                                                        rows="800"
                                                        value={this.state.shipRoute}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>

                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button mt-3"
                                                    // onChange={this.onAlarmVesselChange}
                                                    variant="outline-secondary"
                                                    onClick={this.onApplyClick}
                                                    disabled={this.state.submitdisableStatus}
                                                >
                                                    Apply
                                                </Button>

                                            </Row>
                                        </div>
                                        <div>

                                        </div>
                                        <hr/>
                                        <table className="table table-striped ml-5" style={{width:"90%"}}>
                                            <thead style={{backgroundColor:"rgb(29, 145, 138)"}} aria-colspan={3}>
                                            <tr>
                                                <th colSpan={4} style={{textAlign: "center", color: "white"}}>Inserted
                                                    Route History
                                                </th>
                                            </tr>
                                            </thead>
                                            <thead>
                                            <tr>
                                                <th scope="col">Username</th>
                                                <th scope="col" style={{}}>Timestamp</th>
                                                <th scope="col">Journey Counter</th>
                                                <th scope="col">Route</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {shipDataById.map(data=>{
                                                return <tr>
                                                    <td>{data.username}</td>
                                                    <td>{this.convertDateAndTime(data.res_timestamp)}</td>
                                                    <td>{data.journeycounter}</td>
                                                    <td className="w-25">
                                                        <button className="btn btn-success"
                                                                style={{height: "25px", width: "36px"}}
                                                                data-target="modal"
                                                                value={data.id}
                                                                onClick={this.openpopUp}>view
                                                        </button>

                                                        <button className="btn btn-danger"
                                                                style={{
                                                                    height: "25px",
                                                                    width: "36px",
                                                                    marginLeft: "10px"
                                                                }}
                                                                value={data.id}
                                                                disabled={maxJC === data.journeycounter ? false : true}
                                                                onClick={this.onClickForUrp}>urp
                                                        </button>
                                                    </td>


                                                </tr>
                                            })}
                                            </tbody>
                                        </table>

                                    </Tab>


                                    <Tab eventKey="Alert" title="Update Ship Route" >
                                        <div className="p-1 pt-2 mb-3">
                                            <Row className="justify-content-end pr-2">
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label>Select Ship</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={alarmVesselShipList}
                                                        name="shipName"
                                                        onChange={this.onVesselChange}
                                                        isMulti={false}
                                                        closeMenuOnSelect={true}
                                                        value={
                                                            [
                                                                {
                                                                    label: updateVesselLabel,
                                                                    value: updateVesselValue
                                                                }
                                                            ]
                                                        }
                                                    />
                                                </Form.Group>


                                                <Form.Group size="sm" as={Col}>
                                                    <Form.Label>Route</Form.Label>
                                                    <Form.Control
                                                        as="textarea" aria-label="With textarea"
                                                        placeholder="Route"
                                                        data-key="description"
                                                        onChange={this.OnChnageUpdateRoute}
                                                        rows="800"
                                                        value={this.state.shipUpdateRoute}
                                                        autoComplete="off"
                                                    />
                                                </Form.Group>

                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button mt-3"
                                                    // onChange={this.onAlarmVesselChange}
                                                    variant="outline-secondary"
                                                    onClick={this.onUpdateClick}
                                                    // disabled={this.state.updatedisableStatus}
                                                >
                                                    Update
                                                </Button>

                                            </Row>
                                        </div>
                                        <div>

                                        </div>
                                        <hr/>
                                        <table className="table table-striped ml-5" style={{width:"90%"}}>
                                            <thead style={{backgroundColor:"rgb(29, 145, 138)"}} aria-colspan={3}>
                                            <tr>
                                                <th colSpan={4} style={{textAlign: "center", color: "white"}}>Updated
                                                    Route History
                                                </th>
                                            </tr>
                                            </thead>
                                            <thead>
                                            <tr>

                                                <th scope="col">Username</th>
                                                <th scope="col">Timestamp</th>
                                                <th scope="col">Journey Counter</th>
                                                <th scope="col">Route</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.updateHistoryData.map(data=>{
                                               return <tr>
                                                   <td>{data.username}</td>
                                                   <td>{this.convertDateAndTime(data.res_timestamp)}</td>
                                                   <td>{data.journeycounter}</td>
                                                   <td>
                                                       <button className="btn btn-success"
                                                               style={{height: "25px", width: "36px"}}
                                                               data-target="modal"
                                                               value={data.id}
                                                               onClick={this.openpopUpForUpdate}>view</button>
                                                   </td>
                                               </tr>
                                            })}

                                            </tbody>
                                        </table>

                                    </Tab>
                                    <Tab eventKey="RedPoint" title="Update Red Point">
                                        <div className="p-1 pt-2 mb-3">
                                            <Row className="justify-content-end pr-2">
                                                <Form.Group size="sm" as={Col} className="pr-0">
                                                    <Form.Label style={{color: "black"}}>Select Ship</Form.Label>
                                                    <Select
                                                        theme={theme}
                                                        options={alarmVesselShipList}
                                                        name="shipName"
                                                        isMulti={false}
                                                        closeMenuOnSelect={true}
                                                        value={
                                                            [
                                                                {
                                                                    label: alarmVesselLabel,
                                                                    value: alarmVesselValue
                                                                }
                                                            ]
                                                        }
                                                    />
                                                </Form.Group>
                                                <div className="ml-4">
                                                    <label style={{color: "black"}}>Prev dateTime SGT</label>
                                                    <Form.Control name="end" autoComplete="off"

                                                                  type="text"
                                                                  onChange={this.preDateAndTimeChange}
                                                                  value={preDateAndTime}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <label style={{color: "black"}}>Curr DateTime SGT</label>
                                                    <Form.Control name="end" autoComplete="off"
                                                                  type="text"
                                                                  onChange={this.currDateAndTimeChange}
                                                                  value={currDateAndTime}
                                                    />
                                                </div>
                                                <div className="ml-4" style={{width: "95px"}}>
                                                    <label style={{color: "black"}}>PreJC</label>
                                                    <input className="w-100" style={{height: "55%"}} name="prevJC"
                                                           value={preJC} onChange={this.onPreJC}/>
                                                </div>
                                                <div className="ml-2 mr-2" style={{width: "95px"}}>
                                                    <label style={{color: "black"}}>CurrJC</label>
                                                    <input className="w-100" style={{height: "55%"}} size="sm"
                                                           name="currJC" value={currJC} onChange={this.onCurrJC}/>
                                                </div>

                                                <Button
                                                    size="sm"
                                                    className="parameter-add-button mt-3"
                                                    // onChange={this.onAlarmVesselChange}
                                                    variant="outline-secondary"
                                                    onClick={this.onClickForRedPoint}

                                                >
                                                    Apply
                                                </Button>
                                            </Row>
                                        </div>
                                    </Tab>
                                </Tabs>

                            </div>
                        </div> }







                    <Modal

                        show={popup}
                        OnHide={this.popupClose}
                        backdrop="static"
                        centered
                        className="modal"
                    >

                        <Modal.Body>
                            <p>{this.state.popupRouteData}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                size="sm"
                                className="parameter-add-button ml-0"
                                variant="outline-secondary"
                                data-toggle="modal"
                                onClick={this.popupClose}
                            >
                                Close</Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal
                        show={popupUpdate}
                        OnHide={this.popupCloseUpdate}
                        backdrop="static"
                        centered
                        className="modal"
                    ><Modal.Body>
                        <p>{this.state.popupDataForUpdateRoute}</p>
                    </Modal.Body>
                        <Modal.Footer>
                            <Button
                                size="sm"
                                className="parameter-add-button ml-0"
                                variant="outline-secondary"
                                data-toggle="modal"
                                onClick={this.popupCloseUpdate}
                            >
                                Close</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal

                        show={popupUpdate}
                        OnHide={this.popupCloseUpdate}
                        backdrop="static"
                        centered
                        className="modal"
                    >

                        <Modal.Body>
                            <p>{this.state.popupDataForUpdateRoute}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                size="sm"
                                className="parameter-add-button ml-0"
                                variant="outline-secondary"
                                data-toggle="modal"
                                onClick={this.popupCloseUpdate}
                            >
                                Close</Button>
                        </Modal.Footer>


                    </Modal>












                </div>

            </SMSidebar>
        )
    }
}

export default ShipRoute;
