import React, {Component} from "react";
import {Carousel, Table} from "react-bootstrap";
import CustomScrollBar from "./CustomScrollBar";
import CustomProgressBar from "./CustomProgressBar";

const tableDivStyle = {
    "text-overflow": "ellipsis",
    "overflow": "hidden",
    "white-space": "nowrap",
    "max-width": "50px"
};

function getVesselComponentRenderer(props) {
    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <div style={{paddingBottom: '10px', marginLeft: '10px', marginRight: '10px'}}>
                <div>
                    <span><i className="fa fa-ship fa-3x" aria-hidden="true"/></span>
                    <span style={{marginLeft: '10px'}}>Alpha Charter</span>
                </div>
                <div style={{paddingTop: '5px'}}>
                    <span>BR SFS</span>
                    <span style={{float: 'right'}}>ZA PLZ</span>
                </div>
                <div style={{paddingTop: '5px'}}>
                    <CustomProgressBar percentageValue={70}/>
                </div>
            </div>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
                <tbody>
                <tr>
                    <td><div style={tableDivStyle}>Last Port</div></td>
                    <td>BR SFS</td>
                    <td><div style={tableDivStyle}>Next Port Name</div></td>
                    <td>ZA PLZ</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Distance Travelled</div></td>
                    <td>240</td>
                    <td><div style={tableDivStyle}>Distance To Go</div></td>
                    <td>546</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Speed Cal.</div></td>
                    <td>11</td>
                    <td><div style={tableDivStyle}>Load Status Name</div></td>
                    <td>Ballast</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Draught</div></td>
                    <td>95</td>
                    <td><div style={tableDivStyle}>Drought Max</div></td>
                    <td>118</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ETA</div></td>
                    <td>2020-04-30 03.17.59</td>
                    <td><div style={tableDivStyle}>Calculated ETA</div></td>
                    <td>2020-04-30 03.17.59</td>
                </tr>
                </tbody>
            </Table>
        </CustomScrollBar>
    );
}

