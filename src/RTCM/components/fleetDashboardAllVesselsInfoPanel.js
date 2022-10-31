import React, {Component, Fragment} from "react";
import {Button, Carousel} from "react-bootstrap";
import _ from "lodash";
import {withRouter} from "react-router-dom";
import {addVesselDetailsToSession, getFleetDashboardAllVesselsPanelData} from "../../api";
import {getItemFromLocalStorage, getShipName, getVesselId, setItemInLocalStorage} from "../common/helper";
import MachineryAndEquipmentAccordion from "./machineryAndEquipmentAccordion";

class FleetDashboardAllVesselsInfoPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dashboardRef: props.dashboardRef,
            element: props.element,
            carouselIndex: 0,
            cardsDataArr: [],
            vesselUncheckedArr: [],
            parametersUncheckedArr: []
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.navigateToHomeDashboard = this.navigateToHomeDashboard.bind(this);
        this.fetchFleetDashboardAllVesselsPanelData = this.fetchFleetDashboardAllVesselsPanelData.bind(this);
        this.onFetchFleetDashboardAllVesselsPanelDataSuccess = this.onFetchFleetDashboardAllVesselsPanelDataSuccess.bind(this);
        this.onFetchFleetDashboardAllVesselsPanelDataFailure = this.onFetchFleetDashboardAllVesselsPanelDataFailure.bind(this);
        this.handleOnVesselFilterChange = this.handleOnVesselFilterChange.bind(this);
        this.handleOnParameterFilterChange = this.handleOnParameterFilterChange.bind(this);

        this.state.dashboardRef.handleOnVesselFilterChange = this.handleOnVesselFilterChange;
        this.state.dashboardRef.handleOnParameterFilterChange = this.handleOnParameterFilterChange;
    }

    componentDidMount() {
        this.fetchFleetDashboardAllVesselsPanelData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const socketData = nextProps.socketData;

        if (socketData && (socketData.parameterValues || socketData.engineValues || socketData.latestAlarm)) {
            console.log("Socket Data comes in front end :: parameterValues :",socketData.parameterValues,"\n engineValues :",socketData.engineValues,
                "\n latestAlarm :",socketData.latestAlarm);
            const cardsDataArr = _.cloneDeep(this.state.cardsDataArr);
            for (let i = 0; i < cardsDataArr.length; i++) {
                const vesselData = cardsDataArr[i];
                if (vesselData.vesselId === socketData.vesselId) {
                    if (socketData.parameterValues && socketData.engineValues) {
                        vesselData.parameterValues = socketData.parameterValues;
                        vesselData.engineValues = socketData.engineValues;
                    }
                    if (socketData.latestAlarm) {
                        vesselData.latestAlarm = socketData.latestAlarm.observantMessage;
                    }
                    debugger
                    if (socketData.timestamp) {
                        vesselData.timestamp = socketData.timestamp;
                    }
                }
            }
            this.setState({cardsDataArr: cardsDataArr});
        }
    }

    fetchFleetDashboardAllVesselsPanelData() {
        getFleetDashboardAllVesselsPanelData(this.onFetchFleetDashboardAllVesselsPanelDataSuccess, this.onFetchFleetDashboardAllVesselsPanelDataFailure);
    }

    onFetchFleetDashboardAllVesselsPanelDataSuccess(response) {

        if (response && response.data) {
            this.setState({cardsDataArr: response.data})

            if(response.data.length > 0){
                let uncheckedArray = [];
                const parameterValues = response.data[0].parameterValues;
                for(let i =0 ;i<Object.keys(response.data[0].parameterValues).length; i++){
                    if(!parameterValues[Object.keys(parameterValues)[i]].defaultChecked){
                        uncheckedArray.push(parameterValues[Object.keys(parameterValues)[i]].modbusTag);
                    }
                }
                this.setState({parametersUncheckedArr: uncheckedArray});
            }
        }
    }

    onFetchFleetDashboardAllVesselsPanelDataFailure() {}

    handleOnVesselFilterChange(vesselUncheckedArr) {
        this.setState({
            carouselIndex: 0,
            vesselUncheckedArr: vesselUncheckedArr
        });
    }

    handleOnParameterFilterChange(parametersUncheckedArr) {
        this.setState({parametersUncheckedArr: parametersUncheckedArr});
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({
            carouselIndex: selectedIndex
        });
    };

    navigateToHomeDashboard(carouselCurrentCardData, event) {
        const vesselId = carouselCurrentCardData.vesselId;

        const allVesselsData = getItemFromLocalStorage("ssAppAllVesselsData");
        const selectedVesselData = _.filter(allVesselsData, function (o) {return o.id === vesselId;})[0];

        setItemInLocalStorage("shipName", selectedVesselData.MappingName);
        setItemInLocalStorage("sName", selectedVesselData.Name);
        setItemInLocalStorage("ssAppVesselId", vesselId);

        this.props.history.push({pathname: "/DashboardHome"});
    }

    onQuickDetailViewClick() {}

    getParameterValuesUI(vesselCardData) {
        const parameterValues = vesselCardData.parameterValues;

        const filteredParameterValues = _.filter(parameterValues, function(o) { return !this.state.parametersUncheckedArr.includes(o.modbusTag); }.bind(this));
        const sortedData = _.sortBy(filteredParameterValues, 'priority');
        const sortedChunkData = _.chunk(sortedData, 2);

        return _.map(sortedChunkData, param => {
            const firstCol = param[0];
            const secondCol = param[1];
            const blankValue = "\u00a0\u00a0";

            let firstColCaption;
            let firstColUnit;
            let firstColValue;
            if (firstCol) {
                firstColCaption = firstCol.caption;
                firstColUnit = firstCol.unit;
                firstColValue = firstCol.value;
            } else {
                firstColCaption = blankValue;
                firstColUnit = blankValue;
                firstColValue = blankValue;
            }

            let secondColCaption;
            let secondColUnit;
            let secondColValue;
            if (secondCol) {
                secondColCaption = secondCol.caption;
                secondColUnit = secondCol.unit;
                secondColValue = secondCol.value;
            } else {
                secondColCaption = blankValue;
                secondColUnit = blankValue;
                secondColValue = blankValue;
            }

            return (
                <div className="d-flex justify-content-between mb-2 mt-2" key={vesselCardData.vesselId + firstColCaption + secondColCaption}>
                    <div className="w-30 text-nowrap text-truncate" style={{color:'#8e8e8e'}}>{firstColCaption}</div>
                    <div className="w-20 text-nowrap text-truncate text-left mr-1" style={{fontSize:'16px'}}>{firstColValue} {firstColUnit}</div>
                    <div className="w-30 text-nowrap text-truncate" style={{color:'#8e8e8e'}}>{secondColCaption}</div>
                    <div className="w-20 text-nowrap text-truncate text-left" style={{fontSize:'16px'}}>{secondColValue} {secondColUnit}</div>
                </div>
            );
        })
    }

    getEngineValuesUI(vesselCardData) {
        const engineValues = vesselCardData.engineValues;
        return (
            <Fragment>
                <div className="d-flex justify-content-between mt-2 mb-2">
                    <div style={{color:'#8e8e8e'}}>{engineValues.caption}</div>
                    {
                        _.map(engineValues.modbusTags, (engValues, i) => {
                            let val = engValues.value;
                            val = val ? val: "";
                            return (<div key={i}>{val}</div>)
                        })
                    }
                </div>
            </Fragment>
        );
    }

    getVesselDisplayName(allVesselsData, vesselId) {
       // debugger
      //  const vesselData = _.filter(allVesselsData, function (o) {return o.id === vesselId;})[0];
    //   const vesselData = _.filter(allVesselsData, function (o) {return o.id === vesselId;})[0];
    //   return vesselData.Name;
    const vesselData = _.filter(allVesselsData, function (o) {return o.id === vesselId;})[0];
    if (vesselData !== undefined)
        return vesselData.Name;
    return ""
    }

    getCarouselVesselCardsUI(filteredCardsDataArr) {
        // const {cardsDataArr} = this.state;
        // const filteredCardsDataArr = _.filter(cardsDataArr, function(o) { return !this.state.vesselUncheckedArr.includes(o.vesselId); }.bind(this));
debugger
        const allVesselsData = getItemFromLocalStorage("ssAppAllVesselsData");

        return _.map(filteredCardsDataArr, carouselData => {
            const titleText = "Dist. To Go : "+carouselData.distanceToGo+" NM"
                +"\n"+"Dist. Covered :"+carouselData.coveredDistance+" NM";
            return (
                <div className="w-100 m-1 p-2" key={carouselData.voyageId}
                     style={{border: "2px solid rgb(22, 23, 25)", borderRadius: "15px", height: "310px"}}>
                    <div className="d-flex justify-content-between">
                        <div className="text-truncate bold blue-theme-text">
                            {this.getVesselDisplayName(allVesselsData, carouselData.vesselId)} <span style={{fontSize:'13px'}}>({carouselData.voyageId})</span>
                        </div>
                        <div className="text-truncate" style={{fontSize:'13px',paddingLeft:'10px'}}>
                            ETA : {carouselData.eta}
                            <i className="fa fa-expand ml-2 cursor-pointer" style={{color: "#33b5e5 !important"}}
                               aria-hidden="true"
                               onClick={this.navigateToHomeDashboard.bind(this, carouselData)}/>
                        </div>
                    </div>
                    <div title={titleText} className="w-100 rounded-lg mt-2 mb-2 my-2"
                         style={{background: "transparent", border: "1px solid rgb(22, 23, 25)"}}>
                        <div style={{height: "5px", width: carouselData.progress + "%", background: "#7eb26d"}}/>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <div>{carouselData.sourcePort}</div>
                        <div>{carouselData.destinationPort}</div>
                    </div>

                    <div style={{borderBottom: "1px solid rgb(22, 23, 25)"}}/>

                    {this.getParameterValuesUI(carouselData)}

                    <div style={{borderBottom: "1px solid rgb(22, 23, 25)"}}/>

                    {this.getEngineValuesUI(carouselData)}

                    <div style={{borderBottom: "1px solid rgb(22, 23, 25)"}}/>

                    <div className="d-flex mt-2 mb-2">
                        <div className="w-25 mr-2" style={{color:'#8e8e8e'}}>Alarm :</div>
                        <div className="w-75">{carouselData.latestAlarm}</div>
                    </div>

                    {/*<div className="d-flex mt-2 mb-2 justify-content-center">
                        <Button className="h-25 mr-2"
                                variant="dark" style={{borderRadius: "15px"}}
                                onClick={this.onQuickDetailViewClick.bind(this, carouselData)}
                        >
                            Quick Details
                        </Button>
                        <Button className="h-25"
                                variant="dark" style={{borderRadius: "15px"}}
                                onClick={this.navigateToHomeDashboard.bind(this, carouselData)}
                        >
                            Dashboard
                        </Button>
                    </div>*/}

                    <div className="d-flex justify-content-between">
                        <div className="w-65" ></div>
                        <div className="w-35" >{carouselData.timestamp}</div>
                    </div>
                </div>
            );
        });
    }

    render() {

        const {cardsDataArr} = this.state;
        const CardSortedData = _.sortBy(cardsDataArr, o => o.vesselId);
        const filteredCardsDataArr = _.filter(CardSortedData, function(o) { return !this.state.vesselUncheckedArr.includes(o.vesselId); }.bind(this));

        let counter = 0;
        let renderArray = [];
        let AllCorosalsDataArray = [];

        for(let i =0;i<filteredCardsDataArr.length;i++){
            if(counter<3){
                renderArray.push(filteredCardsDataArr[i]);
                counter++;
            }else{
                counter = 1;
                AllCorosalsDataArray.push(renderArray);
                renderArray = [];
                renderArray.push(filteredCardsDataArr[i]);
            }
        }
        if(renderArray.length>0){
            if(renderArray.length == 3){
                AllCorosalsDataArray.push(renderArray);
            } else {
                if(AllCorosalsDataArray.length>0){
                    if(renderArray.length == 1){
                        renderArray.unshift(AllCorosalsDataArray[AllCorosalsDataArray.length-1][2]);
                        renderArray.unshift(AllCorosalsDataArray[AllCorosalsDataArray.length-1][1]);
                        AllCorosalsDataArray.push(renderArray);
                    }
                    if(renderArray.length == 2){
                        renderArray.unshift(AllCorosalsDataArray[AllCorosalsDataArray.length-1][2]);
                        AllCorosalsDataArray.push(renderArray);
                    }
                } else {
                    AllCorosalsDataArray.push(renderArray);
                }
            }
        }

        const cardCarousels = _.map(AllCorosalsDataArray, carouselData => {
            return (
                <Carousel.Item style={{height: "100%", width: "inherit"}}>
                    <div className="d-flex h-100 w-100">
                        {this.getCarouselVesselCardsUI(carouselData)}
                    </div>
                </Carousel.Item>
            );
        });

        return (
            <Carousel
                activeIndex={this.state.carouselIndex}
                onSelect={this.handleSelect}
                controls={true}
                indicators={false}
                interval={1000000}
                nextIcon={(this.state.carouselIndex == (cardCarousels.length-1))?(""):(<span aria-hidden="true" className="carousel-control-next-icon" />)}
                style={{height: "100%", width: "inherit", background: "#212124"}}
            >
                {cardCarousels}
            </Carousel>
        );
    }
}

export default withRouter(FleetDashboardAllVesselsInfoPanel);