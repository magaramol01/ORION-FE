import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 200 },
  { name: "Group C", value: 200 },
  { name: "Group D", value: 100 },
  { name: "Group E", value: 100 },
];
const data1 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 200 },
  { name: "Group C", value: 200 },
  { name: "Group D", value: 100 },
  { name: "Group E", value: 100 },
];
const COLORS = ["#FDFF70", "#F3D23D", "#FF7079", "#187E08", "#56F33D"];

const CIIReductionModal = (props) => {
  // const [first, setfirst] = useState(second)
  const [attainedCII, setAttainedCII] = useState("");
  const [ciiAfterReduction, setCiiAfterReduction] = useState("");

  // ! ALL values are for voyage no 2016L-1
  return (
    <Modal
      id="modelCII"
      size="lg"
      show={props.isShow}
      onHide={props.onHide}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#6d6d6c" }}>
          CII Reduction Advisory
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first" className="text-light">
                      Enhancing Energy Efficiency
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second" className="text-light">
                      Reduction in speed
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link eventKey="third" className="text-light">
                      Increase in the deadweight capcity of vessel
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>

              <Col sm={9}>
                <Tab.Content className="text-light ml-3">
                  <Tab.Pane eventKey="first">
                    <Row>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6>Attained CII</h6>
                        <h4>4.7</h4>
                        <h5>D</h5>
                      </Col>
                    </Row>
                    <hr className="bg-light" />
                    <Row>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -5%</h6>
                        <h4>4.5</h4>
                        <h5>C</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -10%</h6>
                        <h4>4.2</h4>
                        <h5>C</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -15%</h6>
                        <h4>4.0</h4>
                        <h5>B</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -20%</h6>
                        <h4>3.8</h4>
                        <h5>B</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -25%</h6>
                        <h4>3.5</h4>
                        <h5>A</h5>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Row>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6>Attained CII</h6>
                        <h4>4.7</h4>
                        <h5>D</h5>
                      </Col>
                    </Row>
                    <hr className="bg-light" />
                    <Row>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -5%</h6>
                        <h4>4.0</h4>
                        <h5>B</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -10%</h6>
                        <h4>3.4</h4>
                        <h5>A</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -15%</h6>
                        <h4>2.9</h4>
                        <h5>A</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -20%</h6>
                        <h4>2.4</h4>
                        <h5>A</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> -25%</h6>
                        <h4>2.0</h4>
                        <h5>A</h5>
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Row>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6>Attained CII</h6>
                        <h4>4.7</h4>
                        <h5>D</h5>
                      </Col>
                    </Row>
                    <hr className="bg-light" />
                    <Row>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> +5%</h6>
                        <h4>4.5</h4>
                        <h5>D</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> +10%</h6>
                        <h4>4.3</h4>
                        <h5>C</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> +15%</h6>
                        <h4>4.1</h4>
                        <h5>B</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> +20%</h6>
                        <h4>3.9</h4>
                        <h5>B</h5>
                      </Col>
                      <Col className="d-flex justify-content-center flex-column align-items-center">
                        <h6> +25%</h6>
                        <h4>3.8</h4>
                        <h5>A</h5>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default CIIReductionModal;
