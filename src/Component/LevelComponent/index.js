import React from "react";
import classes from "./LevelComponent.module.css";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

export default function LevelComponent({ item, onEdit, onDelete }) {
  return (
    <>
      <div className={classes.maincompodiv}>
        <div className={classes.headerdiv}>
          <h4>
            {item?.name}
            {item?.isDefault === true && (
              <span className={classes.tag}>Default</span>
            )}
          </h4>
          <div className={classes.icons}>
            <span onClick={onEdit} className={classes.editbtn}>
              <BiEdit size={23} />
            </span>
            {item?.isDefault !== true && (
              <span onClick={onDelete} className={classes.editbtn}>
                <MdDelete size={23} />
              </span>
            )}
          </div>
        </div>
        <div className={classes.contentdiv}>
          <p>No. of Downloads : {item?.downloadLimit}</p>
          <p>Upload Limit per Week : {item?.uploadLimit}</p>
        </div>
      </div>
    </>
  );
}
