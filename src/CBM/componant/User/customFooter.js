import React from "react";


export default function CustomFooter({title = "Powered by Smart Ship Hub Pte.Ltd. @2022"})

{
    return (
        <div style={{
            position: "fixed",
            left: "0px",
            right: "0px",
            bottom: "0px",
            height: "60px",
            zIndex:9999
        }}>
            <div style={{
                textAlign:"center",
                color:"brown",
                width:"100%",
                height:"100%",
                backgroundColor: "#1B1C1D"
            }}>
                <div className="headerBackground" style={{
                    display:"flex",
                    textAlign: "right",
                    flexDirection: "column",
                    padding: "15px"
                }} >
                    <span><a href="https://www.smartshiphub.com" style={{"text-decoration": "none","color": "#000000"}} target="_blank">{title}</a></span>
                </div>


            </div>

        </div>
    );
}
