import React, { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import vesselIcon from "../../common/icons/vessel.svg";
import courseArrow from "../../common/icons/course-line.svg";
import SECARegionJson from "../../json/SECAPoints";
import _ from "lodash";
import { externalAPIKeys, getWindyMapData } from "../../../api";
import SmartShipLoader from "../../../CBM/componant/common/SmartShipLoader";
import "./MapboxExample.css";
import { weatherLayers, mapTypes } from "./constants";
import { D3WindBarb, ConversionFactors } from "d3-wind-barbs";
import { Dropdown, OverlayTrigger, Tooltip, Card } from "react-bootstrap";
import { getVesselId } from "../../common/helper";
mapboxgl.accessToken =
  "pk.eyJ1Ijoia3VuYWxoaiIsImEiOiJjbDU2Y3R5d28wNHFsM2Nuc2YycXJxZWN6In0.NjjGBbikPrGhk5K50iSgtA";

const MapboxExample = (props) => {
  // * MAP CONTAINERS REF * //
  const mapContainer = useRef(null);
  const map = useRef(null);

  // * MAP STATES * //
  const [lng, setLng] = useState(120.7);
  const [lat, setLat] = useState(20.9);
  const [zoom, setZoom] = useState(3);
  const [vesselId, setVesselId] = useState(getVesselId());
  const [mouseCoordinates, setMouseCoordinates] = useState(null);
  const [marineTrafficData, setMarineTrafficData] = useState({});
  const [stormGlassData, setStormGlassData] = useState({});
  const [mapType, setMapType] = useState("weatherMap");
  const [currentWeatherLayer, setCurrentWeatherLayer] = useState({
    label: "Wind",
    value: "wind_new",
  });
  const [isLoading, setIsLoading] = useState(false);

  // * API CALL FUNCTIONS * //
  function onFetchWindyMapDataSuccess(response) {
    setIsLoading(false);
    setMarineTrafficData(response.data.marineTrafficData);
    setStormGlassData(response.data.stormGlassData);
  }

  function onFetchWindyMapDataFailure(response) {
    setIsLoading(false);
    alert(`error occured`);
  }

  const fetchWindyMapData = useCallback(
    function () {
      setIsLoading(true);
      getWindyMapData(onFetchWindyMapDataSuccess, onFetchWindyMapDataFailure, {
        vesselId,
      });
      setIsLoading(false);
    },
    [vesselId]
  );


  // * Render port to port path
  const renderPortToPortPath = useCallback((map, marineTrafficData) => {
    let portToPortRoute;
    let portToPortLngLatArray;
    if (marineTrafficData) {
      portToPortRoute = marineTrafficData.portToPortData?.ROUTE.split(",");
      portToPortLngLatArray = portToPortRoute?.map((element) => {
        const lngLatArrayElement = element.trim().split(" ");
        return lngLatArrayElement.map((element) => parseFloat(element));
      });
    } else {
      portToPortLngLatArray = [
        [0, 0],
        [0, 0],
      ];
    }

    // * Convert portToPortLngLatArray to revisedPortToPortCoordinates array, this does not cut the  polyline if it passes through 180 deg meridian
    let revisedPortToPortCoordinates = [];
    portToPortLngLatArray.forEach((coordinate, index) => {
      let lng = coordinate[0];
      let prevLng = index > 0 ? revisedPortToPortCoordinates[index - 1][0] : 0;
      lng += lng - prevLng > 180 ? -360 : prevLng - lng > 180 ? 360 : 0;
      const lat = coordinate[1];
      revisedPortToPortCoordinates.push([lng, lat]);
    });

    // * Add marker at start and end positions
    const sourcePoint = revisedPortToPortCoordinates[0];

    const destinationPoint =
      revisedPortToPortCoordinates[revisedPortToPortCoordinates.length - 1];

    addMarker(map, sourcePoint, {
      color: "#35C171",
      popupContent: `
            <h6 class="font-weight-bold text-dark mb-0">Source Port</h6>
            <p class="text-dark m-0">
              <strong>Lat: </strong>${sourcePoint[1]}        
              <strong>Long: </strong>${sourcePoint[0]}  
            </p>
        `,
    });

    addMarker(map, destinationPoint, {
      color: "#F44D56",
      popupContent: `
          <h6 class="text-dark font-weight-bold">Destination Port</h6>
          <p class="text-dark mb-0">
          <strong>Lat: </strong>${destinationPoint[1]}        
            <strong>Long: </strong>${destinationPoint[0]}  
          </p>
      `,
    });

    addPolyline(map, revisedPortToPortCoordinates, {
      sourceName: "portToPortRoute",
      color: "#000080",
    });

  }, []);

  function renderSECAregion() {
    const SECARegionKeys = Object.keys(SECARegionJson);
    if (SECARegionKeys.length > 0) {
      // 2D array of paths of all seca regions
      const AllSECARegions = SECARegionKeys.map((regionKey) => {
        const regionCoordinates = SECARegionJson[regionKey].path
          .split(", ")
          .map((element) => {
            const coordinate = element.split(" ");
            return [parseFloat(coordinate[0]), parseFloat(coordinate[1])];
          });
        return {
          regionName: `${SECARegionJson[regionKey].caption}: SECA ZONE`,
          regionCoordinates,
        };
      });

      map.current.on("load", () => {
        // Add source for each regions
        map.current.addSource("SECAregions", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: AllSECARegions.map((regionInfo) => {
              const geometry = {
                type: "LineString",
                coordinates: regionInfo.regionCoordinates,
              };
              const properties = {
                description: regionInfo.regionName,
              };
              return {
                type: "Feature",
                geometry,
                properties,
              };
            }),
          },
        });

        // * add layer for outline
        map.current.addLayer({
          id: "SECAregions-outline",
          type: "line",
          source: "SECAregions",
          paint: {
            "line-color": "#fff",
            "line-width": 2,
          },
        });

        // * add layer for fill
        map.current.addLayer({
          id: "SECAregions-fill",
          type: "fill",
          source: "SECAregions",
          paint: {
            "fill-color": "#d8d9da",
            "fill-opacity": 0,
          },
        });
      });
    }
  }

  const addWeatherLayer = (map) => {
    map.on("load", () => {
      map.addSource("weatherMapLayer", {
        type: "raster",
        tiles: [
          `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=531333440c82998c0e94faf626d89806`,
        ],
        tileSize: 512,
      });
      map.addLayer({
        id: "weatherMapLayer",
        type: "raster",
        source: "weatherMapLayer",
        layout: {
          visibility: "visible",
        },
        paint: {
          "raster-opacity": 1,
        },
        "source-layer": "weather-layer",
      });
    });
  };


  const updateWeatherLayer = (map, source, layer) => {
    const tileSource = map.getSource(source);
    tileSource.tiles = [
      `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=531333440c82998c0e94faf626d89806`,
    ];

    map.style._sourceCaches["other:" + source].clearTiles();

    map.style._sourceCaches["other:" + source].update(map.transform);

    map.triggerRepaint();
  };


  const toggleMap = (map, source, type) => {
    map.on("idle", () => {
      if (!map.getLayer(source)) return;
    });
    const visibility = map.getLayoutProperty(source, "visibility");
    if (type === "normalMap") {
      if (visibility === "visible") {
        map.setLayoutProperty(source, "visibility", "none");
      }
    } else if (type === "weatherMap") {
      if (visibility !== "visible") {
        map.setLayoutProperty(source, "visibility", "visible");
      }
    }
  };

  // * Not being used currently
  const windBarb = (windSpeed, windAngle) => {
    const svg = new D3WindBarb(
      windSpeed, // In knots. If your data is in other units you shuld pass de correct conversionFactor
      windAngle, // in degrees
      // All this configuration is optional. Change it  or comment it to check its effects
      {
        bar: {
          angle: 30,
          fullBarClassName: "",
          padding: 6,
          shortBarClassName: "",
          width: 2,
          stroke: "#2527ba",
        },
        circle: {
          fill: "#2527ba",
          radius: 4,
          strokeWidth: 0.5,
          className: "wind-barb-zero-knots-circle",
        },
        conversionFactor: ConversionFactors.None,
        rootBarClassName: "",
        size: {
          width: 40,
          height: 10,
        },
        svgId: "",
        triangle: {
          fill: "#2527ba",
          stroke: "#2527ba",
          padding: 6,
          className: "wind-barb-triangle",
        },
        baseCircle: {
          className: "wind-barb-base-circle",
          fill: "#2527ba",
          radius: 5,
          stroke: "#2527ba",
          strokeWidth: 1,
        },
      }
    );

    const svgImage = svg.draw();

    return svgImage;
  };

  const renderTravelledPath = useCallback((map, travelledPathData) => {
    if (!travelledPathData) return;
    let travelledPathArray;
    if (travelledPathData) {
      travelledPathArray = travelledPathData.map((coordinate) => {
        return [parseFloat(coordinate.long), parseFloat(coordinate.lat)];
      });
    } else {
      return (travelledPathArray = [[0, 0]]);
    }

    // * Convert travelledPathArray to revisedTravelledPathCoordinates array, this does not cut the  polyline if it passes through 180 deg meridian
    let revisedTravelledPathCoordinates = [];
    travelledPathArray.forEach((coordinate, index) => {
      let lng = coordinate[0];
      let prevLng =
        index > 0 ? revisedTravelledPathCoordinates[index - 1][0] : 0;
      lng += lng - prevLng > 180 ? -360 : prevLng - lng > 180 ? 360 : 0;
      const lat = coordinate[1];
      revisedTravelledPathCoordinates.push([lng, lat]);
    });

    map.on("load", () => {
      map.addSource("travelledRoute", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: travelledPathData.map((coordinateInfo) => {
            // console.log("coordinate info", coordinateInfo);
            const geometry = {
              type: "Point",
              coordinates: [
                parseFloat(coordinateInfo.long),
                parseFloat(coordinateInfo.lat),
              ],
            };
            const properties = {
              description: coordinateInfo,
            };
            return {
              type: "Feature",
              geometry,
              properties,
            };
          }),
        },
      });

      map.addLayer({
        id: "travelledRoute",
        type: "circle",
        source: "travelledRoute",
        paint: {
          "circle-color": "#D9105C",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      // ! Commented wind barb function
      // add wind barb on each red point
      // travelledPathData.map((coordinate) => {
      //   const windSpeed = coordinate?.weatherData?.windSpeed
      //     ? coordinate?.weatherData?.windSpeed.sg
      //     : 0;
      //   const windDirection = coordinate?.weatherData?.windDirection
      //     ? coordinate?.weatherData?.windDirection.sg
      //     : 0;
      //   return new mapboxgl.Marker({
      //     // element: windBarb(windSpeed, windDirection),
      //     element: windBarb(windSpeed, windDirection),
      //   })
      //     .setLngLat([parseFloat(coordinate.long), parseFloat(coordinate.lat)])
      //     .addTo(map);
      // });
    });

    const rotationAngle = travelledPathData
      ? travelledPathData[travelledPathData.length - 1].nmeaData.vesselHeading
      : 0;

    const vesselLngLat = revisedTravelledPathCoordinates[revisedTravelledPathCoordinates.length - 1];

    // * Vessel image
    const vesselImageContainer = document.createElement("div")
    const vesselImage = document.createElement("img");
    vesselImage.setAttribute("src", vesselIcon);
    vesselImage.setAttribute("id", "vesselIcon");
    vesselImage.style.width = "30px";
    vesselImageContainer.appendChild(vesselImage)

    // * Course line image
    const courseLine = document.createElement("img");
    courseLine.setAttribute('src', courseArrow)
    courseLine.setAttribute("id", "courseLine");
    vesselImageContainer.appendChild(courseLine)

    // * Add vessel Icon to map
    new mapboxgl.Marker({
      element: vesselImage,
      rotation: rotationAngle,
    })
      .setLngLat(vesselLngLat)
      .addTo(map);

    // * Add course line Icon on vessel
    new mapboxgl.Marker({
      element: courseLine,
      rotation: rotationAngle,

    })
      .setLngLat(vesselLngLat)
      .addTo(map);

    map.flyTo({
      center: vesselLngLat,
    });

    addPolyline(map, revisedTravelledPathCoordinates, {
      sourceName: "travelled path",
      color: "#A52A2A",
    });
  }, []);

  // * COMMON FUNCTION USED TO ADD POLYLINE OF ANY TYPE
  function addPolyline(map, coordinates, options) {
    map.on("load", () => {
      const polylineSource = map.getSource(options.sourceName);

      // If source is already present then only update the coordinates
      if (polylineSource) return;

      map.addSource(options.sourceName, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      });
      map.addLayer({
        id: options.sourceName,
        type: "line",
        source: options.sourceName,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": options.color,
          "line-width": 1,
        },
      });
    });
  }

  // ! MARKER
  // Options - color, popupContent
  function addMarker(map, lngLatArray, options) {
    return new mapboxgl.Marker({ color: options.color, scale: 0.5 })
      .setLngLat(lngLatArray)
      .setPopup(new mapboxgl.Popup().setHTML(options.popupContent))
      .addTo(map);
  }

  // ! Render port to port path
  useEffect(() => {
    if (!map.current) return;
    if (!marineTrafficData) return;
    renderPortToPortPath(map.current, marineTrafficData);
  }, [marineTrafficData, renderPortToPortPath]);

  // ! Render travelled path
  useEffect(() => {
    if (!map.current) return;
    if (!stormGlassData) return;
    renderTravelledPath(map.current, stormGlassData.data);
  }, [stormGlassData, renderTravelledPath]);

  // ! MAP INITIALIZATION
  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      renderWorldCopies: true,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // ZOOM AND NAVIGATION CONTROL
    map.current.addControl(new mapboxgl.NavigationControl());

    // ! Add layer
    addWeatherLayer(map.current);

    // SHOW COORDINATES OF CURSOR
    map.current.on("mousemove", (e) => {
      setMouseCoordinates({
        lng: e.lngLat.lng.toFixed(4),
        lat: e.lngLat.lat.toFixed(4),
      });
    });

    // REMOVE LAT LONG POPUP ON REMOVING MOUSE OUT OF THE MAP
    map.current.on("mouseout", (e) => {
      setMouseCoordinates(null);
    });

    const secaRegionPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // SHOW SECA REGION INFORMATION ON HOVER
    map.current.on("mouseover", "SECAregions-fill", (e) => {
      map.current.getCanvas().style.cursor = "pointer";
      const regionName = e.features[0].properties.description;
      const geometryType = e.features[0].geometry.type;

      let popupCoordinates;
      if (geometryType === "LineString") {
        popupCoordinates = e.features[0].geometry.coordinates[10];
      }
      if (geometryType === "MultiLineString") {
        popupCoordinates = e.features[0].geometry.coordinates[1][0];
      }

      secaRegionPopup
        .setLngLat(popupCoordinates)
        .setHTML(`<strong class="text-dark">${regionName}</strong>`)
        .addTo(map.current);
    });

    const shipInfoPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: "right",
    });

    //  ! SHOW SHIP INFORMATION POPUP
    map.current.on("mouseover", "travelledRoute", (e) => {
      map.current.getCanvas().style.cursor = "pointer";
      const popupCoordinates = e.features[0].geometry.coordinates;

      const toolTipInfo = JSON.parse(e.features[0].properties.description);

      const toolTipInfoObj = {
        latLng: [
          `${toolTipInfo?.lat} ${toolTipInfo.nmeaData.latDirection}`,
          `${toolTipInfo?.long} ${toolTipInfo.nmeaData.longDirection}`,
        ],
        speedOverGround: toolTipInfo?.nmeaData?.sog,
        waveDirection: toolTipInfo?.weatherData?.waveDirection,
        waveHeight: toolTipInfo?.weatherData?.waveHeight,
        swellDirection: toolTipInfo?.weatherData?.swellDirection,
        swellHeight: toolTipInfo?.weatherData?.swellHeight,
        windSpeed: toolTipInfo?.weatherData?.windSpeed,
        windDirection: toolTipInfo?.weatherData?.windDirection,
        currentSpeed: toolTipInfo?.weatherData?.currentSpeed,
        currentDirection: toolTipInfo?.weatherData?.currentDirection,
        timeStamp: toolTipInfo?.packetTs,
      };

      const popupHTML = `
      <div class="text-dark font-weight-bold" style="font-size:0.7rem; line-height:1.5;">
      <p class="m-0">
      <span class="font-weight-bolder">Lat : </span> ${toolTipInfoObj.latLng[0]
        }, 
      <span class="font-weight-bolder">Long : </span> ${toolTipInfoObj.latLng[1]
        }
      </p>
      <hr class="m-0"/>
        <p class="my-0"><span class="font-weight-bolder">Speed Over Ground</span> : ${toolTipInfoObj.speedOverGround ? toolTipInfoObj.speedOverGround : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Wave Direction</span> : ${toolTipInfoObj.waveDirection ? toolTipInfoObj.waveDirection?.sg : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Wave Height</span> : ${toolTipInfoObj.waveHeight ? toolTipInfoObj.waveHeight?.sg : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Swell Direction</span> : ${toolTipInfoObj.swellDirection ? toolTipInfoObj.swellDirection?.sg : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Swell Height</span> : ${toolTipInfoObj.swellHeight ? toolTipInfoObj.swellHeight?.sg : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Wind Speed</span> : ${toolTipInfoObj.windSpeed ? toolTipInfoObj.windSpeed?.sg : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Wind Direction</span> : ${toolTipInfoObj.windDirection ? toolTipInfoObj.windDirection?.sg : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Current Speed</span> : ${toolTipInfoObj.currentSpeed ? toolTipInfoObj.currentSpeed?.sg : "NA"
        }</p>
        <p class="my-0"><span class="font-weight-bolder">Current Direction</span> : ${toolTipInfoObj.currentDirection
          ? toolTipInfoObj.currentDirection?.sg
          : "NA"
        }</p>
        <hr class="my-0"/>
      <p class="my-0"> <span class="font-weight-bolder">TimeStamp : </span> ${toolTipInfoObj.timeStamp ? toolTipInfoObj.timeStamp : "NA"
        }</p>
      </div>
      `;

      shipInfoPopup
        .setLngLat(popupCoordinates)
        .setHTML(popupHTML)
        .addTo(map.current);
    });

    // ! REMOVE POPUP ON MOUSE REMOVE FOR SECA REGIONS
    map.current.on("mouseleave", "SECAregions-fill", (e) => {
      secaRegionPopup.remove();
      map.current.getCanvas().style.cursor = "";
    });

    // * REMOVE POPUP ON MOUSE REMOVE FOR VESSEL INFO
    map.current.on("mouseleave", "travelledRoute", (e) => {
      shipInfoPopup.remove();
      map.current.getCanvas().style.cursor = "";
    });

    return () => {
      map.current.off("mousemove");
      map.current.off("mouseleave");
      map.current.off("mouseout");
      map.current.off("mouseenter");
      map.current.off("mouseover");
      map.current.off("mouseleave", "SECAregions-fill");
    };
  });

  useEffect(() => {
    // * Handle scaling of vessel and course heading line according to map's zoom level
    map.current.on("zoom", (e) => {
      const zoomLevel = parseInt(e.target.getZoom());
      setZoom(zoomLevel);
      const vessel = document.getElementById("vesselIcon");
      const courseLine = document.getElementById("courseLine");
      if (!vessel) return;
      vessel.style.width = `${zoom > 3 && zoom * 13}px`;
      courseLine.style.width = `${zoom > 3 ? zoom * 8 : 0}px`;
    });

    return () => {
      map.current.off("zoom");
    };
  });

  // ! CALL API AND RENDER SECA REGIONS ON INITIAL RENDER
  useEffect(() => {
    fetchWindyMapData();
    renderSECAregion();
  }, [fetchWindyMapData]);


  // update ship red points
  useEffect(() => {
    if (!props.socketData) return;
    const newMarineTrafficData = props.socketData.marineTrafficData;
    const newStormGlassData = props.socketData.stormGlassData;
    setMarineTrafficData({ ...marineTrafficData, newMarineTrafficData });
    setStormGlassData({ ...stormGlassData, newStormGlassData });
  }, [props.socketData]);



  return (
    <div className="position-relative">
      <SmartShipLoader isVisible={isLoading} />
      <div
        id="map"
        style={{ height: 318, width: "100%" }}
        ref={mapContainer}
        className="map-container"
      >
        {/* WEATHER LAYERS DROPDOWN */}
        {mapType === "weatherMap" && (
          <Dropdown
            size="sm"
            className="position-absolute absolute-top ml-2"
            style={{ zIndex: 1, bottom: "8px" }}
          // as="button"
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="button-tooltip-2">Weather layers</Tooltip>}
            >
              <Dropdown.Toggle
                className="p-2"
                style={{
                  height: "25px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <i className="fas fa-layer-group"></i>
                <span className="ml-1">{currentWeatherLayer?.label}</span>
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="weather-dropdown">
              {weatherLayers.map((layer) => {
                return (
                  <Dropdown.Item
                    key={layer.value}
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => {
                      setCurrentWeatherLayer(layer);
                      updateWeatherLayer(
                        map.current,
                        "weatherMapLayer",
                        layer.value
                      );
                    }}
                    active={layer.value === currentWeatherLayer.value}
                  >
                    {layer.label}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        )}
        {/* map type dropdown */}
        <Dropdown
          size="sm"
          className="position-absolute  ml-2 mb-2 "
          style={{ zIndex: 1, bottom: 0, right: "8px" }}
        // as="button"
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="button-tooltip">Select Map</Tooltip>}
          >
            <Dropdown.Toggle
              style={{ width: "25px", height: "25px", borderRadius: "50%" }}
            >
              <i className="fas fa-ellipsis-v"></i>
            </Dropdown.Toggle>
          </OverlayTrigger>
          <Dropdown.Menu className="bg-light weather-dropdown">
            {mapTypes.map((type) => {
              return (
                <Dropdown.Item
                  key={type.value}
                  style={{ fontSize: "0.8rem" }}
                  active={type.value === mapType}
                  onClick={() => {
                    setMapType(type.value);
                    toggleMap(map.current, "weatherMapLayer", type.value);
                  }}
                >
                  {type.label}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>

        {/* <div id="noonReport" className="d-flex flex-column position-absolute absolute-top ml-2" >
          <div className="d-flex flex-row justify-content-between">
            <div className="px-2 d-flex flex-column justify-content-center align-items-center"><p className="m-0 paramHeading">Vsl.Name</p><p className="m-0 font-weight-bolder paramValue">{MRVLatestDatas.vessel}</p></div>
            <div className="px-2 d-flex flex-column justify-content-center align-items-center"><p className="m-0 paramHeading">Voy.No.</p><p className="m-0 font-weight-bolder paramValue">{MRVLatestDatas.voyage}</p></div>
            <div className="px-2 d-flex flex-column justify-content-center align-items-center"><p className="m-0 paramHeading" >Source Port</p><p className="m-0 font-weight-bolder paramValue" >{MRVLatestDatas.scr}</p></div>
            <div className="px-2 d-flex flex-column justify-content-center align-items-center"><p className="m-0 paramHeading" >Dest.Port</p><p className="m-0 font-weight-bolder paramValue" >{MRVLatestDatas.destination}</p></div>
            <div className="px-2 d-flex flex-column justify-content-center align-items-center"><p className="m-0 paramHeading" >ETA</p><p className="m-0 font-weight-bolder paramValue" >{MRVLatestDatas.ETA}</p></div>
            <div className="px-2 d-flex flex-column justify-content-center align-items-center"><p className="m-0 paramHeading">Total NM</p><p className="m-0 font-weight-bolder paramValue">{MRVLatestDatas.totDist} NM</p></div>
            <div className="px-2 d-flex flex-column justify-content-center align-items-center"><p className="m-0 paramHeading " >Vsl.TZone</p><p className="m-0 font-weight-bolder paramValue">{MRVLatestDatas.timezone}</p></div>
          </div>


        </div> */}
        {mouseCoordinates && (
          <div
            className=" lngLatCoordinates position-absolute absolute-top border-0 m-auto"
            style={{
              zIndex: 1,
              right: "2.5rem",
              bottom: "4px",
              // width: "12rem",
              opacity: 0.8,
              color: "#000",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >


            <span
              style={{
                textShadow:
                  "3px 3px 3px #ffffff, -3px -3px 3px #ffffff, -3px 3px 3px #ffffff, 3px -3px 3px #ffffff",
              }}
            >
              Long: {mouseCoordinates.lng}
            </span>  <br />{" "}
            <span
              style={{
                textShadow:
                  "3px 3px 3px #ffffff, -3px -3px 3px #ffffff, -3px 3px 3px #ffffff, 3px -3px 3px #ffffff",
              }}
            >
              Lat: {mouseCoordinates.lat}{" "}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxExample;
