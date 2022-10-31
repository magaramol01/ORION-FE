import React from "react";
import ReactTooltip from 'react-tooltip';


const CustomTooltip = ({
                           description,
                           label,
                           customKey
                       }) =>  {
    return (
        <div className={"custom_tootltip"} key={customKey} style={{cursor: "pointer"}}>
            <div style={{margin: 2}}>
                <ReactTooltip/>
                <div style={{
                    backgroundColor: "transparent",
                    border: "2px solid #dee2e6",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    paddingLeft: 5,
                    paddingRight: 5,
                }}
                     data-tip={description}
                     data-multiline={true}
                     // data-place={"right"}
                >{`${label}`}</div>
            </div>
        </div>
    )
};

export default CustomTooltip;
