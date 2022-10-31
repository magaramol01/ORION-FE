import * as React from "react";
import CustomBarGauge from "./customBarGauge";
import CustomScrollBar from "./CustomScrollBar";
import {Col} from "react-bootstrap";
import _ from "lodash";

class CustomBarGaugeList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            element: props.element
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return {element: nextProps.element};
        } else return null;
    }

    getTwoColumnStructure = () => {
        const element = this.state.element;
        const data = _.toArray(element.configuration.body.data);
        const dataLength = data.length;
        const isDivisible = dataLength % 2 === 0;
        let elements = [];

        for (let i = 0; i < dataLength / 2; i++) {
            const index = i * 2;
            const firstColumnData = data[index];
            const secondColumnData = data[index + 1];

            elements.push(
                <div style={{display: 'flex', flexDirection: 'row', padding: "5px"}} key={i}>
                    <Col style={{padding: 0}}>
                        <CustomBarGauge barGaugeData={firstColumnData}/>
                    </Col>
                    <Col style={{padding: 0}}>
                        <CustomBarGauge barGaugeData={secondColumnData}/>
                    </Col>
                </div>
            );
        }
        if (!isDivisible) {
            elements.push(
                <div style={{display: 'flex', flexDirection: 'row', padding: "5px"}}>
                    <Col style={{padding: 0}}>
                        <CustomBarGauge barGaugeData={data[dataLength - 1]}/>
                    </Col>
                    <Col style={{padding: 0}}/>
                </div>
            );
        }

        return elements;
    };

    render() {
        const twoColumnElements = this.getTwoColumnStructure();

        return (
            <CustomScrollBar height={"345px"} width={"auto"} >
                <div className="bar-gauge-column-divider"/>
                {
                    twoColumnElements.map((element) => {
                        return (
                            element
                        );
                    })
                }
            </CustomScrollBar>
        );
    }
}

export default CustomBarGaugeList;
