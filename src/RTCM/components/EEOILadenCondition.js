//
import React, { Component, Fragment, useState } from "react";
import _ from "lodash";
import {
  establishSocketConnection,
  getFleetDashboardParametersFilterData,
  getRechartData,
} from "../../api";
import { addMinutes, format, getMinutes, subDays, subMinutes } from "date-fns";
import {
  checkValueStatus,
  getNewDate,
  getShipName,
  getVesselId,
} from "../common/helper";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { components } from "react-select";

const fontSize = 12;
const dateFormatter = (date, isFull) => {
  if (isFull) {
    return format(new Date(date), "dd-MM-yyyy HH:mm:ss");
  }
  return format(new Date(date), "HH");
};

const getEEOIGraphDataAvgByDate = function (EEOIData, flag = "All") {
  if (Array.isArray(EEOIData)) {
    let filterEEOIData = new Array();
    if (flag === "B") {
      filterEEOIData = EEOIData.filter(
        (word) => word.voyage.split(" ")[0].indexOf("L") === -1
      );
    } else if (flag === "L") {
      filterEEOIData = EEOIData.filter(
        (word) => word.voyage.split(" ")[0].indexOf("B") === -1
      );
    } else {
      filterEEOIData = EEOIData;
    }
    // Calculate the sums and group data (while tracking count)
    const sumOfEEOIDateWise = filterEEOIData.reduce(function (m, d) {
      if (!m[d.voyage]) {
        m[d.voyage] = { ...d, count: 1 };
        return m;
      }
      m[d.voyage].EEOI += d.EEOI;
      m[d.voyage].EEOI2022 += d.EEOI2022;
      m[d.voyage].count += 1;
      return m;
    }, {});
    // Create new array from grouped data and compute the average
    const result = Object.keys(sumOfEEOIDateWise).map(function (k) {
      const item = sumOfEEOIDateWise[k];
      return {
        Date: item.Date,
        EEOI: item.EEOI / item.count,
        EEOI2022: item.EEOI2022 / item.count,
        voyage: item.voyage,
      };
    });
    return result;
  } else {
    return [];
  }
};
const getEEOIDataLadenCondition = (element) => {
  //   console.log("element", element);
  if (!element.widgetData.value) return;
  element.widgetData.value.sort(function (a, b) {
    var c = new Date(a.Date);
    var d = new Date(b.Date);
    return c - d;
  });
  let data = new Array();
  let finalEEOIData = new Array();
  let sectionType = sessionStorage.getItem("Section");
  let type = sessionStorage.getItem("type");
  if (sectionType === "ByDate") {
    if (type === "All") {
      finalEEOIData = getEEOIGraphDataAvgByDate(element.widgetData.value);
    } else if (type === "L") {
      finalEEOIData = getEEOIGraphDataAvgByDate(element.widgetData.value);
    } else {
      finalEEOIData = getEEOIGraphDataAvgByDate(element.widgetData.value);
    }
  } else {
    finalEEOIData = element.widgetData.value;
  }

  if (element != undefined) {
    let res = finalEEOIData;
    if (res != undefined) {
      if (res != "0.00") {
        if (res.length > 0) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index];
            let obj = {
              Day: getDay(element.Date).toString(),
              EEOI: parseFloat(parseFloat(element.EEOI).toFixed(2)),
              EEOI2022: parseFloat(parseFloat(element.EEOI2022).toFixed(2)),
              // EEOI2020: parseFloat(element.EEOI2020).toFixed(2),
              voyage: element.voyage,
            };
            data.push(obj);
          }
        }
      }
    }
  }
  console.log("data", data);

  return data;
};
const getDay = (date) => {
  return format(new Date(date), "dd-MM");
};
class EEOILadenCondition extends Component {
  constructor(props) {
    const element = props.element;
    super(props);
    this.state = {
      element: element,
    };
  }

  render() {
    const EEOIGraphData = this.props.element;
    let sectionType = sessionStorage.getItem("Section");

    return (
      <div style={{ width: "100%", marginTop: "50px" }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            width={500}
            height={250}
            data={getEEOIDataLadenCondition(EEOIGraphData)}
            margin={{
              top: 30,
              right: 30,
              left: 0,
              bottom: 10,
            }}
          >
            <XAxis dataKey="Day">
              {" "}
              <Label
                style={{
                  textAnchor: "middle",
                  fontSize: 14,
                  fill: "#FFF",
                }}
                value="Date"
                angle={0}
                position="outside"
                fill="#fff"
                // position='center'
                dy={20} //offsetNum
              />
            </XAxis>
            <YAxis orientation="left" dataKey="EEOI" allowDecimals={true}>
              <Label
                style={{
                  textAnchor: "middle",
                  fontSize: 14,
                  fill: "#FFF",
                }}
                value="EEOI"
                angle={-90}
                position="outside"
                fill="#fff"
                // position='insideLeft'
                offset={23} //offsetNum
              />
            </YAxis>

            <Tooltip
              viewBox={{ background: "#212124" }} //212124
              contentStyle={{ background: "#212124", border: "#d8d9da" }}
            />

            <Line
              name="Existing EEOI"
              type="monotone"
              dataKey="EEOI"
              stroke="white"
              activeDot={{ r: 4 }}
            />

            <Line
              name="EEOI 2022"
              type="monotone"
              dataKey="EEOI2022"
              stroke="orange"
              strokeDasharray="3 3"
              dot={false}
            />
            {/* <Line name="EEOI 2021" type="monotone" dataKey="EEOI2021" stroke="blue" /> */}
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ position: "relative", marginTop: "-260px" }}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
export default EEOILadenCondition;
