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
                            <th className="tableColumnAdjustment">From Current Time</th>
                            <tbody>
                                <tr>
                                    <td>+6hrs</td>
                                    <td>+12hrs</td>
                                    <td>+18hrs</td>
                                    <td>+24hrs</td>
                                    <td>+30hrs</td>
                                    <td>+36hrs</td>
                                    <td>+42hrs</td>
                                    <td>+48hrs</td>
                                    <td>+54hrs</td>
                                    <td>+60hrs</td>
                                    <td>+66hrs</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Lat</th>
                            <tbody>
                                <tr>
                                    <td>24.98</td>
                                    <td>25.03</td>
                                    <td>21.06</td>
                                    <td>22.04</td>
                                    <td>25.14</td>
                                    <td>25.14</td>
                                    <td>25.14</td>
                                    <td>25.14</td>
                                    <td>25.14</td>
                                    <td>25.14</td>
                                    <td>25.14</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Long</th>
                            <tbody>
                                <tr>
                                    <td>55.03</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                    <td>57.08</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Water Temperature</th>
                            <tbody>
                                <tr>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                    <td>26.02</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wave Direction</th>
                            <tbody>
                            <tr>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Lat</th>
                            <tbody>
                            <tr>
                                <td>24.98</td>
                                <td>25.03</td>
                                <td>21.06</td>
                                <td>22.04</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Long</th>
                            <tbody>
                            <tr>
                                <td>55.03</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Water Temperature</th>
                            <tbody>
                            <tr>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wave Direction</th>
                            <tbody>
                            <tr>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Lat</th>
                            <tbody>
                            <tr>
                                <td>24.98</td>
                                <td>25.03</td>
                                <td>21.06</td>
                                <td>22.04</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Long</th>
                            <tbody>
                            <tr>
                                <td>55.03</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Water Temperature</th>
                            <tbody>
                            <tr>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wave Direction</th>
                            <tbody>
                            <tr>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Lat</th>
                            <tbody>
                            <tr>
                                <td>24.98</td>
                                <td>25.03</td>
                                <td>21.06</td>
                                <td>22.04</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                                <td>25.14</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Long</th>
                            <tbody>
                            <tr>
                                <td>55.03</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                                <td>57.08</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Water Temperature</th>
                            <tbody>
                            <tr>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                                <td>26.02</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wave Direction</th>
                            <tbody>
                            <tr>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                                <td>319.9</td>
                            </tr>
                            </tbody>
                        </tr>
                        {/*<tr>
                            <th className="tableColumnAdjustment">Wave Height</th>
                            <tbody>
                                <tr>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                    <td>0.5</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wind Wave Direction</th>
                            <tbody>
                                <tr>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                    <td>315.94</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wind Wave Height</th>
                            <tbody>
                                <tr>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                    <td>0.24</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Swell Direction</th>
                            <tbody>
                                <tr>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                    <td>320.01</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Swell Height</th>
                            <tbody>
                                <tr>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                    <td>0.44</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wind Speed</th>
                            <tbody>
                                <tr>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                    <td>4.64</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Wind Direction</th>
                            <tbody>
                                <tr>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                    <td>318.04</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Guest I</th>
                            <tbody>
                                <tr>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                    <td>5.99</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Cloud Cover</th>
                            <tbody>
                                <tr>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Pressure</th>
                            <tbody>
                                <tr>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                    <td>1012.05</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Visibility</th>
                            <tbody>
                                <tr>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                    <td>24.14</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Sea Level</th>
                            <tbody>
                            <tr>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                                <td>0.05</td>
                            </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Current Speed</th>
                            <tbody>
                                <tr>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                    <td>0.28</td>
                                </tr>
                            </tbody>
                        </tr>
                        <tr>
                            <th className="tableColumnAdjustment">Current Direction</th>
                            <tbody>
                                <tr>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                    <td>330.09</td>
                                </tr>
                            </tbody>
                        </tr>*/}
                    </thead>
                </Table>
            </CustomScrollBar>
        );
    }
}

export default CustomTable;