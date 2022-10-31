import React from "react";
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class CustomLoader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShow: false
        }
    }

    render() {
        return (
            <Loader className="custom-loader"
                    visible={true}
                    type="Bars"
                    color="#00BFFF"
                    height={50}
                    width={50}
                    timeout={300000}

            />
        );
    }
}

export default CustomLoader;
