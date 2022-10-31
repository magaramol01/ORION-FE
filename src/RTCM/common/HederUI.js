import React, {Component, Fragment} from 'react';
import logo from "../common/images/smart-ship-logo-white.png";
import logo_url from "../../CBM/Images/nova-logo.png";
import {Col, Form} from "react-bootstrap";
import {loadShipBySistet,loadShipByFleet, loadAllFleetByUserFilter, loadAllSisterByUserFilter} from '../../CBM/componant/Ship/shipHandler';
import Select from "react-select";
import {
    getCheckBoxValue,
    getFilterName,
    getFilterValue,
    getItemFromLocalStorage,
    getShipName,
    getVesselId,
    setItemInLocalStorage,
    getCorrectFormattedDate2} from "./helper";
import {addVesselDetailsToSession, deploymentType, shipName} from "../../api";

const theme = ({
    colors: 'black',
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
});

const sisterVesselGroups = [
    {
        groupName: "#/MainEngineSF",
        vesselIds: [6],
    },
    {
        groupName: "#/MainEngineCX",
        vesselIds: [1, 2, 3,4],
    },
    {
        groupName: "#/MainEngineMD",
        vesselIds: [5,7,13,14],
    },
    {
        groupName: "#/MainEngineYZJ",
        vesselIds: [8,9,10,11,11],
    },
];




class HederUI extends Component {

