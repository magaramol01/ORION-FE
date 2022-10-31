import React from "react";
import SMSidebar from "../../SMSidebar";
import NavigationBar from "../../CBM/componant/common/NavigationBar";


import ReportTable from "./ReportTable";
// import Table from "./Table"
// import { Filter } from "./Filter";
// import { Table } from "react-bootstrap";



const ReportPage = (props)=> {

         return  (
            <>
            <SMSidebar history={props.history} screenPath={"/ReportPage"}>
                <div className="smartShipBody d-flex flex-column vh-100 ">
                    <NavigationBar 
                       title={"Technical Advisory Reports "}/>
                      
                    <div style={{"height":"100%"}}>
            
                    <ReportTable/> 
                   
                
                
                    </div>
                </div>
            </SMSidebar>
   
    </>
        )
  
}

export default ReportPage;