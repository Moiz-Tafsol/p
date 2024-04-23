import React from "react";
import ReactSelect, { components } from "react-select";
import classes from "./DropDown.module.css";
import PropTypes from "prop-types";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
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
  placeholderColor = "var(--placeholder-color)",
  isMulti,
  style,
  leftIcon,
  Components,
  labelClassName,
  indicatorColor = "var(--black-color)",
  optionLabel,
  optionValue,
  singleValueColor = "var(--black-color)",
  customeClassName = "DropdownOptionContainer",
  ...props
}) => {
  const DropdownIndicator = (props) => {
    return (
      <>
        <style>
          {`
            .DropdownOptionContainer__indicator{
              padding: 2px;
              border-radius: 8px;
            }
          `}
        </style>
        <components.DropdownIndicator {...props}>
          {props.isFocused ? (
            <IoIosArrowUp size={18} color={indicatorColor} />
          ) : (
            <IoIosArrowDown size={18} color={indicatorColor} />
          )}
        </components.DropdownIndicator>
      </>
    );
  };

  const dropDownStyle = {
    control: (styles, { isFocused, isDisabled, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled ? "var(--disabled-input-color)" : "#fff",
      padding: "4px 13px 4px 4px",
      color: "var(--white-color)",
      boxShadow: "none",
      fontFamily: "var(--ff-primary-reg)",
      fontSize: "var(--fs-base)",
      letterSpacing: "1.4",
      cursor: "pointer",
      border: "none",
      borderRadius: "6px",
      textTransform: "capitialize",
      border: "2px solid var(--primary-color)",
      ...customStyle,

      ":hover": {
        ...styles[":hover"],
        borderColor: "var(--primary-color)",
      },
      ":placeholder": {
        ...styles[":placeholder"],
        color: "var(--black-color)",
      },
      ":active": {
        ...styles[":active"],
        borderColor: "#77CAFF",
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
        backgroundColor: isSelected && "var(--secondary-color)",
        color: isSelected && "var(--white-color)",
        padding: "8px 12px",
        fontFamily: "var(--ff-primary-reg)",
        textTransform: "capitialize",

        ":active": {
          ...styles[":active"],
          color: "#fff",
        },
        ":hover": {
          ...styles[":hover"],
          color: "#fff",
          backgroundColor: "#6b85be",
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
      fontSize: "var(--fs-base)",
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
          className={`${[
            classes.label,
            labelClassName && labelClassName,
            disabled && classes.disabled,
          ].join(" ")}`}
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
