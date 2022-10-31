import React from "react";
import {ProgressBar} from "react-bootstrap";

const CustomProgressBar = ({percentageValue}) => {
    return (
        <div className="smarship-progreess-wrapper">
            <ProgressBar
                variant="success"
                now={percentageValue}
                height={1}
                // label="70%"
            />
        </div>
    )
};

export default CustomProgressBar
