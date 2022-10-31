import {Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis} from 'recharts';
import React, {Component, PureComponent} from "react";
import {addMinutes, format, getMinutes, subDays, subMinutes} from "date-fns";
import {establishSocketConnection, getRechartData} from "../../api";
import {getNewDate, getShipName, getVesselId} from "./helper";
import _ from "lodash";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";

const fontSize = 12;

const dateFormatter = (date, isFull) => {
    if (isFull) {
        return format(new Date(date), "dd-MM-yyyy HH:mm:ss");
    }
    return format(new Date(date), "HH");
};

const CustomTooltip = ({active, payload, label, rechartGaugeData}) => {
    if (active && payload) {
        const tooltipData = payload[0];

        return (
            <div className="rechart-custom-tooltip">
                <div className="rechart-tooltip-header">{rechartGaugeData.widgetData.caption}</div>
                <div>Time : {dateFormatter(tooltipData.payload.timestampValue, true)}</div>
                <div>Value : {tooltipData.value} {rechartGaugeData.widgetData.unit}</div>
                {/*<div>Lower Threshold : {rechartGaugeData.lowerBoundValue} °C</div>*/}
                {/*<div>Upper Threshold : {rechartGaugeData.upperBoundValue} °C</div>*/}
            </div>
        );
    }

    return null;
};

/**
 * get the dates between `startDate` and `endSate` with equal granularity
 */
const getTicks = (startDate, endDate, num, timeDiffBetwLabelsInMinutes) => {
    let currentDate = _.cloneDeep(startDate);
    const currentDateMinutes = getMinutes(startDate);
    if (currentDateMinutes > 0 && currentDateMinutes < timeDiffBetwLabelsInMinutes) {
        currentDate = subMinutes(currentDate, currentDateMinutes);
    } else if (currentDateMinutes > timeDiffBetwLabelsInMinutes && currentDateMinutes <= 59) {
        currentDate = subMinutes(currentDate, currentDateMinutes - timeDiffBetwLabelsInMinutes);
    }

    const ticks = [currentDate.getTime()];

    for (let i = 0; i < num; i++) {
        currentDate = addMinutes(currentDate, timeDiffBetwLabelsInMinutes);
        ticks.push(currentDate.getTime());
    }

    return ticks;
};

const getStartDate = () => {
    return subDays(getNewDate(), 1)
};

const getEndDate = () => {
    return getNewDate();
};

class CustomizedAxisTick extends PureComponent {
    render() {
        const {
            x, y, stroke, payload,
        } = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666"
                      transform="rotate(-35)">{dateFormatter(payload.value)}</text>
            </g>
        );
    }
}

class CustomRecharts extends Component {

    constructor(props) {
        super(props);
        const shipName = getShipName();
        const vesselId = getVesselId();

        this.state = {
            rechartGaugeData: props.rechartGaugeData,
            rechartData: [],
            socket: establishSocketConnection("subscribeToGaugeChart", {shipName: shipName, vesselId: vesselId}),
            lastDataPointTime: "",
            shipName: shipName,
            vesselId: vesselId,
            rechartModbusParameterIdentifier: props.rechartModbusParameterIdentifier,
            ticks: [],
            domain: []
        };

        this.subscribeToSocket("subscribeToGaugeChart");

        this.onGetRechartDataSuccess = this.onGetRechartDataSuccess.bind(this);
        this.onGetRechartDataFail = this.onGetRechartDataFail.bind(this);
    }

    onGaugeSelectionChange(rechartModbusParameterIdentifier,selectedGauge) {
        this.setState({
            rechartModbusParameterIdentifier: rechartModbusParameterIdentifier,
            rechartGaugeData: selectedGauge
        });

        getRechartData(this.onGetRechartDataSuccess, this.onGetRechartDataFail, {
            vesselId: this.state.vesselId,
            parameterId: rechartModbusParameterIdentifier
        });
    }

