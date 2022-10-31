import React from "react";

class CylinderWidget extends React.Component {

    constructor(props) {
        super(props);

        this.blankRow = this.blankRow.bind(this);
    }

    blankRow = (styleObj) => {
        return (
            <tr style={styleObj.trStyle}>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
                <td style={styleObj.tdStyle}> &nbsp; </td>
            </tr>
        );
    };

    render() {
        /*return (
            <div>
                <div className="col-sm-12" style={{border: '0px solid'}}>
                    <table id="cylinderWidgetId" className="cylinder-table">
                        <tbody>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                            <tr>
                                <td style={{width: '25%', textAlign: 'center'}}> Exh. gas out temp. </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_temp1">312.5</span>°C </div> </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_temp2">319.8</span>°C </div> </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_temp3">311.9</span>°C </div> </td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_temp4">316.4</span>°C </div> </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_temp5">319.7</span>°C</div> </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_temp6">317.8</span>°C </div> </td>
                                <td style={{width: '6%', textAlign: 'center'}}><div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '20%'}}><span className="exh_gas_out_temp7">313.1</span>°C </div> </td>
                                <td style={{width: '5.5%', textAlign: 'center'}}><div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '20%'}}><span className="exh_gas_out_temp8">319.2</span>°C </div> </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '20%'}}><span className="exh_gas_out_temp9">312.7</span>°C </div> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td />
                            </tr>
                            <tr>
                                <td style={{width: '25%', textAlign: 'center'}}> Exh. gas out dev. </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #333333', borderRadius: '5px', width: '65%', marginLeft: '25%'}}> <span className="exh_gas_out_dev1">-1.6</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_dev2">-7.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_dev3">-0.3</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_dev4">-3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_dev5">-7.8</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '25%'}}><span className="exh_gas_out_dev6">3.1</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '20%'}}><span className="exh_gas_out_dev7">-2.7</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '20%'}}><span className="exh_gas_out_dev8">3.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '20%'}}><span className="exh_gas_out_dev9">-6</span>°C</div></td>
                            </tr>
                            {this.blankRow({trStyle: {height: '66px'}, tdStyle: {}})}
                            <tr>
                                <td style={{textAlign: 'center'}}> Cyl.cover CW outlet temp. </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_1">83.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_2">80.2</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_3">84.5</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_4">83.6</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_5">84.9</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_6">83.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(51, 51, 51)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_7">81.1</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_8">82.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cw_outlet_temp_9">84.9</span>°C</div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Cyl.liner Wall (Exh.) temp. </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="linear_wall_exh_temp1">146.1</span> </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="linear_wall_exh_temp2">149.5</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="linear_wall_exh_temp3">148.7</span></div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="linear_wall_exh_temp4">149.9</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="linear_wall_exh_temp5">149.7</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="linear_wall_exh_temp6">146.5</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="linear_wall_exh_temp7">147.6</span></div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="linear_wall_exh_temp8">149.8</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="linear_wall_exh_temp9">148.6</span></div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Cyl.liner Wall (PP) temp.</td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cyl_linear_wall1">153.3</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cyl_linear_wall2">154.5</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cyl_linear_wall3">151.1</span></div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="cyl_linear_wall4">153.2</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cyl_linear_wall5">151.2</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cyl_linear_wall6">152.8</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cyl_linear_wall7">154.5</span></div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cyl_linear_wall8">151.3</span></div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cyl_linear_wall9">153.6</span></div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Cyl.liner CW outlet temp.</td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp1">114.2</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp2">117.4</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp3">116.1</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp4">115.6</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp5">116.7</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="cw_outlet_temp6">117.5</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp7">115.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp8">115.2</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="cw_outlet_temp9">113.1</span>°C</div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Scav air temp.</td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="scav_air_temp1">49.5</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="scav_air_temp2">51.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="scav_air_temp3">51.6</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="scav_air_temp4">48.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="scav_air_temp5">51.2</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="scav_air_temp6">51.9</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: '#000'}}><span className="scav_air_temp7">48.4</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: '#000'}}><span className="scav_air_temp8">50.6</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: '#000'}}><span className="scav_air_temp9">51.6</span>°C</div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> PCO. outlet temp.</td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="pco_outlet_temp1">55.4</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="pco_outlet_temp2">57.4</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="pco_outlet_temp3">57.4</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="pco_outlet_temp4">56.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="pco_outlet_temp5">57.7</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="pco_outlet_temp6">55.1</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="pco_outlet_temp7">55.8</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="pco_outlet_temp8">58.9</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="pco_outlet_temp9">55.5</span>°C</div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> PCO. outlet flow.</td>
                                {/!* <td style="width: 6%;text-align:center">   <label class="radio-inline"> <input type="radio" name="optradio" checked> Nonflow</label></td> *!/}
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="pco_outlet_flow1">54.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="pco_outlet_flow2">54.9</span> °C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="pco_outlet_flow3">57.4</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}> <span className="pco_outlet_flow4">55.7</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="pco_outlet_flow5">56.9</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="pco_outlet_flow6">57.4</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: '#000'}}><span className="pco_outlet_flow7">54.3</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: '#000'}}><span className="pco_outlet_flow8">55</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: '#000'}}><span className="pco_outlet_flow9">57.5</span>°C</div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Crosshead bear. temp. (Force) </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}> <span className="crosshead_bear_temp_force1">57.4</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_force2">55</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_force3">51.5</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}> <span className="crosshead_bear_temp_force4">52.7</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_force5">57.9</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_force6">55.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_force7">57.5</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_force8">55</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_force9">55.8</span>°C</div></td>
                            </tr>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Crosshead bear. temp. (AFT) </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft1">48.4</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft2">48.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft3">48</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft4">47.3</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft5">48.2</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft6">47.6</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft7">47.5</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crosshead_bear_temp_aft8">48.9</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: '#000'}}><span className="crosshead_bear_temp_aft9">47.6</span>°C</div></td>
                            </tr>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Crankpin bear temp </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="crankpin_bear_temp1">48.8</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crankpin_bear_temp2">47.2</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crankpin_bear_temp3">48.3</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crankpin_bear_temp4">47.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crankpin_bear_temp5">47.5</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crankpin_bear_temp6">47.9</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crankpin_bear_temp7">48.8</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="crankpin_bear_temp8">47.2</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid #8c8787', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: '#000'}}><span className="crankpin_bear_temp9">47.6</span>°C</div></td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Main bear temp.(Force)</td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="main_bear_temp_force1">48.6</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="main_bear_temp_force2">48.5</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}> <span className="main_bear_temp_force3">48.1</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_force4">47.5</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_force5">47.2</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_force6">48.7</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_force7">47.1</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_force8">48.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_force9">48.5</span>°C</div></td>
                            </tr>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                            <tr>
                                <td style={{textAlign: 'center', width: '25%'}}> Main bear temp.(AFT) </td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft1">56.5</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft2">56.9</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft3">54.7</span>°C</div></td>
                                <td style={{width: '5.2%', textAlign: 'center'}}><div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft4">53.5</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft5">58</span>°C </div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '23%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft6">55.8</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '18%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft7">54.2</span>°C</div></td>
                                <td style={{width: '5.5%', textAlign: 'center'}}> <div style={{border: '2px solid red', borderRadius: '5px', width: '65%', marginLeft: '16%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft8">56.5</span>°C</div></td>
                                <td style={{width: '6%', textAlign: 'center'}}> <div style={{border: '2px solid rgb(140, 135, 135)', borderRadius: '5px', width: '65%', marginLeft: '13%', backgroundColor: 'rgb(0, 0, 0)'}}><span className="main_bear_temp_aft9">53.3</span>°C</div></td>
                            </tr>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                        </tbody>
                    </table>
                </div>
            </div>
        );*/

        return (
            <div>
                <div className="col-sm-12" style={{border: '0px solid'}}>
                    <table id="cylinderWidgetId" className="cylinder-table">
                        <tbody>
                            {this.blankRow({trStyle: {}, tdStyle: {height: '20px'}})}
                            <tr>
                                <td className="cylinder-table-data-first-column"> Exh. gas out temp. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_temp1"> 312.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="exh_gas_out_temp2"> 319.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_temp3"> 311.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_temp4"> 316.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_temp5"> 319.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_temp6"> 317.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_temp7"> 313.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="exh_gas_out_temp8"> 319.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_temp9"> 312.7 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> Exh. gas out dev. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="exh_gas_out_dev1"> -1.6 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_dev2"> -7.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_dev3"> -0.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_dev4"> -3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="exh_gas_out_dev5"> -7.8 </span> °C  </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_dev6"> 3.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_dev7"> -2.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_dev8"> 3.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="exh_gas_out_dev9"> -6 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            {this.blankRow({trStyle: {height: '73px'}, tdStyle: {}})}
                            <tr>
                                <td className="cylinder-table-data-first-column"> Cyl.cover CW outlet temp. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp_1"> 83.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp_2"> 80.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cw_outlet_temp_3"> 84.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp_4"> 83.6 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp_5"> 84.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp_6"> 83.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cw_outlet_temp_7"> 81.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp_8"> 82.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp_9"> 84.9 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> Cyl.liner Wall (Exh.) temp. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="linear_wall_exh_temp1"> 146.1 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="linear_wall_exh_temp2"> 149.5 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="linear_wall_exh_temp3"> 148.7 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="linear_wall_exh_temp4"> 149.9 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="linear_wall_exh_temp5"> 149.7 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="linear_wall_exh_temp6"> 146.5 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="linear_wall_exh_temp7"> 147.6 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="linear_wall_exh_temp8"> 149.8 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="linear_wall_exh_temp9"> 148.6 </span> </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> Cyl.liner Wall (PP) temp. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cyl_linear_wall1"> 153.3 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cyl_linear_wall2"> 154.5 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cyl_linear_wall3"> 151.1 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cyl_linear_wall4"> 153.2 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cyl_linear_wall5"> 151.2 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cyl_linear_wall6"> 152.8 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cyl_linear_wall7"> 154.5 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cyl_linear_wall8"> 151.3 </span> </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cyl_linear_wall9"> 153.6 </span> </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> Cyl.liner CW outlet temp. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp1"> 114.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp2"> 117.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cw_outlet_temp3"> 116.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp4"> 115.6 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cw_outlet_temp5"> 116.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp6"> 117.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp7"> 115.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="cw_outlet_temp8"> 115.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="cw_outlet_temp9"> 113.1 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> Scav air temp. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp1"> 49.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp2"> 51.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp3"> 51.6 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp4"> 48.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp5"> 51.2 </span> °C  </div ></td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp6"> 51.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp7"> 48.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="scav_air_temp8"> 50.6 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="scav_air_temp9"> 51.6 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> PCO. outlet temp. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp1"> 55.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp2"> 57.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp3"> 57.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp4"> 56.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="pco_outlet_temp5"> 57.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp6"> 55.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp7"> 55.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp8"> 58.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_temp9"> 55.5 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> PCO. outlet flow. </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow1"> 54.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="pco_outlet_flow2"> 54.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow3"> 57.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow4"> 55.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow5"> 56.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow6"> 57.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow7"> 54.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow8"> 55 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="pco_outlet_flow9"> 57.5 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            {this.blankRow({trStyle: {height: '22px'}, tdStyle: {}})}
                            <tr>
                                <td className="cylinder-table-data-first-column"> Crosshead bear. temp. (Force) </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="crosshead_bear_temp_force1"> 57.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force2"> 55.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force3"> 51.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force4"> 52.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force5"> 57.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force6"> 55.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force7"> 57.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force8"> 55.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_force9"> 55.8 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                            <tr>
                                <td className="cylinder-table-data-first-column"> Crosshead bear. temp. (AFT) </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft1"> 48.4 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft2"> 48.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="crosshead_bear_temp_aft3"> 48 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft4"> 47.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft5"> 48.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft6"> 47.6 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft7"> 47.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft8"> 48.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crosshead_bear_temp_aft9"> 47.6 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            {this.blankRow({trStyle: {height: '17px'}, tdStyle: {}})}
                            <tr>
                                <td className="cylinder-table-data-first-column"> Crankpin bear temp </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp1"> 48.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="crankpin_bear_temp2"> 47.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp3"> 48.3 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp4"> 47.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp5"> 47.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp6"> 47.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp7"> 48.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp8"> 47.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="crankpin_bear_temp9"> 47.6 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            <tr>
                                <td className="cylinder-table-data-first-column"> Main bear temp.(Force) </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force1"> 48.6 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force2"> 48.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force3"> 48.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force4"> 47.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force5"> 47.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force6"> 48.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force7"> 47.1 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="main_bear_temp_force8"> 48.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_force9"> 48.5 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                            <tr>
                                <td className="cylinder-table-data-first-column"> Main bear temp.(AFT) </td>

                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft1"> 56.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft2"> 56.9 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft3"> 54.7 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-danger"> <span className="main_bear_temp_aft4"> 53.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft5"> 58 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft6"> 55.8 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft7"> 54.2 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft8"> 56.5 </span> °C </div> </td>
                                <td className="cylinder-table-data"> <div className="cylinder-table-data-normal"> <span className="main_bear_temp_aft9"> 53.3 </span> °C </div> </td>

                                <td style={{width: '247px'}}/>
                            </tr>
                            {this.blankRow({trStyle: {}, tdStyle: {}})}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        /*return(
            <div className="col-sm-12" style={{border: '0px solid'}}>
                <table id="cylinderWidgetId" style={{backround: "white", fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif !important', fontSize: '10px', width: '100%'}}>
                    <tbody style={{border: '2px solid rgb(51, 51, 51)'}}>
                        <tr>
                            <td style={{border: '2px solid red'}}>adadasd</td>
                            <td style={{border: '2px solid red'}}>adadasd</td>
                            <td style={{border: '2px solid red'}}>adadasd</td>
                            <td style={{border: '2px solid red'}}>adadasd</td>
                            <td style={{border: '2px solid red'}}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )*/
    }
}

export default CylinderWidget;

/*
* defaults for react-grid
* height:42.6
* width:12
* */
