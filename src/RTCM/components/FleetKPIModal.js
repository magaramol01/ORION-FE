import React from "react";
import { Modal } from "react-bootstrap";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 200 },
    { name: 'Group C', value: 200 },
    { name: 'Group D', value: 100 },
    { name: 'Group E', value: 100 },
];
const data1 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 200 },
    { name: 'Group C', value: 200 },
    { name: 'Group D', value: 100 },
    { name: 'Group E', value: 100 },
];

const COLORS = ['#FDFF70', '#F3D23D', '#FF7079', '#187E08', '#56F33D'];

const FleetKPIModal = (props) => {
  return (
    <Modal
      id="modelCII"
      size="xl"
      show={props.isShow}
      onHide={props.onHide}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#6d6d6c" }}>FLEET KPI's</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="config-form-block"
          style={{ backgroundColor: "#101012" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-5">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label style={{ fontSize: "16px" }}>
                          YTD Fleet CII
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="curuncy">
                          20 Feb 2022 - 20 Feb 2021
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <div className="row">
                          <div className="col-md-10">
                            <label className="amountHV ytdAmt">
                              16.3 % <i class="fa fa-long-arrow-up upArow"></i>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <PieChart
                      width={200}
                      height={180}
                    //   onMouseEnter={this.onPieEnter}
                    >
                      <Pie
                        data={data}
                        cx={80}
                        cy={80}
                        innerRadius={40}
                        outerRadius={60}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                        <label value="B" position="center" />
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="col-md-2">
                    <div className="row">
                      <div className="col-md-12">
                        <span style={{ color: "#fff" }}>Ship Grade</span>
                      </div>
                      <div className="col-md-12 mt16">
                        <span
                          id="spnCii"
                          style={{
                            backgroundColor: "#FDFF70",
                            marginLeft: "10px",
                          }}
                        >
                          A
                        </span>
                      </div>
                      <div className="col-md-12 mt16">
                        <span
                          id="spnCii"
                          style={{
                            backgroundColor: "#F3D23D",
                            marginLeft: "10px",
                          }}
                        >
                          B
                        </span>
                      </div>
                      <div className="col-md-12 mt16">
                        <span
                          id="spnCii"
                          style={{
                            backgroundColor: "#FF7079",
                            marginLeft: "10px",
                          }}
                        >
                          C
                        </span>
                      </div>
                      <div className="col-md-12 mt16">
                        <span
                          id="spnCii"
                          style={{
                            backgroundColor: "#187E08",
                            marginLeft: "10px",
                          }}
                        >
                          D
                        </span>
                      </div>
                      <div className="col-md-12 mt16">
                        <span
                          id="spnCii"
                          style={{
                            backgroundColor: "#56F33D",
                            marginLeft: "10px",
                          }}
                        >
                          E
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6" style={{ left: "18px" }}>
                <div className="row">
                  <div className="customGrid col-md-12">
                    <label style={{ fontSize: "16px" }}>Factors YTD</label>
                  </div>
                </div>
                <div className="row">
                  <div className="customGrid col-md-12">
                    <label className="curuncy">20 Feb 2022 - 20 Feb 2021</label>
                  </div>
                </div>
                <div className="row">
                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label>RPM/Power optimization</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="fytdValue">5%</label>
                      </div>
                    </div>
                  </div>
                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label>JIT Arrival</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="fytdValue">12%</label>
                      </div>
                    </div>
                  </div>

                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label>Hull & Propeller</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="fytdValue">N/A</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <div className="amountDes">
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="curuncy">USD</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="curuncy">CO</label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="amount">800K</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="amount">45K</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <div className="amountDes">
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="curuncy">USD</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="curuncy">CO</label>
                            </div>
                          </div>

                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="amount">1700K</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="amount">120K</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <div className="amountDes">
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="curuncy">USD</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="curuncy">CO</label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="amount">N/A</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="amount">N/A</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt32">
                  <div className="customGrid col-md-12">
                    <div className="amountDesF mt16">
                      <div className="row">
                        <div className="customGrid col-md-12 mt8">
                          <label>Achievable CII: B XX.X</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="customGrid col-md-12">
                    <label style={{ fontSize: "12px" }}>
                      {" "}
                      Regular Restriction Impact Forecast
                    </label>
                  </div>
                </div>
                <div className="row mt8">
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-12">
                        <label>2023</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <PieChart
                          width={80}
                          height={80}
                        //   onMouseEnter={this.onPieEnter}
                        >
                          <Pie
                            data={data1}
                            cx={30}
                            cy={30}
                            innerRadius={20}
                            outerRadius={30}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {data.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                            <label value="B" position="center" />
                          </Pie>
                        </PieChart>
                      </div>
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#FDFF70" }}
                            >
                              A
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#F3D23D" }}
                            >
                              B
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#FF7079" }}
                            >
                              C
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#187E08" }}
                            >
                              D
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#56F33D" }}
                            >
                              E
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-12">
                        <label>2024</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <PieChart
                          width={80}
                          height={80}
                        //   onMouseEnter={this.onPieEnter}
                        >
                          <Pie
                            data={data1}
                            cx={30}
                            cy={30}
                            innerRadius={20}
                            outerRadius={30}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {data.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                            <label value="B" position="center" />
                          </Pie>
                        </PieChart>
                      </div>
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#FDFF70" }}
                            >
                              A
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#F3D23D" }}
                            >
                              B
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#FF7079" }}
                            >
                              C
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#187E08" }}
                            >
                              D
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#56F33D" }}
                            >
                              E
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-12">
                        <label>2025</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <PieChart
                          width={80}
                          height={80}
                        //   onMouseEnter={this.onPieEnter}
                        >
                          <Pie
                            data={data1}
                            cx={30}
                            cy={30}
                            innerRadius={20}
                            outerRadius={30}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {data.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                            <label value="B" position="center" />
                          </Pie>
                        </PieChart>
                      </div>
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#FDFF70" }}
                            >
                              A
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#F3D23D" }}
                            >
                              B
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#FF7079" }}
                            >
                              C
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#187E08" }}
                            >
                              D
                            </span>
                          </div>
                          <div className="col-md-12">
                            <span
                              id="spnCii"
                              style={{ backgroundColor: "#56F33D" }}
                            >
                              E
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6" style={{ left: "24px" }}>
                <div className="row mt16">
                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="CIIHistoryHeading">YTD</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3 offset-md-1">
                        <label className="amountHV">5 %</label>
                      </div>
                      <div className="col-md-1">
                        <i
                          class="fa fa-long-arrow-down downArow"
                          style={{ fontSize: "21px" }}
                        ></i>
                      </div>
                      <div className="col-md-4">
                        <label className="ytdValuesDown">-0.3 %</label>
                      </div>
                    </div>
                  </div>

                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="CIIHistoryHeading">2021</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className=" col-md-3">
                        <label className="amountHV">3 %</label>
                      </div>
                      <div className=" col-md-1">
                        <i
                          class="fa fa-long-arrow-up upArow"
                          style={{ fontSize: "21px" }}
                        ></i>
                      </div>
                      <div className="col-md-4">
                        <label className="ytdValuesUp">-0.3 %</label>
                      </div>
                    </div>
                  </div>

                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="CIIHistoryHeading">2022</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <label className="amountHV">6 %</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <div className="amountDes">
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="curuncy">USD</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="curuncy">CO</label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="amount">800K</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="amount">45K</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <div className="amountDes">
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="curuncy">USD</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="curuncy">CO</label>
                            </div>
                          </div>

                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="amount">800K</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="amount">45K</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="customGrid col-md-4">
                    <div className="row">
                      <div className="customGrid col-md-12">
                        <div className="amountDes">
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="curuncy">USD</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="curuncy">CO</label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="customGrid col-md-6">
                              <label className="amount">800K</label>
                            </div>
                            <div className="amountDes1 customGrid col-md-6">
                              <label className="amount">45K</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FleetKPIModal;
