import React, { Component } from "react";
class NoonReportData extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div id="overlay">

                <table id="tblNoonReportData" className="table" style={{ color: '#fff' }}>
                    <tr>
                        <td></td>
                        <td> <span>China express</span></td>
                        <td> <span>V2103-L</span></td>
                        <td><span>Rio Grande</span></td>
                        <td><span>ETA</span></td>
                        <td><span>1000</span></td>
                        <td><span>UTC</span></td>
                    </tr>
                </table>

                {/* <div className="row">
                    <div className="col-lg-2" style={{marginLeft:'16px',textAlign:'center'}}>
                        <span style={{fontSize:'12px'}}>China express</span>
                    </div>
                    <div className="col-lg-2" style={{marginLeft:'6px'}}>
                        <span style={{fontSize:'12px', textAlign:'center'}}>V2103-L</span>
                    </div>
                    <div className="col-lg-2">
                        <span style={{fontSize:'12px',textAlign:'center'}}>Rio Grande</span>
                    </div>
                    <div className="col-lg-2">
                        <span style={{fontSize:'12px'}}>ETA</span>
                    </div>
                    <div className="col-lg-2">
                        <span style={{fontSize:'12px',textAlign:'center'}}>1000</span>
                    </div>
                    <div className="col-lg-1">
                        <span style={{fontSize:'12px',textAlign:'center'}}>UTC</span>
                    </div>
                </div>
           */}
            </div>
        )
    }
}
export default NoonReportData;