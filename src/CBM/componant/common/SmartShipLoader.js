import React, {Component} from "react";
import {Spinner} from "react-bootstrap";


const SmartShipLoader = ({isVisible}) => {
    return (
        isVisible && (
            <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: "#cccccccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2
            }}>
                <Spinner animation="grow" variant="secondary" />
            </div>
        )
    )
};

export default SmartShipLoader;
