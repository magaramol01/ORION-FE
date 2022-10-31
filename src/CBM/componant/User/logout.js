import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {isLoggedOut} from "./isLoggedOut";
import SmartShipLoader from "../common/SmartShipLoader";

class Logout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            status: false,
        };
    }

    onSuccess = (res) => {
       // console.log(res);
    };


    onFailure = (err) => {
        //console.log(err);
    };

    logout = async () => {
        let status = await isLoggedOut().then(r => {
            if (r) {
                this.setState({status: true});
            } else {
                this.setState({status: false})
            }
        });
    };

    componentDidMount() {
        this.logout();
    }

    render() {
        if (this.state.status) {
            return (<Redirect to="/UserLogin"/>);
        }

        return (
            <div style={{
                height: "100vh"
            }}>
                <SmartShipLoader isVisible={this.state.loading}/>
            </div>

        );

    }

}

export default Logout;

