import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input";
import {
  BaseURL,
  apiHeader,
  formRegEx,
  formRegExReplacer,
  validateEmail,
} from "../../config/apiUrl";
import ConfirmPassword from "../../modals/ConfirmPassword";
import ForgetPasswordModal from "../../modals/ForgetPasswordModal";
import OtpModal from "../../modals/OtpModal/OtpModal";
import { saveLoginUserData } from "../../store/auth/authSlice";
import classes from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgetModal, setForgetModal] = useState(false);
  const [forgetLoader, setForgetLoader] = useState(false);

  const [otpModal, setOtpModal] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [forgotPassEmail, setForgotPassEmail] = useState("");
  const [code, setCode] = useState();
  const [resendOtpLoader, setResendOtpLoader] = useState(false);

  const [confirmPassModal, setConfirmPassModal] = useState(false);
  const [confirmPassLoader, setConfirmPassLoader] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let params = {
      email,
      password,
    };
    for (let key in params) {
      if (params[key] == "" || params[key] == null) {
        return toast.error("Please fill all the required fields!");
      }
    }
    if (!validateEmail(email)) {
      return toast.error("In Valid Email");
    }
    if (params["password"]?.length < 8) {
      return toast.error("Password must contain min 8 characters");
    }
    const url = BaseURL("auth/admin/login");
    setLoading(true);
    const response = await Post(url, params, apiHeader());
    if (response !== undefined) {
      dispatch(saveLoginUserData(response?.data));
      navigate("/");
      toast.success("Login successfully");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (email) => {
    if (!email) {
      return toast.error("Email is required");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter correct email");
    }
    const apiUrl = BaseURL(`auth/forgotPassword`);
    setForgetLoader(true);
    const response = await Post(apiUrl, { email });
    if (response !== undefined) {
      toast.success(
        "OTP code has been sent successfully. Please check your email!"
      );
      setForgetModal(false);
      setOtpModal(true);
      setForgotPassEmail(email);
    }
    setForgetLoader(false);
  };

  const handleResetPassword = async (params) => {
    const url = BaseURL(`auth/verify-otp`);
    setOtpLoader(true);
    const response = await Post(url, params);
    if (response !== undefined) {
      toast.success("Otp code is valid. Please change your password!");
      setOtpModal(false);
      setConfirmPassModal(true);
      setCode(params?.code);
    }
    setOtpLoader(false);
  };

  const handleResendOtp = async (email) => {
    const url = BaseURL(`auth/resend-otp`);
    setResendOtpLoader(true);
    const response = await Patch(url, { email });
    if (response !== undefined) {
      toast.success(
        "OTP code has been sent successfully. Please check your email!"
      );
      setResendOtpLoader(false);
      return true;
    }
    setResendOtpLoader(false);
    return false;
  };

  const handleConfirmPassword = async (params) => {
    for (let key in params) {
      if (!params[key]) {
        return toast.error(
          `Please Fill ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }
    const url = BaseURL(`auth/resetPassword`);
    setConfirmPassLoader(true);
    const response = await Patch(url, params);
    if (response !== undefined) {
      dispatch(saveLoginUserData(response?.data));
      toast.success("Password has been changed successfully!");
      setConfirmPassModal(false);
    }
    setConfirmPassLoader(false);
  };

  return (
    <>
      <div className={[classes.mainContainer]}>
        <div className={[classes.innerContainer]}>
          <Row>
            <Col md={12}>
              <div className={classes.loginText}>
                <h3>LOGIN</h3>
              </div>
            </Col>
            <Col md={12}>
              <form onSubmit={handleLogin}>
                <div className={[classes.inputCol]}>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    setter={setEmail}
                    label={"Email"}
                  />
                </div>
                <div className={[classes.inputCol]}>
                  <Input
                    placeholder="Password"
                    value={password}
                    setter={setPassword}
                    type="password"
                    label={"Password"}
                  />{" "}
                  <div className={classes.actions}>
                    <Link onClick={() => setForgetModal(true)}>
                      Forget Password
                    </Link>
                  </div>
                </div>

                <Button
                  className={classes.loginBtn}
                  label={loading ? "Submitting..." : "Login"}
                  disabled={loading}
                />
              </form>
            </Col>
          </Row>
          {forgetModal && (
            <ForgetPasswordModal
              modalLoading={forgetLoader}
              forgetPasswordHandler={handleForgotPassword}
              setShow={setForgetModal}
              show={forgetModal}
            />
          )}
          {otpModal && (
            <OtpModal
              isOtpSend={otpLoader}
              handleOtpFunc={handleResetPassword}
              setShow={setOtpModal}
              show={otpModal}
              email={forgotPassEmail}
              resendOtp={handleResendOtp}
              resendOtpLoader={resendOtpLoader}
            />
          )}
          {confirmPassModal && (
            <ConfirmPassword
              isConfirmPass={confirmPassLoader}
              handleConfirmPass={handleConfirmPassword}
              setShow={setConfirmPassModal}
              show={confirmPassModal}
              email={forgotPassEmail}
              code={code}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
