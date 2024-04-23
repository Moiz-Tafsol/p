import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input";
import { validateEmail } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ConfirmPassword.module.css";
const ConfirmPassword = ({
  show,
  setShow,
  handleConfirmPass,
  isConfirmPass,
  email,
  code,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async () => {
    const params = {
      email: email,
      code: Number(code),
      password,
      passwordConfirm: confirmPassword,
    };
    if (params?.password !== params?.passwordConfirm) {
      return toast.error("Password And Confirm password do not match!");
    }
    if (!validateEmail(params?.email)) {
      return toast.error("Please enter correct email");
    }
    for (let key in params) {
      if (params[key] == "") {
        return toast.error(`Please fill ${key} Code.`);
      }
    }
    await handleConfirmPass(params);
  };
  return (
    <>
      <ModalSkeleton
        borderRadius="20px"
        header={"Confirm Password"}
        setShow={setShow}
        show={show}
        width={"600px"}
      >
        <div className={classes.main}>
          <Row className="gy-4">
            <Col md={12}>
              <Input
                disabled
                value={email}
                label={"Email"}
                placeholder={"Email"}
              />
            </Col>
            <Col md={12}>
              <Input
                type={"password"}
                setter={setPassword}
                value={password}
                label={"Password"}
                placeholder={"Password"}
              />
            </Col>
            <Col md={12}>
              <Input
                type={"password"}
                setter={setConfirmPassword}
                value={confirmPassword}
                label={"Confirm Password"}
                placeholder={"Confirm Password"}
              />
            </Col>
            <Col md={12}>
              <div className={classes.btnMain}>
                <Button
                  disabled={isConfirmPass}
                  onClick={handleSubmit}
                  label={isConfirmPass ? "Submitting..." : "Submit"}
                />
              </div>
            </Col>
          </Row>
        </div>
      </ModalSkeleton>
    </>
  );
};

export default ConfirmPassword;
