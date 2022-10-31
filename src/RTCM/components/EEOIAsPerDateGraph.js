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
import { AppContext } from "../context/GlobalContext";

const fontSize = 12;
const dateFormatter = (date, isFull) => {
  if (isFull) {
    return format(new Date(date), "dd-MM-yyyy HH:mm:ss");
  }
  return format(new Date(date), "HH");
};
const data = [
  { name: "Mon", uv: 4000 },
  { name: "Tues", uv: 3000 },
  { name: "Wens", uv: 2000 },
  { name: "Thru" },
  { name: "Fri", uv: 1890 },
  { name: "Sat", uv: 2390 },
  { name: "Sun", uv: 3490 },
];

const getEEOIDataAsPerDate1 = (element) => {
  let sectionType = sessionStorage.Section;
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
              EEOI: element.EEOI,
              EEOI2022: element.EEOI2022,
            };
            data.push(obj);
          }
        }
      }
    }
  }
  return data;
};

const getEEOIGraphDataAvgByDate = function (EEOIData, flag="All") {
  // console.log(EEOIData, flag)
  if (Array.isArray(EEOIData)) {
    let filterEEOIData = new Array();
    if (flag === "B") {
      filterEEOIData = EEOIData.filter((word) => word.voyage.includes("B"));
    } else if (flag === "L") {
      filterEEOIData = EEOIData.filter((word) => word.voyage.includes("L"));
    } else {
      filterEEOIData = EEOIData;
    }
   
    const result = filterEEOIData.map(function (item) {
      // const item = sumOfEEOIDateWise[k];
      return {
        // Date: item.Date,
        EEOI: item.EEOI ,
        EEOI2022: item.EEOI2022 ,
        voyage: item.voyage,
      };
    });
    return result;
  } else {
    return [];
  }
};

const getDay = (date) => {
  return format(new Date(date), "dd-MM");
};

class EEOIAsPerDateGraph extends Component {
  static contextType = AppContext;
  constructor(props) {
    const element = props.element;
    super(props);
    this.state = {
      element: element,
    };
  }

  getEEOIDataAsPerDate = (element) => {
    const { dispatch, state } = this.context;
    let data = new Array();
    let finalEEOIData = new Array();
    // let sectionType = sessionStorage.getItem("Section");
    let voyageFilter = state.voyageFilter; // Either byVoyage or byDate
    // let type = sessionStorage.getItem("type");
    let type = state.voyageType;

    if (voyageFilter === "byDate") {
      if (type === "All") {
        finalEEOIData = getEEOIGraphDataAvgByDate(
          element.widgetData.value,
          // type
        );
      } else if (type === "L") {
        finalEEOIData = getEEOIGraphDataAvgByDate(
          element.widgetData.value,
          // type
        );
      } else {
        finalEEOIData = getEEOIGraphDataAvgByDate(
          element.widgetData.value,
          // type
        );
      }
    } else if (voyageFilter === "byVoyage") {
      if (type === "All") {
        finalEEOIData = getEEOIGraphDataAvgByDate(
          element.widgetData.value,
          // type
        );
      } else if (type === "L") {
        finalEEOIData = getEEOIGraphDataAvgByDate(
          element.widgetData.value,
          // type
        );
      } else {
        finalEEOIData = getEEOIGraphDataAvgByDate(
          element.widgetData.value,
          // type
        );
      }
    }

    if (element != undefined) {
      let res = finalEEOIData;
      if (res != undefined) {
        if (res != "0.00") {
          if (res.length > 0) {
            for (let index = 0; index < res.length; index++) {
              const element = res[index];
              let obj = {
                // Day: getDay(element.Date).toString(),
                EEOI: parseFloat(element.EEOI).toFixed(2),
                EEOI2022: parseFloat(element.EEOI2022).toFixed(2),
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

  render() {
    const EEOIGraphData = this.props.element;

    return (
      <div style={{ width: "100%", marginTop: "50px" }}>
        <Label style={{ marginTop: "-230" }} value="EEOI As Per Date" />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            width={500}
            height={250}
            data={this.getEEOIDataAsPerDate(EEOIGraphData)}
            margin={{
              top: 30,
              right: 30,
              left: 0,
              bottom: 10,
            }}
          >
            <XAxis dataKey="voyage">
              {" "}
              <Label
                style={{
                  textAnchor: "middle",
                  fontSize: 14,
                  fill: "#FFF",
                }}
                value="Voyage"
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
              dot={false}
              strokeDasharray="3 3"
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
export default EEOIAsPerDateGraph;
