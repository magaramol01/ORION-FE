import React, { Component, Fragment, useState } from "react";
import { Button, Col, Form, OverlayTrigger, Popover } from "react-bootstrap";
import _ from "lodash";
import { AppContext } from "../context/GlobalContext";

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
const CustomLegendSymbol = ({ color }) => {
  return (
    <svg
      className="recharts-surface"
      width={14}
      height={14}
      viewBox="0 0 32 32"
      version="1.1"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 4,
      }}
    >
      <path
        strokeWidth={4}
        fill="none"
        stroke={color}
        d="M0,16h10.666666666666666
      A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
      H32M21.333333333333332,16
      A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
        className="recharts-legend-icon"
      />
    </svg>
  );
};

const moment = require("moment-timezone");
const getCIIRating = (value) => {
  if (value <= 3.76) return "A";
  else if (3.76 <= value && value <= 4.11) return "B";
  else if (4.11 <= value && value <= 4.64) return "C";
  else if (4.64 <= value && value <= 5.16) return "D";
  else if (value >= 5.16) return "E";
};

const getCIIRatingForYAxis = (value) => {
  if (value >= 0 && value <= 3) return "A";
  else if (value <= 3.76) return "B";
  else if (3.76 <= value && value <= 4.11) return "C";
  else if (4.11 <= value && value <= 4.64) return "D";
  else if (4.64 <= value && value <= 5.16) return "E";
  // else if (value >= 5.16) return "E";
};
const CustomTooltips = ({ active, payload }) => {
  if (payload.length > 0) {
    const tooltipData = payload[0].payload;
    let date = tooltipData.disaplyDate;
    let AttainedCII90days = parseFloat(
      parseFloat(tooltipData.ACII90D).toFixed(2)
    );
    let AttainedCIIAvg = parseFloat(
      parseFloat(tooltipData.AttendCIIAvg).toFixed(2)
    );
    let RequiredCII = tooltipData.requiredCII;

    return (
      <div
        className="rechart-custom-tooltip"
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ marginLeft: "1px" }}>
          <div>
            Date
            <span className="font-weight-bold"> : {date} </span>{" "}
          </div>

          <div className="mt-2">
            Required CII{" "}
            <span className="tootlTipValue font-weight-bold">
              : {RequiredCII}
            </span>
          </div>

          <div className="mt-2">
            Attained CII Period Avg{" "}
            <span className="tootlTipValue font-weight-bold">
              : {AttainedCIIAvg}
            </span>
          </div>

          <div className="mt-2">
            Attained CII
            <span className="tootlTipValue font-weight-bold">
              : {AttainedCII90days}
            </span>
          </div>

          <div className="mt-2">
            CII Rating{" "}
            <span className="tootlTipValue font-weight-bold">
              : {getCIIRating(AttainedCII90days)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

class CIIGraphByDate extends Component {
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
      minAttainedCII: 3,
      maxAttainedCII: 6,
    };
  }
  componentDidMount() {
    //this.getCIIData();
  }

  componentDidUpdate = (prevProps) => {
    let response = this.props.element.widgetData.value;
    const attainedCIIs = response.map((value) => parseFloat(value.attainedcii));

    const maxAttainedCII = Math.max(...attainedCIIs);
    const minAttainedCII = Math.min(...attainedCIIs);

    // this.setState({
    //   maxAttainedCII: maxAttainedCII,
    //   minAttainedCII: minAttainedCII,
    // });
  };

  getCIIData() {
    const { state, dispatch } = this.context;
    let graphData = new Array();
    let response = this.props.element.widgetData.value;
    response = response.sort(function (a, b) {
      var c = new Date(a.reportdate);
      var d = new Date(b.reportdate);
      return c - d;
    });

    const attainedCIIs = response.map((value) => parseFloat(value.attainedcii));

    const maxAttainedCII = Math.max(...attainedCIIs);
    const minAttainedCII = Math.min(...attainedCIIs);

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

    if (response) {
      const sumOfCIIVoyageWise = response
        .map((item) => item.attainedcii)
        .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);

      response.forEach((element) => {
        let obj = {
          disaplyDate: moment(element.reportdate).format(
            "dddd MMM DD YYYY h:mm"
          ),
          name: moment(element.reportdate).format("DD MMM"),
          ACII90D: parseFloat(element.attainedcii).toFixed(2),
          empty: 3,
          A: parseFloat(element.a) < 3 ? minAttainedCII : parseFloat(element.a),
          B: parseFloat(element.b),
          C: parseFloat(element.c),
          D: parseFloat(element.d),
          E: maxAttainedCII > 6 ? maxAttainedCII : 6,
          AttendCIIAvg: parseFloat(
            sumOfCIIVoyageWise / response.length
          ).toFixed(2),
          requiredCII: parseFloat(element.requiredcii),
          co2: parseFloat(element.co2),
          distance: element.distance,
        };
        graphData.push(obj);
      });
    }
    return graphData;
  }

  onFilterTypeChange(e) {}
  onShipChange(e) {}

  renderColorfulLegendText = ({ payload }) => {
    const firstEntries = payload.slice(0, 5).reverse();
    const lastEntries = payload.filter((entry, index) => index >= 5);
    const finalEntries = firstEntries.concat(lastEntries);
    return (
      <div className="d-flex justify-content-center">
        {finalEntries.map((ele) => (
          <span className="mx-2">
            <CustomLegendSymbol color={ele.color} />
            {ele.value}
          </span>
        ))}
      </div>
    );
  };

  render() {
    return (
      <>
        <div className="container-fluid text-light">
          <div className="row mt32">
            <div className=" col-md-12">
              <ResponsiveContainer width="100%" height={200}>
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
                    tickCount={4}
                    interval={0}
                    type="number"
                    ticks={[3, 4, 5, 6]}
                    domain={[3, 6]}
                    orientation="left"
                  >
                    <Label
                      style={{
                        textAnchor: "middle",
                        fontSize: 14,
                        fill: "#FFF",
                      }}
                      value="Attained CII (daily)"
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
                    ticks={[3, 3.76, 4.11, 4.64, 5.16]}
                    domain={[3, 6]}
                    tickFormatter={getCIIRatingForYAxis}
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
                    viewBox={{ background: "#FFF" }} //212124
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
                    stroke="#DC572A"
                    fill="#DC572A"
                    name="D"
                  />

                  <Area
                    dot={false}
                    type="monotone"
                    dataKey="C"
                    fillOpacity={1}
                    stroke="#c2ad73"
                    fill="#c2ad73"
                    name="C"
                  />

                  <Area
                    dot={false}
                    type="monotone"
                    dataKey="B"
                    fillOpacity={1}
                    stroke="#14DE3F"
                    fill="#14DE3F"
                    // baseLine={3.76}
                    markerStart={3.76}
                    name="B"
                  />

                  <Area
                    dot={false}
                    type="monotone"
                    dataKey="A"
                    fillOpacity={1}
                    stroke="green"
                    fill="green"
                    name="A"
                  />

                  {/* <Area
                  dot={false}
                  type="monotone"
                  dataKey="empty"
                  fillOpacity={1}
                  stroke="#212124"
                  fill="#212124"
                  legendType="none"
                /> */}

                  <Line
                    type="monotone"
                    name="Attained CII (Daily)"
                    dataKey="ACII90D"
                    stroke="blue"
                    strokeWidth={2}
                  />

                  <Line
                    type="monotone"
                    name="Required CII"
                    dataKey="requiredCII"
                    stroke="#E96444"
                    strokeWidth={3}
                    dot={false}
                    strokeDasharray="5 2"
                  />

                  <Line
                    type="monotone"
                    name="Avg. CII"
                    dataKey="AttendCIIAvg"
                    stroke="#5D3FD3	"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 2"
                  />

                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ position: "relative" }}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    content={this.renderColorfulLegendText}
                  />
                  {/* <Legend verticalAlign="bottom" wrapperStyle={{ position: 'relative' }} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} /> */}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default CIIGraphByDate;
