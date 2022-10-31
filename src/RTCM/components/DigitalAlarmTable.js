
import React, {Fragment} from "react";
import CustomScrollBar from "./CustomScrollBar";
import _ from "lodash";
import { getItemFromLocalStorage } from "../common/helper";

class DigitalAlarmTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            element: props.element
        };

        this.blankRow = this.blankRow.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!_.isEqual(nextProps.element, prevState.element)) {
            return { element: nextProps.element };
        } else return null;
    }

    blankRow = (styleObj) => {
        return (
            <tr style={styleObj.trStyle}>
                <td style={styleObj.tdStyle}> &nbsp; </td>
            </tr>
        );
    };

    getTable1Data = () => {
        const element = this.state.element;
        const data = element.configuration.body.data.digitalalarms.col1;
        if (data) {
            return data;
        }
    };

    getTable2Data = () => {
        const element = this.state.element;
        const data = element.configuration.body.data.digitalalarms.col2;
        if (data) {
            return data;
        }
    };

    getTable3Data = () => {
        const element = this.state.element;
        const data = element.configuration.body.data.digitalalarms.col3;
        if (data) {
            return data;
        }
    };

    getTable4Data = () => {
        const element = this.state.element;
        const data = element.configuration.body.data.digitalalarms.col4;
        if (data) {
            return data;
        }
    };

    getDigitalRenderRenderer = (obj) => {
        let shipName = getItemFromLocalStorage('shipName');
        if (shipName == "nova-nanjing-express" || shipName == "nova-fujian-express" || shipName == "nova-shanghai-express" || shipName == "nova-xinhui-express" || shipName == "explorer-asia" || shipName =="explorer-oceania" || shipName =="mol-treasure") {

            function returnValue(data) {
                const val = data.value;
                if (data.value == "") {
                    return "--"
                } else {
                    return val
                }
            }

            let val1Status = returnValue(obj.widgetData);

            return (
                <div style={{height: "30px"}}>
                <div className="custom-accordion-vessel-content__secondary-text"><span>{obj.widgetData.caption}</span>{"  "}
                <div className="custom-accordion-vessel-content__name text-light" >{val1Status}</div>
                </div>
            </div>
            )

        } else {
            function returnClassName(data) {
                const val = data.value ;
                if (data.digitalData == "" || Object.keys(data.digitalData).length == 0) {
                    return "whitebox";
                } else {
                    const statusData = JSON.parse(data.digitalData);
                    if(val == "true" || val == "1" || val == "1.0" || val == "1.00") {
                        return statusData["1"]
                    } else if(val == "false" || val == "0" || val == "0.0" || val == "0.00") {
                        return statusData["0"]
                    } else {
                        return statusData["default"]
                    }
                }
            }

            let val1Status = returnClassName(obj.widgetData);

            return (
                <div style={{ height: "30px" }}>
                    <div><span>{obj.widgetData.caption}</span>{"  "}<div className={val1Status}></div>
                    </div>
                </div>
            )
        }
    }


    render() {
        const digitalAlarmTableCol1Data = this.getTable1Data();
        const digitalAlarmTableCol2Data = this.getTable2Data();
        const digitalAlarmTableCol3Data = this.getTable3Data();
        const digitalAlarmTableCol4Data = this.getTable4Data();

        const panelId = this.state.element.type + "@" + this.state.element.layout.i;

        return (

            <div id={panelId}
                style={{ height: "100%", width: "fit-content%", background: "black" }}
            >
                <CustomScrollBar autoHeight={true} autoHeightMin={"25%"} autoHeightMax={"100%"} width={"100%"}>

                    <div style={{ display: "flex" }}>
                        <div style={{ width: "200px", height: "550px", marginLeft: "40px", marginTop: "20px", fontSize: "10px", borderLeft: "2px" }}>
                            {
                                Object.keys(digitalAlarmTableCol1Data).map((obj) => {
                                    return (
                                        this.getDigitalRenderRenderer(digitalAlarmTableCol1Data[obj])
                                    );
                                })
                            }
                        </div>
                        <div style={{ width: "200px", height: "550px", marginLeft: "40px", marginTop: "20px", fontSize: "10px" }}>
                            {
                                Object.keys(digitalAlarmTableCol2Data).map((obj) => {
                                    return (
                                        this.getDigitalRenderRenderer(digitalAlarmTableCol2Data[obj])
                                    );
                                })
                            }
                        </div>
                        <div style={{ width: "200px", height: "600px", marginLeft: "40px", marginTop: "20px", fontSize: "10px" }}>
                            {
                                Object.keys(digitalAlarmTableCol3Data).map((obj) => {
                                    return (
                                        this.getDigitalRenderRenderer(digitalAlarmTableCol3Data[obj])
                                    );
                                })
                            }
                        </div>
                        <div style={{ width: "200px", height: "550px", marginLeft: "40px", marginRight: "20px", marginTop: "20px", fontSize: "10px" }}>
                            {
                                Object.keys(digitalAlarmTableCol4Data).map((obj) => {
                                    return (
                                        this.getDigitalRenderRenderer(digitalAlarmTableCol4Data[obj])
                                    );
                                })
                            }
                        </div>
                    </div>

                </CustomScrollBar>
            </div>
        );
    }
}

export default DigitalAlarmTable;

