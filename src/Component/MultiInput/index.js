import { useState } from "react";
import PropTypes from "prop-types";
import classes from "./MultiInput.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { numberRegEx } from "../../config/apiUrl";
import { MdDelete } from "react-icons/md";

/**
 * Primary UI component for user interaction
 */
export const TagInput = ({
  type,
  label,
  label2, // sub label
  value: tags, // input value
  setter: setTags, //setValue
  noBorder,
  placeholder,
  disabled,
  parentCustomStyle, //Main Div Inline Style
  customStyle, //Input Container inline Style
  inputStyle, //Input inline Style
  labelStyle, //Label inline Style
  error, // Show Error Boolean
  errorText, // Error Text
  leftIcon, // Icon For Input
  rightIcon,
  regexType,
  labelOnTop = false,
  ...props
}) => {
  const [passToggle, setPassToggle] = useState(false);
  const [value, setter] = useState(null);

  const handleInputChange = (event) => {
    setter(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      const newTag = value?.trim();
      if (newTag !== "") {
        setTags((prevTags) => [...prevTags, newTag]);
        setter("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };
  let inputContainerStyleObject = Object.assign(
    {},
    error && { border: `1px solid red ` },
    leftIcon && { paddingLeft: "50px" }
  );
  return (
    <>
      <div
        className={`${[
          classes.Container,
          labelOnTop ? classes.labelOnTop : "",
        ].join(" ")}`}
        style={{ ...parentCustomStyle }}
      >
        {label && (
          <label
            htmlFor={`input${label}`}
            className={`${[
              classes.labelText,
              disabled && classes.disabled,
              labelOnTop ? classes.onTopLabel : "",
            ].join(" ")}`}
            style={{ ...labelStyle }}
          >
            {label} {label2 && label2}
          </label>
        )}
        <div
          className={`${[classes.inputPassContainer].join(" ")}`}
          style={{ ...customStyle }}
        >
          {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
          <input
            value={value}
            // onKeyDown={(e) => {
            //   if (type == 'number') {
            //     return (
            //       ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
            //     );
            //   }
            // }}
            onChange={(e) => {
              if (regexType == "number" || type == "number") {
                setter(e?.target?.value?.replace(numberRegEx, ""));
              } else {
                handleInputChange(e);
              }
            }}
            onKeyDown={(e) => handleInputKeyDown(e)}
            disabled={disabled}
            placeholder={placeholder}
            type={passToggle == true ? "text" : type}
            id={`input${label}`}
            className={` ${[
              classes.inputBox,
              noBorder && classes.noBorder,
            ].join(" ")}`}
            style={{ ...inputContainerStyleObject, ...inputStyle }}
            onBlur={() => {
              setter(value?.trim());
            }}
            {...props}
          />
          {rightIcon && <div className={classes.rightIcon}>{rightIcon}</div>}

          {type == "password" && passToggle == false && (
            <VisibilityOffIcon
              className={classes.passwordIcon}
              onClick={(e) => setPassToggle(!passToggle)}
            />
          )}
          {type == "password" && passToggle && (
            <VisibilityIcon
              className={classes.passwordIcon}
              onClick={(e) => setPassToggle(!passToggle)}
            />
          )}
        </div>
        {error && (
          <p className={`mt-2 ${[classes.errorText].join(" ")}`}>{errorText}</p>
        )}
      </div>
      <div className={classes.tags}>
        {tags.map((tag, index) => (
          <span
            key={index}
            className={classes.tag}
            style={{ display: "inline-block", margin: "4px" }}
          >
            <span>{tag}</span>
            <MdDelete
              size={20}
              color={"#FF0000"}
              onClick={() => removeTag(tag)}
              cursor={"pointer"}
            />
          </span>
        ))}
      </div>
    </>
  );
};

// Input.propTypes = {
//   type: PropTypes.oneOf.isRequired,
//   label: PropTypes.string,
//   placeholder: PropTypes.string,
//   value: PropTypes.string.isRequired,
//   setter: PropTypes.string,
//   noBorder: PropTypes.bool,
//   disabled: PropTypes.bool,
//   customStyle: PropTypes.string,
//   error: PropTypes.bool,
//   errorText: PropTypes.string,
//   label2: PropTypes.string,
// };

// Input.defaultProps = {
//   type: "text",
//   placeholder: "enter text",
//   value: "",
//   noBorder: false,
//   disabled: false,
//   error: false,
//   errorText: "An error has occurred, check your details!",
// };
