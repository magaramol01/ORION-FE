import React, {useRef, useState} from "react";
import Popover from "react-bootstrap/Popover";
import {Calendar} from "react-calendar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Form} from "react-bootstrap";

function CustomAlarmDatePicker({
                                   onDateInputChange,
                                   onDateChange,
                                   dateName,
                                   value
                               }) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const [date, month, year] = value.split(" ")[0].split("-");
    const popoverBottom = (
        <Popover
            id="popover-basic"
            target={target.current}
        >
            {/*<Popover.Title as="h3">Popover Bottom</Popover.Title>*/}
            {/*<Popover.Content></Popover.Content>*/}
            <div className="alarm-calendar-wrapper">
                <Calendar
                    onChange={onDateChange}
                    value={
                        year && month && date &&  new Date(
                            Number(year),
                            Number(month) - 1,
                            Number(date)
                        )
                    }
                    // selectRange={true}
                />
            </div>
        </Popover>
    );
    return (
        <div className="container">
            <OverlayTrigger
                trigger="click" placement="left"
                overlay={popoverBottom}
                rootClose
            >
                <Form.Control
                    ref={target}
                    type="input"
                    placeholder="dd-mm-yyyy hh:mm:ss"
                    // onKeyDown={(e) => e.preventDefault()}
                    onFocus={() => setShow(true)}
                    // onBlur={() => setShow(false) }
                    value={value}
                    onChange={onDateInputChange}
                    name={dateName}
                />
            </OverlayTrigger>
        </div>
    );
}

export default CustomAlarmDatePicker;
