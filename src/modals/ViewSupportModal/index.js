import React from "react";
import { Col, Row } from "react-bootstrap";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ViewSupportModal.module.css";
import { imageUrl } from "../../config/apiUrl";
import moment from "moment";
const ViewSupportModal = ({ show, setShow, details, pageName }) => {
  return (
    <>
      <style>{`
    .MuiFormControl-root {
      width: 100%;
    }
    .MuiFormLabel-root {
      color: var(--placeholder-color) !important;
    }
    .MuiOutlinedInput-notchedOutline {
      box-shadow: 0px 0 5px 2px #0000000d;
      border-radius: 10px;
      border: 1px solid rgb(112, 112, 112) !important;
    }
    `}</style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="750px"
        borderRadius="20px"
        header={`Support Details`}
      >
        <div className={classes.modalOverflow}>
          {pageName === "forums" ? (
            <Row>
              {" "}
              <div className={classes.detailRow}>
                <h5>Title:</h5>
                <p>
                  {details?.title.charAt(0).toUpperCase() +
                    details?.title.slice(1)}
                </p>
              </div>
              <div className={classes.detailRow}>
                <h5>Descrciption:</h5>
                <p>{details?.description}</p>
              </div>
            </Row>
          ) : (
            <Row>
              <Col md={6} className={classes.formCol}>
                <div className={classes.detailRow}>
                  <h5>Name:</h5>
                  <p>
                    {details?.name.charAt(0).toUpperCase() +
                      details?.name.slice(1)}
                  </p>
                </div>
              </Col>
              <Col md={6} className={classes.formCol}>
                <div className={classes.detailRow}>
                  <h5>Email:</h5>
                  <p>{details?.email}</p>
                </div>
              </Col>
              <Col md={12} className={classes.formCol}>
                <div className={classes.detailRow}>
                  <h5>Subject:</h5>
                  <p>
                    {details?.subject.charAt(0).toUpperCase() +
                      details?.subject.slice(1)}
                  </p>
                </div>
              </Col>
              <Col md={12} className={classes.formCol}>
                <div className={classes.detailRow}>
                  <h5>Description:</h5>
                  <p>{details?.message}</p>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </ModalSkeleton>
    </>
  );
};

export default ViewSupportModal;
