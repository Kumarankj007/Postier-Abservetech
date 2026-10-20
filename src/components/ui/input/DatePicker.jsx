// components/ui/DatePickerComponent.js

import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({
    selectedDate,
    onDateChange,
    label,
    placeholder,
    error,
    className = "",
    id,
    description,
    classLabel = "form-label",
    horizontal,
    validate,
}) => {
    return (
        <div className={`fromGroup ${error ? "has-error" : ""} ${horizontal ? "flex" : ""
            }  ${validate ? "is-valid" : ""} `}>
            {label && (
                <label
                    htmlFor={id}
                    className={`block capitalize ${classLabel} ${horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
                        }`}
                >
                    {label}
                </label>
            )}
            <div className={`relative ${horizontal ? "flex-1" : ""}`}>
                <DatePicker
                    style={{ width: "100%" }}
                    selected={selectedDate}
                    onChange={onDateChange}
                    placeholderText={placeholder}
                    className={`${error ? " has-error" : " "
                        } form-control py-2 ${className}  `}
                    id={id}
                />
            </div>
            {error && (
                <div className="mt-2 text-danger-500 text-sm">
                    {error}
                </div>
            )}
            {description && <span className="input-description">{description}</span>}
        </div>
    );
};

export default DatePickerComponent;