function getWeatherComponentRenderer(props) {
    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
                <tbody>
                <tr>
                    <td><div style={tableDivStyle}>From Current Time</div></td>
                    <td>+6hrs</td>
                    <td>+12hrs</td>
                    <td>+18hrs</td>
                    <td>+24hrs</td>
                    <td>+30hrs</td>
                    <td>+36hrs</td>
                    <td>+42hrs</td>
                    <td>+48hrs</td>
                    <td>+54hrs</td>
                    <td>+60hrs</td>
                    <td>+66hrs</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Lat</div></td>
                    <td>24.9801</td>
                    <td>25.0305</td>
                    <td>21.06</td>
                    <td>22.04</td>
                    <td>25.1419</td>
                    <td>25.1435</td>
                    <td>25.1421</td>
                    <td>25.1488</td>
                    <td>25.14</td>
                    <td>25.1479</td>
                    <td>25.1487</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Long</div></td>
                    <td>55.0653</td>
                    <td>56.0953</td>
                    <td>55.0153</td>
                    <td>56.0253</td>
                    <td>55.0563</td>
                    <td>56.0053</td>
                    <td>55.0753</td>
                    <td>56.1653</td>
                    <td>55.3653</td>
                    <td>56.4653</td>
                    <td>55.8653</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Water Temperature</div></td>
                    <td>26.2</td>
                    <td>24.7</td>
                    <td>25.7</td>
                    <td>25.2</td>
                    <td>26.3</td>
                    <td>26.1</td>
                    <td>24.3</td>
                    <td>26.2</td>
                    <td>26.2</td>
                    <td>26.2</td>
                    <td>26.2</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Wave Direction</div></td>
                    <td>319.2</td>
                    <td>299.45</td>
                    <td>39.18</td>
                    <td>319.16</td>
                    <td>319.2</td>
                    <td>319.2</td>
                    <td>319.2</td>
                    <td>319.2</td>
                    <td>319.2</td>
                    <td>319.2</td>
                    <td>319.2</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Wave Height</div></td>
                    <td>0.5</td>
                    <td>1.5</td>
                    <td>0.7</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Wind Wave Direction</div></td>
                    <td>315.94</td>
                    <td>323.77</td>
                    <td>315.94</td>
                    <td>315.94</td>
                    <td>315.94</td>
                    <td>315.94</td>
                    <td>315.94</td>
                    <td>315.94</td>
                    <td>315.94</td>
                    <td>315.94</td>
                    <td>315.94</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Wind Wave Height</div></td>
                    <td>0.24</td>
                    <td>0.11</td>
                    <td>0.24</td>
                    <td>0.24</td>
                    <td>0.24</td>
                    <td>0.24</td>
                    <td>0.24</td>
                    <td>0.24</td>
                    <td>0.24</td>
                    <td>0.24</td>
                    <td>0.24</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Swell Direction</div></td>
                    <td>320.01</td>
                    <td>300</td>
                    <td>303.03</td>
                    <td>320.01</td>
                    <td>320.01</td>
                    <td>320.01</td>
                    <td>320.01</td>
                    <td>320.01</td>
                    <td>320.01</td>
                    <td>320.01</td>
                    <td>320.01</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Swell Height</div></td>
                    <td>0.44</td>
                    <td>0.32</td>
                    <td>0.25</td>
                    <td>0.27</td>
                    <td>0.44</td>
                    <td>0.44</td>
                    <td>0.44</td>
                    <td>0.44</td>
                    <td>0.44</td>
                    <td>0.44</td>
                    <td>0.44</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Wind Speed</div></td>
                    <td>4.64</td>
                    <td>3.23</td>
                    <td>5.89</td>
                    <td>4.64</td>
                    <td>4.64</td>
                    <td>4.64</td>
                    <td>4.64</td>
                    <td>4.64</td>
                    <td>4.64</td>
                    <td>4.64</td>
                    <td>4.64</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Wind Direction</div></td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                    <td>318.04</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Guest I</div></td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                    <td>5.49</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Cloud Cover</div></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Pressure</div></td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                    <td>1012.05</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Visibility</div></td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                    <td>24.14</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Sea Level</div></td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                    <td>0.5</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Current Speed</div></td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                    <td>0.26</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Current Direction</div></td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                    <td>330.9</td>
                </tr>

                </tbody>
            </Table>
        </CustomScrollBar>
    );
}

function getVoyageComponentRenderer(props) {
    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
                <tbody>
                <tr>
                    <td><div style={tableDivStyle}>ETA</div></td>
                    <td>11.08</td>
                    <td><div style={tableDivStyle}>CETA Offset</div></td>
                    <td>-28.8096</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ETA Port</div></td>
                    <td>PORT ELIZABETH</td>
                    <td><div style={tableDivStyle}>Dep Port</div></td>
                    <td>SAO FRANCISCO</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Reas.</div></td>
                    <td>BUNKERING</td>
                    <td><div style={tableDivStyle}>Delay</div></td>
                    <td>NIL</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ETB</div></td>
                    <td>TBA</td>
                    <td><div style={tableDivStyle}>ETB Offset</div></td>
                    <td>-2</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ETD</div></td>
                    <td>TBA</td>
                    <td><div style={tableDivStyle}>ETD Offset</div></td>
                    <td>-2</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Report Type</div></td>
                    <td>NOON</td>
                    <td><div style={tableDivStyle}>Voyage No</div></td>
                    <td>39-L</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Status</div></td>
                    <td>AT SEA</td>
                    <td><div style={tableDivStyle}></div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Total Cargo</div></td>
                    <td>65366.9</td>
                    <td><div style={tableDivStyle}>Cargo Load</div></td>
                    <td>65366.9</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Cargp Disch.</div></td>
                    <td>0</td>
                    <td><div style={tableDivStyle}>Ballast</div></td>
                    <td>376</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Voyage CP Speed</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Voyage CP Cons.</div></td>
                    <td></td>
                </tr>
                </tbody>
            </Table>
        </CustomScrollBar>
    );
}

