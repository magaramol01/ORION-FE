import React, {Component} from "react";
import {Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis, CartesianGrid} from 'recharts';
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import {Accordion, Card, Col, Dropdown, Form, Row, Image} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import {
    getCorrectFormattedDate2,
    getItemFromLocalStorage,
    getShipName,
    getVesselId,
    checkValueStatus
} from "../common/helper";
import compassPanelSrc from "../common/images/compass-rose.jpg";
import {getWindyMapData, getDashboardScreenData} from "../../api";
import vessalImg from "../common/images/ShipUpdated.png";
import tringleImg from "../common/images/triangle.png"
import arrowImg from "../common/images/compassArrow.svg"
import currentSpeedArrow from "../common/images/currentSpeedArrow.png"
import windDirectionArrow from "../common/images/windDirection.png";
import vessalHeadingDirectionImg from "../common/images/vessalHeadingDirection.png";
import vessalCourseDirectionImg from "../common/images/vessalCourseDirection.png";
import swellDirectionImg from "../common/images/swellDirection.png";
import HederUI from "../common/HederUI";
import SMSidebar from "../../SMSidebar";
import classNames from 'classnames';
import CustomScrollBar from "../components/CustomScrollBar";
import _ from "lodash";

// import Compass from 'react-Compass';
// import '../../../node_modules/react-compass/dist/react-compass.css';
class CompassD extends Component {


    constructor(props) {
        super(props);
        

        this.state = {
            headerUIRef: React.createRef(),
            windyData: {},//JSON.parse('{"packetTs":"2021-12-05 16:19:52","createdTs":"2021-12-05 16:20:44","id":105529,"journeyCounter":5,"lat":"23.97","long":"46.30","weatherData":{"time":"2021-12-05T16:00:00+00:00","windSpeed":{"sg":3.11,"icon":3.11,"noaa":2.82},"waveHeight":{"sg":1.17,"icon":0.66,"noaa":0.83,"meteo":1.17},"swellHeight":{"sg":1.15,"icon":0.66,"noaa":0.83,"meteo":1.15},"swellPeriod":{"sg":6.69,"icon":7.42,"noaa":8.07,"meteo":6.69},"currentSpeed":{"sg":0.07,"meto":0.07},"waveDirection":{"sg":136.72,"icon":136.29,"noaa":142.66,"meteo":136.72},"windDirection":{"sg":24.26,"icon":140.26,"noaa":134.94},"swellDirection":{"sg":237.12,"icon":136.28,"noaa":140.04,"meteo":187.12},"windWaveHeight":{"sg":0.14,"icon":0.05,"noaa":0.28,"meteo":0.14},"windWavePeriod":{"sg":1.77,"icon":1.43,"noaa":3.11,"meteo":1.77},"currentDirection":{"sg":320.97,"meto":52.97},"vessalCourseDirection":{"sg":162.97,"meto":52.97}},"nmeaData":{"latDirection":"S","longDirection":"W","vesselHeading":"351.40"},"vesselId":2}'),//windyDataFromDB.stormGlassData.data[windyDataFromDB.stormGlassData.data.length - 1].nmeaData;
            vesselId: parseInt(getVesselId()),
            mapTooltipConfiguration: {},
            compassFlags: {
                dispCurrentDirection: true,
                dispWindDirection: true,
                dispSwellDirection: true,
                dispWaveDirection: true,
                dispVesselCourseDirection: true,
                dispVesselHeadDirection: true

            }
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);

        //this.fetchWindyMapData();
        this.fetchWindyMapData = this.fetchWindyMapData.bind(this);
        this.onFetchWindyMapDataSuccess = this.onFetchWindyMapDataSuccess.bind(this);
        this.onFetchWindyMapDataFailure = this.onFetchWindyMapDataFailure.bind(this);
    }

