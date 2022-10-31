import React , {Component} from 'react';
import {Col , Form , Row , Table} from 'react-bootstrap';

const  USECASE = [{'key':'ME intermediate shaft bearing high temperature due to excessive axial clearance causing insufficient oil flow to bearings.',
    'key1':'Piston cooling failure due to less cooling or internal leakage'}];
const  FAILUREADVISORY = ['Bearing wear and failure could be monitored/predicted using lube oil analysis along with the temperature sensor and vibration sensor readings if fitted.',
    'Piston cooling is essential for the prevention of seizure and damage to the running surfaces of the engine. It can lead to total failure of the liner and the piston if left unattended.'];

class Temp extends Component {
    constructor(props) {
        debugger
        super(props);
        this.state = {
            useCase:"",
            failureAdvisory:""
        };

    }

    onUseCaseChange = (event)=> {
        this.setState({useCase:event.target.value});
        alert(event.target.value)
    };
    onFailureAdvisoryChange = (event) =>{
        this.setState({failureAdvisory:event.target.value});
        alert(event.target.value)
    };
    render () {
        return (
            <div style={{   }}>
                <Row md={12} lg={12} style={{display : "flex",margin:0,marginBottom:20,marginTop:20}}>
                    <Col md="6" lg="6">
                        <label style={{
                            // fontFamily: DefaultFont,
                            color: '#676a6b',
                            letterSpacing: 0.55, lineheight: 1.5, fontsize: '1rem'
                        }}>Use Case
                            <span style={{color: "red"}}>* </span>
                        </label>
                        <Form.Control as="select" id="department" required
                                      disabled={false}
                                      onChange={this.onUseCaseChange}>
                            <option value="" selected="selected"> Select Department </option>
                            {USECASE.map(dropDownOption =>
                                <option value={dropDownOption.key}
                                        key={dropDownOption.key}>{dropDownOption.key}</option>)}

                        </Form.Control>
                    </Col>
                    <Col md="6" lg="6">
                        <label style={{
                            // fontFamily: DefaultFont,
                            color: '#676a6b',
                            letterSpacing: 0.55, lineheight: 1.5, fontsize: '1rem'
                        }}>Failure Advise
                            <span style={{color: "red"}}>* </span>
                        </label>
                        <Form.Control as="select" id="department" required
                                      disabled={false}
                                      onChange={this.onFailureAdvisoryChange}>
                            <option value="" selected="selected"> Select Department </option>
                            {FAILUREADVISORY.map(dropDownOption =>
                                <option value={dropDownOption}
                                        key={dropDownOption}>{dropDownOption}</option>)}

                        </Form.Control>
                    </Col>
                </Row>
                <Row style={{margin:0}}>
                    <Table striped bordered hover responsive variant="dark" >
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Cause Name</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Larry the Bird</td>
                            <td>Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        </tbody>
                    </Table>
                </Row>
            </div>
        );
    }
}

export default Temp;
