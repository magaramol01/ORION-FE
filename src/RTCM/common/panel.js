import {WIDGET_TYPES} from "./enums";
import CanvasGauge from "../components/canvasGauge";
import React from "react";
import CIIFilter from '../components/CIIFilter';
import MapboxExample from "../screens/MapboxExample";
import SingleCylinderWidgetXpress from "../components/SingleCylinderWidgetXpress";
import DigitalAlarmTable from "../components/DigitalAlarmTable";
import NanjingCylinderWidget from "../components/NanjingCylinderWidget";
import BataviaCylinderWidget from "../components/BataviaCylinderWidget";
import AsiaCylinderWidget from "../components/AsiaCylinderWidget";
import SingleCylinderWidget from "../components/singleCylinderWidget";
import SparIndusCylinderWidget from "../components/SparIndusCylinderWidget";
import SingleGaugeCylinderWidget from "../components/singleGaugeCylinderWidger";
import MainEngineTable from "../components/mainEngineTable";
import SystemTable from "../components/systemTable";
import CustomText from "../components/CustomText";
import GaugeEngineAlert from "../components/gaugeEngineAlert";
import AlarmAlertBox from "../components/alarmAlertBox";
import LeafletExample from "../screens/LeafletExample";
import CustomCarousel from "../components/customCarousel";
import VesselInformationAccordion from "../components/vesselInformationAccordion";
import VesselProgressBar from "../components/vesselProgressBar";
import CustomGauge from "../components/customGauge";
import CustomGaugeWithSparkBarAndLabel from "../components/customGaugeWithSparkBarAndLabel";
import DashboardHome3Carousel from "../components/dashboardHome3Carousel";
import MainEngineAccordion from "../components/mainEngineAccordion";
import CustomBarGauge from "../components/customBarGauge";
import CustomBarGaugeList from "../components/customBarGaugeList";
import DashboardHomeInformationCarousel from "../components/dashboardHomeInformationCarousel";
import GaugesStripe from "../components/gaugesStripe";
import MRVInformationPanel1 from "../components/mrvInformationPanel1";
import CustomBarChart from "../components/customBarChart";
import MRVFilter from "../components/MRVFilter";
import LeafletAllVessels from "../components/LeafletAllVessels";
import FleetDashboardAllVesselsFilter from "../components/fleetDashboardAllVesselsFilter";
import FleetDashboardParametersFilter from "../components/fleetDashboardParametersFilter";
import FleetDashboardAllVesselsInfoPanel from "../components/fleetDashboardAllVesselsInfoPanel";
import Compass from "../components/Compass";
import NoonReportData from "../../RTCM/components/NoonReportData";
import LeafletExampleForCompass from "../screens/LeafletExampleForCompass";
import MultLineChart from "../components/multiLineChart";

