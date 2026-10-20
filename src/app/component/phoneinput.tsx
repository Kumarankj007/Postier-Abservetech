import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString, isValidNumber, isValidPhoneNumber } from "libphonenumber-js";

interface PhoneInputComponentProps {
  value?: any;
  onPhoneChange?: (number: string, code: string, isValid: boolean) => void;
  country?: string;
  inputStyle?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  errors?: boolean | any;
  inputId?: string;
  labelId?: string;
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
  value,
  onPhoneChange,
  country = "us", // default country
  errors = false, // default style
  inputStyle,
  dropdownStyle,
  inputId,
  labelId,
}) => {
  const handlePhoneChange = (phoneValue: string, data: any) => {
    const code = data.dialCode;
    const nationalNumber = phoneValue.slice(code.length);
    const fullNumber = `+${phoneValue}`;

// let isValid = false;
//     try {
//       const parsed = parsePhoneNumberFromString(fullNumber);
//       isValid = parsed?.isValid() ?? false;
//     } catch {
//       isValid = false;
//     }
    const parsed = parsePhoneNumberFromString(fullNumber);
    const isValid = isValidPhoneNumber(`+91${nationalNumber}`, 'IN')     // data?.countryCode.toUpperCase())
    // console.log(nationalNumber , 'parsed')
    // const isValid = parsed?.isValid() ?? false;

    if (onPhoneChange) {
      onPhoneChange(nationalNumber, code, isValid);
    }
  };

//   function validateInternationalPhone(phone: string, countryCode: string) {
//   try {
//     return isValidPhoneNumber(phone, countryCode?.toUpperCase());
//   } catch {
//     return false;
//   }
// }


  return (
    <div className="w-full">
      <PhoneInput
        value={value}
        onChange={handlePhoneChange}
        country={country}
        inputStyle={{
          border: errors ? "0.5px solid red" : "0.5px solid #004080",
          width: "100%",
          padding: "33px",
          ...inputStyle,
        }}
        dropdownStyle={{
          ...dropdownStyle,
        }}
        buttonStyle={{
          width: "100px",
          padding: "28px",
          border: errors ? "0.5px solid red" : "0.5px solid #004080",
          borderRadius: "7px",
        }}
        inputProps={{
          id: inputId,
          autoFocus: true,
          "aria-labelledby": labelId,
        }}
      />
    </div>
  );
};

export default PhoneInputComponent;
