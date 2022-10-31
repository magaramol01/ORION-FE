import React, {Component} from "react";


class CustomAlert extends Component {

    constructor(props) {
        super(props);
        this.alertRef = React.createRef();
        this.state = {
            type: "error",
            message: "",
            alertTop: 500,
            show: false
        };
        this.hideInterval = null;
    }

    componentDidMount() {
        this.hideInterval = setInterval(this.hideAlert, 3000);
    }

    hideAlert = () => {
        //debugger
        clearInterval(this.hideInterval);
        this.setState({
            alertTop: 0
        }, () => {
            setTimeout(() => {
                //debugger
                this.setState({
                    show: false
                })
            }, 200)
        })
    };

    showAlert = ({
        type,
        message
                 }) => {
        this.setState({
            type,
            message,
            show: true,
            alertTop: 500
        }, () => {
            clearInterval(this.hideInterval);
            this.hideInterval = setInterval(this.hideAlert, 3000);
        })
    };

    render() {
        const {
            type,
            show,
            message,
            alertTop
        } = this.state;
        let alertClass = "alert-danger";
        if(type === "success") {
            alertClass = "alert-success"
        }
        return (
            <div>
                {
                    show && (<div
                        ref={this.alertRef}
                        className={`cg-notify-message cg-notify-message-center ${alertClass}`}
                        style={{
                            marginLeft: -82,
                            top: alertTop,
                            marginTop: -490,
                            visibility: "visible"
                        }}>
                        <div>
                            {message}
                        </div>
                        <button type="button" className="cg-notify-close" onClick={this.hideAlert}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>)
                }
            </div>
        );
    }
}


export default CustomAlert;