function getNavigationComponentRenderer(props) {
    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
                <tbody>
                <tr>
                    <td><div style={tableDivStyle}>Lat</div></td>
                    <td>-28.91</td>
                    <td><div style={tableDivStyle}>Long</div></td>
                    <td>-36.26</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>Course</div>
                    </td>
                    <td>108</td>
                    <td>
                        <div style={tableDivStyle}>Heading</div>
                    </td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>DRAFT AFT</div>
                    </td>
                    <td>12.82</td>
                    <td>
                        <div style={tableDivStyle}>DRAFT FWD</div>
                    </td>
                    <td>12.8</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>SOG</div>
                    </td>
                    <td>12.1</td>
                    <td>
                        <div style={tableDivStyle}>SOW</div>
                    </td>
                    <td>11.08</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>GPS-Miles</div>
                    </td>
                    <td>10</td>
                    <td>
                        <div style={tableDivStyle}>Miles. SP. LOG.</div>
                    </td>
                    <td>11</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>Dist. To Go</div>
                    </td>
                    <td>01-11.60N</td>
                    <td>
                        <div style={tableDivStyle}>Displacement</div>
                    </td>
                    <td>88365</td>
                </tr>

                <tr>
                    <td>
                        <div style={tableDivStyle}>RPM</div>
                    </td>
                    <td>0</td>
                    <td>
                        <div style={tableDivStyle}>SLIP</div>
                    </td>
                    <td>18.11</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>Power kW</div>
                    </td>
                    <td>4741</td>
                    <td>
                        <div style={tableDivStyle}>ME FOC</div>
                    </td>
                    <td>21.79</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>FUEL ME HS</div>
                    </td>
                    <td>21.79</td>
                    <td>
                        <div style={tableDivStyle}>Total Straming Time</div>
                    </td>
                    <td>0.9</td>
                </tr>
                <tr>
                    <td>
                        <div style={tableDivStyle}>ME Fuel Streaming Time</div>
                    </td>
                    <td>154.64</td>
                    <td>
                        <div style={tableDivStyle}>FO Per 24 Hrs</div>
                    </td>
                    <td>24</td>
                </tr>
                </tbody>
            </Table>
        </CustomScrollBar>
    );
}

function getMainEngineComponentRenderer(props) {
    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
                <tbody>
                <tr>
                    <td><div style={tableDivStyle}>Engine Speed</div></td>
                    <td>12.4</td>
                    <td><div style={tableDivStyle}>ME Revolution</div></td>
                    <td>84.8</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME TC Speed</div></td>
                    <td>11500</td>
                    <td><div style={tableDivStyle}>ME Revolution MOP</div></td>
                    <td>83</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME Output CE Cal.</div></td>
                    <td>48.02%</td>
                    <td><div style={tableDivStyle}>ME Output Perf.</div></td>
                    <td>3257</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME Inlet Fuel Temp.</div></td>
                    <td>127</td>
                    <td><div style={tableDivStyle}>ME Inlet Fuel Viscosity</div></td>
                    <td>329.6</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME Cylinder Consume</div></td>
                    <td>1.24</td>
                    <td><div style={tableDivStyle}>ME Cylinder Oil Consume</div></td>
                    <td>96.2</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME Sys. Oil Consume</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>ME Ech. Gas Average Outlet Temp</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME TC Inlet Exh. Gas Temp.</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>ME TC Outlet Exh. Gas Temp.</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME TC Intake Air Temp.</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>ME Scavenging Air Pressure</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME Scavenging Air Temp.</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Engine Room Temp.</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>ME Thrust Bearing Temp</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>ME LO Purifier Use</div></td>
                    <td>No.1</td>
                </tr>
                </tbody>
            </Table>
        </CustomScrollBar>
    );
}

function getAuxEngineComponentRenderer(props) {
    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
                <tbody>
                <tr>
                    <td><div style={tableDivStyle}>Steam Time Aux 1</div></td>
                    <td>23</td>
                    <td><div style={tableDivStyle}>Steam Load KW Aux 1</div></td>
                    <td>230</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Steam Time Aux 2</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Steam Load KW Aux 2</div></td>
                    <td>245</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Steam Time Aux 3</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Steam Load KW Aux 3</div></td>
                    <td>268</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Steam Time Aux 4</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Steam Load KW Aux 4</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Steam Time Aux 5</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Steam Load KW Aux 5</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Aux Eng. Sys. Oil Cons.</div></td>
                    <td></td>
                </tr>
                </tbody>
            </Table>
        </CustomScrollBar>
    );
}

