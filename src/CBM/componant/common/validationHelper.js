import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";

const floatRegex = RegExp(/^[+]?([0-9]{0,})*[.]?([0-9]{0,})?$/);
const expressionRegex = RegExp(/^[(]?[-]?([0-9]+)[)]??([(]?([-+/*]([0-9]))?([.,][0-9]+)?[)]?)*$/);
const integerRegex = RegExp(/^[-+]?\d+$/);

export function getValidatedValue(value, validationType) {
    let validatedValue;
    if (value === "") {
        validatedValue = "";
    } else {
        switch (validationType) {
            case "float":
                debugger
                if (floatRegex.test(value)) {
                    validatedValue = value;
                }
                break;
            case "expression":
                debugger
                if (expressionRegex.test(value)) {
                    validatedValue = value;
                }
                break;
            case "integer":
                debugger
                if (integerRegex.test(value)) {
                    validatedValue = value;
                }
                break;
            default:
                validatedValue = value;
        }
    }
    return validatedValue;
}

export function ErrorMessageCss(errorMessage) {
    return errorMessage ? {borderColor: 'red'} : null
}

export function ErrorMessage({errorMessage}) {
    return errorMessage && (<Form.Text className='text-left errorMessage'>
        {errorMessage}
    </Form.Text>);
}
