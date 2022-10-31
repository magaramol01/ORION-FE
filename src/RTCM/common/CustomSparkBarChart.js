import React from 'react';
import {Sparklines, SparklinesBars} from 'react-sparklines';

const sparkLineData = [2, 4, 8, 14, 2, -8, -5, 10, -10, 20, 8, 15, 5, 10, -5, 20, -8, 15, 5, 10, 5, 20, 8, 15, 5, 10, 5, 20, 8, 15, 3, 6, 9, 12];

/*
* This library has many limitations and hence find different one which only provides sparkline
* or else use APEX CHARTS library
* */

const LinearGradientFill = (props) => {
    return (
        <linearGradient id={"barChart-" + props.chartId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3cce6b" stopOpacity="1"/>
            <stop offset="100%" stopColor="#3cce6b" stopOpacity="0"/>
        </linearGradient>
    );
};

// TODO : convert all this js to class structure so that it will render on state or props
const CustomSparkLineChart = (props) => (
    <Sparklines
        data={props.sparkLineData}
        limit={30}
        style={{height: "20px", width: "100%"}}
    >
        <svg>
            <defs>
                <LinearGradientFill chartId={props.chartId}/>
            </defs>
        </svg>
        <SparklinesBars data={props.chartId}
            style={{
                strokeWidth: 1,
                // fill: 'url(#gradientBar)'
                fill: "url(#barChart-" + props.chartId + ")"
            }}
            // color="#299c46"
            color="#3cce6b"
        />
    </Sparklines>
);

export default CustomSparkLineChart;
