import _ from "lodash";
import React from "react";
import CustomScrollBar from "./CustomScrollBar";
import {Col, Form} from "react-bootstrap";
import {getItemFromLocalStorage} from "../common/helper";

class FleetDashboardAllVesselsFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dashboardRef: props.dashboardRef,
            isSelectAll: true,
            vesselUncheckedArr: [],
            allVesselsData: []
        };

        this.onSelectAllVesselsCheckboxValueChange = this.onSelectAllVesselsCheckboxValueChange.bind(this);
        this.onIndividualVesselCheckboxValueChange = this.onIndividualVesselCheckboxValueChange.bind(this);
    }

    componentDidMount() {
        debugger
        this.setState({allVesselsData: getItemFromLocalStorage("ssAppAllVesselsData")});
        console.log(this.state.allVesselsData);
    }

    onSelectAllVesselsCheckboxValueChange() {
        const isSelectAll = this.state.isSelectAll;
        let vesselUncheckedArr = [];

        if (isSelectAll) {
            _.map(this.state.allVesselsData, (obj, vesselData) => {
                vesselUncheckedArr.push(obj.id)
            });
        } else {
            vesselUncheckedArr = [];
        }

        this.setState({
            isSelectAll: !isSelectAll,
            vesselUncheckedArr: vesselUncheckedArr
        });

        this.triggerParameterFilterChange(vesselUncheckedArr);
    }

    onIndividualVesselCheckboxValueChange(event) {
        debugger
        const isChecked = event.target.checked;
        let vesselUncheckedArr = this.state.vesselUncheckedArr;
        const vesselId = parseInt(event.target.name);

        if (isChecked) {
            vesselUncheckedArr = vesselUncheckedArr.filter(item => item !== vesselId);
        } else {
            vesselUncheckedArr.push(vesselId);
        }
        this.setState({
            vesselUncheckedArr: vesselUncheckedArr,
            isSelectAll: vesselUncheckedArr.length === 0
        });

        this.triggerParameterFilterChange(vesselUncheckedArr);
    }

    triggerParameterFilterChange(vesselUncheckedArr) {
        if (this.state.dashboardRef.handleOnVesselFilterChange) {
            this.state.dashboardRef.handleOnVesselFilterChange(vesselUncheckedArr);
        }
        if(this.state.dashboardRef.handleOnVesselFilterChangeForWindy) {
            this.state.dashboardRef.handleOnVesselFilterChangeForWindy(vesselUncheckedArr);
        }
    }

    getVesselsCheckBoxUI(allVesselsData, vesselUncheckedArr) {
        return _.map(allVesselsData, (vesselData) => {
            const vesselId = vesselData.id;
            const vesselName = vesselData.Name;

            return (
                <Form.Group size="sm" as={Col} key={"filter" + vesselName + vesselId}>
                    <Form.Check
                        type="checkbox"
                        label={vesselName}
                        name={vesselId}
                        checked={!vesselUncheckedArr.includes(vesselId)}
                        onChange={this.onIndividualVesselCheckboxValueChange}
                    />
                </Form.Group>
            );
        });
    }

    render() {
        const {isSelectAll, vesselUncheckedArr, allVesselsData} = this.state;

        return (
            <div style={{height: "100%", paddingTop: "5px"}}>
                {/*<Form.Group size="sm" as={Col}>*/}
                <div style={{display:'flex',justifyContent:'space-between',paddingLeft:'10px',paddingRight:'10px'}}>
                    <div style={{float:'left'}}>Vessels :</div>
                    <div style={{display:'flex'}}>
                        <div className="customSwitch" style={{flex: "right"}}>
                            <input
                                type="checkbox"
                                checked={isSelectAll}
                                name="selectAllVessels"
                                data-key="selectAllVessels"
                                className={"customSwitch customSwitchInput"}
                                id="selectAllVessels"
                                onChange={this.onSelectAllVesselsCheckboxValueChange}
                            />
                            <label className="customSwitchLabel customSwitchToggle" htmlFor="selectAllVessels"/>
                        </div>
                        <div style={{float:'right',fontSize:'17px'}}><b>All</b></div>
                    </div>
                </div>
                {/*</Form.Group>*/}
                <CustomScrollBar height={"90%"} width={"auto"}>
                    {
                        this.getVesselsCheckBoxUI(allVesselsData, vesselUncheckedArr)
                    }
                </CustomScrollBar>
            </div>
        );
    }
}

export default FleetDashboardAllVesselsFilter;