import React from "react";
import { Col, Row } from "react-bootstrap";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ViewFaqModal.module.css";
const ViewFaqModal = ({ show, setShow, details }) => {
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
        header={`Faq Details`}
      >
        <div className={classes.modalOverflow}>
          <Row className={classes.formCol}>
            <Col sm={6}>
              <div className={classes.detailRow}>
                <h5>Category:</h5>
                <p>{details?.category?.name}</p>
              </div>
            </Col>
            <Col sm={6}>
              <div className={classes.detailRow}>
                <h5>Status:</h5>
                <span className="active" style={{ width: "fit-content" }}>
                  {details?.isActive ? "Active" : "Non Active"}
                </span>
              </div>
            </Col>
          </Row>
          <Row className={classes.formCol}>
            <div className={classes.detailRow}>
              <h5>Question:</h5>
              <p>{details?.question}</p>
            </div>
          </Row>
          <Row className={classes.formCol}>
            <div className={classes.detailRow}>
              <h5>Answer:</h5>
              <p>{details?.answer}</p>
            </div>
          </Row>
          {/* <Row className={classes.formCol}>
            <Col md={6}>
              <div className={classes.detailRow}>
                <h5>Category:</h5>
                <p>{details?.category?.name}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className={classes.detailRow}>
                <h5>Status:</h5>
                <span className="active" style={{ width: "fit-content" }}>
                  {details?.isActive ? "Active" : "Non Active"}
                </span>
              </div>
            </Col>
          </Row> */}
        </div>
      </ModalSkeleton>
    </>
  );
};

export default ViewFaqModal;
