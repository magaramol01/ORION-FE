import React from "react";
import * as L from "leaflet";
import 'leaflet.fullscreen';
import 'leaflet-polylinedecorator';
import '../common/css/App.css';
import greenPinMarkerUrl from "../common/images/PoiLocationPinMarker.png";
import redPinMarkerUrl from "../common/images/LocationPoiPinMarker.Png";
import greenDotIconUrl from "../common/images/green-ball-png-3-original.png";
import redDotIconUrl from "../common/images/pointing-clipart-red-3-original.png";
 import vesselIconUrl from "../common/images/ShipUpdated.png";
// import shipFrontViewIconUrl from "../common/images/shipFrontView.png";
// import shipFrontViewIconUrl from "../common/images/ship-icon1.png";
import SECARegionJson from "../json/SECAPoints"
import {Dropdown} from "react-bootstrap";
import _ from "lodash";
import {externalAPIKeys, getAllVesselsWindyMapData,getAllShip,getAllShipSourceDastinationData} from "../../api";
import {getShipName, getDateInCommonStrFormat, getDiffBetweenDatesInMinutes, getVesselId} from "../common/helper";
import {withRouter} from "react-router-dom";

const CustomToggle = React.forwardRef(({children, onClick}, ref) => (
    <div ref={ref}
         style={{cursor: "pointer"}}
         onClick={(e) => {
             e.preventDefault();
             onClick(e);
         }}
    >
        <i className="fa fa-ellipsis-v windy-ellipsis-feel"/>
    </div>
));

