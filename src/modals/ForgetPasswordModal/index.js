import React, { useState } from "react";
import styles from "./ForgetPasswordModal.module.css";
import ModalSkeleton from "../../modals/ModalSkeleton";
import { Input } from "../../Component/Input";
import { Button } from "../../Component/Button/Button";

export default function ForgetPasswordModal({
  show,
  setShow,
  forgetPasswordHandler,
  modalLoading,
}) {
  const [email, setEmail] = useState("");
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      header={`Forget Password`}
      width={"600px"}
      borderRadius={"20px"}
    >
      <div className={styles.container}>
        <div className={styles["forget-password"]}>
          <p>
            Enter your email address and we will send you a link to reset your
            password.
          </p>
        </div>
        <div className={styles["form-container"]}>
          <div className={styles["form-group"]}>
            <Input
              label={`Email`}
              type="email"
              value={email}
              setter={setEmail}
              placeholder={"Email"}
            />
          </div>
          <div className={styles["form-group"]}>
            <Button
              label={modalLoading ? "Loading..." : "Submit"}
              className={styles.submit__btn}
              disabled={modalLoading}
              onClick={() => forgetPasswordHandler(email)}
            />
          </div>
        </div>
      </div>
    </ModalSkeleton>
  );
}
