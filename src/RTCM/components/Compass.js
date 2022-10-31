import React, { Component } from "react";
import { Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import { Accordion, Card, Col, Dropdown, Form, Row, Image } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import {
    getCorrectFormattedDate2,
    getItemFromLocalStorage,
    getShipName,
    getVesselId,
    checkValueStatus
} from "../common/helper";
import compassPanelSrc from "../common/images/compass-rose.jpg";
import { getWindyMapData, getDashboardScreenData } from "../../api";
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
import LeafletExample from "../components/LeafletAllVessels";
// import Compass from 'react-Compass';
// import '../../../node_modules/react-compass/dist/react-compass.css';
import { establishSocketConnection } from "../../../src/api";
import { setItemInLocalStorage } from "../common/helper";
class Compass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headerUIRef: React.createRef(),
            element: props.element,
            otherData: {},
            windyData: props.windData != undefined ? props.windData : {}, //JSON.parse('{"packetTs":"2021-12-05 16:19:52","createdTs":"2021-12-05 16:20:44","id":105529,"journeyCounter":5,"lat":"23.97","long":"46.30","weatherData":{"time":"2021-12-05T16:00:00+00:00","windSpeed":{"sg":3.11,"icon":3.11,"noaa":2.82},"waveHeight":{"sg":1.17,"icon":0.66,"noaa":0.83,"meteo":1.17},"swellHeight":{"sg":1.15,"icon":0.66,"noaa":0.83,"meteo":1.15},"swellPeriod":{"sg":6.69,"icon":7.42,"noaa":8.07,"meteo":6.69},"currentSpeed":{"sg":0.07,"meto":0.07},"waveDirection":{"sg":136.72,"icon":136.29,"noaa":142.66,"meteo":136.72},"windDirection":{"sg":24.26,"icon":140.26,"noaa":134.94},"swellDirection":{"sg":237.12,"icon":136.28,"noaa":140.04,"meteo":187.12},"windWaveHeight":{"sg":0.14,"icon":0.05,"noaa":0.28,"meteo":0.14},"windWavePeriod":{"sg":1.77,"icon":1.43,"noaa":3.11,"meteo":1.77},"currentDirection":{"sg":320.97,"meto":52.97},"vessalCourseDirection":{"sg":162.97,"meto":52.97}},"nmeaData":{"latDirection":"S","longDirection":"W","vesselHeading":"351.40"},"vesselId":2}'),//windyDataFromDB.stormGlassData.data[windyDataFromDB.stormGlassData.data.length - 1].nmeaData;
            vesselId: parseInt(getVesselId()),
            mapTooltipConfiguration: {},
            compassFlags: {
                dispCurrentDirection: true,
                dispWindDirection: true,
                dispSwellDirection: true,
                dispWaveDirection: true,
                dispVesselCourseDirection: true,
                dispVesselHeadDirection: true

            },
            dashboardtStateForCompass: props.dashboardtStateForCompass,
            socketSubscriberName: "subscribeToDashboard",
            socket: establishSocketConnection("subscribeToDashboard", {
                'shipName': getShipName(),
                'vesselId': getVesselId()
            }),
        };
        // this.startTimer = this.startTimer.bind(this);
        //  this.stopTimer = this.stopTimer.bind(this);
        /*this.fetchWindyMapData = this.fetchWindyMapData.bind(this);
        this.onFetchWindyMapDataSuccess = this.onFetchWindyMapDataSuccess.bind(this);
        this.onFetchWindyMapDataFailure = this.onFetchWindyMapDataFailure.bind(this);*/
        this.subscribeToSocket("subscribeToDashboard");
    }

    componentDidMount() {

        //  this.startTimer();
        let otherInfo = {
            'shipName': getShipName(),
            'vesselId': getVesselId()
        };
        this.setState({
            otherData: otherInfo
        });
        //this.fetchWindyMapData();//-------------un comment when given to SSH
    }

    /*componentWillReceiveProps(nextProps, nextContext) {
        
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
    }*/

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


    /*fetchWindyMapData = () => {
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
    };*/

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
        this.setState({ compassFlags: item });
        item.dispCurrentDirection = !currentValue;
        this.setState({ compassFlags: item });
        item.dispSwellDirection = !currentValue;
        this.setState({ compassFlags: item });
        item.dispWaveDirection = !currentValue;
        this.setState({ compassFlags: item });
        item.dispVesselCourseDirection = !currentValue;
        this.setState({ compassFlags: item });
        item.dispVesselHeadDirection = !currentValue;
        this.setState({ compassFlags: item });
    }

    setChecked(currentValue, Name) {

        let checkBoxesValue = [this.state.compassFlags];
        let item = checkBoxesValue[0];
        if (Name === "dispWindDirection") {
            item.dispWindDirection = !currentValue;
            this.setState({ compassFlags: item });
        } else if (Name === "dispCurrentDirection") {
            item.dispCurrentDirection = !currentValue;
            this.setState({ compassFlags: item });
        } else if (Name === "dispSwellDirection") {
            item.dispSwellDirection = !currentValue;
            this.setState({ compassFlags: item });
        } else if (Name === "dispWaveDirection") {
            item.dispWaveDirection = !currentValue;
            this.setState({ compassFlags: item });
        } else if (Name === "dispVesselCourseDirection") {
            item.dispVesselCourseDirection = !currentValue;
            this.setState({ compassFlags: item });
        } else {
            item.dispVesselHeadDirection = !currentValue;
            this.setState({ compassFlags: item });
        }
    }


    subscribeToSocket(socketSubscriberName) {

        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {

            if (dataSentOverSocket.updatedTime) {
                setItemInLocalStorage('lastUpdatedHeaderTime', JSON.stringify(dataSentOverSocket.updatedTime));
            }
            if (dataSentOverSocket.otherData) {
                this.setState({
                    otherData: dataSentOverSocket.otherData
                });

            } else {
                delete dataSentOverSocket.updatedTime;
                this.setState({
                    dashboardtStateForCompass: dataSentOverSocket
                });
            }
        });
    }
    render() {



        //---------------------------------campass-----------------------------------
        let vessalDIrectionInDeg;
        let windDirectionStyle;
        let windSpeed = "0";
        let windDirectionValue = "0";
        let currectSpeed = "0";
        let currectDirection = "0";
        let swellHeight = "0";
        let swellDirection = "0";
        let waveHeight = "0";
        let waveDirection = "0";
        let greenTirangleDirection;
        let currectDirectionDegree;
        let vessalLatLogTextDirection;

        let vessalCourseDirection="0";
        let vesselHeading="0";
        let vessalLat="0";
        let VessalLong="0";
        let windDirectionArrowClassName;
        let currentDirectionArrowClassName;
        let currectDirectionValue = "0";
        let vessalCourseDirectionInDeg;
        let vessalHeadingDirection = "0";
        let WaveDirectionInDeg;
        let swellDIrectionInDeg;
        let redTirangleDirection;
        let windyData;
        let windLebelColor;
        let cuuentSpeedLebelColor;
        let deg1;
        let sog;
        let windDirection;
        let extraNMEAData;
        let stw = 0;
        windyData = this.state.windyData;
      
        if (windyData != undefined) {
           
            if (Object.keys(windyData).length > 0) {
                let nameDataFilter =windyData.stormGlassData!=undefined?windyData.stormGlassData.data.filter(x => x.nmeaData.sog != undefined):[];
                let nameDataDateWiseFilter = [];
                if (nameDataFilter != undefined && nameDataFilter.length>0) {
                    if (nameDataFilter.length > 0) {
                        nameDataDateWiseFilter = nameDataFilter.sort((a, b) => new Date(b.packetTs) - new Date(a.packetTs));
                        if (nameDataDateWiseFilter.length > 0) {
                            sog = nameDataDateWiseFilter[0].nmeaData.sog
                        }
                    }
                }
                // sog = extraNMEAData ? extraNMEAData.sog ? extraNMEAData.sog : "" : "";
                stw =this.state.dashboardtStateForCompass.widget_1.configuration!=undefined?this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row6.colData.col2.widgetData.value:"0";
                //this.props.element.configuration.body.data.carousel1.group2.data.row6.colData.col2.widgetData.value;
                //this.state.mapTooltipConfiguration[1].priority===""?0:this.state.mapTooltipConfiguration[1].priority;
                // extraNMEAData = this.windyData.nmeaData
                // sog = extraNMEAData ? extraNMEAData.sog ? extraNMEAData.sog : "0" : "0";
                //  const speedOverGround = extraNMEAData ? extraNMEAData.sog ? extraNMEAData.sog : "" : "";
                // this.windyData = JSON.parse('{"packetTs":"2021-12-05 16:19:52","createdTs":"2021-12-05 16:20:44","id":105529,"journeyCounter":5,"lat":"23.97","long":"46.30","weatherData":{"time":"2021-12-05T16:00:00+00:00","windSpeed":{"sg":3.11,"icon":3.11,"noaa":2.82},"waveHeight":{"sg":1.17,"icon":0.66,"noaa":0.83,"meteo":1.17},"swellHeight":{"sg":1.15,"icon":0.66,"noaa":0.83,"meteo":1.15},"swellPeriod":{"sg":6.69,"icon":7.42,"noaa":8.07,"meteo":6.69},"currentSpeed":{"sg":0.07,"meto":0.07},"waveDirection":{"sg":136.72,"icon":136.29,"noaa":142.66,"meteo":136.72},"windDirection":{"sg":140.26,"icon":140.26,"noaa":134.94},"swellDirection":{"sg":137.12,"icon":136.28,"noaa":140.04,"meteo":137.12},"windWaveHeight":{"sg":0.14,"icon":0.05,"noaa":0.28,"meteo":0.14},"windWavePeriod":{"sg":1.77,"icon":1.43,"noaa":3.11,"meteo":1.77},"currentDirection":{"sg":52.97,"meto":52.97},"vessalCourseDirection":{"sg":122.97,"meto":52.97}},"nmeaData":{"latDirection":"S","longDirection":"W","vesselHeading":"351.40"},"vesselId":2}'); //windyDataFromDB.stormGlassData.data[windyDataFromDB.stormGlassData.data.length - 1].nmeaData;
                //  this.vessalLat = this.windyData.lat;
                //  this.VessalLong = this.windyData.long;
                //  deg1 = extraNMEAData.vesselHeading + 'deg';
                // this.vessalHeadingDirection = {
                //     transition: 'transform 5000ms ease',
                //     transform: `rotate(${deg1})`
                // }
               vessalLat = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row4.colData.col1.widgetData.value;
                VessalLong = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row4.colData.col2.widgetData.value;
               vesselHeading = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row6.colData.col1.widgetData.value;
                let vesselHeadDirection = parseInt(this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row6.colData.col1.widgetData.value) + "deg";
                vessalDIrectionInDeg = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${vesselHeadDirection})`
                }
                vessalHeadingDirection = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${vesselHeadDirection})`
                }
                let redTirangleDirectionDeg = parseInt(vesselHeading) + 45 + "deg";
                redTirangleDirection = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${redTirangleDirectionDeg})`
                }
                let greenTirangleDirectionDeg = (parseInt(vesselHeading) + 45) - 180 + "deg";
               greenTirangleDirection = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${greenTirangleDirectionDeg})`
                }
                let vessalLatLogTextDirectionDeg = parseInt(vesselHeading) + 90 + "deg";

                let vesselHeadingDirectionValue = parseInt(vesselHeading);
                vessalLatLogTextDirection = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${vessalLatLogTextDirectionDeg})`
                }
                windDirection = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row5.colData.col2.widgetData.value + 'deg';
                windSpeed = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row5.colData.col1.widgetData.value;
                windDirectionValue = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel1.group2.data.row5.colData.col2.widgetData.value;
                windDirectionStyle = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${windDirection})`
                }
                currectSpeed = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel2.group2.data.row6.colData.col1.widgetData.value;
                currectDirection = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel2.group2.data.row6.colData.col2.widgetData.value + 'deg';
                currectDirectionValue = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel2.group2.data.row6.colData.col2.widgetData.value;
                currectDirectionDegree = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${currectDirection})`
                }

                let vesselHeadingRed1StDirection = vesselHeadingDirectionValue - 45 < 0 ? vesselHeadingDirectionValue + 360 - 45 : (vesselHeadingDirectionValue - 45 >= 360 ? vesselHeadingDirectionValue - 45 - 360 : vesselHeadingDirectionValue - 45);

                let vesselHeadingRed2ndDirection = vesselHeadingDirectionValue + 45 >= 360 ? vesselHeadingDirectionValue + 45 - 360 : vesselHeadingDirectionValue + 45;

                let vesselHeadingGreen1StDirection = vesselHeadingDirectionValue - 225 < 0 ? vesselHeadingDirectionValue - 225 + 360 : (vesselHeadingDirectionValue - 225 >= 360 ? vesselHeadingDirectionValue - 225 - 360 : vesselHeadingDirectionValue - 225);

                let vesselHeadingGreen2ndDirection = vesselHeadingDirectionValue - 135 < 0 ? vesselHeadingDirectionValue - 135 + 360 : (vesselHeadingDirectionValue - 135 >= 360 ? vesselHeadingDirectionValue - 135 - 360 : vesselHeadingDirectionValue - 135);

                let checkWindDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, vesselHeadingRed2ndDirection, this.windDirectionValue);

                let checkWindInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, vesselHeadingGreen2ndDirection, this.windDirectionValue);

                let checkCurrentDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, vesselHeadingRed2ndDirection, currectDirection);
                // let checkCurrentDataInRedTriangle1 = checkValueStatus(0, vesselHeadingRed2ndDirection, currentDir);
                let checkCurrentInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, vesselHeadingGreen2ndDirection, currectDirection);
                // let checkCurrentDataInGreenTriangle1 = checkValueStatus(180, vesselHeadingGreen2ndDirection, currentDir);
                if (checkWindDataInRedTriangle) {
                   windLebelColor = 'forRedTirangle Font18';

                } else if (checkWindInGreenTriangle) {
                    windLebelColor = 'forGreenTirangle Font18';
                } else {
                    windLebelColor = "forWhiteTirangle Font18";
                }
                if (checkCurrentDataInRedTriangle) {
                    cuuentSpeedLebelColor = 'forRedTirangle Font18';

                } else if (checkCurrentInGreenTriangle) {
                    cuuentSpeedLebelColor = 'forGreenTirangle Font18';

                } else {
                    cuuentSpeedLebelColor = 'forWhiteTirangle Font18';
                }

                waveDirection = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel2.group2.data.row4.colData.col2.widgetData.value;
                let waveDirectionInSg = parseInt(waveDirection) + 'deg';
                WaveDirectionInDeg = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${waveDirectionInSg})`
                }
                waveHeight = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel2.group2.data.row4.colData.col1.widgetData.value;

               swellHeight = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel2.group2.data.row5.colData.col1.widgetData.value;
               swellDirection = this.state.dashboardtStateForCompass.widget_1.configuration.body.data.carousel2.group2.data.row5.colData.col2.widgetData.value;;
                let swellDirectionInSg = parseInt(swellDirection) + 'deg';
                swellDIrectionInDeg = {
                    transition: 'transform 5000ms ease',
                    transform: `rotate(${swellDirectionInSg})`
                }
                if (Object.keys(nameDataDateWiseFilter[0].weatherData).length > 0) {
                    if (nameDataDateWiseFilter[0].weatherData.vessalCourseDirection != undefined) {
  
                       vessalCourseDirection = nameDataDateWiseFilter[0].weatherData.vessalCourseDirection.sg;
                        let vessalCourseDirectionDeg = nameDataDateWiseFilter[0].weatherData.vessalCourseDirection.sg + "deg";
                        vessalCourseDirectionInDeg = {
                            transition: 'transform 5000ms ease',
                            transform: `rotate(${vessalCourseDirectionDeg})`
                        }
                    }
                }


                // if (Object.keys(this.windyData.weatherData).length > 0 && this.windyData.weatherData.currentSpeed != undefined) {
                //     windDirection = this.windyData.weatherData.windDirection.sg + 'deg';

                //     this.windSpeed = this.windyData.weatherData.windSpeed.sg;
                //     this.windDirectionValue = this.windyData.weatherData.windDirection.sg;
                //     this.windDirectionStyle = {
                //         transition: 'transform 5000ms ease',
                //         transform: `rotate(${windDirection})`
                //     }

                //     this.currectSpeed = this.windyData.weatherData.currentSpeed.sg;
                //     this.currectDirection = this.windyData.weatherData.currentDirection.sg + 'deg';
                //     this.currectDirectionValue = this.windyData.weatherData.currentDirection.sg;
                //     this.currectDirectionDegree = {
                //         transition: 'transform 5000ms ease',
                //         transform: `rotate(${this.currectDirection})`
                //     }
                //     this.waveDirection = this.windyData.weatherData.waveDirection.sg;
                //     let waveDirectionInSg = this.windyData.weatherData.waveDirection.sg + 'deg';
                //     this.WaveDirectionInDeg = {
                //         transition: 'transform 5000ms ease',
                //         transform: `rotate(${waveDirectionInSg})`
                //     }
                //     this.waveHeight = this.windyData.weatherData.waveHeight.sg;
                //     this.swellHeight = this.windyData.weatherData.swellHeight.sg;
                //     this.swellDirection = this.windyData.weatherData.swellDirection.sg;
                //     let swellDirectionInSg = this.windyData.weatherData.swellDirection.sg + 'deg';
                //     this.swellDIrectionInDeg = {
                //         transition: 'transform 5000ms ease',
                //         transform: `rotate(${swellDirectionInSg})`
                //     }
                //     if (this.windyData.weatherData.vessalCourseDirection) {
                //         this.vessalCourseDirection = this.windyData.weatherData.vessalCourseDirection.sg;
                //         let vessalCourseDirectionDeg = this.windyData.weatherData.vessalCourseDirection.sg + "deg";
                //         this.vessalCourseDirectionInDeg = {
                //             transition: 'transform 5000ms ease',
                //             transform: `rotate(${vessalCourseDirectionDeg})`
                //         }

                //     }

                //     this.windDirectionValue = parseInt(this.windDirectionValue);
                //     let currentDir = parseInt(this.windyData.weatherData.currentDirection.sg);
                //     let vesselHeadingDirectionValue = parseInt(this.vesselHeading);

                //     let vesselHeadingRed1StDirection = vesselHeadingDirectionValue - 45 < 0 ? vesselHeadingDirectionValue + 360 - 45 : (vesselHeadingDirectionValue - 45 >= 360 ? vesselHeadingDirectionValue - 45 - 360 : vesselHeadingDirectionValue - 45);

                //     let vesselHeadingRed2ndDirection = vesselHeadingDirectionValue + 45 >= 360 ? vesselHeadingDirectionValue + 45 - 360 : vesselHeadingDirectionValue + 45;

                //     let vesselHeadingGreen1StDirection = vesselHeadingDirectionValue - 225 < 0 ? vesselHeadingDirectionValue - 225 + 360 : (vesselHeadingDirectionValue - 225 >= 360 ? vesselHeadingDirectionValue - 225 - 360 : vesselHeadingDirectionValue - 225);

                //     let vesselHeadingGreen2ndDirection = vesselHeadingDirectionValue - 135 < 0 ? vesselHeadingDirectionValue - 135 + 360 : (vesselHeadingDirectionValue - 135 >= 360 ? vesselHeadingDirectionValue - 135 - 360 : vesselHeadingDirectionValue - 135);

                //     let checkWindDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, vesselHeadingRed2ndDirection, this.windDirectionValue);

                //     let checkWindInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, vesselHeadingGreen2ndDirection, this.windDirectionValue);

                //     let checkCurrentDataInRedTriangle = checkValueStatus(vesselHeadingRed1StDirection, vesselHeadingRed2ndDirection, currentDir);
                //     // let checkCurrentDataInRedTriangle1 = checkValueStatus(0, vesselHeadingRed2ndDirection, currentDir);
                //     let checkCurrentInGreenTriangle = checkValueStatus(vesselHeadingGreen1StDirection, vesselHeadingGreen2ndDirection, currentDir);
                //     // let checkCurrentDataInGreenTriangle1 = checkValueStatus(180, vesselHeadingGreen2ndDirection, currentDir);
                //     if (checkWindDataInRedTriangle) {
                //         this.windLebelColor = 'forRedTirangle Font12';

                //     } else if (checkWindInGreenTriangle) {
                //         this.windLebelColor = 'forGreenTirangle Font12';
                //     } else {
                //         this.windLebelColor = "forWhiteTirangle Font12";
                //     }
                //     if (checkCurrentDataInRedTriangle) {
                //         this.cuuentSpeedLebelColor = 'forRedTirangle Font12';

                //     } else if (checkCurrentInGreenTriangle) {
                //         this.cuuentSpeedLebelColor = 'forGreenTirangle Font12';

                //     } else {
                //         this.cuuentSpeedLebelColor = 'forWhiteTirangle Font12';
                //     }
                // }

            }
            //--------------------------------------End------------------------------------------
            return (

                <div className="dashboard-container" style={{ backgroundColor: '#161719' }}>
                    {/* ---------------------------------campass----------------------------------- */}

                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-11 offset-md-1">
                                    <div id="frameForFullScreen">
                                        <Image id="myImgForFullScreen"
                                            style={vessalDIrectionInDeg}
                                            src={vessalImg} />
                                        <div className="triangleRedForFullScreen"
                                            style={redTirangleDirection}></div>
                                        <div className="triangleGreenForFullScreen"
                                            style={greenTirangleDirection}></div>

                                        {this.state.compassFlags.dispCurrentDirection &&
                                            <div className="currentDirectionArrowForFullScreen"
                                                style={currectDirectionDegree}>
                                                <span
                                                    className="arrowCurrentDirectionForFullScreen arrowCurrentDirectionDownForFullScreen"></span>

                                            </div>}
                                        {/*    ----------------------end----------------------*/}
                                        {/* Wind direction arrow icon*/}
                                        {this.state.compassFlags.dispWindDirection &&
                                            <div className="WindArrowForFullScreen"
                                                style={windDirectionStyle}>
                                                <span
                                                    className="arrowWindDirectionForFullScreen arrowWindDirectionDownForFullScreen"></span>

                                            </div>}
                                        {/*    ----------------------end----------------------*/}
                                        {/* Vessal Course direction arrow icon*/}
                                        {this.state.compassFlags.dispVesselCourseDirection &&
                                            <div className="VessalCourseArrowForFullScreen"
                                                style={vessalCourseDirectionInDeg}>
                                                <span
                                                    className="arrowVCDirectionForFullScreen arrowVCDirectionUpForFullScreen"></span>

                                            </div>}
                                        {/*    ----------------------end----------------------*/}
                                        {/* Vessal Heading direction arrow icon*/}
                                        {this.state.compassFlags.dispVesselHeadDirection &&
                                            <div className="VessalHeadingCourseArrowForFullScreen"
                                                style={vessalHeadingDirection}>
                                                <span
                                                    className="arrowVHDirectionForFullScreen arrowVHDirectionUpForFullScreen"></span>

                                            </div>}
                                        {/*    ----------------------end----------------------*/}

                                        {/* Vessal Heading direction arrow icon*/}
                                        {this.state.compassFlags.dispWaveDirection &&
                                            <div className="WaveArrowForFullScreen"
                                                style={WaveDirectionInDeg}>
                                                <span
                                                    className="arrowWaveDirectionForFullScreen arrowWaveDirectionDownForFullScreen"></span>

                                            </div>}
                                        {/*    ----------------------end----------------------*/}

                                        {/* Vessal Swell direction arrow icon*/}
                                        {this.state.compassFlags.dispSwellDirection &&
                                            <div className="SwellArrowForFullScreen"
                                                style={swellDIrectionInDeg}>
                                                <span
                                                    className="arrowSwellDirectionForFullScreen arrowSwellDirectionDownForFullScreen"></span>

                                            </div>}
                                        {/*    ----------------------end----------------------*/}

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-6" >
                            <div className="row mt16">
                                <div className="col-md-3 offset-md-1">
                                    <div className="row mt8">
                                        <div
                                            className="col-md-6 center">
                                            <span className="font18"> {vessalLat}</span>
                                            <span className="font12 unitStyle"> ° N</span>
                                        </div>
                                    </div>
                                    <div className="row mt8">
                                        <div className="col-md-6 sogLineForFullScree font12 unitStyle">Lat
                                        </div>
                                    </div>


                                    <div className="row mt8">
                                        <div
                                            className="col-md-6 center">
                                            <span className="font18"> {VessalLong}</span>
                                            <span className="font12 unitStyle"> ° S</span>

                                        </div>
                                    </div>
                                    <div className="row mt8">
                                        <div className="col-md-6 sogLineForFullScree font12 unitStyle">Long
                                        </div>
                                    </div>

                                    <div className="row mt8">
                                        <div className="col-md-6 center">
                                            <span className="font18"> {stw}</span>
                                            <span className="font12 unitStyle"> kn</span>
                                        </div>
                                    </div>
                                    <div className="row mt8">
                                        <div className="col-md-6 sogLineForFullScree font12 unitStyle">STW
                                        </div>
                                    </div>

                                    <div className="row mt8">
                                        <div className="col-md-6 center">
                                            <span className="font18"> {sog}</span>
                                            <span className="font12 unitStyle"> kn</span>
                                        </div>
                                    </div>
                                    <div className="row mt8">
                                        <div className="col-md-6 sogLineForFullScree font12 unitStyle">SOG
                                        </div>
                                    </div>



                                </div>
                                <div className="col-md-4">
                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <i className="fa fa-long-arrow-right compassWindLabelIcons"
                                                aria-hidden="true"></i><label
                                                    className="compassLebelSpanForFullScreen font18 unitStyle">Wind</label>
                                            <label className="container">
                                                <span
                                                    className={windLebelColor}>{windDirectionValue}</span>
                                                <span className="font12 unitStyle"> ° </span>


                                                <input type="checkbox"
                                                    onChange={() => this.setChecked(this.state.compassFlags.dispWindDirection, "dispWindDirection")}
                                                    defaultChecked={this.state.compassFlags.dispWindDirection} />
                                                <span className="checkmark"></span>

                                            </label>

                                            {/*   <i className="fa fa-arrows" aria-hidden="true" title="Wind Direction"
                                        ><span className={this.windLebelColor}>{this.windDirectionValue} °</span> </i>*/}
                                            {/*  <p><span
                                                className="rectangleHeading">Wind Direction</span>{this.windDirectionValue} °
                                            </p>*/}

                                        </div>
                                    </div>
                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <label className="container">

                                                <span
                                                    className={windLebelColor}>{windSpeed}</span>
                                                <span className="font12 unitStyle"> kn</span>
                                                <input type="checkbox" />
                                                <span className="checkmark"
                                                    style={{ display: 'none' }}></span>

                                            </label>
                                            {/*  <p><span
                                                className="rectangleHeading">Wind Direction</span>{this.windDirectionValue} °
                                            </p>*/}

                                        </div>
                                    </div>


                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <i
                                                className="fa fa-long-arrow-right compassVHDLabelIcons"
                                                aria-hidden="true"></i><label
                                                    className="compassLebelSpanForFullScreen font18 unitStyle">Heading </label>
                                            <label className="container">
                                                <span
                                                    className='compassLebelSpanForFullScreen mrl0 font18'>{vesselHeading}  <span className="font12 unitStyle"> °</span></span>
                                               
                                                <input type="checkbox"
                                                    defaultChecked={this.state.compassFlags.dispVesselHeadDirection}
                                                    onChange={() => this.setChecked(this.state.compassFlags.dispVesselHeadDirection, "dispVesselHeadDirection")} />
                                                <span className="checkmark"></span>

                                            </label>
                                        </div>
                                    </div>
                                   
                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <i
                                                className="fa fa-long-arrow-right compassVCDLabelIcons"
                                                aria-hidden="true"></i> <label
                                                    className="compassLebelSpanForFullScreen font18 unitStyle">Course </label>
                                            <label className="container">
                                                <span
                                                    className='compassLebelSpanForFullScreen font18'>{vessalCourseDirection} </span>
                                                <span className="font12 unitStyle"> kn</span>
                                                <input type="checkbox"
                                                    defaultChecked={this.state.compassFlags.dispVesselCourseDirection}
                                                    onChange={() => this.setChecked(this.state.compassFlags.dispVesselCourseDirection, "dispVesselCourseDirection")} />
                                                <span className="checkmark"></span>

                                            </label>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-md-4">
                                    
                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <i
                                                className="fa fa-long-arrow-right compassCurrentLabelIcons"
                                                aria-hidden="true"></i><label
                                                    className="compassLebelSpanForFullScreen font18 unitStyle">Current </label>
                                            <label className="container">
                                                <span
                                                    className={cuuentSpeedLebelColor}>{currectDirectionValue}</span>
                                                <span className="font12 unitStyle"> °</span>

                                                <input type="checkbox"
                                                    defaultChecked={this.state.compassFlags.dispCurrentDirection}
                                                    onChange={() => this.setChecked(this.state.compassFlags.dispCurrentDirection, "dispCurrentDirection")} />
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
                                    <div className="row mt8">
                                        <div className="col-md-12">

                                            <label className="container">
                                                <span
                                                    className={cuuentSpeedLebelColor}>{currectSpeed}</span>
                                                <span className="font12 unitStyle"> kn</span>
                                                <input type="checkbox" />
                                                <span className="checkmark"
                                                    style={{ display: 'none' }}></span>

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

                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <i
                                                className="fa fa-long-arrow-right compassSwellLabelIcons"
                                                aria-hidden="true"></i><label
                                                    className="compassLebelSpanForFullScreen font18 unitStyle">Swell</label>
                                            <label className="container">
                                                <span
                                                    className='compassLebelSpanForFullScreen mrl0 font18'>{swellDirection}</span>
                                                <span className="font12 unitStyle"> °</span>
                                                <input type="checkbox"
                                                    defaultChecked={this.state.compassFlags.dispSwellDirection}
                                                    onChange={() => this.setChecked(this.state.compassFlags.dispSwellDirection, "dispSwellDirection")} />

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
                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <label className="container">
                                                <span
                                                    className='compassLebelSpanForFullScreen font18 mrl0'>{swellHeight}<span className="font12 unitStyle"> mts</span></span>

                                                <input type="checkbox" />
                                                <span className="checkmark"
                                                    style={{ display: 'none' }}></span>

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


                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <i
                                                className="fa fa-long-arrow-right compassWaveLabelIcons"
                                                aria-hidden="true"></i><label
                                                    className="compassLebelSpanForFullScreen font18 unitStyle">Wave </label>
                                            <label className="container">
                                                <span
                                                    className='compassLebelSpanForFullScreen mrl0 font18'>{waveDirection} </span>
                                                <span className="font12 unitStyle"> °</span>

                                                <input type="checkbox"
                                                    defaultChecked={this.state.compassFlags.dispWaveDirection}
                                                    onChange={() => this.setChecked(this.state.compassFlags.dispWaveDirection, "dispWaveDirection")} />
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
                                    <div className="row mt8">
                                        <div className="col-md-12">
                                            <label className="container">
                                                <span
                                                    className='compassLebelHeightSpanForFullScreen font18'>{waveHeight} <span className="font12 unitStyle">mts</span></span>

                                                <input type="checkbox" />
                                                <span className="checkmark"
                                                    style={{ display: 'none' }}></span>

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

                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    }
}

export default Compass;