const panel = {

    getPanelLayout: function (element, elementWidgetData, panelId) {
        const widgetType = elementWidgetData.type;
        const widgetDefaults = elementWidgetData.defaults;
        let height = widgetDefaults.h;
        let width = widgetDefaults.w;

        switch (widgetType) {

        }

        return {
            i: panelId,
            x: element.x * 100,
            y: Infinity, // puts it at the bottom
            // h: element.h,
            // w: element.w
            h: height,
            w: width * 100,
            minW: 0,
            minH: 0,
            static: false,
            isDraggable: true,
            isResizable: false
        }
    },

    getPanelBody: function (element, otherData, dashboardRef,dashboardtStateForCompass, windData, MRVLatestData, ciiLast90DaysData) {
        const widgetType = element.type;
        let panelBody;

        switch (widgetType) {
            case WIDGET_TYPES.ADVISORY:
                panelBody = (
                    <AlarmAlertBox element={element} socketData={otherData}/>
                );
                break;

            case WIDGET_TYPES.ALARM:
                panelBody = (
                    <AlarmAlertBox element={element} socketData={otherData}/>
                );
                break;

            case WIDGET_TYPES.ALERT:
                panelBody = (
                    <AlarmAlertBox element={element} socketData={otherData}/>
                );
                break;

            case WIDGET_TYPES.CAROUSEL:
                panelBody = (
                    <CustomCarousel element={element}/>
                );
                break;

            case WIDGET_TYPES.GAUGE:
                panelBody = (
                    <div style={{textAlign: "center", padding: "8px"}}>
                        <CanvasGauge element={element}/>
                    </div>
                );
                break;

            case WIDGET_TYPES.GAUGE_ALERT:
                panelBody = (
                    <GaugeEngineAlert element={element}/>
                );
                break;

            case WIDGET_TYPES.GAUGE_CYLINDER:
                panelBody = (
                    <SingleGaugeCylinderWidget element={element}/>
                );
                break;

            case WIDGET_TYPES.FLEET_DASH_PARAMETERS_FILTER:
                panelBody = (
                    <FleetDashboardParametersFilter element={element} socketData={otherData} dashboardRef={dashboardRef}/>
                );
                break;
               

                case WIDGET_TYPES.FLEET_DASH_ALL_VESSELS_FILTER:
                panelBody = (
                    <FleetDashboardAllVesselsFilter element={element} socketData={otherData} dashboardRef={dashboardRef}/>
                );
                break;

            case WIDGET_TYPES.ALL_VESSEL_LEAFLET_MAP:
                panelBody = (
                    <LeafletAllVessels element={element} socketData={otherData} dashboardRef={dashboardRef}/>
                );
                break;

            case WIDGET_TYPES.ALL_VESSEL_PARAMETERS_INFO_PANEL:
                panelBody = (
                    <FleetDashboardAllVesselsInfoPanel element={element} socketData={otherData} dashboardRef={dashboardRef}/>
                );
                break;

            case WIDGET_TYPES.NANJING_ME_TABLE:
                panelBody = (
                    <NanjingCylinderWidget element={element}/>
                );
                break;

             case WIDGET_TYPES.BATAVIA_MAIN_ENGINE_CYLINDER:
                    panelBody = (
                        <BataviaCylinderWidget  element={element}/>
                    );
                    break;
           case WIDGET_TYPES.BATAVIA_MAIN_ENGINE_ACCORDION:
                        panelBody = (
                            <MainEngineAccordion element={element}/>
                        );
                        break;
            case WIDGET_TYPES.BATAVIA_ME_TABLE:
                        panelBody = (
                            <BataviaCylinderWidget element={element}/>
                        );
                        break;

            case WIDGET_TYPES.NANJING_MAIN_ENGINE_ACCORDION:
                    panelBody = (
                        <MainEngineAccordion element={element} />
                    );
                    break;
            case WIDGET_TYPES.ASIA_ME_TABLE:
                panelBody = (
                    <AsiaCylinderWidget element={element}/>
                );
                break;

            case WIDGET_TYPES.LEAFLET_MAP:
                panelBody = (
                   <LeafletExample element={element} socketData={otherData} MRVLatestData={MRVLatestData}/>
                //    <MapboxExample element={element} socketData={otherData}/>
                );
                break;

            case WIDGET_TYPES.XPRESS_MAIN_ENGINE_CYLINDER:
                panelBody = (
                    <SingleCylinderWidgetXpress element={element}/>
                );
                break;
            case WIDGET_TYPES.ASIA_MAIN_ENGINE_CYLINDER:
                panelBody = (
                    <AsiaCylinderWidget element={element}/>
                );
                break;

            case WIDGET_TYPES.Digital_Alarm_Table:
                panelBody = (
                    <DigitalAlarmTable element={element}/>
                );
                break;

            case WIDGET_TYPES.MAIN_ENGINE_CYLINDER:
                panelBody = (
                    <SingleCylinderWidget element={element}/>
                );
                break;

            case WIDGET_TYPES.SPARINDUS_ME_TABLE:
                panelBody = (
                    <SparIndusCylinderWidget element={element}/>
                );
                break;

            case WIDGET_TYPES.MAIN_ENGINE_TABLE:
                panelBody = (
                    <MainEngineTable element={element}/>
                );
                break;

            case WIDGET_TYPES.SYSTEM_TABLE:
                panelBody = (
                    <SystemTable element={element}/>
                );
                break;

            case WIDGET_TYPES.TEXT_CARD:
                panelBody = (
                    <CustomText element={element}/>
                );
                break;

            case WIDGET_TYPES.VESSEL_INFORMATION_ACCORDION:
                panelBody = (
                    <VesselInformationAccordion element={element}/>
                );
                break;

            case WIDGET_TYPES.VESSEL_PROGRESS_BAR:
                panelBody = (
                    <VesselProgressBar element={element}/>
                );
                break;
                case WIDGET_TYPES.NON_REPORT_DATA_DASHBOARD:
                    panelBody = (
                        <NoonReportData element={element} socketData={otherData} />
                    );
                    break;

            case WIDGET_TYPES.CUSTOM_GAUGE:
                panelBody = (
                    <CustomGauge element={element}/>
                );
                break;

            case WIDGET_TYPES.CUSTOM_GAUGE_WITH_SPARK_BAR_AND_LABEL:
                panelBody = (
                    <CustomGaugeWithSparkBarAndLabel element={element}/>
                );
                break;

            case WIDGET_TYPES.DASH_HOME_3_CAROUSEL:
                panelBody = (
                    <DashboardHome3Carousel element={element} />
                );
                break;

            case WIDGET_TYPES.DASH_HOME_INFORMATION_CAROUSEL:
                panelBody = (
                    <DashboardHomeInformationCarousel  element={element} socketData={otherData} windData={windData} CIIData={ciiLast90DaysData} />
                );
                break;

            case WIDGET_TYPES.MAIN_ENGINE_ACCORDION:
                panelBody = (
                    <MainEngineAccordion element={element}/>
                );
                break;

            case WIDGET_TYPES.XPRESS_MAIN_ENGINE_ACCORDION:
                panelBody = (
                    <MainEngineAccordion element={element}/>
                );
                break;
            case WIDGET_TYPES.ASIA_MAIN_ENGINE_ACCORDION:
                panelBody = (
                    <MainEngineAccordion element={element}/>
                );
                break;

            case WIDGET_TYPES.SPARINDUS_ME_ACCORDION:
                panelBody = (
                    <MainEngineAccordion element={element}/>
                );
                break;

            case WIDGET_TYPES.CUSTOM_BAR_GAUGE:
                panelBody = (
                    <CustomBarGauge element={element}/>
                );
                break;

            case WIDGET_TYPES.CUSTOM_BAR_GAUGE_LIST:
                panelBody = (
                    <CustomBarGaugeList element={element}/>
                );
                break;

            case WIDGET_TYPES.OBSERVANT:
                panelBody = (
                    <AlarmAlertBox element={element} socketData={otherData}/>
                );
                break;

            case WIDGET_TYPES.MRV_INFORMATIONAL_PANEL1:
                panelBody = (
                    <MRVInformationPanel1 element={element} />
                );
                break;

            case WIDGET_TYPES.BAR_CHART:
                panelBody = (
                    <CustomBarChart element={element}/>
                );
                break;

            case WIDGET_TYPES.MRV_FILTER_PANEL:
                panelBody = (
                    <MRVFilter element={element} dashboardRef={dashboardRef}/>
                );
                break;
                case WIDGET_TYPES.CII_FILTER_PANEL:
                    panelBody = (
                        <CIIFilter element={element} dashboardRef={dashboardRef} />
                    );
                    break;    

            case WIDGET_TYPES.GAUGES_HOME_GAUGES_STRIPE:
                panelBody = (
                    <GaugesStripe element={element} socketData={otherData}/>
                );
                break;
                case WIDGET_TYPES.FULL_SCREEN_COMPASS:
                    panelBody = (
                        <Compass element={element} otherData={otherData}
                            dashboardtStateForCompass={dashboardtStateForCompass} socketData={otherData} windData={windData} />
                    );
                    break;
                case WIDGET_TYPES.COMPASS_SCREEN_WIND_MAP:
                    panelBody = (
                        <LeafletExampleForCompass element={element} socketData={otherData} MRVLatestData={MRVLatestData}/>
                    );
                    break;
                /*  Task No-SSH-18
                    Dev Name:Yogesh Chavan
                    Desc:-Multiline graph component*/
                case WIDGET_TYPES.MULTI_LINE_GRAPH:
                    panelBody = (
                        <MultLineChart element={element} socketData={otherData} dashboardtStateForCompass={dashboardtStateForCompass} windData={windData} />
                    );
                    break;
                /* _____________________End_________________________*/
        }

        return panelBody;
    },

    getPanelConfiguration: function (widgetDetails) {
        const widgetType = widgetDetails.type;

        let headerText = "";
        let configuration = {};
        let panelConfiguration = {
            header: {
                text: headerText,
                configuration: {
                    isShow: true,
                    fontSize: 14,
                    fontFamily: "Roboto, Helvetica Neue, Arial, sans-serif !important",
                    color: "#d8d9da",
                    backgroundColor: "#161719"
                }
            },
            body: {
                text: "",
                configuration: configuration
            },
            panel: {
                isTransparent: false
            }
        };

        switch (widgetType) {
            case WIDGET_TYPES.ADVISORY:
                panelConfiguration.header.text = "Advisories";
                break;

            case WIDGET_TYPES.ALARM:
                panelConfiguration.header.text = "Alerts";
                break;

            case WIDGET_TYPES.ALERT:
                panelConfiguration.header.text = "Alerts";
                break;

            case WIDGET_TYPES.CAROUSEL:
                panelConfiguration.header.text = null;
                break;

            case WIDGET_TYPES.GAUGE:
                panelConfiguration.header.text = "Unit N";
                const gaugeData = {
                    renderTo: "unit_n_gauge",
                    value: 5,
                    startAngle: 90,
                    ticksAngle: 180,
                    width: 140,
                    height: 130,
                    units: "bar",
                    valueBox: true,
                    minValue: 0,
                    maxValue: 18,
                    majorTicks: [0, 3, 6, 9, 12, 15, 18],
                    minorTicks: 2,
                    strokeTicks: true,
                    highlights: [],
                    colorMajorTicks: "#ddd",
                    colorMinorTicks: "#ddd",
                    colorTitle: "#eee",
                    colorUnits: "#ccc",
                    colorNumbers: "#eee",
                    colorPlate: "#222",
                    borderShadowWidth: 0,
                    borders: false,
                    needleType: "arrow",
                    needleWidth: 5,
                    needleCircleSize: 7,
                    needleCircleOuter: true,
                    needleCircleInner: false,
                    animationDuration: 1500,
                    animationRule: "linear",
                    colorValueBoxBackground: "#000",
                    colorValueText: "#fff",
                    fontValue: 50,
                    fontNumbersSize: 25,
                    fontUnitsSize: 40,
                    fontValueSize: 50,
                    colorBarProgress: "#ff9800",
                    colorBar: "#000",
                    barWidth: 8
                };
                panelConfiguration.body["gaugeData"] = gaugeData;
                break;

            case WIDGET_TYPES.GAUGE_ALERT:
                panelConfiguration.header.text = "Gauge Alert";
                break;

            case WIDGET_TYPES.GAUGE_CYLINDER:
                panelConfiguration.header.text = null;
                break;

            case WIDGET_TYPES.FLEET_DASH_PARAMETERS_FILTER:
                panelConfiguration.header.text = "Parameters Filter";
                break;

            case WIDGET_TYPES.FLEET_DASH_ALL_VESSELS_FILTER:
                panelConfiguration.header.text = "All Vessels Filter";
                break;

            case WIDGET_TYPES.ALL_VESSEL_LEAFLET_MAP:
                panelConfiguration.header.text = "All Vessels Route Forecast";
                break;

            case WIDGET_TYPES.ALL_VESSEL_PARAMETERS_INFO_PANEL:
                panelConfiguration.header.text = "All Vessels Parameters Info Panel";
                break;

            case WIDGET_TYPES.NANJING_ME_TABLE:
                panelConfiguration.header.text = "Nanjing Main Engine";
                break;
               
            case WIDGET_TYPES.ASIA_ME_TABLE:
                panelConfiguration.header.text = "Asia Main Engine";
                break;

                case WIDGET_TYPES.BATAVIA_MAIN_ENGINE_CYLINDER:
                    panelConfiguration.header.text = "Main Engine";
                    break;
                case WIDGET_TYPES.BATAVIA_ME_TABLE:
                        panelConfiguration.header.text = "Batavia Main Engine";
                      break;
              case WIDGET_TYPES.BATAVIA_MAIN_ENGINE_ACCORDION:
                        panelConfiguration.header.text = "Main Engine Accordion";
                        break;   

            case WIDGET_TYPES.LEAFLET_MAP:
                panelConfiguration.header.text = "Vessel Route Forecast";
                break;

            case WIDGET_TYPES.MAIN_ENGINE_CYLINDER:
                panelConfiguration.header.text = "Main Engine";
                break;

            case WIDGET_TYPES.XPRESS_MAIN_ENGINE_CYLINDER:
                panelConfiguration.header.text = "Main Engine";
                break;
            case WIDGET_TYPES.ASIA_MAIN_ENGINE_CYLINDER:
                panelConfiguration.header.text = "Main Engine";
                break;

            case WIDGET_TYPES.Digital_Alarm_Table:
                panelConfiguration.header.text = "Digital Alarm Table";
                break;

            case WIDGET_TYPES.SPARINDUS_ME_TABLE:
                panelConfiguration.header.text = "Spar Indus Main Engine";
                break;

            case WIDGET_TYPES.MAIN_ENGINE_TABLE:
                panelConfiguration.header.text = "Main Engine Table";
                break;

            case WIDGET_TYPES.SYSTEM_TABLE:
                panelConfiguration.header.text = "System Table";
                break;

            case WIDGET_TYPES.TEXT_CARD:
                panelConfiguration.header.text = null;
                break;

            case WIDGET_TYPES.VESSEL_INFORMATION_ACCORDION:
                panelConfiguration.header.text = "Vessel Configuration";
                break;

            case WIDGET_TYPES.VESSEL_PROGRESS_BAR:
                panelConfiguration.header.text = "Vessel Progress Bar";
                break;

            case WIDGET_TYPES.CUSTOM_GAUGE:
                panelConfiguration.header.text = "Custom Gauge";
                break;

            case WIDGET_TYPES.CUSTOM_GAUGE_WITH_SPARK_BAR_AND_LABEL:
                panelConfiguration.header.text = "Custom Gauge With Spark Bar and Label";
                break;

            case WIDGET_TYPES.DASH_HOME_3_CAROUSEL:
                panelConfiguration.header.text = "Dashboard Home 3 Carousel";
                break;

            case WIDGET_TYPES.DASH_HOME_INFORMATION_CAROUSEL:
                panelConfiguration.header.text = "Dashboard Home Information Carousel";
                break;

            case WIDGET_TYPES.MAIN_ENGINE_ACCORDION:
                panelConfiguration.header.text = "Main Engine Accordion";
                break;

            case WIDGET_TYPES.XPRESS_MAIN_ENGINE_ACCORDION:
                panelConfiguration.header.text = "Main Engine Accordion";
                break;

            case WIDGET_TYPES.SPARINDUS_ME_ACCORDION:
                panelConfiguration.header.text = "Spar Indus ME Accordion";
                break;
            case WIDGET_TYPES.ASIA_MAIN_ENGINE_ACCORDION:
                panelConfiguration.header.text = "ASIA ME Accordion";
                break;

            case WIDGET_TYPES.CUSTOM_BAR_GAUGE:
                panelConfiguration.header.text = "Custom Bar Gauge";
                break;

            case WIDGET_TYPES.CUSTOM_BAR_GAUGE_LIST:
                panelConfiguration.header.text = "Custom Bar Gauge List";
                break;

            case WIDGET_TYPES.OBSERVANT:
                panelConfiguration.header.text = "Observant";
                break;

            case WIDGET_TYPES.MRV_INFORMATIONAL_PANEL1:
                panelConfiguration.header.text = "MRV Information Panel 1";
                break;

            case WIDGET_TYPES.BAR_CHART:
                panelConfiguration.header.text = "Bar Chart";
                break;

            case WIDGET_TYPES.MRV_FILTER_PANEL:
                panelConfiguration.header.text = "MRV Filter";
                break;

            case WIDGET_TYPES.GAUGES_HOME_GAUGES_STRIPE:
                panelConfiguration.header.text = "Gauges Home Gauges Stripe";
                break;
        }

        return panelConfiguration;
    },

    getPanelHeaderClass: function (element) {
        // change implementation such that user can customize header
        // this function should return css styles
        // for a time being created class in css file and returning it
        // but later change it
        const elementHeader = element.configuration.header;
        const elementHeaderConfiguration = elementHeader.configuration;
        const alignment = elementHeaderConfiguration.alignment;

        let headerClass = "";

        if (alignment === "left") {
            headerClass = "leftAlign";
        } else if (alignment === "center") {
            headerClass = "centerAlign";
        } else if (alignment === "right") {
            headerClass = "rightAlign";
        }

        return headerClass;
    }

};

export default panel;
