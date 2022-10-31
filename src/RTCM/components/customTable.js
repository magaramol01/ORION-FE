import React, {Component} from "react";
import {Table} from "react-bootstrap";
import CustomScrollBar from "./CustomScrollBar";

class CustomTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            containerHeight: this.props.height,
            containerWidth: this.props.width
        };
    }

    render() {

        return (
            <CustomScrollBar height={this.state.containerHeight} width={this.state.containerHeight}>
                <Table variant="dark" size="sm">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Company</th>
                            <th>Domain</th>
                            <th>Revenue</th>
                        </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Dimentrix</td>
                        <td>Software</td>
                        <td>$100M</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Smart Ship</td>
                        <td>Vessel</td>
                        <td>$1000M</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>HPS</td>
                        <td>Health</td>
                        <td>$2M</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Dimentrix</td>
                        <td>Software</td>
                        <td>$100M</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Smart Ship</td>
                        <td>Vessel</td>
                        <td>$1000M</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>HPS</td>
                        <td>Health</td>
                        <td>$2M</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Dimentrix</td>
                        <td>Software</td>
                        <td>$100M</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Smart Ship</td>
                        <td>Vessel</td>
                        <td>$1000M</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>HPS</td>
                        <td>Health</td>
                        <td>$2M</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Dimentrix</td>
                        <td>Software</td>
                        <td>$100M</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Smart Ship</td>
                        <td>Vessel</td>
                        <td>$1000M</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>HPS</td>
                        <td>Health</td>
                        <td>$2M</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Dimentrix</td>
                        <td>Software</td>
                        <td>$100M</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Smart Ship</td>
                        <td>Vessel</td>
                        <td>$1000M</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>HPS</td>
                        <td>Health</td>
                        <td>$2M</td>
                    </tr>
                    </tbody>
                </Table>
            </CustomScrollBar>
        );
    }
}

export default CustomTable;
