import React, {Component} from 'react';
import {addShipNameToSession, getAllShips} from "../../../api";
import {Button, Col, Form} from 'react-bootstrap';
import SmartShipLoader from "./SmartShipLoader";
import NavigationBar from "./NavigationBar";
import Select from "react-select";
import {setItemInLocalStorage} from "../../../RTCM/common/helper";

const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
    },
    borderRadius: 2,
    baseUnit: 1,
    controlHeight: 35,
    fontSize: 14
});

class ShipsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            shipsList: [],
            selectedShipName: null
        }
    }

    componentDidMount() {
        getAllShips(this.onGetAllElementsSuccess,this.onGetAllElementsFailure);
    }

    onGetAllElementsSuccess = (response) => {
        if(response.data.ShipName==='no ship') {
            this.props.history.push({
                pathname: '/',
            })
        }else{
            let shipNameArray = [];
            let array = response.data.ShipName;
            for(let i=0;i<array.length;i++){
                let obj = {};
                obj['label']=array[i];
                obj['value']=array[i];
                shipNameArray.push(obj);
            }
            this.setState({
                loading: false,
                shipsList: shipNameArray
            })
        }
    };
    onGetAllElementsFailure = (error) => {
        this.setState({
            loading: false
        })
    };

    onDropdownSingleValueChange = (e) => {
        const shipName = e.value;
        this.setState({selectedShipName: shipName});
        setItemInLocalStorage("shipName", shipName);
    };

    onShowClick = ()=> {
        addShipNameToSession(this.onElementsSuccess,this.onElementsFailure,{shipName:this.state.selectedShipName});
    };

    onElementsSuccess = (response) => {
        this.props.history.push({
            pathname: '/DashboardHome'
        })
    };

    onElementsFailure = (error) => {
        this.setState({
            loading: false
        })
    };
    render() {
        const { loading,shipsList} = {...this.state};
        return(
                <div className="smartShipBody d-flex flex-column vh-100">
                    <SmartShipLoader isVisible={loading}/>
                    <NavigationBar
                        title={"Select Ship"}/>
                    <div
                        className="d-flex justify-content-center pt-5 overflow-auto cbm-wrapper"
                        xs={12} md={12} lg={12}
                    >
                        <Form.Group size="sm" as={Col}>
                            <Select
                                theme={theme}
                                options={shipsList}
                                name="shipName"
                                onChange={this.onDropdownSingleValueChange}
                                isMulti={false}
                                closeMenuOnSelect={true}
                            />
                        </Form.Group>
                        <Button
                            size="sm"
                            className="parameter-add-button"
                            onClick={this.onShowClick}
                            variant="outline-secondary"
                        >
                            Show
                        </Button>
                    </div>
                </div>
        );
    }
}
export default ShipsList;