function getAuxiliariesComponentRenderer(props) {
    return (
        <CustomScrollBar height={"345px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
                <tbody>
                <tr>
                    <td><div style={tableDivStyle}>Boiler Running Hrs</div></td>
                    <td>0</td>
                    <td><div style={tableDivStyle}>Boiler MGOLs</div></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Boiler HS</div></td>
                    <td>0</td>
                    <td><div style={tableDivStyle}>Boiler LS</div></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Boiler Exh. Gas In</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Boiler Exh. Gas Out</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Press. Compa. Boiler Exh. Side</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Camp Boiler Steam. Valve Open</div></td>
                    <td></td>
                </tr>
                <tr>
                    <td><div style={tableDivStyle}>Camp Boiler Fuel Consume HFO</div></td>
                    <td></td>
                    <td><div style={tableDivStyle}>Camp Boiler Fuel Oil Consume LSMGO</div></td>
                    <td></td>
                </tr>
                </tbody>
            </Table>
        </CustomScrollBar>
    );

}

class CustomCarousel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: props.element,
            carouselIndex: 0
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({
            carouselIndex: selectedIndex
        });
    };

    render() {

        if (this.state.element.configuration.header.text === "Bridge/Navigation & Charter Party") {
            return (
                <div>
                    <Carousel activeIndex={this.state.carouselIndex} onSelect={this.handleSelect}
                              controls={false} style={{height: "inherit", width: "inherit", background: "#212124"}}
                    >
                        <Carousel.Item style={{height: "inherit", width: "inherit"}}>
                            <div className="panel-title">
                            <span className="panel-title-text">
                                Vessel
                            </span>
                            </div>
                            {getVesselComponentRenderer()}
                        </Carousel.Item>

                        <Carousel.Item style={{height: "inherit", width: "inherit"}}>
                            <div className="panel-title">
                            <span className="panel-title-text">
                                Weather
                            </span>
                            </div>
                            {getWeatherComponentRenderer()}
                        </Carousel.Item>

                        <Carousel.Item style={{height: "inherit", width: "inherit"}}>
                            <div className="panel-title">
                            <span className="panel-title-text">
                                Voyage
                            </span>
                            </div>
                            {getVoyageComponentRenderer()}
                        </Carousel.Item>

                        <Carousel.Item style={{height: "inherit", width: "inherit"}}>
                            <div className="panel-title">
                            <span className="panel-title-text">
                                Navigation
                            </span>
                            </div>
                            {getNavigationComponentRenderer()}
                        </Carousel.Item>

                    </Carousel>
                </div>
            );
        } else {
            return (
                <div>
                    <Carousel activeIndex={this.state.carouselIndex} onSelect={this.handleSelect}
                              controls={false} style={{height: "inherit", width: "inherit", background: "#212124"}}
                    >
                        <Carousel.Item style={{height: "inherit", width: "inherit"}}>
                            <div className="panel-title">
                            <span className="panel-title-text">
                                Main Engine
                            </span>
                            </div>
                            {getMainEngineComponentRenderer()}
                        </Carousel.Item>

                        <Carousel.Item style={{height: "inherit", width: "inherit"}}>
                            <div className="panel-title">
                            <span className="panel-title-text">
                                Aux Engine
                            </span>
                            </div>
                            {getAuxEngineComponentRenderer()}
                        </Carousel.Item>

                        <Carousel.Item style={{height: "inherit", width: "inherit"}}>
                            <div className="panel-title">
                            <span className="panel-title-text">
                                Auxiliaries
                            </span>
                            </div>
                            {getAuxiliariesComponentRenderer()}
                        </Carousel.Item>

                    </Carousel>
                </div>
            );
        }
    }
}

export default CustomCarousel;
