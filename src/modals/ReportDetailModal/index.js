import React from "react";
import classes from "./ReportDetailModal.module.css";
import ModalSkeleton from "../ModalSkeleton";
const ReportDetailModal = ({ show, setShow, selectedItem }) => {
  return (
    <>
      <ModalSkeleton
        showCloseIcon={true}
        width={"700px"}
        borderRadius={"10px"}
        header={"Report Detail"}
        setShow={setShow}
        show={show}
      >
        <div className={classes.main}>
          <p>
            <span>Name:</span> {selectedItem?.user?.username}
          </p>
          <p>
            <span>Email:</span>
            {selectedItem?.user?.email}
          </p>
          <p>
            <span>Description:</span>
            {selectedItem?.description}
          </p>
        </div>
      </ModalSkeleton>
    </>
  );
};

export default ReportDetailModal;
