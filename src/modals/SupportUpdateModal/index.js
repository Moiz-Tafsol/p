import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import ModalSkeleton from "../ModalSkeleton";
import { DropDown } from "../../Component/DropDown/DropDown";
import classes from "./SupportUpdateModal.module.css";
import { Input } from "../../Component/Input";
import { validateEmail } from "../../config/apiUrl";
const SupportUpdateModal = ({ show, setShow, loading, handleClick, data }) => {
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    let params = {
      status: status?.value,
    };
    for (let key in params) {
      if (params[key] === "") {
        return toast.error("Please fill all the fields");
      }
    }
    await handleClick(params);
    setShow(false);
  };

  useEffect(() => {
    if (data) {
      setStatus({
        label: data?.status,
        value: data?.status,
      });
    }
  }, []);
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
    .input_Container__-7V9Q{
      width:100%; 
    }
    .UploadImageBox_box__nod00{
      height:300px !important;
    }
    `}</style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="750px"
        borderRadius="20px"
        header={`Update Status`}
      >
        <div className={classes["wrapper-view-modal"]}>
          <Row>
            <div className={classes.formCol}>
              <DropDown
                customStyle={{
                  width: "100%",
                  backgroundColor: "var(--white-color)",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
                indicatorColor="var(--main-color)"
                placeholderColor="var(--label-color)"
                singleValueColor="var(--black-color)"
                labelClassName={classes.dropDownLabelClass}
                label={"Status"}
                placeholder="Status"
                value={status}
                setter={setStatus}
                options={[
                  {
                    label: "Pending",
                    value: "pending",
                  },
                  {
                    label: "Resolved",
                    value: "resolved",
                  },
                  {
                    label: "Rejected",
                    value: "rejected",
                  },
                ]?.filter((item) => item?.value !== status?.value)}
                isSearchable={false}
              />
            </div>
            <Col md={12} className={classes.btnCol}>
              <Button
                label={`${!loading ? "Update" : "Updating..."}`}
                onClick={handleSubmit}
                disabled={loading}
              />
            </Col>
          </Row>
        </div>
      </ModalSkeleton>
    </>
  );
};

export default SupportUpdateModal;
