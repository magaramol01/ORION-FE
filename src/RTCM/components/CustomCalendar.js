import React, {Component} from "react";
import {Calendar} from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../common/css/customCalendar.css"

class CustomCalendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }


    render() {
        return (
            <div className="custom-calendar-wrapper">
                <Calendar
                    // onChange={this.onCalendarValueChange}
                    value={this.state.date}
                    defaultView={"month"}
                    className="smartship-react-calendar"
                    // allowPartialRange={true}
                    // selectRange={true}
                />
            </div>
        )
    }
}

export default CustomCalendar;
