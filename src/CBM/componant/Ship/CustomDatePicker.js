import React, { useRef, useState } from "react";
import Popover from "react-bootstrap/Popover";
import { Calendar } from "react-calendar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Form } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";

function CustomDatePicker(props) {
  const { onDateInputChange, onDateChange, dateName, value } = props;
  const [show, setShow] = useState(false);
  const target = useRef(null);
  //const [date, month, year] = value.split(" ")[0].split("-");
  const popoverBottom = (
    <Popover id="popover-basic" target={target.current}>
      {/*<Popover.Title as="h3">Popover Bottom</Popover.Title>*/}
      {/*<Popover.Content></Popover.Content>*/}
      <div className="alarm-calendar-wrapper">
        <Calendar
          onChange={onDateChange}
          value={new Date()}
          // selectRange={true}
        />
      </div>
    </Popover>
  );
  return (
    <div>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={popoverBottom}
        rootClose
      >
        <Form.Control
          required
          size="sm"
          ref={target}
          type="input"
          placeholder="DD-MM-YYYY"
          // onKeyDown={(e) => e.preventDefault()}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          value={value}
          onChange={onDateInputChange}
          name={dateName}
          // defaultValue="01-02-1972"
          autoComplete="off"
        />
      </OverlayTrigger>
      <Form.Control.Feedback type="invalid">
        This is a required field
      </Form.Control.Feedback>
    </div>
  );
}
export default CustomDatePicker;