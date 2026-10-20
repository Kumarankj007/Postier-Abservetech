import React from "react";

const Textinput = ({ label, type, placeholder, name, register, error, setValue }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        onChange={(e) => setValue(name, e.target.value, { shouldValidate: true , shouldDirty: true})}
        className={`${
            error ? " has-error" : ""
          } form-control py-2  `}
      />
      {error && <div className={` mt-2 ${
          
              " text-danger-500 block text-sm"
          }`}>{error.message}</div>}
    </div>
  );
};

export default Textinput;
