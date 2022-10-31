// import { render } from "@testing-library/react";
// import React, { component } from "react";
// import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
// import Select from "react-select";

//  class Popup extends component  {

   


   

//  render() {
//     const theme = theme => ({
//         ...theme,
//         colors: {
//             ...theme.colors,

//         },

//         borderRadius: 2,
//         baseUnit: 1,
//         controlHeight: 35,
//         fontSize: 14

//     });


//         return (
//             <>


//                 <Modal
//                     size="lg"
//                     show={Popup}
//                     onHide={this.popupClose}
//                     backdrop="static"
//                     centered
//                 >
//                     <Modal.Header closeButton>
//                         <Modal.Title style={{ color: "#6d6d6c" }}> Add Advisory Report</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <div className="config-form-block sm-w-800">
//                             <div>
//                                 <Form id="ShipReg">

//                                     <Row>

//                                         <Form.Group size="sm" as={Col}>
//                                             <Form.Label>VesselName</Form.Label>
//                                             <Select
//                                                 theme={theme}
//                                                 defaultValue={
//                                                     PdfUpdate.RegisteredCountry === '' ? [] :
//                                                         [
//                                                             {
//                                                                 value: ShipUpdate.RegisteredCountry,
//                                                                 label: ShipUpdate.RegisteredCountry
//                                                             }
//                                                         ]
//                                                 }

//                                                 options={countryList}

//                                                 onChange={this.countrySelector}

//                                             />
//                                         </Form.Group>
//                                     </Row>


//                                     <Row>
//                                         <Form.Group size="sm" as={Col} >
//                                             <Form.Label>Month</Form.Label>
//                                             <Select
//                                                 style={ShipUpdate.Category.length > 0 ? { borderColor: "red" } : null}
//                                                 theme={theme}
//                                                 // name = "category"
//                                                 defaultValue={
//                                                     ShipUpdate.Category === '' ? [] :
//                                                         [
//                                                             {
//                                                                 value: ShipUpdate.Category,
//                                                                 label: ShipUpdate.Category
//                                                             }
//                                                         ]
//                                                 }
//                                                 options={shipCatArr}
//                                                 onChange={this.categorySelector}
//                                             />
//                                             {ShipUpdate.Category.length > 0 && (
//                                                 <Form.Text className='text-left errorMessage'>
//                                                     {ShipUpdate.Category}
//                                                 </Form.Text>
//                                             )}
//                                         </Form.Group>
//                                         <Form.Group size="sm" as={Col} >
//                                             <Form.Label>Year</Form.Label>
//                                             <Select
//                                                 style={ShipUpdate.Category.length > 0 ? { borderColor: "red" } : null}
//                                                 theme={theme}
//                                                 // name = "category"
//                                                 defaultValue={
//                                                     ShipUpdate.Category === '' ? [] :
//                                                         [
//                                                             {
//                                                                 value: ShipUpdate.Category,
//                                                                 label: ShipUpdate.Category
//                                                             }
//                                                         ]
//                                                 }
//                                                 options={shipCatArr}
//                                                 onChange={this.categorySelector}
//                                             />
//                                             {ShipUpdate.Category.length > 0 && (
//                                                 <Form.Text className='text-left errorMessage'>
//                                                     {ShipUpdate.Category}
//                                                 </Form.Text>
//                                             )}
//                                         </Form.Group>


//                                     </Row>

//                                 </Form>
//                             </div>
//                         </div>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button
//                             size="sm"
//                             className="parameter-add-button ml-0"
//                             variant="outline-secondary"
//                             onClick={this.popupClose}
//                         >
//                             Cancel
//                         </Button>
//                         {
//                             (
//                                 ShipUpdate.id === "" && (
//                                     <Button
//                                         size="sm"
//                                         className="parameter-add-button ml-0"
//                                         variant="outline-secondary"
//                                         onClick={this.onSubmitRegisterShip}
//                                     >
//                                         Register
//                                     </Button>
//                                 )
//                             )
//                             || (
//                                 <Button
//                                     size="sm"
//                                     className="parameter-add-button ml-0"
//                                     variant="outline-secondary"
//                                     data-fid={ShipUpdate.id}
//                                     onClick={this.onSubmitUpdateShip}
//                                 >
//                                     Update
//                                 </Button>
//                             )
//                         }
//                     </Modal.Footer>
//                 </Modal>
//             </>
//         )
//     }
// }

// export default Popup;