    subscribeToSocket(socketSubscriberName) {
        this.state.socket.on(socketSubscriberName, dataSentOverSocket => {
            if (dataSentOverSocket) {
                const newDataPoint = JSON.parse(dataSentOverSocket);

                if (newDataPoint.rechartModbusParameterIdentifier === this.state.rechartModbusParameterIdentifier && this.state.lastDataPointTime !== newDataPoint.time) {
                    let rechartDataClone = _.cloneDeep(this.state.rechartData);
                    rechartDataClone.push(newDataPoint);

                    const startDate = getStartDate();
                    const endDate = getEndDate();

                    const validatedReChartData = this.validateReChartData(rechartDataClone);

                    const ticks = getTicks(startDate, endDate, 24, 60);
                    const domain = [dataMin => dataMin, () => endDate.getTime()];

                    this.setState({
                        rechartData: validatedReChartData,
                        lastDataPointTime: newDataPoint.time,
                        ticks: ticks,
                        domain: domain,
                    });
                }
            }
        });
    }

    validateReChartData(reChartData) {
        if (Object.keys(reChartData).length > 0) {
            let validatedReChartData = [];
            const reChartDataLength = reChartData.length;
            const latestDataPointTimestamp = reChartData[reChartDataLength - 1].timestampValue;
            const rollingWindowStartingTimestamp = latestDataPointTimestamp - 86400000;

            for (let i = 0; i < reChartData.length; i++) {
                const dataPoint = reChartData[i];
                const dataPointTimestamp = dataPoint.timestampValue;
                if (dataPointTimestamp && latestDataPointTimestamp && rollingWindowStartingTimestamp && dataPointTimestamp >= rollingWindowStartingTimestamp && dataPointTimestamp <= latestDataPointTimestamp) {
                    validatedReChartData.push(dataPoint);
                }
            }
            return validatedReChartData;
        }
        return reChartData;
    }

    componentDidMount() {
        getRechartData(this.onGetRechartDataSuccess, this.onGetRechartDataFail, {
            vesselId: this.state.vesselId,
            parameterId: this.state.rechartModbusParameterIdentifier
        });
    }

    onGetRechartDataSuccess(response) {
        const rechartData = response.data;

        const startDate = getStartDate();
        const endDate = getEndDate();

        const ticks = getTicks(startDate, endDate, 24, 60);
        const domain = [dataMin => dataMin, () => endDate.getTime()];

        this.setState({
            rechartData: rechartData,
            ticks: ticks,
            domain: domain,
        });
    }

    onGetRechartDataFail() {
        this.setState({
            rechartData: []
        });
    }

    render() {
        const {rechartData, ticks, domain, rechartGaugeData} = this.state;
        const {lowerBoundValue, upperBoundValue, minValue, maxValue} = rechartGaugeData.widgetData;

        if (rechartData) {
            return (
                <div style={{height: "100px"}}>
                    <div style={{position: "absolute", width: "100%"}}>
                        <div style={{display: "flex", justifyContent: "space-between", fontSize: fontSize, marginTop: "59px", paddingRight: "26px"}}>
                            <div>{format(getStartDate(), "dd-MM-yyyy")}</div>
                            <div>{format(getEndDate(), "dd-MM-yyyy")}</div>
                        </div>
                    </div>
                    <ResponsiveContainer height='100%' width='93%'>
                        <LineChart width={880} height={100} margin={{top: 0, right: 0, left: 15, bottom: 15}} data={rechartData}>

                            <Line
                                type="monotone"
                                dataKey="value"
                                dot={false}
                                stroke="#7eb26d"
                            />

                            <ReferenceArea
                                // x1={domain[0]}
                                // x2={domain[1]}
                                y1={lowerBoundValue}
                                y2={upperBoundValue}
                                stroke="none"
                                fill="#578fc3"
                                opacity={0.2}
                            />

                            <XAxis
                                dataKey="timestampValue"
                                axisLine={true}
                                tickLine={true}
                                stroke="#d8d9da"
                                scale="time"
                                tickFormatter={dateFormatter}
                                type="number"
                                domain={domain}
                                ticks={ticks}
                                tick={{fontSize: fontSize}}
                                // tick={<CustomizedAxisTick />}
                                /*interval={0}
                                angle={90}
                                dy={20}
                                dx={5}*/
                            />

                            <YAxis
                                axisLine={true}
                                tickLine={true}
                                domain={[minValue, maxValue]}
                                stroke="#d8d9da"
                                unit={rechartGaugeData.widgetData.unit}
                                tick={{fontSize: fontSize}}
                            />

                            <Tooltip
                                viewBox={{background: "#212124"}}
                                contentStyle={{background: "#212124", border: "#d8d9da"}}
                                content={<CustomTooltip rechartGaugeData={rechartGaugeData}/>}/>
                            />

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        } else {
            return (null);
        }
    }
}

export default CustomRecharts;