    componentDidMount() {
       
        this.fetchWindyMapData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
       
        const socketData = nextProps.socketData;
      
        if (socketData && socketData.vesselId && this.state.vesselId === socketData.vesselId) {
            const newStormGlassWeatherData = socketData.stormGlassWeatherData;
            if (newStormGlassWeatherData && Object.keys(newStormGlassWeatherData).length !== 0 && newStormGlassWeatherData.constructor === Object) {
                this.setState({
                    windyData: newStormGlassWeatherData.data[newStormGlassWeatherData.data.length - 1]
                });
            }
        }
   
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    angleFromCoordinate(lat1, long1, lat2, long2) {

        let dLon = (long2 - long1);
        let y = Math.sin(dLon) * Math.cos(lat2);
        let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
            * Math.cos(lat2) * Math.cos(dLon);
        var pi = Math.PI;
        let brng = Math.atan2(y, x);
        brng = brng * (180 / pi);//Math.toDegrees(brng);
        brng = (brng + 360) % 360;
        brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise
        return brng + 'deg';
    }

    fetchWindyMapData = () => {
        getWindyMapData(this.onFetchWindyMapDataSuccess, this.onFetchWindyMapDataFailure, {
            vesselId: this.state.vesselId
        });
    };

    onFetchWindyMapDataSuccess = (response) => {

        if (response && Object.keys(response.data).length !== 0) {
            const windyMapData = response.data;
            this.setState({
                windyData: response.data.stormGlassData.data[response.data.stormGlassData.data.length - 1],
                mapTooltipConfiguration: windyMapData.mapTooltipConfiguration

            });
        }
    };

    onFetchWindyMapDataFailure = (response) => {
        console.log(response);
    };


    startTimer() {
        let that = this;
        this.timer = setInterval(() => {
            this.setState({
                windyData: JSON.parse('{"packetTs":"2021-12-05 16:19:52","createdTs":"2021-12-05 16:20:44","id":105529,"journeyCounter":5,"lat":"23.97","long":"46.30","weatherData":{"time":"2021-12-05T16:00:00+00:00","windSpeed":{"sg":3.11,"icon":3.11,"noaa":2.82},"waveHeight":{"sg":1.17,"icon":0.66,"noaa":0.83,"meteo":1.17},"swellHeight":{"sg":1.15,"icon":0.66,"noaa":0.83,"meteo":1.15},"swellPeriod":{"sg":6.69,"icon":7.42,"noaa":8.07,"meteo":6.69},"currentSpeed":{"sg":0.07,"meto":0.07},"waveDirection":{"sg":90.72,"icon":136.29,"noaa":142.66,"meteo":136.72},"windDirection":{"sg":330.26,"icon":140.26,"noaa":134.94},"swellDirection":{"sg":87.12,"icon":136.28,"noaa":140.04,"meteo":167.12},"windWaveHeight":{"sg":0.14,"icon":0.05,"noaa":0.28,"meteo":0.14},"windWavePeriod":{"sg":1.77,"icon":1.43,"noaa":3.11,"meteo":1.77},"currentDirection":{"sg":32.97,"meto":52.97},"vessalCourseDirection":{"sg":122.97,"meto":52.97}},"nmeaData":{"latDirection":"S","longDirection":"W","vesselHeading":"360"},"vesselId":2}') //windyDataFromDB.stormGlassData.data[windyDataFromDB.stormGlassData.data.length - 1].nmeaData; ,

            });
            that.startTimer1();
        }, 20000);
    }

    startTimer1() {
        this.timer = setInterval(() => {
            this.setState({
                windyData: JSON.parse('{"packetTs":"2021-12-05 16:19:52","createdTs":"2021-12-05 16:20:44","id":105529,"journeyCounter":5,"lat":"23.97","long":"46.30","weatherData":{"time":"2021-12-05T16:00:00+00:00","windSpeed":{"sg":3.11,"icon":3.11,"noaa":2.82},"waveHeight":{"sg":1.17,"icon":0.66,"noaa":0.83,"meteo":1.17},"swellHeight":{"sg":1.15,"icon":0.66,"noaa":0.83,"meteo":1.15},"swellPeriod":{"sg":6.69,"icon":7.42,"noaa":8.07,"meteo":6.69},"currentSpeed":{"sg":0.07,"meto":0.07},"waveDirection":{"sg":90.72,"icon":136.29,"noaa":142.66,"meteo":136.72},"windDirection":{"sg":215,"icon":140.26,"noaa":134.94},"swellDirection":{"sg":87.12,"icon":136.28,"noaa":140.04,"meteo":137.12},"windWaveHeight":{"sg":0.14,"icon":0.05,"noaa":0.28,"meteo":0.14},"windWavePeriod":{"sg":1.77,"icon":1.43,"noaa":3.11,"meteo":1.77},"currentDirection":{"sg":150,"meto":150.97},"vessalCourseDirection":{"sg":322.97,"meto":52.97}},"nmeaData":{"latDirection":"S","longDirection":"W","vesselHeading":"280"},"vesselId":2}') //windyDataFromDB.stormGlassData.data[windyDataFromDB.stormGlassData.data.length - 1].nmeaData; ,

            });
        }, 20000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    setTheCheckBoxDefalutValue() {
        let currentValue = false;
        let checkBoxesValue = [this.state.compassFlags];
        let item = checkBoxesValue[0];
        item.dispWindDirection = !currentValue;
        this.setState({compassFlags: item});
        item.dispCurrentDirection = !currentValue;
        this.setState({compassFlags: item});
        item.dispSwellDirection = !currentValue;
        this.setState({compassFlags: item});
        item.dispWaveDirection = !currentValue;
        this.setState({compassFlags: item});
        item.dispVesselCourseDirection = !currentValue;
        this.setState({compassFlags: item});
        item.dispVesselHeadDirection = !currentValue;
        this.setState({compassFlags: item});
    }

    setChecked(currentValue, Name) {

        let checkBoxesValue = [this.state.compassFlags];
        let item = checkBoxesValue[0];
        if (Name === "dispWindDirection") {
            item.dispWindDirection = !currentValue;
            this.setState({compassFlags: item});
        } else if (Name === "dispCurrentDirection") {
            item.dispCurrentDirection = !currentValue;
            this.setState({compassFlags: item});
        } else if (Name === "dispSwellDirection") {
            item.dispSwellDirection = !currentValue;
            this.setState({compassFlags: item});
        } else if (Name === "dispWaveDirection") {
            item.dispWaveDirection = !currentValue;
            this.setState({compassFlags: item});
        } else if (Name === "dispVesselCourseDirection") {
            item.dispVesselCourseDirection = !currentValue;
            this.setState({compassFlags: item});
        } else {
            item.dispVesselHeadDirection = !currentValue;
            this.setState({compassFlags: item});
        }
    }

    render() {


        //---------------------------------campass-----------------------------------
        let vessalDIrectionInDeg;
        let windDirectionStyle;
        let windSpeed = "";
        let windDirectionValue;
        let currectSpeed;
        let currectDirection;
        let swellHeight;
        let swellDirection;
        let waveHeight;
        let waveDirection;
        let greenTirangleDirection;
        let currectDirectionDegree;
        let vessalLatLogTextDirection;
        let windyData;
        let vessalCourseDirection = 0;
        let vesselHeading;
        let vessalLat;
        let VessalLong;
        let windDirectionArrowClassName;
        let currentDirectionArrowClassName;
        let currectDirectionValue;
        let vessalCourseDirectionInDeg;
        let vessalHeadingDirection;
        let WaveDirectionInDeg;
        let swellDIrectionInDeg;
       
        this.windyData =this.state.windyData;
        let windLebelColor;
        let cuuentSpeedLebelColor;
        let deg1;
        let sog;
        let windDirection;
        let extraNMEAData;
        let stw = 0;
        if (Object.keys(this.windyData).length > 0) {
            
            stw = this.props.element.carousel1.group2.data.row6.colData.col2.widgetData.value;
            //this.props.element.configuration.body.data.carousel1.group2.data.row6.colData.col2.widgetData.value;
            //this.state.mapTooltipConfiguration[1].priority===""?0:this.state.mapTooltipConfiguration[1].priority;
            extraNMEAData = this.windyData.nmeaData
            sog = extraNMEAData ? extraNMEAData.sog ? extraNMEAData.sog : "" : "";
            //  const speedOverGround = extraNMEAData ? extraNMEAData.sog ? extraNMEAData.sog : "" : "";
            // this.windyData = JSON.parse('{"packetTs":"2021-12-05 16:19:52","createdTs":"2021-12-05 16:20:44","id":105529,"journeyCounter":5,"lat":"23.97","long":"46.30","weatherData":{"time":"2021-12-05T16:00:00+00:00","windSpeed":{"sg":3.11,"icon":3.11,"noaa":2.82},"waveHeight":{"sg":1.17,"icon":0.66,"noaa":0.83,"meteo":1.17},"swellHeight":{"sg":1.15,"icon":0.66,"noaa":0.83,"meteo":1.15},"swellPeriod":{"sg":6.69,"icon":7.42,"noaa":8.07,"meteo":6.69},"currentSpeed":{"sg":0.07,"meto":0.07},"waveDirection":{"sg":136.72,"icon":136.29,"noaa":142.66,"meteo":136.72},"windDirection":{"sg":140.26,"icon":140.26,"noaa":134.94},"swellDirection":{"sg":137.12,"icon":136.28,"noaa":140.04,"meteo":137.12},"windWaveHeight":{"sg":0.14,"icon":0.05,"noaa":0.28,"meteo":0.14},"windWavePeriod":{"sg":1.77,"icon":1.43,"noaa":3.11,"meteo":1.77},"currentDirection":{"sg":52.97,"meto":52.97},"vessalCourseDirection":{"sg":122.97,"meto":52.97}},"nmeaData":{"latDirection":"S","longDirection":"W","vesselHeading":"351.40"},"vesselId":2}'); //windyDataFromDB.stormGlassData.data[windyDataFromDB.stormGlassData.data.length - 1].nmeaData;
            this.vessalLat = this.windyData.lat;
            this.VessalLong = this.windyData.long;
            deg1 = extraNMEAData.vesselHeading + 'deg';
            this.vesselHeading = extraNMEAData.vesselHeading;
            this.vessalHeadingDirection = {
                transition: 'transform 15000ms ease',
                transform: `rotate(${deg1})`
            }
            let vesselHeadDirection = parseInt(this.windyData.nmeaData.vesselHeading) + 45 + "deg";
            this.vessalDIrectionInDeg = {
                transition: 'transform 15000ms ease',
                transform: `rotate(${vesselHeadDirection})`
            }

            let redTirangleDirectionDeg = parseInt(this.windyData.nmeaData.vesselHeading) + 45 + "deg";
            this.redTirangleDirection = {
                transition: 'transform 15000ms ease',
                transform: `rotate(${redTirangleDirectionDeg})`
            }
            let greenTirangleDirectionDeg = (parseInt(this.windyData.nmeaData.vesselHeading) + 45) - 180 + "deg";
            this.greenTirangleDirection = {
                transition: 'transform 15000ms ease',
                transform: `rotate(${greenTirangleDirectionDeg})`
            }
            let vessalLatLogTextDirectionDeg = parseInt(this.windyData.nmeaData.vesselHeading) + 90 + "deg";
            this.vessalLatLogTextDirection = {
                transition: 'transform 15000ms ease',
                transform: `rotate(${vessalLatLogTextDirectionDeg})`
            }

            if (Object.keys(this.windyData.weatherData).length > 0 && this.windyData.weatherData.currentSpeed!=undefined) {
            
                windDirection = this.windyData.weatherData.windDirection.sg + 'deg';

                this.windSpeed = this.windyData.weatherData.windSpeed.sg;
                this.windDirectionValue = this.windyData.weatherData.windDirection.sg;
                this.windDirectionStyle = {
                    transition: 'transform 15000ms ease',
                    transform: `rotate(${windDirection})`
                }

                this.currectSpeed = this.windyData.weatherData.currentSpeed.sg;
                this.currectDirection = this.windyData.weatherData.currentDirection.sg + 'deg';
                this.currectDirectionValue = this.windyData.weatherData.currentDirection.sg;
                this.currectDirectionDegree = {
                    transition: 'transform 15000ms ease',
                    transform: `rotate(${this.currectDirection})`
                }
                this.waveDirection = this.windyData.weatherData.waveDirection.sg;
                let waveDirectionInSg = this.windyData.weatherData.waveDirection.sg + 'deg';
                this.WaveDirectionInDeg = {
                    transition: 'transform 15000ms ease',
                    transform: `rotate(${waveDirectionInSg})`
                }
                this.waveHeight = this.windyData.weatherData.waveHeight.sg;
                this.swellHeight = this.windyData.weatherData.swellHeight.sg;
                this.swellDirection = this.windyData.weatherData.swellDirection.sg;
                let swellDirectionInSg = this.windyData.weatherData.swellDirection.sg + 'deg';
                this.swellDIrectionInDeg = {
                    transition: 'transform 15000ms ease',
                    transform: `rotate(${swellDirectionInSg})`
                }
                if (this.windyData.weatherData.vessalCourseDirection) {
                    this.vessalCourseDirection = this.windyData.weatherData.vessalCourseDirection.sg;
                    let vessalCourseDirectionDeg = this.windyData.weatherData.vessalCourseDirection.sg + "deg";
                    this.vessalCourseDirectionInDeg = {
                        transition: 'transform 15000ms ease',
                        transform: `rotate(${vessalCourseDirectionDeg})`
                    }
                }
                this.windDirectionValue = parseInt(this.windDirectionValue);
                let currentDir = parseInt(this.windyData.weatherData.currentDirection.sg);
                let vesselHeadingDirectionValue = parseInt(this.vesselHeading) - 45;
                let vesselHeadingOpposite = parseInt(this.vesselHeading) - 180;
                let vesselHeadingRed1StDirection = vesselHeadingDirectionValue >= 360 ? 0 + 45 : 360 - 45;
                let vesselHeadingRed2ndDirection = vesselHeadingDirectionValue - 360 >= 360 ? 360 - 45 : 0 + 45;
                let vesselHeadingGreen1StDirection = vesselHeadingOpposite - 45;
                let vesselHeadingGreen2ndDirection = vesselHeadingOpposite + 45;
                let checkWindDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, 360, this.windDirectionValue);
                let checkWindDataInRedTriangle1 = checkValueStatus(0, vesselHeadingRed2ndDirection, this.windDirectionValue);
                let checkWindInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, 180, this.windDirectionValue);
                let checkWindDataInGreenTriangle1 = checkValueStatus(180, vesselHeadingGreen2ndDirection, this.windDirectionValue);

                let checkCurrentDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, 360, currentDir);
                let checkCurrentDataInRedTriangle1 = checkValueStatus(0, vesselHeadingRed2ndDirection, currentDir);
                let checkCurrentInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, 180, currentDir);
                let checkCurrentDataInGreenTriangle1 = checkValueStatus(180, vesselHeadingGreen2ndDirection, currentDir);
                if (checkWindDataInRedTriangle || checkWindDataInRedTriangle1) {
                    this.windLebelColor = 'forRedTirangle';

                } else if (checkWindInGreenTriangle || checkWindDataInGreenTriangle1) {
                    this.windLebelColor = 'forGreenTirangle';
                } else {
                    this.windLebelColor = "forWhiteTirangle";
                }
                if (checkCurrentDataInRedTriangle || checkCurrentDataInRedTriangle1) {
                    this.cuuentSpeedLebelColor = 'forRedTirangle';

                } else if (checkCurrentInGreenTriangle || checkCurrentDataInGreenTriangle1) {
                    this.cuuentSpeedLebelColor = 'forGreenTirangle';

                } else {
                    this.cuuentSpeedLebelColor = 'forWhiteTirangle';
                }
            }
        }
        //--------------------------------------End------------------------------------------
        return (
            <div>
                {/* <div className="scroll-canvas scroll-canvas--dashboard">*/}
                <CustomScrollBar height={'300px'} width={'100%'}>
                    <div className="dashboard-container">
                        {/* ---------------------------------campass----------------------------------- */}

                        <div className="row">

                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div id="frame">
                                            <Image id="myImg" style={this.vessalHeadingDirection} src={vessalImg}/>
                                            <div className="triangleRed" style={this.redTirangleDirection}></div>
                                            <div className="triangleGreen"
                                                 style={this.greenTirangleDirection}></div>
                                            {this.state.compassFlags.dispCurrentDirection &&
                                            <div className="currentDirectionArrow"
                                                 style={this.currectDirectionDegree}>
                                                <span
                                                    className="arrowCurrentDirection arrowCurrentDirectionDown"></span>

                                            </div>}
                                            {/*    ----------------------end----------------------*/}
                                            {/* Wind direction arrow icon*/}
                                            {this.state.compassFlags.dispWindDirection &&
                                            <div className="WindArrow" style={this.windDirectionStyle}>
                                                <span className="arrowWindDirection arrowWindDirectionDown"></span>

                                            </div>}
                                            {/*    ----------------------end----------------------*/}
                                            {/* Vessal Course direction arrow icon*/}
                                            {this.state.compassFlags.dispVesselCourseDirection &&
                                            <div className="VessalCourseArrow"
                                                 style={this.vessalCourseDirectionInDeg}>
                                                <span className="arrowVCDirection arrowVCDirectionUp"></span>

                                            </div>}
                                            {/*    ----------------------end----------------------*/}
                                            {/* Vessal Heading direction arrow icon*/}
                                            {this.state.compassFlags.dispVesselHeadDirection &&
                                            <div className="VessalHeadingCourseArrow"
                                                 style={this.vessalHeadingDirection}>
                                                <span className="arrowVHDirection arrowVHDirectionUp"></span>

                                            </div>}
                                            {/*    ----------------------end----------------------*/}

                                            {/* Wave direction arrow icon*/}
                                            {this.state.compassFlags.dispWaveDirection &&
                                            <div className="WaveArrow" style={this.WaveDirectionInDeg}>
                                                <span className="arrowWaveDirection arrowWaveDirectionDown"></span>

                                            </div>}
                                            {/*    ----------------------end----------------------*/}

                                            {/* Vessal Swell direction arrow icon*/}
                                            {this.state.compassFlags.dispSwellDirection &&
                                            <div className="SwellArrow" style={this.swellDIrectionInDeg}>
                                                    <span
                                                        className="arrowSwellDirection arrowSwellDirectionDown"></span>

                                            </div>}
                                            {/*    ----------------------end----------------------*/}

                                        </div>
                                    </div>
                                </div>
                                <div className="row">

                                    {/* <div className="col-md-8">

                                        <div className="row mt8" style={{fontSize:'11px'}}>

                                            <div className="col-md-5">
                                                <label style={{marginLeft: '48px'}}>{this.vessalLat} ° N </label>
                                            </div>
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                                <label>{this.VessalLong} ° S </label>
                                            </div>
                                        </div>
                                    </div>*/}
                                    <div className="col-md-2"></div>
                                    <div className="col-md-4" style={{fontSize: '11px', marginLeft: '6px'}}>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col-md-8 center">N {this.vessalLat} °</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-8 sogLine">Lat</div>
                                                </div>

                                            </div>
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col-md-8 center">S {this.VessalLong} °</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-8 sogLine">Long</div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-4" style={{fontSize: '11px'}}>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col-md-6 center">10 kn</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 sogLine">STW</div>
                                                </div>

                                            </div>
                                            <div className="col-md-5">
                                                <div className="row">
                                                    <div className="col-md-6 center">{stw} kn</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 sogLine">SOG</div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>
                            <div className="col-md-3">

                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="compassLebel">Wind</label>
                                        <label className="container">

                                        
                                           <span
                                                className={this.windLebelColor}>{this.windDirectionValue} °</span>
                                      
                                            <input type="checkbox"
                                                   onChange={() => this.setChecked(this.state.compassFlags.dispWindDirection, "dispWindDirection")}
                                                   defaultChecked={this.state.compassFlags.dispWindDirection}/>
                                            <span className="checkmark"></span>

                                        </label>

                                        {/*   <i className="fa fa-arrows" aria-hidden="true" title="Wind Direction"
                                        ><span className={this.windLebelColor}>{this.windDirectionValue} °</span> </i>*/}
                                        {/*  <p><span
                                                className="rectangleHeading">Wind Direction</span>{this.windDirectionValue} °
                                            </p>*/}

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="container">
                                          <span className={this.windLebelColor}>{this.windSpeed} kn</span> 
                                            <input type="checkbox"/>
                                            <span className="checkmark" style={{display: 'none'}}></span>

                                        </label>
                                        {/*  <p><span
                                                className="rectangleHeading">Wind Direction</span>{this.windDirectionValue} °
                                            </p>*/}

                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="compassLebel">Current</label>
                                        <label className="container">
                                           <span
                                                className={this.cuuentSpeedLebelColor}>{this.currectDirectionValue} °</span>
                                         
                                            <input type="checkbox"
                                                   defaultChecked={this.state.compassFlags.dispCurrentDirection}
                                                   onChange={() => this.setChecked(this.state.compassFlags.dispCurrentDirection, "dispCurrentDirection")}/>
                                            <span className="checkmark"></span>

                                        </label>
                                        {/*     <i className="fa fa-arrows" aria-hidden="true" title="Current Direction"
                                        > <span
                                            className={this.cuuentSpeedLebelColor}>{this.currectDirectionValue} °</span></i>*/}
                                        {/*<div className="rectangleSpeed" style={this.cuuentSpeedLebelColor}>

                                            <p><span
                                                className="rectangleHeading">Current Speed</span> {this.currectSpeed} kn
                                            </p>
                                            <p><span
                                                className="rectangleHeading">Current Direction</span>{this.currectDirectionValue} °
                                            </p>

                                        </div>*/}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">

                                        <label className="container">
                                          <span
                                                className={this.cuuentSpeedLebelColor}>{this.currectSpeed} kn</span>
                                           
                                            <input type="checkbox"/>
                                            <span className="checkmark" style={{display: 'none'}}></span>

                                        </label>
                                        {/*<i className="fa fa-tachometer" title="Current Speed"
                                        > <span className={this.cuuentSpeedLebelColor}>{this.currectSpeed} kn</span></i>
*/}
                                        {/*<div className="rectangleSpeed" style={this.cuuentSpeedLebelColor}>

                                            <p><span
                                                className="rectangleHeading">Current Speed</span> {this.currectSpeed} kn
                                            </p>
                                            <p><span
                                                className="rectangleHeading">Current Direction</span>{this.currectDirectionValue} °
                                            </p>

                                        </div>*/}
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="compassLebel">Wave</label>
                                        <label className="container">
                                         <span className='compassLebelSpan'>{this.waveDirection} °</span> 
                                            <input type="checkbox"
                                                   defaultChecked={this.state.compassFlags.dispWaveDirection}
                                                   onChange={() => this.setChecked(this.state.compassFlags.dispWaveDirection, "dispWaveDirection")}/>
                                            <span className="checkmark"></span>

                                        </label>
                                        {/*<i className="fa fa-arrows" aria-hidden="true" title="Wave Direction"
                                        > <span className='compassLebelSpan'>{this.currectDirectionValue} °</span></i>*/}
                                        {/* <p><span
                                    <div className="rectangleWave">


                                                className="rectangleHeading">Wave Height</span> {this.waveHeight} kn</p>
                                            <p><span
                                                className="rectangleHeading">Wave Direction</span>{this.waveDirection} °
                                            </p>
                                    </div>*/}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="container">
                                           <span className='compassLebelHeightSpan'>{this.waveHeight}</span>
                                          
                                            <input type="checkbox"/>
                                            <span className="checkmark" style={{display: 'none'}}></span>

                                        </label>
                                        {/*  <i className="fa fa-arrows-v" title="Wave Height"
                                        > <span className='compassLebelHeightSpan'>{this.waveHeight} kn</span></i>*/}

                                        {/* <p><span
                                    <div className="rectangleWave">


                                                className="rectangleHeading">Wave Height</span> {this.waveHeight} kn</p>
                                            <p><span
                                                className="rectangleHeading">Wave Direction</span>{this.waveDirection} °
                                            </p>
                                    </div>*/}
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="compassLebel">Swell</label>
                                        <label className="container">
                                            <span className='compassLebelSpan'>{this.swellDirection} °</span> 
                                            <input type="checkbox"
                                                   defaultChecked={this.state.compassFlags.dispSwellDirection}
                                                   onChange={() => this.setChecked(this.state.compassFlags.dispSwellDirection, "dispSwellDirection")}/>

                                            <span className="checkmark"></span>

                                        </label>
                                        {/* <i className="fa fa-arrows" aria-hidden="true" title="Swell Direction"
                                        > <span className='compassLebelSpan'>{this.swellDirection} °</span></i>*/}
                                        {/*  <div className="rectangleSwell">
                                            <p><span
                                                className="rectangleHeading">Swell Height</span> {this.swellHeight} kn
                                            </p>
                                            <p><span
                                                className="rectangleHeading">Swell Direction</span>{this.swellDirection} °
                                            </p>
                                        </div>*/}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="container">
                                          <span className='compassLebelSpan'>{this.swellHeight}</span>
                                            <input type="checkbox"/>
                                            <span className="checkmark" style={{display: 'none'}}></span>

                                        </label>
                                        {/*  <i className="fa fa-sellsy" title="Swell Height"
                                        > <span className='compassLebelSpan'>{this.swellHeight} kn</span></i>*/}

                                        {/*  <div className="rectangleSwell">
                                            <p><span
                                                className="rectangleHeading">Swell Height</span> {this.swellHeight} kn
                                            </p>
                                            <p><span
                                                className="rectangleHeading">Swell Direction</span>{this.swellDirection} °
                                            </p>
                                        </div>*/}
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="compassLebel">Heading</label>
                                        <label className="container">
                                           <span className='compassLebelSpan'>{this.vesselHeading} kn</span>
                                            <input type="checkbox"
                                                   defaultChecked={this.state.compassFlags.dispVesselHeadDirection}
                                                   onChange={() => this.setChecked(this.state.compassFlags.dispVesselHeadDirection, "dispVesselHeadDirection")}/>
                                            <span className="checkmark"></span>

                                        </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="compassLebel">Course</label>
                                        <label className="container">
                                          <span
                                                className='compassLebelSpan'>{this.vessalCourseDirection} kn</span>
                                          
                                            <input type="checkbox"
                                                   defaultChecked={this.state.compassFlags.dispVesselCourseDirection}
                                                   onChange={() => this.setChecked(this.state.compassFlags.dispVesselCourseDirection, "dispVesselCourseDirection")}/>
                                            <span className="checkmark"></span>

                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </CustomScrollBar>
            </div>
        );
    }
}

export default CompassD;
