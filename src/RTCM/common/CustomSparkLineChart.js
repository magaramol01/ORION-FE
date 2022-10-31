import React from 'react';
import {Sparklines, SparklinesBars, SparklinesLine} from 'react-sparklines';

const sparkLineData = [2, 4, 8, 14, 2, -8, -5, 10, -10, 20, 8, 15, 5, 10, -5, 20, -8, 15, 5, 10, 5, 20, 8, 15, 5, 10, 5, 20, 8, 15];

/*
* This library has many limitations and hence find different one which only provides sparkline
* or else use APEX CHARTS library
* */

const LinearGradientFill = stopColor => {
    return (
        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="0%" y2="100%">
            {/*<stop offset="0%" stopColor="#299c46" stopOpacity="1"/>*/}
            {/*<stop offset="100%" stopColor="#299c46" stopOpacity="0"/>*/}
        </linearGradient>
    );
};

const CustomSparkLineChart = props => (
    <Sparklines
        data={props.sparkLineData}
        limit={30}
        style={{height: "20px", width: "100%"}}
    >
        <svg>
            <defs>
                <LinearGradientFill/>
            </defs>
        </svg>
        <SparklinesLine
            style={{
                strokeWidth: 1,
                fill: 'url(#gradientLine)'
            }}
            color="#299c46"
            // color="#66ff00"
            // color="#1a87ff"
        />
    </Sparklines>
);

export default CustomSparkLineChart;
