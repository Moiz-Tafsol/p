import React, { useEffect, useState } from "react";
import ModalSkeleton from "../ModalSkeleton";
import styles from "./OtpModal.module.css";
import OtpInput from "react-otp-input";
import { Button } from "../../Component/Button/Button";
import { toast } from "react-toastify";
import { validateEmail } from "../../config/apiUrl";
const OtpModal = ({
  show,
  setShow,
  email,
  handleOtpFunc,
  isOtpSend,
  resendOtp,
  resendOtpLoader,
}) => {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(120);
  const handleSubmit = async () => {
    const params = {
      code: Number(otp),
      email: email,
    };
    if (!validateEmail(params?.email)) {
      return toast.error("Please enter correct email");
    }
    for (let key in params) {
      if (params[key] == "") {
        return toast.error(`Please fill ${key} Code.`);
      }
    }
    if (String(params?.otpCode)?.length < 6) {
      return toast.error(`Otp Code is incomplete!`);
    }
    await handleOtpFunc(params);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);
  return (
    <>
      <style></style>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        borderRadius="20px"
        header={`Otp Verification`}
        width={"600px"}
      >
        <div className={styles.OtpInput_main}>
          <p className={styles.pass}>Enter the One Time Password sent to</p>
          <p className={styles.gmail}>{email}</p>
          <div className={styles.otpMain}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              inputStyle={styles.OtpInput_style}
              numInputs={6}
              isInputNum={true}
              shouldAutoFocus={true}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <p className={styles.resend}>
            {seconds == 0 ? (
              "Your OTP code has been expired!"
            ) : (
              <>
                <span>
                  {" "}
                  Your Otp code will be expired in{" "}
                  {String(String(Math.floor(seconds / 60))).padStart(2, "0")}
                </span>
                :<span>{String(seconds % 60).padStart(2, "0")}</span>
              </>
            )}
            <span
              className={resendOtpLoader && styles.resend_otp_loader}
              style={
                seconds == 0
                  ? { color: "var(--main-color)" }
                  : { pointerEvents: "none", color: "lightgray" }
              }
              onClick={() => {
                if (resendOtp(email)) {
                  setSeconds(120);
                }
              }}
            >
              Resend OTP
            </span>
          </p>
          <div className={styles.verify_btn_main}>
            <Button
              disabled={isOtpSend}
              onClick={handleSubmit}
              label={isOtpSend ? "Verifying..." : "Verify"}
              className={styles.verify_btn}
            />
          </div>
        </div>
      </ModalSkeleton>
    </>
  );
};

export default OtpModal;
