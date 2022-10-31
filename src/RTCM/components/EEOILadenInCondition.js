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
      m[d.voyage].Distance += d.Distance;
      m[d.voyage].MASSOFCARGO += d.MASSOFCARGO;
      m[d.voyage].count += 1;
      return m;
    }, {});
    // Create new array from grouped data and compute the average
    const result = Object.keys(sumOfEEOIDateWise).map(function (k) {
      const item = sumOfEEOIDateWise[k];
      return {
        Day: getDay(item.Date).toString(),
        EEOI: item.EEOI / item.count,
        EEOI2022: item.EEOI2022 / item.count,
        Distance: item.Distance / item.count,
        MASSOFCARGO: item.MASSOFCARGO / item.count,
        voyage: item.voyage,
      };
    });

    return result;
  } else {
    return [];
  }
};

const getEEOIDataLadenConditionMassCargo = (element) => {
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
              Day:
                element.Date === undefined
                  ? element.Day
                  : getDay(element.Date).toString(),
              EEOI: parseFloat(parseFloat(element.EEOI).toFixed(2)),
              EEOI2022: parseFloat(parseFloat(element.EEOI2022).toFixed(2)),
              FOC: parseFloat(parseFloat(element.FOC).toFixed(2)),
              Distance: parseFloat(parseFloat(element.Distance).toFixed(2)),
              MASSOFCARGO: parseFloat(
                parseFloat(element.MASSOFCARGO).toFixed(2)
              ),
              voyage: element.voyage,
            };
            data.push(obj);
          }
        }
      }
    }
  }
  return data;
};

const getEEOIDataLadenConditionMassCargo1 = (element) => {
  let sectionType = sessionStorage.getItem("Section");
  let data = new Array();
  if (element != undefined) {
    let res = element.widgetData.value;
    if (res != undefined) {
      if (res != "0.00") {
        if (res.length > 0) {
          for (let index = 0; index < res.length; index++) {
            const element = res[index];

            let obj = {
              Day: getDay(element.Date).toString(),
              EEOI: parseFloat(element.EEOI),
              EEOI2022: parseFloat(element.EEOI2022),
              FOC: parseFloat(element.FOC),
              Distance: parseFloat(element.Distance),
              MASSOFCARGO: parseFloat(element.MASSOFCARGO),
              voyage: parseFloat(element.voyage),
            };
            data.push(obj);
          }
        }
      }
    }
  }
  return data;
};

const getDay = (date) => {
  return format(new Date(date), "dd-MM");
};
class EEOILadenInCondition extends Component {
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
            data={getEEOIDataLadenConditionMassCargo(EEOIGraphData)}
            margin={{
              top: 30,
              right: 40,
              left: 0,
              bottom: 10,
            }}
          >
            <XAxis dataKey="Day">
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
                // position="center"
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
                // position="insideLeft"
                offset={23} //offsetNum
              />
            </YAxis>
            <YAxis
              orientation="left"
              dataKey="Distance"
              yAxisId="idDist"
              allowDecimals={true}
            >
              <Label
                style={{
                  textAnchor: "middle",
                  fontSize: 14,
                  fill: "#33B5E5",
                }}
                value="Distance"
                angle={-90}
                position="left"
                fill="#33B5E5"
                // position="insideLeft"
                offset={-15} //offsetNum
              />
            </YAxis>
            <YAxis
              orientation="right"
              dataKey="MASSOFCARGO"
              yAxisId="idMASSOFCARGO"
              allowDecimals={true}
            >
              <Label
                className="mofLabel"
                style={{
                  textAnchor: "middle",
                  fontSize: 14,
                  fill: "#00FF00",
                  paddingLeft: "20px",
                }}
                value="Mass Of Cargo"
                angle={-90}
                position="right"
                fill="#00FF00"
                // position="insideRight"
                offset={0} //offsetNum
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
              strokeDasharray="3 3"
              stroke="orange"
              dot={false}
            />
            {/* <Line name="FOC/100" type="monotone" dataKey="FOC" stroke="green" /> */}
            <Line
              name="Distance"
              type="monotone"
              dataKey="Distance"
              stroke="#33B5E5"
              yAxisId="idDist"
            />
            <Line
              name="Mass of cargo"
              type="monotone"
              dataKey="MASSOFCARGO"
              stroke="#00FF00"
              yAxisId="idMASSOFCARGO"
            />
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
export default EEOILadenInCondition;
