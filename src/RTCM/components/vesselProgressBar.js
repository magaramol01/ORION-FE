import React, {Component} from "react";
import "react-step-progress-bar/styles.css";
import {ProgressBar, Step} from "react-step-progress-bar";

class VesselProgressBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: this.props.element
        };
    }

    render() {

        return (
            <div>
                <div style={{marginLeft: '10px', marginRight: '10px'}}>
                    <div style={{padding: '20px', marginTop: "23px"}}>
                        <ProgressBar
                            stepPositions={[0, 10, 70, 100]}
                            text={"70%"}
                            percent={70}
                            // filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
                            // filledBackground="linear-gradient(to right, #f0bb31, #299c46)"
                            filledBackground="linear-gradient(to right, #299c46, #299c46)"
                            unfilledBackground="#161719"
                            style={{marginTop: "25px"}}
                        >
                            <Step transition="scale">
                                {({accomplished}) => (
                                    <div style={{textAlign: "center"}}>
                                        <div style={{
                                            paddingBottom: "8px",
                                            whiteSpace: "nowrap"
                                        }}>BR SFS
                                        </div>
                                        <div style={{paddingBottom: "28px"}}>
                                            <i className="fa fa-anchor" style={{fontSize: "17px"}}/>
                                        </div>
                                    </div>
                                )}
                            </Step>
                            <Step transition="scale">
                                {({accomplished}) => (
                                    <div style={{textAlign: "center"}}>
                                        <div style={{
                                            paddingBottom: "8px",
                                            whiteSpace: "nowrap"
                                        }}>AF BIN
                                        </div>
                                        <div style={{paddingBottom: "28px"}}>
                                            <i className="fa fa-anchor" style={{fontSize: "17px"}}/>
                                        </div>
                                    </div>
                                )}
                            </Step>
                            <Step transition="scale">
                                {({accomplished}) => (
                                    <div style={{textAlign: "center"}}>
                                        <div style={{
                                            paddingBottom: "8px",
                                            whiteSpace: "nowrap"
                                        }}>CCN
                                        </div>
                                        <div style={{paddingBottom: "28px"}}>
                                            <i className="fa fa-anchor" style={{fontSize: "17px"}}/>
                                        </div>
                                    </div>
                                )}
                            </Step>
                            <Step transition="scale">
                                {({accomplished}) => (
                                    <div style={{textAlign: "center"}}>
                                        <div style={{
                                            paddingBottom: "8px",
                                            whiteSpace: "nowrap"
                                        }}>PLZ
                                        </div>
                                        <div style={{paddingBottom: "28px"}}>
                                            <i className="fa fa-anchor" style={{fontSize: "17px"}}/>
                                        </div>
                                    </div>
                                )}
                            </Step>
                        </ProgressBar>
                    </div>
                </div>
            </div>
        )
    }
}

export default VesselProgressBar;
