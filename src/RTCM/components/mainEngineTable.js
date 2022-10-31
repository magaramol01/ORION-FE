import React from "react";
import {Table} from "react-bootstrap";
import CustomScrollBar from "./CustomScrollBar";

function TableType1(props) {
    return (
        <Table variant="dark" size="sm">
            <thead>
            <tr>
                <th>TC</th>
                <th>LO Inlet Press</th>
                <th>LO Outlet Temp</th>
            </tr>
            </thead>

            <tbody>
            <tr>
                <td>NO.1</td>
                <td>1.88 bar</td>
                <td>74.3°C</td>
            </tr>
            <tr>
                <td>NO.2</td>
                <td>1.48 bar</td>
                <td>74.8°C</td>
            </tr>
            <tr>
                <td>NO.3</td>
                <td>1.35 bar</td>
                <td>74.8°C</td>
            </tr>
            </tbody>
        </Table>
    );
}

function TableType2(props) {
    return (
        <Table variant="dark" size="sm">
            <thead>
            <tr>
                <th>TC</th>
                <th>Exh. Gas Before</th>
                <th>Exh. Gas After</th>
            </tr>
            </thead>

            <tbody>
            <tr>
                <td>NO.1</td>
                <td>1.88 bar</td>
                <td>74.3°C</td>
            </tr>
            <tr>
                <td>NO.2</td>
                <td>368.8°C</td>
                <td>370.8°C</td>
            </tr>
            <tr>
                <td>NO.3</td>
                <td>374.8°C</td>
                <td>379.8°C</td>
            </tr>
            </tbody>
        </Table>
    );
}

function TableType3(props) {
     return (
         <CustomScrollBar height={"140px"} width={"auto"}>
            <Table variant="dark" size="sm">
             <thead>
             <tr>
                 <th/>
                 <th>Press</th>
                 <th>Temp</th>
             </tr>
             </thead>

             <tbody>
             <tr>
                 <td>FO inlet</td>
                 <td>7.56 bar</td>
                 <td>90.9°C</td>
             </tr>
             <tr>
                 <td>LO inlet</td>
                 <td>1.36 bar</td>
                 <td>42.3°C</td>
             </tr>
             <tr>
                 <td>Scav. air</td>
                 <td>1.63 bar</td>
                 <td>45.4°C</td>
             </tr>
             <tr>
                 <td>JCW inlet</td>
                 <td>6.4 bar</td>
                 <td>77.1°C</td>
             </tr>
             <tr>
                 <td>JCW outlet</td>
                 <td>16 bar</td>
                 <td/>
             </tr>
             <tr>
                 <td>Start. air</td>
                 <td>23.1 bar</td>
                 <td/>
             </tr>
             <tr>
                 <td>Control air</td>
                 <td>5.7 bar</td>
                 <td/>
             </tr>
             <tr>
                 <td>Air Spring</td>
                 <td>6.6 bar</td>
                 <td/>
             </tr>
             </tbody>
         </Table>
         </CustomScrollBar>
     );
}

function TableType4(props) {
     return (
         <CustomScrollBar height={"140px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
             <tbody>
             <tr>
                 <td><div>ME RPM</div></td>
                 <td>77.22rpm</td>
             </tr>
             <tr>
                 <td><div>ME POWER</div></td>
                 <td>33915.1KW</td>
             </tr>
             <tr>
                 <td><div>ME LOAD</div></td>
                 <td>65.8%</td>
             </tr>
             <tr>
                 <td><div>ME CONSUME</div></td>
                 <td>5852°C</td>
             </tr>
             </tbody>
         </Table>
         </CustomScrollBar>
     );
}

function TableType5(props) {
     return (
         <CustomScrollBar height={"140px"} width={"auto"}>
            <Table variant="dark" size="sm" className="table-dark-first-column-as-header">
             <tbody>
             <tr>
                 <td><div>HPS bearing temp.</div></td>
                 <td>56.9°C</td>
             </tr>
             <tr>
                 <td><div>Thrust pad temp.</div></td>
                 <td>62.0°C</td>
             </tr>
             <tr>
                 <td><div>Thrust radial bear temp.</div></td>
                 <td>61.0°C</td>
             </tr>
             <tr>
                 <td><div>Inter shaft I bear temp.</div></td>
                 <td>63.4°C</td>
             </tr>
             <tr>
                 <td><div>Inter shaft II bear temp.</div></td>
                 <td>8.6°C</td>
             </tr>
             <tr>
                 <td><div>ST fore bear temp.</div></td>
                 <td>61.9°C</td>
             </tr>
             <tr>
                 <td><div>ST after bear temp.</div></td>
                 <td>63.0°C</td>
             </tr>
             <tr>
                 <td><div>Axial vibration</div></td>
                 <td>43.mm</td>
             </tr>
             </tbody>
         </Table>
         </CustomScrollBar>
     );
}

class MainEngineTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            containerHeight: this.props.height,
            containerWidth: this.props.width,
            element: this.props.element
        };
    }

    render() {
        let table;
        const tableType = this.state.element.configuration.body.tableType;
        switch (tableType) {
            case "type1":
                table = TableType1();
                break;
            case "type2":
                table = TableType2();
                break;
            case "type3":
                table = TableType3();
                break;
            case "type4":
                table = TableType4();
                break;
            case "type5":
                table = TableType5();
                break;
            default:
                table = TableType1();
                break;
        }

        return (
            <div style={{padding: '1px'}}>
                    {table}
            </div>
        );
    };

}

export default MainEngineTable;
