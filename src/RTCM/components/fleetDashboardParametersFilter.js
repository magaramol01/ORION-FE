import _ from "lodash";
import React from "react";
import CustomScrollBar from "./CustomScrollBar";
import {Col, Form} from "react-bootstrap";
import {getFleetDashboardParametersFilterData} from "../../api";

class FleetDashboardParametersFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dashboardRef: props.dashboardRef,
            isSelectAll: false,
            parametersList: {},
            parametersUncheckedArr: []
        };

        this.onFetchParametersFilterDataSuccess = this.onFetchParametersFilterDataSuccess.bind(this);
        this.onFetchParametersFilterDataFailure = this.onFetchParametersFilterDataFailure.bind(this);
        this.onSelectAllParametersCheckboxValueChange = this.onSelectAllParametersCheckboxValueChange.bind(this);
        this.onIndividualParameterCheckboxValueChange = this.onIndividualParameterCheckboxValueChange.bind(this);
    }

    componentDidMount() {
        this.fetchParametersFilterData();
    }

    fetchParametersFilterData() {
        getFleetDashboardParametersFilterData(this.onFetchParametersFilterDataSuccess, this.onFetchParametersFilterDataFailure)
    }

    onFetchParametersFilterDataSuccess(response) {
        if (response && response.data) {
            let allParameterList = response.data;
            this.setState({parametersList: allParameterList});

            let uncheckedArray = [];
            for(let i =0 ;i<Object.keys(allParameterList).length; i++){
                if(!allParameterList[Object.keys(allParameterList)[i]].defaultChecked){
                    uncheckedArray.push(allParameterList[Object.keys(allParameterList)[i]].modbusTag);
                }
            }
            this.setState({parametersUncheckedArr:uncheckedArray})
        }
    }

    onFetchParametersFilterDataFailure() {
        this.setState({parametersList: {}})
    }

    onSelectAllParametersCheckboxValueChange() {
        const isSelectAll = this.state.isSelectAll;
        let parametersUncheckedArr = [];

        if (isSelectAll) {
            _.map(this.state.parametersList, (obj, parameterLabel) => {
                parametersUncheckedArr.push(obj.modbusTag)
            });
        } else {
            parametersUncheckedArr = [];
        }

        this.setState({
            isSelectAll: !isSelectAll,
            parametersUncheckedArr: parametersUncheckedArr
        });

        this.triggerParameterFilterChange(parametersUncheckedArr);
    }

    onIndividualParameterCheckboxValueChange(event) {
        const isChecked = event.target.checked;
        let parametersUncheckedArr = this.state.parametersUncheckedArr;

        if (!isChecked) {
            parametersUncheckedArr.push(event.target.name);
        } else {
            parametersUncheckedArr = parametersUncheckedArr.filter(item => item !== event.target.name);
        }
        this.setState({parametersUncheckedArr: parametersUncheckedArr});

        this.triggerParameterFilterChange(parametersUncheckedArr);
    }

    triggerParameterFilterChange(parametersUncheckedArr) {
        if (this.state.dashboardRef.handleOnParameterFilterChange) {
            this.state.dashboardRef.handleOnParameterFilterChange(parametersUncheckedArr);
        }
    }

    render() {
        const {isSelectAll, parametersList, parametersUncheckedArr} = this.state;

        return (
            <div style={{height: "100%", paddingTop: "5px"}}>
                {/*<Form.Group size="sm" as={Col}>*/}
                <div style={{display:'flex',justifyContent:'space-between',paddingLeft:'10px',paddingRight:'10px'}}>
                    <div style={{float:'left'}}>Parameters :</div>
                    <div style={{display:'flex'}}>
                        <div className="customSwitch" style={{flex: "right"}}>
                            <input
                                type="checkbox"
                                checked={isSelectAll}
                                name="selectAllParameters"
                                data-key="selectAllParameters"
                                className={"customSwitch customSwitchInput"}
                                id="selectAllParameters"
                                onChange={this.onSelectAllParametersCheckboxValueChange}
                            />
                            <label className="customSwitchLabel customSwitchToggle" htmlFor="selectAllParameters"/>
                        </div>
                        <div style={{float:'right',fontSize:'17px'}}><b>All</b></div>
                    </div>
                </div>
                {/*</Form.Group>*/}
                <CustomScrollBar height={"93%"} width={"auto"}>
                    {
                        parametersList && _.map(parametersList, (obj, parameterLabel) => {
                            const modbusTag = obj.modbusTag;

                            return (
                                <Form.Group size="sm" as={Col} key={"filter" + modbusTag + parameterLabel}>
                                    <Form.Check
                                        type="checkbox"
                                        label={parameterLabel}
                                        name={modbusTag}
                                        checked={!parametersUncheckedArr.includes(modbusTag)}
                                        onChange={this.onIndividualParameterCheckboxValueChange}
                                    />
                                </Form.Group>
                            )
                        })
                    }
                </CustomScrollBar>
            </div>
        );
    }
}

export default FleetDashboardParametersFilter;