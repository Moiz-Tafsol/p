import React from "react";
import ReactSelect, { components } from "react-select";
import classes from "./DropDown.module.css";
import PropTypes from "prop-types";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

export const DropDown = ({
  options,
  label,
  labelTwo,
  customStyle,
  disabled,
  value,
  setter,
  noBorder,
  placeholder,
  placeholderColor = "var(--white-color)",
  isMulti,
  style,
  leftIcon,
  Components,
  labelClassName,
  labelStyle,
  indicatorColor = "var(--white-color)",
  optionLabel,
  optionValue,
  singleValueColor = "var(--text-gray-color)",
  customeClassName = "DropdownOptionContainer",
  mainHoverStyle,
  ...props
}) => {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator padding={"0px"} {...props}>
        {props.isFocused ? (
          <MdOutlineArrowDropUp
            size={30}
            color={indicatorColor}
            style={{ padding: "0px" }}
          />
        ) : (
          <MdOutlineArrowDropDown
            size={30}
            color={indicatorColor}
            style={{ padding: "0px" }}
          />
        )}
      </components.DropdownIndicator>
    );
  };

  const dropDownStyle = {
    control: (styles, { isFocused, isDisabled, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? "var(--disabled-input-color)"
        : "var(--main-color)",
      padding: "0px 0px 0px 0px",
      color: "var(--white-color)",
      boxShadow: "none",
      fontFamily: "var(--ff-primary-reg)",
      fontSize: "16px",
      letterSpacing: "1.4",
      cursor: "pointer",
      border: "1px solid var(--main-color)",
      // boxShadow: "0px 0 5px 2px #0000000d",
      borderRadius: "10px",
      textTransform: "capitialize",
      ...customStyle,

      ":hover": {
        ...styles[":hover"],
        border: "1px solid var(--main-color)",
        ...mainHoverStyle,
      },
      ":placeholder": {
        ...styles[":placeholder"],
        color: "var(--text-color-black)",
      },
      ":active": {
        ...styles[":active"],
        borderColor: "var(--main-color)",
      },
    }),

    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: placeholderColor,
      };
    },

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected && "var(--main-color)",
        color: isSelected && "white",
        padding: "10px 10px",
        fontFamily: "var(--ff-primary-reg)",
        textTransform: "capitialize",
        fontSize: "16px",

        ":active": {
          ...styles[":active"],
          color: "white",
        },
        ":hover": {
          ...styles[":hover"],
          color: "#fff",
          backgroundColor: "rgba(0, 189, 112, 1)",
          cursor: "pointer",
        },
      };
    },

    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: "var(--main-color)",
        borderRadius: "14px",
        padding: "1px 10px",
        fontFamily: "var(--ff-primary-reg)",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "#fff",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      fontSize: 12,
      color: "#fff",
      ":hover": {
        color: "#fff",
      },
    }),
  };
  return (
    <div className={`${[classes.Container].join(" ")}`}>
      <style jsx>{`
        .DropdownOptionContainer__menu {
          margin: 0px;
          border: 0px;
          z-index: 1100 !important;
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
        }
        .DropdownOptionContainer__single-value {
          color: ${singleValueColor};
        }
      `}</style>
      {label && (
        <label
          htmlFor={`dropdown${label}`}
          className={`mb-2 ${[
            classes.label,
            labelClassName && labelClassName,
            disabled && classes.disabled,
          ].join(" ")}`}
          style={{ ...labelStyle }}
        >
          {label}
          {/* {labelTwo && (
            <span style={{ color: Colors.neutralShadesOfDimGray }}>
              {" " + labelTwo}
            </span>
          )} */}
        </label>
      )}

      <div className={`${[classes.dropdownContainer].join(" ")}`}>
        <ReactSelect
          inputId={`dropdown${label}`}
          value={value}
          onChange={(e) => {
            setter(e);
          }}
          className={`${[classes.reactSelect].join(" ")}`}
          isMulti={isMulti}
          isDisabled={disabled}
          placeholder={placeholder}
          options={options}
          styles={{ ...dropDownStyle, ...style }}
          isClearable={false}
          classNamePrefix={customeClassName}
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: (e) => DropdownIndicator(e),
            ...Components,
          }}
          getOptionLabel={(option) => {
            return optionLabel ? option[optionLabel] : option.label;
          }}
          getOptionValue={(option) =>
            optionValue ? option[optionValue] : option.value
          }
          {...props}
        />
        {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
      </div>
    </div>
  );
};

DropDown.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  labelTwo: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.object.isRequired,
  setter: PropTypes.object,
  disabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  customStyle: PropTypes.object,
  style: PropTypes.object,
  Components: PropTypes.object,
  labelClassName: PropTypes.string,
};

DropDown.defaultProps = {
  placeholder: "sdsad",
  value: "aaaa",
  disabled: false,
  isMulti: false,
  options: [],
  Components: {},
};