    constructor(props) {
        super(props);

        this.state = {
            shipsList: [],
            allShips: [],
            firstDropdownData:[],
            selectedShipName: "",
            sName: "",
            imo: "",
            mmsi: "",
            callSign: "",
            updatedDate: "",
            configForm :"Sister vessel",
            select : 'fleet',
            selectLable:" Sister Vessel",
            checkBox : true,
            selectedFilterName:"",
            selectedFilterValue:"",
            isfleet :"",
            modbusDataHistoryPopupRef: React.createRef()
        };

        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    startTimer() {
        this.timer = setInterval(() => {
            const lastUpdatedTime = getItemFromLocalStorage('lastUpdatedHeaderTime');
            if (lastUpdatedTime) {
                const selectedVesselId = getItemFromLocalStorage('ssAppVesselId');
                let formatedDate = getCorrectFormattedDate2(lastUpdatedTime[selectedVesselId]);
                if(!formatedDate){
                    formatedDate = "";
                }
                this.setState({
                    updatedDate: formatedDate
                });
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.startTimer();
        if(!getCheckBoxValue()){
            setItemInLocalStorage("ssAppCheckBoxValue","sister");
        }
        if(getItemFromLocalStorage("ssAppCheckBoxValue") !== "sister"){
            this.setState({select : "sisterVessel"});
            this.setState({selectLable : "Fleet"});
            this.setState({checkBox:false});
            this.setState({configForm: 'fleet'});
            this.getFleet(false);
        }else{
            this.sisterGroup(false);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateDataInHeaderUI(shipData) {
        //const shipNameArray = shipData.shipNameData;
        const defaultShipName = getShipName();

        this.setState({
            //shipsList: shipData.shipNameData,
            selectedShipName: defaultShipName,
            sName: getItemFromLocalStorage("sName"),
            selectedVesselId: getItemFromLocalStorage("ssAppVesselId"),
        });

        let allShipsData = shipData.allShipData;
        for (let i = 0; i < allShipsData.length; i++) {
            if (allShipsData[i].MappingName === defaultShipName) {
                const modbusDataStatus = shipData.modbusTrackerData;
                this.setState({
                    allShips: allShipsData,
                    imo: allShipsData[i].Imo,
                    mmsi: allShipsData[i].Mmsi,
                    callSign: allShipsData[i].CallSign,
                    isMachineryDataReceived: modbusDataStatus.isMachineryDataReceived,
                    isNMEADataReceived: modbusDataStatus.isNMEADataReceived
                });
            }
        }
    }


    addVesselDetailsToSessionSuccess = () => {};

    addVesselDetailsToSessionFailure = () => {};

    onShipChange = (e) => {
        const shipName = e.value;
        const sName = e.label;
        const selectedVesselId = e.vesselId;

        let allShips = this.state.allShips;
        let selectedShip = shipName;
        let Imo = "", Mmsi = "", CallSign = "";

        for (let i = 0; i < allShips.length; i++) {
            if (allShips[i].MappingName === selectedShip) {
                Imo = allShips[i].Imo;
                Mmsi = allShips[i].Mmsi;
                CallSign = allShips[i].CallSign;
            }
        }

        this.setState({
            selectedShipName: shipName,
            selectedVesselId: selectedVesselId,
            sName: sName,
            imo: Imo,
            mmsi: Mmsi,
            callSign: CallSign
        });

        setItemInLocalStorage("shipName", shipName);
        setItemInLocalStorage("sName", sName);
        setItemInLocalStorage("ssAppVesselId", selectedVesselId);
        addVesselDetailsToSession(this.addVesselDetailsToSessionSuccess, this.addVesselDetailsToSessionFailure, {shipName: shipName, vesselId: selectedVesselId});

        const vesselGroup = sisterVesselGroups.find((group) =>
        group.vesselIds.includes(e.vesselId)
        );
        const currentLocation = window.location.hash
        const isMEScreen = sisterVesselGroups.some(vesselGroup => vesselGroup.groupName === currentLocation)

    if(isMEScreen){
        if (vesselGroup.groupName === currentLocation) {
            window.location.reload();
        } else {
            window.location.replace( vesselGroup.groupName);
        }
    }else{
        window.location.reload()
    }
    };

    onfilterChange = (e) => {
        const filterValue = e.value;
        let filterName = "";
        let temp = [...this.state.firstDropdownData];

        if(this.state.configForm == 'Sister vessel') {
            temp.map((item) => {
                if(filterValue == item.value) {
                    filterName = item.label
                }
            });

            this.setState({
                selectedFilterName:filterName,
                selectedFilterValue:filterValue
            })

            setItemInLocalStorage("ssAppFilterName",filterName);
            setItemInLocalStorage("ssAppFilterValue",filterValue);
            this.shipBysister(filterName,true);
        } else {
            temp.map((item) => {
                if(filterValue == item.value) {
                    filterName = item.label
                }
            });

            this.setState({
                selectedFilterName:filterName,
                selectedFilterValue:filterValue
            });

            setItemInLocalStorage("ssAppFilterName",filterName);
            setItemInLocalStorage("ssAppFilterValue",filterValue);

            this.shipByFleet(filterValue,true);
        }
    };

    shipBysister=(val,changesStatus)=>{

        this.setState({loading:true});
        let payload = val;
        loadShipBySistet({id:payload}).then(r=> {
                if(r.isSuccess === 1) {
                    let sisterShipNameArray = [];
                    let temp = r;

                    temp.map((item) => {
                        let obj = {};
                        obj['label'] = item.name;
                        obj['value'] = item.mappingname;
                        obj['vesselId'] = item.id;
                        sisterShipNameArray.push(obj);
                    });

                    if(changesStatus){
                        this.setState({sName:sisterShipNameArray[0].label});
                        this.setState({selectedShipName:sisterShipNameArray[0].value});
                        this.setState({selectedVesselId:sisterShipNameArray[0].vesselId});
                        setItemInLocalStorage("shipName", sisterShipNameArray[0].value);
                        setItemInLocalStorage("sName", sisterShipNameArray[0].label);
                        setItemInLocalStorage("ssAppVesselId", sisterShipNameArray[0].vesselId);
                        window.location.reload();
                    } else {
                        if (!getShipName() || !getVesselId()){
                            this.setState({sName:sisterShipNameArray[0].label});
                            this.setState({selectedShipName:sisterShipNameArray[0].value});
                            this.setState({selectedVesselId:sisterShipNameArray[0].vesselId});
                            setItemInLocalStorage("shipName", sisterShipNameArray[0].value);
                            setItemInLocalStorage("sName", sisterShipNameArray[0].label);
                            setItemInLocalStorage("ssAppVesselId", sisterShipNameArray[0].vesselId);
                            window.location.reload();
                        }else{
                            this.setState({sName:getItemFromLocalStorage("shipName")});
                            this.setState({selectedShipName:getItemFromLocalStorage("shipName")});
                            this.setState({selectedVesselId:getItemFromLocalStorage("ssAppVesselId")});
                        }
                    }

                    this.setState({shipsList:sisterShipNameArray});
                } else if(r.isSuccess === 0){
                    this.showAlert({
                        type: "warning",
                        message: "No Records Found"
                    });
                }
                this.setState({loading:false});
            }
        );

    };

    shipByFleet=(val,changesStatus)=>{
        this.setState({loading:true});
        let payload = val;
        loadShipByFleet({id:payload}).then(r=> {
                if(r.isSuccess === 1) {
                    let shipNameArray = [];
                    let temp = r;

                    temp.map((item) => {
                        let obj = {};
                        obj['label'] = item.name;
                        obj['value'] = item.mappingname;
                        obj['vesselId'] = item.id;
                        shipNameArray.push(obj);
                    });

                    if(changesStatus){
                        this.setState({sName:shipNameArray[0].label});
                        this.setState({selectedShipName:shipNameArray[0].value});
                        this.setState({selectedVesselId:shipNameArray[0].vesselId});
                        setItemInLocalStorage("shipName", shipNameArray[0].value);
                        setItemInLocalStorage("sName", shipNameArray[0].label);
                        setItemInLocalStorage("ssAppVesselId", shipNameArray[0].vesselId);
                        window.location.reload();
                    } else {
                        if (!getShipName() || !getVesselId()){
                            this.setState({sName:shipNameArray[0].label});
                            this.setState({selectedShipName:shipNameArray[0].value});
                            this.setState({selectedVesselId:shipNameArray[0].vesselId});
                            setItemInLocalStorage("shipName", shipNameArray[0].value);
                            setItemInLocalStorage("sName", shipNameArray[0].label);
                            setItemInLocalStorage("ssAppVesselId", shipNameArray[0].vesselId);
                            window.location.reload();
                        }else{
                            this.setState({sName:getItemFromLocalStorage("shipName")});
                            this.setState({selectedShipName:getItemFromLocalStorage("shipName")});
                            this.setState({selectedVesselId:getItemFromLocalStorage("ssAppVesselId")});
                        }
                    }

                    this.setState({shipsList:shipNameArray});
                } else if(r.isSuccess === 0){
                    this.showAlert({
                        type: "warning",
                        message: "No Records Found"
                    });
                }
                this.setState({loading:false});
            }
        );

    };

    sisterGroup =(changesState)=>{
        this.setState({loading:true});
        loadAllSisterByUserFilter().then(r=> {
                this.setState({ShipSister:r});
                if(true) {
                    let sisterNameArray = [];
                    let temp = [...this.state.ShipSister];

                    let obj1 = {};
                    obj1['label'] = "Select All";
                    obj1['value'] = "0";
                    sisterNameArray.push(obj1)

                    temp.map((item) => {
                        let obj = {};
                        obj['label'] = item.vesselgroupname;
                        obj['value'] = item.id;
                        sisterNameArray.push(obj);
                    });

                    if(changesState){
                        setItemInLocalStorage("ssAppFilterName","Select All");
                        setItemInLocalStorage("ssAppFilterValue",0);
                        this.setState({selectedFilterName:"Select All"});
                        this.setState({selectedFilterValue:"0"});
                    } else {
                        if(!getFilterName() || !getFilterValue()){
                            setItemInLocalStorage("ssAppFilterName","Select All");
                            setItemInLocalStorage("ssAppFilterValue",0);
                            this.setState({selectedFilterName:"Select All"});
                            this.setState({selectedFilterValue:"0"});
                        } else {
                            this.setState({selectedFilterName:getFilterName()});
                            this.setState({selectedFilterValue:getFilterValue()});
                        }
                    }

                    this.setState({firstDropdownData:sisterNameArray});
                    this.shipBysister(this.state.selectedFilterName,changesState);
                } else if(r.isSuccess === 0){
                    // this.showAlert({
                    //     type: "warning",
                    //     message: "No Records Found"
                    // });
                }
                this.setState({loading:false});
            }
        );
    };

    getFleet =(changesState)=>{
        let  response;
        this.setState({loading:true});
        loadAllFleetByUserFilter().then(r=> {
                this.setState({FleetData:r});
                if(true){
                    response = 1;
                    let fleet = [];
                    let temp = [...this.state.FleetData];

                    let obj1 = {};
                    obj1['label'] = "Select All";
                    obj1['value'] = "Select All";
                    fleet.push(obj1)

                    temp.map((item) => {
                        let obj = {};
                        obj['label'] = item.name;
                        obj['value'] = item.id;
                        fleet.push(obj);
                    });

                    if(changesState){
                        setItemInLocalStorage("ssAppFilterName","Select All");
                        setItemInLocalStorage("ssAppFilterValue","Select All");
                        this.setState({selectedFilterName:"Select All"});
                        this.setState({selectedFilterValue:"Select All"});
                    } else {
                        if(!getFilterName() || !getFilterValue()){
                            setItemInLocalStorage("ssAppFilterName","Select All");
                            setItemInLocalStorage("ssAppFilterValue","Select All");
                            this.setState({selectedFilterName:"Select All"});
                            this.setState({selectedFilterValue:"Select All"});
                        } else {
                            this.setState({selectedFilterName:getFilterName()});
                            this.setState({selectedFilterValue:getFilterValue()});
                        }
                    }

                    this.setState({firstDropdownData:fleet})
                    this.shipByFleet(this.state.selectedFilterValue,changesState);

                } else if(r.isSuccess === 0){
                    this.setState({isfleet:"0"});
                    // this.showAlert({
                    //     type: "warning",
                    //     message: "No Records Found"
                    // });
                }
                this.setState({loading:false});
            }
        );
    };

    checkBoxItemValueChange = (e) => {
        const dataset = e.target.dataset;
        const key = dataset.key;

        if(key === 'sisterVessel') {
            this.setState({select : "fleet"});
            this.setState({selectLable : "Sister Vessel"});
            setItemInLocalStorage("ssAppCheckBoxValue","sister");
            this.setState({checkBox:true});
            this.setState({configForm: 'Sister vessel'});
            this.sisterGroup(true);
        } else {
            this.setState({select : "sisterVessel"});
            setItemInLocalStorage("ssAppCheckBoxValue","fleet");
            this.setState({selectLable : "Fleet"});
            this.setState({checkBox:false});
            this.setState({configForm: 'fleet'});
            this.getFleet(true);
        }
    }





    render() {
        const {shipsList, selectedShipName, sName, selectedVesselId, imo, mmsi, callSign, updatedDate, configForm, firstDropdownData, selectLable, checkBox, selectedFilterName, selectedFilterValue} = {...this.state};

        return (
            <Fragment>
            <div className="smartship-icon">
                <img alt={"logo"} src={logo} className="smartship-icon-img"/>
            </div>

                <div className="vesselDetails-items">
                    <span style={{fontStyle:'Roboto, Helvetica Neue, Arial, sans-serif !important',fontSize:15,color:'#33b5e5'}}>View By: <b style={{color:'#d8d9da'}}>{": " +selectLable}</b></span>
                </div>
                <div className="customSwitch" style={{float:"right",marginTop: "10px"}}>
                    <input
                        type="checkbox"
                        checked={this.state.checkBox}
                        name="createShips"
                        data-key={this.state.select}
                        className={"customSwitch customSwitchInput"}
                        id="createShips"
                        onClick={this.checkBoxItemValueChange}
                    />
                    <label className="customSwitchLabel customSwitchToggle" htmlFor="createShips" />
                </div>
                                 {
                                     (deploymentType === "shore") && (selectedFilterName !== "") && (
                                        <div id={"dropdownId"} className="vessel-dropdown-container">
                                            <Select
                                                theme={theme}
                                                options={firstDropdownData}
                                                name="filterName"
                                                onChange={this.onfilterChange}
                                                isMulti={false}
                                                closeMenuOnSelect={true}
                                                defaultValue={
                                                    [
                                                        {
                                                            label: selectedFilterName,
                                                            value: selectedFilterValue
                                                        }
                                                    ]
                                                }
                                            />

                                        </div>
                                     )

                    }

                {

                    (deploymentType === "shore") && (selectedShipName !== "") && (

                        <div id={"dropdownId"} className="vessel-dropdown-container">
                            <Select
                                theme={theme}
                                options={shipsList}
                                name="shipName"
                                onChange={this.onShipChange}
                                isMulti={false}
                                closeMenuOnSelect={true}
                                defaultValue={
                                    [
                                        {
                                            label: sName,
                                            value: selectedShipName,
                                            vesselId: selectedVesselId
                                        }
                                    ]
                                }
                            />
                        </div>
                    )

                }


                    <div className="vesselDetails-items">
                        <span style={{fontStyle:'Roboto, Helvetica Neue, Arial, sans-serif !important',fontSize:15,color:'#33b5e5'}}>Last Updated <b style={{color:'#d8d9da'}}>{": "+updatedDate}</b></span>
                    </div>
                    <div style={{width: 140, alignSelf: "center"}}>
                        <div title={getItemFromLocalStorage("firstName")} className="user-initial-representation">
                                {
                                    getItemFromLocalStorage("firstName").charAt(0)
                                }
                        </div>
                        <div style={{float: 'right', width: 90, height: 38, marginTop: 0}}>
                            <img alt={"logo"} src={`${logo_url}`} style={{width:'100%',height:'100%'}}/>
                        </div>
                    </div>
            </Fragment>
        )
    }

}

export default HederUI;