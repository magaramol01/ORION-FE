import React, {PureComponent} from 'react';
import {Bar, BarChart, Brush, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {format} from "date-fns";
import _ from "lodash";
import {getShipName, getVesselId} from "../common/helper";

const fontSize = 12;

const dateFormatter = (date) => {
    if (date) {
        return format(new Date(date), "dd-MM");
    }
    return "";
};

class CustomBarChart extends PureComponent {

    constructor(props) {
        super(props);
        const shipName = getShipName();
        const vesselId = getVesselId();

        this.state = {
            element: props.element,
            shipName: shipName,
            vesselId: vesselId
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    getBarGraphData() {
        const widgetElement = this.state.element;
        const barGraphData = widgetElement.configuration.body.data.widgetData.value;
        return barGraphData ? _.sortBy(barGraphData, 'timestampValue') : [];
    }

    render() {
        const barGraphData = this.getBarGraphData();

        return (
            <div id={"customMRVBarChart"} style={{width: '100%', height: '100%'}} className="text-light">
                <div className="panel-group-header" style={{position: "absolute"}}>
                    Consumption
                </div>

                <ResponsiveContainer height='100%' width='100%'>
                    <BarChart
                        width={880}
                        height={100}
                        data={barGraphData}
                        margin={{
                            top: 15, right: 5, left: 5, bottom: 5,
                        }}
                    >

                        <XAxis
                            dataKey="timestamp"
                            axisLine={true}
                            tickLine={true}
                            stroke="#d8d9da"
                            tickFormatter={dateFormatter}
                            height={25}
                        />

                        <YAxis
                            stroke="#d8d9da"
                            axisLine={true}
                            tickLine={true}
                            tick={{fontSize: fontSize}}
                        />

                        <Tooltip
                            viewBox={{background: "#212124"}}
                            contentStyle={{background: "#212124", border: "#d8d9da"}}
                        />

                        <Legend verticalAlign="top"/>

                        <Bar
                            name="HFO"
                            dataKey="totalHFO"
                            fill="#dd6b66"
                        />

                        <Bar
                            name="ULSGO"
                            dataKey="totalMGO"
                            fill="#e69d87"
                        />

                        <Brush dataKey="name" height={15} stroke="#33b5e5" fill="#18191b"/>

                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default CustomBarChart;