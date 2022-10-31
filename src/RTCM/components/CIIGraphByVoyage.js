import React, { Component, Fragment, useState } from "react";
import { Button, Col, Form, OverlayTrigger, Popover } from "react-bootstrap";

import _ from "lodash";

import {
  checCO2alueStatus,
  getNewDate,
  getShipName,
  getVesselId,
} from "../common/helper";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import {
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  LineChart,
  periodAvgerenceArea,
  periodAvgerenceLine,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Surface,
  Symbols,
} from "recharts";

import { getItemFromLocalStorage } from "../common/helper";
import { getCIILast90DaysData } from "../../api";
import { AppContext } from "../context/GlobalContext";

const moment = require("moment-timezone");

const CustomTooltips = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const tooltipData = payload[0].payload;
    let date = tooltipData.disaplyDate;
    let AttainedCII90Days = tooltipData.ACII90D;
    let AttainedCIIAvg = tooltipData.attainedciiAvg;
    let RequiredCII = tooltipData.requiredCII;
    let CO2 = tooltipData.co2;
    let Distance = tooltipData.distance;

    return (
      <div
        className="rechart-custom-tooltip p-2"
        style={{
          borderRadius: "4px",
          backgroundColor: "#6697b2",
          color: "#000",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ marginLeft: "1px" }}>
          <div>
            Date <span className="font-weight-bold"> : {date} </span>{" "}
          </div>

          <div className="mt-2">
            Attained CII 90 Days
            <span className="tootlTipValue font-weight-bold">
              : {AttainedCII90Days}
            </span>
          </div>

          <div className="mt-2">
            Attained CII Period Avg
            <span className="tootlTipValue font-weight-bold">
              : {AttainedCIIAvg}
            </span>
          </div>

          <div className="mt-2">
            Required CII
            <span className="tootlTipValue font-weight-bold">
              : {RequiredCII}
            </span>
          </div>

          <div className="mt-2">
            CO2
            <span className="tootlTipValue font-weight-bold">: {CO2}</span>
          </div>

          <div className="mt-2">
            Distance
            <span className="tootlTipValue font-weight-bold">: {Distance}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

class CIIFleetPerformance extends Component {
  static contextType = AppContext;
  constructor(props) {
    const element = props.element;
    super(props);
    this.fetchCII90DaysData = this.getCIIData.bind(this);

    this.state = {
      ciiGraphData: [],
      allShips: [],
      selectedShipName: "CHINA EXPRESS",
      sName: "",
      element: element,
      activeFilterType: "All",
      selectedVesselId: getItemFromLocalStorage("ssAppVesselId"),
    };
  }
  componentDidMount() {
    // this.getCIIData();
  }

  getCIIData() {
    const { state } = this.context;
    let graphData = new Array();
    let response = this.props.element.widgetData.value;

    if (!response || !Array.isArray(response)) return;

    if (state.ciiType === "demand") {
      response = this.props.element.widgetData.value.filter(
        (voyage) => voyage.type === "demand"
      );
    } else if (state.ciiType === "supply") {
      response = this.props.element.widgetData.value.filter(
        (voyage) => voyage.type === "supply"
      );
    }

    if (state.voyageType === "L") {
      response = response.filter((voyage) => voyage.voyage.includes("L"));
    } else if (state.voyageType === "B") {
      response = response.filter((voyage) => voyage.voyage.includes("B"));
    }

    if (response) {
      const sumOfCIIVoyageWise = response
        .map((item) => item.attainedcii)
        .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);

      response.forEach((element) => {
        let obj = {
          disaplyDate: moment(element.reportdate).format(
            "dddd MMM DD YYYY h:mm"
          ),
          name: element.voyage,
          distance: element.distance,
          ACII90D: parseFloat(parseFloat(element.attainedcii).toFixed(2)),
          A: element.a,
          B: element.b,
          C: element.c,
          D: element.d,
          E: 6,
          // parseFloat(element.attainedcii) < 6
          //   ? 6
          //   : parseFloat(element.attainedcii),
          attainedciiAvg: parseFloat(
            parseFloat(sumOfCIIVoyageWise / response.length).toFixed(2)
          ),
          requiredCII: element.requiredcii,
          co2: element.co2,
          empty: 3,
        };
        graphData.push(obj);
      });
    }
    return graphData;
  }

  onFilterTypeChange(e) {}
  onShipChange(e) {}

  render() {
    // 3.76, 4.11, 4.64, 5.16, 6.00
    function formatYAxis(value) {
      if (value <= 3.76) return "A";
      else if (3.76 <= value && value <= 4.11) return "B";
      else if (4.11 <= value && value <= 4.64) return "C";
      else if (4.64 <= value && value <= 5.16) return "D";
      else if (value >= 5.16) return "E";
    }

    return (
      <>
        <div className="container-fluid text-light">
          <div className="row mt32">
            <div className=" col-md-12">
              <ComposedChart
                width={1150}
                height={260}
                data={this.getCIIData()}
                margin={{
                  top: 10,
                  right: 30,
                  left: 10,
                  bottom: 10,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis
                  tick={{ fill: "#fff" }}
                  style={{ color: " #fff" }}
                  yAxisId={0}
                  tickCount={5}
                  interval={0}
                  type="number"
                  ticks={[2, 3, 4, 5, 6]}
                  domain={[2, 6]}
                  orientation="left"
                >
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: 14,
                      fill: "#FFF",
                    }}
                    value="Attained CII 90 Days MT."
                    angle={-90}
                    position="outside"
                    fill="#fff"
                    offset={23} //offsetNum
                  />
                </YAxis>
                <YAxis
                  yAxisId={1}
                  type="number"
                  allowDecimals={true}
                  interval={0}
                  tick={{ fill: "#fff" }}
                  tickCount={5}
                  ticks={[3.76, 4.11, 4.64, 5.16, 6.0]}
                  domain={[2, 6]}
                  tickFormatter={formatYAxis}
                  orientation="right"
                >
                  <Label
                    style={{
                      textAnchor: "middle",
                      fontSize: 14,
                      fill: "#FFF",
                    }}
                    value="Rating"
                    angle={90}
                    position="outside"
                    fill="#fff"
                    offset={25} //offsetNum
                  />
                </YAxis>

                <Tooltip
                  viewBox={{ background: "#FFF" }}
                  contentStyle={{ background: "#FFF", border: "#FFF" }}
                  content={<CustomTooltips payload={this.getCIIData()} />}
                />

                <Area
                  dot={false}
                  type="monotone"
                  dataKey="E"
                  fillOpacity={1}
                  stroke="#A52A2A"
                  fill="#A52A2A"
                  name="E"
                />

                <Area
                  dot={false}
                  type="monotone"
                  dataKey="D"
                  fillOpacity={1}
                  stroke="#F0E68C"
                  fill="#F0E68C"
                  name="D"
                />

                <Area
                  dot={false}
                  type="monotone"
                  dataKey="C"
                  fillOpacity={1}
                  stroke="#FFD700"
                  fill="#FFD700"
                  name="C"
                />

                <Area
                  dot={false}
                  type="monotone"
                  dataKey="B"
                  fillOpacity={1}
                  stroke="#14DE3F"
                  fill="#14DE3F"
                  name="B"
                />

                <Area
                  dot={false}
                  type="monotone"
                  dataKey="A"
                  fillOpacity={1}
                  stroke="green"
                  fill="green"
                  baseLine={2}
                  name="A"
                />

                <Area
                  type="monotone"
                  dataKey="empty"
                  fillOpacity={1}
                  stroke="#212124"
                  fill="#212124"
                  legendType="none"
                />

                <Line
                  type="monotone"
                  name="Attained CII, 90 Days"
                  dataKey="ACII90D"
                  stroke="blue"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  name="Required CII"
                  dataKey="requiredCII"
                  strokeWidth={3}
                  stroke="#fff"
                  strokeDasharray="5 5"
                  dot={false}
                />

                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ position: "relative" }}
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.handleMouseLeave}
                  content={this.renderCusomizedLegend}
                />
                {/* <Legend verticalAlign="bottom" wrapperStyle={{ position: 'relative' }} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} /> */}
              </ComposedChart>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default CIIFleetPerformance;