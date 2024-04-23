import React from "react";
import classes from "./CustomPhoneInput.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomPhoneInput = ({
  //  label = "Contact",
  value,
  setter,
  placeholder = "Phone",
  disabled,
  label,
  customClass,
}) => {
  return (
    <>
      <style>{`
    .react-tel-input .flag-dropdown{
      border:1px solid var(--border-color) !important;
      border-radius:10px 0 0 10px;
    }
   
    `}</style>
      <div className={customClass && customClass}>
        {label && (
          <p
            className={[
              classes.phoneLabel,
              disabled && classes.labelDisabled,
            ].join(" ")}
          >
            {label}
          </p>
        )}
        <PhoneInput
          inputClass={[classes.phoneInput]}
          containerClass={[classes.phoneInputContainer]}
          placeholder={placeholder}
          enableSearch={true}
          country={"gb"}
          // onlyCountries={["us"]}
          // disableDropdown={true}
          value={value}
          onChange={(phone) => {
            setter(phone);
          }}
          disabled={disabled}
          inputStyle={{
            ...(disabled && { background: "var(--disabled-input-color)" }),
          }}
        />
      </div>
    </>
  );
};

export default CustomPhoneInput;
