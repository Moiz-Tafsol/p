import React, { useRef } from "react";
import { MdUpload, MdModeEdit, MdClose } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { imageUrl } from "../../config/apiUrl";
import classes from "./UploadImageBox.module.css";
import { userAvatar } from "../../constant/imagePath";
import { GrGallery } from "react-icons/gr";

function UploadImageBox({
  state,
  setter,
  label,
  edit = true,
  onDelete,
  labelClassName,
  onClose,
  isCloseable,
  hideDeleteIcon = false,
  imgClass,
  containerClass = "",
  onEdit,
}) {
  const inputRef = useRef(null);
  return (
    <>
      {label && (
        <label
          className={`${classes.label} ${labelClassName && labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className={`${classes.box} ${containerClass}`}>
        <div className={classes.uploadImageBox}>
          {/* Close Icon */}
          {isCloseable && (
            <span className={classes.closeIcon} onClick={onClose}>
              <MdClose color="var(-main-color)" />
            </span>
          )}
          {state?.name || typeof state == "string" ? (
            <div className={classes.imageUploaded}>
              <img
                src={
                  state === null
                    ? userAvatar
                    : typeof state == "object"
                    ? URL.createObjectURL(state)
                    : imageUrl(state)
                }
                className={imgClass ? imgClass : ""}
                alt="New Product"
              />
              <div className={classes.editAndDelete}>
                {edit && (
                  <>
                    {hideDeleteIcon && (
                      <div className={classes.icon} onClick={onDelete}>
                        <RiDeleteBinLine />
                      </div>
                    )}
                    <div
                      className={classes.icon}
                      onClick={() => {
                        inputRef.current.click();
                        onEdit && onEdit();
                      }}
                    >
                      <MdModeEdit color="var(-main-color)" />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={classes.uploadBox}>
              {/* <img src={state} className={classes.icon} /> */}
              <GrGallery className={classes.icon} />
              <div
                className={classes.uploadIcon}
                onClick={() => inputRef.current.click()}
              >
                <MdUpload color="var(-main-color)" />
              </div>
            </div>
          )}
        </div>
        {/* {label && <label>{label}</label>} */}
        {/* Input For Image Upload */}
        <input
          hidden
          type={"file"}
          ref={inputRef}
          onChange={(e) => setter(e.target.files[0])}
        />
      </div>
    </>
  );
}

export default UploadImageBox;