class LeafletAllVessels extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hover: "",
            dashboardRef: props.dashboardRef,
            options: {
                key: externalAPIKeys.windy,
                zoom: 0,
                timestamp: Date.now(),
                hourFormat: '12h',
                verbose: false,  // prints logs on console so that we can trace issues
            },
            leafletData: {},
            mapSettings: {
                showPopup: false,
                portToPortPath: true,
                traveledPath: true,
                currentPath: false,
                allPath: false,
                weatherMap: true,
                normalMap: false
            },
            SECARegionJson: SECARegionJson,
            shipName: getShipName(),
            vesselId: parseInt(getVesselId()),
            vesselUncheckedArrForWindy: [],
            shipNameAndId:{},
            mapToolTipConfiguration: [
                {"caption":"latlong","visible": true, "priority": 1},
                {"caption":"speedOverGround","visible": true, "priority": 2},
                {"caption":"waveDirection","visible": true, "priority": 3},
                {"caption":"waveHeight","visible": true, "priority": 4},
                {"caption":"swellDirection","visible": true, "priority": 5},
                {"caption":"swellHeight","visible": true, "priority": 6},
                {"caption":"windSpeed","visible": true, "priority": 7},
                {"caption":"windDirection","visible": true, "priority": 8},
                {"caption":"currentSpeed","visible": true, "priority": 9},
                {"caption":"currentDirection","visible": true, "priority": 10}
            ],
            allShipSourceDestination : {},
        };

        this.fetchAllVesselsWindyMapData = this.fetchAllVesselsWindyMapData.bind(this);
        this.onFetchAllVesselsWindyMapDataSuccess = this.onFetchAllVesselsWindyMapDataSuccess.bind(this);
        this.onFetchAllVesselsWindyMapDataFailure = this.onFetchAllVesselsWindyMapDataFailure.bind(this);
        this.handleOnVesselFilterChangeForWindy = this.handleOnVesselFilterChangeForWindy.bind(this);
        this.initLeafletWindy = this.initLeafletWindy.bind(this);

        this.state.dashboardRef.handleOnVesselFilterChangeForWindy = this.handleOnVesselFilterChangeForWindy;
    }

    componentDidMount() {
        this.fetchAllVesselsWindyMapData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const socketData = nextProps.socketData;
        if (socketData && socketData.vesselId && this.state.vesselId === socketData.vesselId) {
            let leafletDataCopy = _.cloneDeep(this.state.leafletData);

            if (Object.keys(leafletDataCopy).length === 0 && leafletDataCopy.constructor === Object) {
                leafletDataCopy.stormGlassData = [];
                leafletDataCopy.marineTrafficData = [];
            }

            const newStormGlassWeatherData = socketData.stormGlassWeatherData;
            if (newStormGlassWeatherData && Object.keys(newStormGlassWeatherData).length !== 0 && newStormGlassWeatherData.constructor === Object) {
                let traveledPathPointsDataArr = leafletDataCopy.stormGlassData;
                let isSameEntryExists = traveledPathPointsDataArr.some(ele => ele.lat === newStormGlassWeatherData.lat && ele.long === newStormGlassWeatherData.long);

                if (!isSameEntryExists) {
                    newStormGlassWeatherData.nmeaData = JSON.parse(newStormGlassWeatherData.nmeaData);
                    newStormGlassWeatherData.weatherData = JSON.parse(newStormGlassWeatherData.weatherData);

                    const existingRecordIndex = traveledPathPointsDataArr.findIndex(ele => ele.vesselId === newStormGlassWeatherData.vesselId);
                    traveledPathPointsDataArr[existingRecordIndex] = newStormGlassWeatherData;

                    leafletDataCopy.stormGlassData = traveledPathPointsDataArr;

                    this.setState({
                        leafletData: leafletDataCopy
                    }, this.renderVesselsLastLocation);
                }
            }

            const newMarineTrafficData = socketData.marineTrafficData;
            if (newMarineTrafficData && Object.keys(newMarineTrafficData).length !== 0 && newMarineTrafficData.constructor === Object) {
                let portToPortData = leafletDataCopy.marineTrafficData;

                if (portToPortData.length === 0) {
                    portToPortData.unshift(newMarineTrafficData);

                    this.setState({
                        leafletData: leafletDataCopy
                    }, this.renderPortToPortPath);
                }
            }
        }
    }

    handleOnVesselFilterChangeForWindy(vesselUncheckedArr) {
        this.setState({vesselUncheckedArrForWindy: vesselUncheckedArr});
        console.log(this.state.vesselUncheckedArrForWindy);
        this.initLeafletWindy();
    }

    fetchAllVesselsWindyMapData = async () => {
        await getAllShipSourceDastinationData(this.onFetchAllSourceDestDataSuccess,this.onFetchAllSourceDestDataFailure)
        getAllShip(this.getShipNameSuccess, this.getShipNameFail);
        getAllVesselsWindyMapData(this.onFetchAllVesselsWindyMapDataSuccess, this.onFetchAllVesselsWindyMapDataFailure);
    };

    onFetchAllSourceDestDataSuccess = (response) => {
        this.setState({
            allShipSourceDestination : response.data
        })
    }

    onFetchAllSourceDestDataFailure = (err) => {

    }
    toggleHover = (hover,vsId) => {
        this.setState({
            hover: this.state.hover,
        })
        debugger
        this.renderPortToPortPath(vsId);
        console.log(this.state.hover)
    };

    getShipNameSuccess = (response) => {
        console.log(this.state.shipNameAndId);
        this.setState({
            shipNameAndId : response.data
        })
    }

    getShipNameFail = (err) => {
    }

    onFetchAllVesselsWindyMapDataSuccess = (response) => {

        if (response && Object.keys(response.data).length !== 0) {
            const windyMapData = response.data;

            let leafletDataCopy = _.cloneDeep(this.state.leafletData);

            if (Object.keys(leafletDataCopy).length === 0 && leafletDataCopy.constructor === Object) {
                leafletDataCopy.stormGlassData = [];
                leafletDataCopy.marineTrafficData = [];
            }

            const savedStormGlassWeatherData = windyMapData.stormGlassData;
            if (savedStormGlassWeatherData && savedStormGlassWeatherData.length !== 0) {
                leafletDataCopy.stormGlassData = savedStormGlassWeatherData;
            }

            const savedMarineTrafficData = windyMapData.marineTrafficData;
            if (savedMarineTrafficData && savedMarineTrafficData.length !== 0) {
                leafletDataCopy.marineTrafficData = savedMarineTrafficData;
            }

            const mapTooltipConfigurationDataReceived = response.data.mapTooltipConfiguration;

            this.setState({
                leafletData: leafletDataCopy,
                mapToolTipConfiguration: mapTooltipConfigurationDataReceived
            }, this.initLeafletWindy);
        } else {
            this.initLeafletWindy();
        }
    };

    onFetchAllVesselsWindyMapDataFailure = (response) => {
        this.initLeafletWindy();
    };

    initLeafletWindy = () => {
        if (!window.windyInit) {
            return
        }

        window.windyInit(this.state.options, windyAPI => {
            const thisRef = this;
            const {store, map} = windyAPI;
            const {mapSettings} = thisRef.state;

            L.control.fullscreen({
                position: 'topleft',
                title: 'Show me the fullscreen !',
                titleCancel: 'Exit fullscreen mode',
                content: null,
                forceSeparateButton: true,
              }).addTo(map);
            // changes made by me
            store.set('overlay', 'wind');

            const portToPortPathColor = "#0D176F";
            const secaRegionPathColor = "#d8d9da";

            const LeafIconType1 = L.Icon.extend({
                options: {
                    iconSize: [15, 26],
                    iconAnchor: [6, 30]
                }
            });
            const LeafIconType2 = L.Icon.extend({
                options: {
                    iconSize: [5, 5]
                }
            });
            const LeafIconType3 = L.Icon.extend({
                options: {
                    iconSize: [8.5, 22],
                    iconAnchor: [5, 10],
                }
            });

            const greenPinMarker = new LeafIconType1({iconUrl: greenPinMarkerUrl});
            const redPinMarker = new LeafIconType1({iconUrl: redPinMarkerUrl});
            const greenDotIcon = new LeafIconType2({iconUrl: greenDotIconUrl});
            const redDotIcon = new LeafIconType2({iconUrl: redDotIconUrl});
            const vesselFrontViewIcon = new LeafIconType3({iconUrl: vesselIconUrl});

            let traveledPathPolyline;
            let currentPathPolyline;

            let vesselLatestPointMarker;

            let portToPortPathMarkersLayerGroup = L.layerGroup([]);
            let travelledPathMarkersLayerGroup = L.layerGroup([]);

            thisRef.renderPortToPortPath = function (vsId) {
                /*if (portToPortPathPolyline) {
                    portToPortPathPolyline.removeFrom(map);
                    portToPortPathMarkersLayerGroup.clearLayers();
                    portToPortPathMarkersLayerGroup.removeFrom(map);    // its optional, but removed safer side as below we have added on map
                }*/

                if (mapSettings.portToPortPath && Object.keys(thisRef.state.leafletData).length !== 0 && thisRef.state.leafletData.constructor === Object) {
                    const allVesselsPortToPortPath = thisRef.state.leafletData.marineTrafficData;
                    if (this.state.hover === true) {
                    for (let j = 0; j < allVesselsPortToPortPath.length; j++) {
                        if (vsId == allVesselsPortToPortPath[j].vesselId) {
                        if(this.state.vesselUncheckedArrForWindy.includes(allVesselsPortToPortPath[j].vesselId)){
                            continue;
                        }
                        let portToPortPathPolyline;
                        let portToPortPathLatLongArr = [];

                        let portToPortPath = allVesselsPortToPortPath[j].ROUTE;
                        portToPortPath = portToPortPath.replace("LINESTRING (", "");
                        portToPortPath = portToPortPath.replace(")", "");
                        portToPortPath = portToPortPath.split(",");

                        for (let i = 0; i < portToPortPath.length; i++) {
                            const dataPointInfo = portToPortPath[i].trim();
                            const latLongPoints = dataPointInfo.split(" ");
                            const lat = parseFloat(latLongPoints[1]);
                            const long = parseFloat(latLongPoints[0]);

                            portToPortPathLatLongArr.push([lat, long]);

                            if (i === 0) { // source port logic
                                let startPointMarker = L.marker([lat, long], {icon: greenPinMarker});
                                const startPointMarkerHtml = '<b>Source Port :</b> <br> Lat : ' + lat + '°, Long : ' + long + '° <br> ';
                                startPointMarker.bindTooltip(startPointMarkerHtml);
                                portToPortPathMarkersLayerGroup.addLayer(startPointMarker);
                            }
                            if (i === portToPortPath.length - 1) { // destination port logic
                                let endPointMarker = L.marker([lat, long], {icon: redPinMarker});
                                const endPointMarkerHtml = '<b>Destination Port :</b> <br> Lat : ' + lat + '°, Long : ' + long + '° <br> ';
                                endPointMarker.bindTooltip(endPointMarkerHtml);
                                portToPortPathMarkersLayerGroup.addLayer(endPointMarker);
                            }
                        }
                        portToPortPathPolyline = L.polyline(portToPortPathLatLongArr, {color: portToPortPathColor, weight: 1});
                        portToPortPathPolyline.addTo(map);

                        portToPortPathPolyline.on('mouseover', function (event) {
                            event.target.setStyle({
                                weight: 3
                            });
                        });
                        
                        portToPortPathPolyline.on('mouseout', function (event) {
                            event.target.setStyle({
                                weight: 0
                            });
                            portToPortPathMarkersLayerGroup.clearLayers(map);
                        });
debugger
                        portToPortPathMarkersLayerGroup.addTo(map);
                    }
                }
                }
                }
            };

            thisRef.renderVesselsLastLocation = function () {
                let traveledPathLatLongArr = [];

                if (traveledPathPolyline) {
                    traveledPathPolyline.removeFrom(map);
                    travelledPathMarkersLayerGroup.clearLayers();
                    travelledPathMarkersLayerGroup.removeFrom(map);    // its optional, but removed safer side as below we have added on map
                }
                if (mapSettings.traveledPath && Object.keys(thisRef.state.leafletData).length !== 0 && thisRef.state.leafletData.constructor === Object) {
                    const traveledPathPointsDataArr = thisRef.state.leafletData.stormGlassData;
                    for (let i = 0; i < traveledPathPointsDataArr.length; i++) {
                        if(this.state.vesselUncheckedArrForWindy.includes(traveledPathPointsDataArr[i].vesselId)){
                            continue;
                        }
                        const dataPointInfo = traveledPathPointsDataArr[i];

                        const dataPointInfoNmeaData = dataPointInfo.nmeaData;
                        let nmeaData;
                        let vesselCurrentLocationLatDirection = null;
                        let vesselCurrentLocationLongDirection = null;
                        if (dataPointInfoNmeaData && Object.keys(dataPointInfoNmeaData).length !== 0) {
                            nmeaData = dataPointInfoNmeaData;
                            vesselCurrentLocationLatDirection = nmeaData.latDirection;
                            vesselCurrentLocationLongDirection = nmeaData.longDirection;
                        }

                        if (!thisRef.isValidLat(dataPointInfo.lat) || !thisRef.isValidLong(dataPointInfo.long)) {
                            console.log("Invalid Lat : " + dataPointInfo.lat + " Long : " + dataPointInfo.long);
                            continue;
                        }

                        const vesselCurrentLocationLat = thisRef.getCorrectedDataPoint(dataPointInfo.lat, vesselCurrentLocationLatDirection);
                        const vesselCurrentLocationLong = thisRef.getCorrectedDataPoint(dataPointInfo.long, vesselCurrentLocationLongDirection);

                        traveledPathLatLongArr.push([[vesselCurrentLocationLat, vesselCurrentLocationLong]]);

                        vesselLatestPointMarker = L.marker([vesselCurrentLocationLat, vesselCurrentLocationLong], {icon: vesselFrontViewIcon});
                        const vesselLatestPointMarkerHtml = getTooltip(dataPointInfo);
                        vesselLatestPointMarker.bindTooltip(vesselLatestPointMarkerHtml, {keepInView: true});

                        const popup = L.popup({
                            closeButton: false,
                            autoClose: false,
                            closeOnClick: false
                        }).setLatLng([vesselCurrentLocationLat, vesselCurrentLocationLong]);
                        const vesselLatestPointPopupHtml = getPopup(dataPointInfo);
                        popup.setContent(vesselLatestPointPopupHtml);
                        popup.addTo(map);

                        vesselLatestPointMarker.on('click', onVesselCurrentLocationClick.bind(thisRef, dataPointInfo));
                        if (dataPointInfoNmeaData) {
                            let vesselHeading = 0;
                            if (nmeaData) {
                                vesselHeading = nmeaData.vesselHeading ? nmeaData.vesselHeading : 0;
                            }
                            vesselLatestPointMarker.setRotationAngle(vesselHeading);
                            vesselLatestPointMarker.setRotationOrigin("center center");
                        }
                        // vesselLatestPointMarker.on('mouseover', function (event) {
                        //     if (popup.isOpen()) {
                        //         popup.closePopup();
                        //         popup.removeFrom(map);
                        //     }
                        // });
                        // vesselLatestPointMarker.on('mouseout', function (event) {
                        //         popup.openPopup();
                        //         popup.addTo(map);

                        // });
                        vesselLatestPointMarker.on('mouseover', function (event) {
                            if (popup.isOpen()) {
                                popup.closePopup();
                                popup.removeFrom(map);
            
                            }
                            thisRef.toggleHover(thisRef.state.hover = true);
                        });
                        vesselLatestPointMarker.on('mouseout', function (event) {
            
                            if (popup.openPopup()) {
                                popup.addTo(map);
                            }
                            const vsId = dataPointInfo.vesselId
                            thisRef.toggleHover(thisRef.state.hover = true, vsId);
            
                        });

                        travelledPathMarkersLayerGroup.addLayer(vesselLatestPointMarker);
                    }
                    traveledPathPolyline = L.polyline(traveledPathLatLongArr, {color: 'transparent', weight: 0});
                    traveledPathPolyline.addTo(map);

                    travelledPathMarkersLayerGroup.addTo(map);
                }
            };

            thisRef.renderCurrentPath = function () {
                let currentPathLatLongArr = [];

                if (currentPathPolyline) {
                    currentPathPolyline.remove();
                }
                if (mapSettings.currentPath) {
                    const currentPath = thisRef.state.leafletData.currentPath;
                    for (let i = 0; i < currentPath.length; i++) {
                        const dataPointInfo = currentPath[i];

                        currentPathLatLongArr.push([dataPointInfo.lat, dataPointInfo.long]);

                        if (i !== currentPath.length - 1) {
                            let marker = L.marker([dataPointInfo.lat, dataPointInfo.long], {icon: greenDotIcon});
                            const html = 'Suggested <br> Lat Long : ' + + dataPointInfo.lat + ', ' + dataPointInfo.long + ' <br> \
	 						Wind Speed : ' + dataPointInfo.windSpeed + ' <br> \
							RPM : ' + dataPointInfo.rpm + ' ';
                            marker.bindTooltip(html);
                            marker.addTo(map);
                        }
                    }
                    currentPathPolyline = L.polyline(currentPathLatLongArr, {color: '#FFFF00', weight: 1});
                    currentPathPolyline.addTo(map);

                    L.polylineDecorator(currentPathPolyline, {
                        patterns: [
                            {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {fillOpacity: 1, weight: 0,color: '#FFFF00'}})}
                        ]
                    }).addTo(map);
                }
            };

            thisRef.renderSECARegion = function () {
                const secaRegionKeys = Object.keys(thisRef.state.SECARegionJson);

                if (secaRegionKeys.length > 0) {
                    secaRegionKeys.map(key => {
                        let secaRegionPathLatLongArr = [];

                        const secaRegionJsonData = thisRef.state.SECARegionJson;
                        const secaData = secaRegionJsonData[key];
                        let regionCoordinatesPath = secaData.path.split(",");

                        for (let i = 0; i < regionCoordinatesPath.length; i++) {
                            const dataPointInfo = regionCoordinatesPath[i].trim();
                            const latLongPoints = dataPointInfo.split(" ");
                            const lat = parseFloat(latLongPoints[1]);
                            const long = parseFloat(latLongPoints[0]);

                            secaRegionPathLatLongArr.push([lat, long]);
                        }

                        let secaRegionPathPolygone = L.polygon(secaRegionPathLatLongArr, {color: secaRegionPathColor, weight: 1});
                        const secaRegionTooltipHtml = secaData.caption + ' : SECA ZONE';
                        secaRegionPathPolygone.bindTooltip(secaRegionTooltipHtml);
                        secaRegionPathPolygone.addTo(map);
                    });
                }
            };

            thisRef.renderLeafletWindy = function() {
                if (mapSettings.normalMap) {
                    // Creating a Layer object
                    let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
                    // Adding layer to the map
                    map.addLayer(layer);
                }

                thisRef.renderSECARegion();
                thisRef.renderPortToPortPath();
                thisRef.renderVesselsLastLocation();
                thisRef.renderCurrentPath();
            };

            thisRef.renderLeafletWindy();

            map.on('zoomend', onMapZoom);

            // zoom the map to the polyline
            //map.fitBounds(traveledPathPolyline.getBounds());

            function getTooltip(currentLocationInfo) {
                let mapToolTipConfiguration = _.cloneDeep(thisRef.state.mapToolTipConfiguration);
                mapToolTipConfiguration = _.remove(mapToolTipConfiguration, function(c) {
                    return (c.visible == true);
                });
                mapToolTipConfiguration = _.sortBy(mapToolTipConfiguration, "priority");
                let currentWeatherData;
                if (currentLocationInfo.weatherData) {
                    currentWeatherData = currentLocationInfo.weatherData;
                }
                let extraNMEAData;
                if (currentLocationInfo.nmeaData) {
                    extraNMEAData = currentLocationInfo.nmeaData;
                }
                const shipData = _.find(thisRef.state.shipNameAndId,{id:currentLocationInfo.vesselId});
                const shipName = shipData.name;
                // let sourceLat = "";
                // let destinationLat = "";
                // let sourceLong = "";
                // let destinationLong = "";
                //  if (mapSettings.portToPortPath && Object.keys(thisRef.state.leafletData).length !== 0 && thisRef.state.leafletData.constructor === Object) {
                //      const allVesselsPortToPortPath = thisRef.state.leafletData.marineTrafficData;
                // debugger
                //      const currentVesselData = _.find(allVesselsPortToPortPath, {vesselId: currentLocationInfo.vesselId});
                // debugger
                // if (!currentVesselData) {
                //          return '';
                //      }
                //
                //     let portToPortPath = currentVesselData.ROUTE;
                //     portToPortPath = portToPortPath.replace("LINESTRING (", "");
                //     portToPortPath = portToPortPath.replace(")", "");
                //     portToPortPath = portToPortPath.split(",");
                //
                //     const sourceDataPointInfo = portToPortPath[0].trim();
                //     const sourceLatLongPoints = sourceDataPointInfo.split(" ");
                //     sourceLat = parseFloat(sourceLatLongPoints[1]).toFixed(2);
                //     sourceLong = parseFloat(sourceLatLongPoints[0]).toFixed(2);
                //
                //     const destinationDataPointInfo = portToPortPath[portToPortPath.length - 1].trim();
                //     const destinationLatLongPoints = destinationDataPointInfo.split(" ");
                //     destinationLat = parseFloat(destinationLatLongPoints[1]).toFixed(2);
                //     destinationLong = parseFloat(destinationLatLongPoints[0]).toFixed(2);
                // }

                if (!currentWeatherData && !extraNMEAData) {
                    let tooltipText = '<b>'+shipName+'</b> <br>'
                    for(let i=0;i<mapToolTipConfiguration.length;i++) {
                        if (mapToolTipConfiguration[i].identifier == "latlong") {
                            const cap = mapToolTipConfiguration[i].caption.split(',');
                            tooltipText = tooltipText + 'Source : <br>'+
                                'Destination : <br>'
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "speedOverGround") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "waveDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "waveHeight") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "swellDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "swellHeight") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "windSpeed") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "windDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "currentSpeed") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "currentDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            continue;
                        }
                    }
                    tooltipText = tooltipText + '<hr style="margin-left:-5px;margin-top: 1px;width:106%;margin-bottom: 2px;border-top: 1px solid lightgray"/>'+
                        'Timestamp : ';

                    return tooltipText;
                } else {
                    const speedOverGround = extraNMEAData ? extraNMEAData.sog ? extraNMEAData.sog : "" : "";
                    const waveDirection = currentWeatherData.waveDirection ? currentWeatherData.waveDirection.sg : "";
                    const waveHeight = currentWeatherData.waveHeight ? currentWeatherData.waveHeight.sg : "";
                    const swellDirection = currentWeatherData.swellDirection ? currentWeatherData.swellDirection.sg : "";
                    const swellHeight = currentWeatherData.swellHeight ? currentWeatherData.swellHeight.sg : "";
                    const windSpeed = currentWeatherData.windSpeed ? currentWeatherData.windSpeed.sg : "";
                    const windDirection = currentWeatherData.windDirection ? currentWeatherData.windDirection.sg : "";
                    const currentSpeed = currentWeatherData.currentSpeed ? currentWeatherData.currentSpeed.sg : "";
                    const currentDirection = currentWeatherData.currentDirection ? currentWeatherData.currentDirection.sg : "";
                    const time = currentLocationInfo.packetTs;
                    const latDirection = extraNMEAData ? extraNMEAData.latDirection ? extraNMEAData.latDirection : "" : "";
                    const longDirection = extraNMEAData ? extraNMEAData.longDirection ? extraNMEAData.longDirection : "" : "";

                    let tooltipText = '<b>'+shipName+'</b> <br>'
                    for(let i=0;i<mapToolTipConfiguration.length;i++) {
                        if (mapToolTipConfiguration[i].identifier == "latlong") {
                            const cap = mapToolTipConfiguration[i].caption.split(',');
                            tooltipText = tooltipText + cap[0] + ' : <b>' +currentLocationInfo.lat + '' +mapToolTipConfiguration[i].unit +' '+latDirection+'</b>, '+ cap[1] + ' : <b>' + currentLocationInfo.long + ''+mapToolTipConfiguration[i].unit+' '+longDirection+' </b><br>';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "speedOverGround") {
                            //tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ': <br> ';
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : ' +'<b>' +speedOverGround+''+mapToolTipConfiguration[i].unit+' </b><br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "waveDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : ' +'<b>' +waveDirection + ''+mapToolTipConfiguration[i].unit+' </b><br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "waveHeight") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : <b>' + waveHeight + ''+mapToolTipConfiguration[i].unit+'</b> <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "swellDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : <b>' + swellDirection + ''+mapToolTipConfiguration[i].unit+' </b><br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "swellHeight") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : <b>' + swellHeight + ''+mapToolTipConfiguration[i].unit+'</b> <br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "windSpeed") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : <b>' + windSpeed + ''+mapToolTipConfiguration[i].unit+' </b><br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "windDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : <b>' + windDirection + ''+mapToolTipConfiguration[i].unit+' </b><br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "currentSpeed") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : <b>' + currentSpeed + ''+mapToolTipConfiguration[i].unit+' </b><br> ';
                            continue;
                        }
                        if (mapToolTipConfiguration[i].identifier == "currentDirection") {
                            tooltipText = tooltipText + mapToolTipConfiguration[i].caption + ' : <b>' + currentDirection + ''+mapToolTipConfiguration[i].unit+'</b> <br> ';
                            continue;
                        }
                    }
                    tooltipText = tooltipText + '<hr style="margin-left:-5px;margin-top: 1px;width:106%;margin-bottom: 2px;border-top: 1px solid lightgray"/>'+
                         'Timestamp : <b>' + getDateInCommonStrFormat(time)+'</b>';

                    return tooltipText;
                }
            }

            function getPopup(currentLocationInfo) {

                const shipData = _.find(thisRef.state.shipNameAndId,{id:currentLocationInfo.vesselId});
                const sourcePort = thisRef.state.allShipSourceDestination[currentLocationInfo.vesselId].sourcePort;
                const voyageId = thisRef.state.allShipSourceDestination[currentLocationInfo.vesselId].voyageId;
                const destinationPort = thisRef.state.allShipSourceDestination[currentLocationInfo.vesselId].destinationPort;

                const shipName = shipData.name;
                let windSpeed = "";
                let sog = "";
                let time = "";
                let currentWeatherData;
                if (currentLocationInfo.weatherData) {
                    currentWeatherData = currentLocationInfo.weatherData;
                }
                let extraNMEAData;
                if (currentLocationInfo.nmeaData) {
                    extraNMEAData = currentLocationInfo.nmeaData;
                }
                if (!!currentWeatherData && !!extraNMEAData) {
                    windSpeed = currentWeatherData.windSpeed ? currentWeatherData.windSpeed.sg : "";
                    sog = extraNMEAData ? extraNMEAData.sog ? extraNMEAData.sog : "" : "";
                    time = currentLocationInfo.packetTs;
                }

                    return '' +
                        '<b > ' + shipName +' </b> <br>'


                        /*  

                         '<b > ' + shipName +' </b> <br>'('+voyageId+')'+'</b> <br>' +
                        ''+sourcePort+' - '+destinationPort+'<br> '+
                        'SOG : <b>'+sog+'kn'+'</b> , '+' Wind : <b>'+windSpeed+'kn'+'</b> <br>'+
                        'Timestamp :'+' <b>'+time+'
                         */
            }

            function onMapZoom() {
                if (!vesselLatestPointMarker) {
                    return;
                }

                var currentZoom = map.getZoom();
                let height = "110px";
                let width = "20px";
                let anchorHeight;
                let anchorWidth;

                switch (currentZoom) {
                    case 3:
                        height = 22;
                        width = 8.5;
                        anchorHeight = 10;
                        anchorWidth = 5;
                        break;
                    case 4:
                        height = 25;
                        width = 12;
                        anchorHeight = 12;
                        anchorWidth = 5;
                        break;
                    case 5:
                        height = 30;
                        width = 12.5;
                        anchorHeight = 14;
                        anchorWidth = 6;
                        break;
                    case 6:
                        height = 35;
                        width = 13;
                        anchorHeight = 17;
                        anchorWidth = 6;
                        break;
                    case 7:
                        height = 40;
                        width = 14;
                        anchorHeight = 19;
                        anchorWidth = 6;
                        break;
                    case 8:
                        height = 45;
                        width = 15;
                        anchorHeight = 21;
                        anchorWidth = 7;
                        break;
                    case 9:
                        height = 50;
                        width = 16;
                        anchorHeight = 26;
                        anchorWidth = 8;
                        break;
                    case 10:
                        height = 60;
                        width = 18;
                        anchorHeight = 30;
                        anchorWidth = 9;
                        break;
                    case 11:
                        height = 70;
                        width = 20;
                        anchorHeight = 35;
                        anchorWidth = 10;
                        break;
                    default:
                        break;
                }

                const LeafIconTemp = L.Icon.extend({
                    options: {
                        iconSize: [width, height],
                        iconAnchor: [anchorWidth, anchorHeight]
                    }
                });
                const shipFrontViewIcon = new LeafIconTemp({iconUrl: vesselIconUrl});
                vesselLatestPointMarker.setIcon(shipFrontViewIcon);
                // vesselLatestPointMarker.setRotationAngle(270);
            }
            
            function onVesselCurrentLocationClick(event) {
                this.props.history.push({pathname: "/DashboardHome"});
            }

        });
    };

    isValidLat = (dataPoint) => {
        const long = parseFloat(dataPoint);
        if (!isNaN(long)) {
            return isFinite(long) && Math.abs(long) <= 90;
        }
        return false;
    };

    isValidLong = (dataPoint) => {
        const long = parseFloat(dataPoint);
        if (!isNaN(long)) {
            return isFinite(long) && Math.abs(long) <= 180;
        }
        return false;
    };

    getCorrectedDataPoint = (dataPoint, dataPointDirection) => {
        if (dataPoint && dataPointDirection && (dataPointDirection.toLowerCase() === "s" || dataPointDirection.toLowerCase() === "w")) {
            return "-" + dataPoint;
        }
        return dataPoint;
    };
    
    onToggleDropDown = (isOpen, event, metadata) => {
        if (metadata.source !== "select") {
            this.setState(state => {
                this.state.mapSettings.showPopup = isOpen;
                return state;
            });
        }
    };

    onDropDownItemClick = (eventKey, event) => {
        if (!event) {
            eventKey.preventDefault();
            return;
        }

        switch (eventKey) {
            case "portToPortPath":
                this.setState(state => {
                    const prevState = this.state.mapSettings.portToPortPath;
                    this.state.mapSettings.portToPortPath = !prevState;
                    if (prevState) {
                        const prevState = this.state.mapSettings.allPath;
                        if (prevState) {
                            this.state.mapSettings.allPath = !prevState;
                        }
                    } else {
                        const othersState = this.state.mapSettings.traveledPath && this.state.mapSettings.currentPath;
                        const prevState = this.state.mapSettings.allPath;
                        if (othersState && !prevState) {
                            this.state.mapSettings.allPath = !prevState;
                        }
                    }

                    return state;
                }, this.renderPortToPortPath);
                break;

            case "traveledPath":
                this.setState(state => {
                    const prevState = this.state.mapSettings.traveledPath;
                    this.state.mapSettings.traveledPath = !prevState;
                    if (prevState) {
                        const prevState = this.state.mapSettings.allPath;
                        if (prevState) {
                            this.state.mapSettings.allPath = !prevState;
                        }
                    } else {
                        const othersState = this.state.mapSettings.portToPortPath && this.state.mapSettings.currentPath;
                        const prevState = this.state.mapSettings.allPath;
                        if (othersState && !prevState) {
                            this.state.mapSettings.allPath = !prevState;
                        }
                    }

                    return state;
                }, this.renderVesselsLastLocation);
                break;

            case "currentPath":
                this.setState(state => {
                    const prevState = this.state.mapSettings.currentPath;
                    this.state.mapSettings.currentPath = !prevState;
                    if (prevState) {
                        const prevState = this.state.mapSettings.allPath;
                        if (prevState) {
                            this.state.mapSettings.allPath = !prevState;
                        }
                    } else {
                        const othersState = this.state.mapSettings.portToPortPath && this.state.mapSettings.traveledPath;
                        const prevState = this.state.mapSettings.allPath;
                        if (othersState && !prevState) {
                            this.state.mapSettings.allPath = !prevState;
                        }
                    }

                    return state;
                }, this.renderCurrentPath);
                break;

            case "allPath":
                this.setState(state => {
                    const prevState = this.state.mapSettings.allPath;
                    this.state.mapSettings.allPath = !prevState;
                    this.state.mapSettings.portToPortPath = !prevState;
                    this.state.mapSettings.traveledPath = !prevState;
                    this.state.mapSettings.currentPath = !prevState;
                    return state;
                }, this.renderLeafletWindy);
                break;

            case "weatherMap":
                this.setState(state => {
                    const prevState = this.state.mapSettings.weatherMap;
                    this.state.mapSettings.weatherMap = !prevState;
                    this.state.mapSettings.normalMap = prevState;
                    return state;
                }, this.renderLeafletWindy);
                break;

            case "normalMap":
                this.setState(state => {
                    const prevState = this.state.mapSettings.normalMap;
                    this.state.mapSettings.normalMap = !prevState;
                    this.state.mapSettings.weatherMap = prevState;
                    return state;
                }, this.renderLeafletWindy);
                break;
        }
    };

    render() {
        const {mapSettings} = this.state;

        return (
            <div style={{height: "100%", width: "100%"}}>
                <div style={{height: "100%", width: "100%"}} id="windy"/>
                <Dropdown
                    id="windy-custom-toggle"
                    onToggle={this.onToggleDropDown}
                    drop={'up'}
                    show={mapSettings.showPopup}
                >
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-toggle"/>
                    <Dropdown.Menu className="dropdown-menu--menu windy-dropdown-menu">

                        <Dropdown.Item eventKey="portToPortPath" onSelect={this.onDropDownItemClick}>
                            <span className="windy-custom-popup-menu">
                                <input type="checkbox" className="windy-custom-popup-menu-checkbox"
                                       checked={mapSettings.portToPortPath}
                                       onChange={this.onDropDownItemClick}
                                />
                            </span>
                            <span>Port to Port Path</span>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="traveledPath" onSelect={this.onDropDownItemClick}>
                            <span className="windy-custom-popup-menu">
                                <input type="checkbox" className="windy-custom-popup-menu-checkbox"
                                       checked={mapSettings.traveledPath}
                                       onChange={this.onDropDownItemClick}
                                />
                            </span>
                            <span>Traveled Path</span>
                        </Dropdown.Item>
                        {/*<Dropdown.Item eventKey="currentPath" onSelect={this.onDropDownItemClick}>
                            <span className="windy-custom-popup-menu">
                                <input type="checkbox" className="windy-custom-popup-menu-checkbox"
                                       checked={mapSettings.currentPath}
                                       onChange={this.onDropDownItemClick}
                                />
                            </span>
                            <span>Current Path</span>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="allPath" onSelect={this.onDropDownItemClick}>
                            <span className="windy-custom-popup-menu">
                                <input type="checkbox" className="windy-custom-popup-menu-checkbox"
                                       checked={mapSettings.allPath}
                                       onChange={this.onDropDownItemClick}
                                />
                            </span>
                            <span>All Port to Port Path</span>
                        </Dropdown.Item>*/}

                        <Dropdown.Divider style={{borderColor: "#2c3235"}}/>

                        <Dropdown.Item eventKey="weatherMap" onSelect={this.onDropDownItemClick}>
                            <span className="windy-custom-popup-menu">
                                <input type="radio" name="mapView"
                                       className="windy-custom-popup-menu-checkbox"
                                       checked={mapSettings.weatherMap}
                                       onChange={this.onDropDownItemClick}
                                />
                            </span>
                            <span>Weather Map</span>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="normalMap" onSelect={this.onDropDownItemClick}>
                            <span className="windy-custom-popup-menu">
                                <input type="radio" name="mapView"
                                       className="windy-custom-popup-menu-checkbox"
                                       checked={mapSettings.normalMap}
                                       onChange={this.onDropDownItemClick}
                                />
                            </span>
                            <span>Normal Map</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }

}

export default withRouter(LeafletAllVessels);