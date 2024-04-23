import React from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Patch } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input";
import { ProfileWithEditButton } from "../../Component/ProfileWithEditButton";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import {
  BaseURL,
  CreateFormData,
  apiHeader,
  imageUrl,
} from "../../config/apiUrl";
import ChangePasswordModal from "../../modals/ChangePasswordModal";
import { saveLoginUserData, updateUser } from "../../store/auth/authSlice";
import classes from "./Setting.module.css";

function Setting() {
  const { access_token, user } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState(user ? user?.email : "");
  const [name, setName] = React.useState(user ? user?.username : "");
  const [image, setImage] = React.useState(user ? user?.photo : "");
  const [isLoading, setIsLoading] = React.useState(false);

  const [forgetModal, setForgetModal] = React.useState(false);
  const [forgetLoader, setForgetLoader] = React.useState(false);

  const UpdateHandler = async () => {
    let params = {
      username: name,
      photo: image,
    };

    for (const key in params) {
      if (params[key] === "" || params[key] === null) {
        toast.error("Please fill all the fields");
        return;
      }
    }
    const formData = CreateFormData(params);
    const apiUrl = BaseURL(`users/updateMe`);
    setIsLoading(true);
    const response = await Patch(apiUrl, formData, apiHeader(access_token));
    if (response !== undefined) {
      dispatch(updateUser(response?.data?.data));
      toast.success(`Profile Updated Successfully`);
    }
    setIsLoading(false);
  };

  const handleUpdatePassword = async (body) => {
    const apiUrl = BaseURL(`auth/updateMyPassword`);
    setForgetLoader(true);
    const response = await Patch(apiUrl, body, apiHeader(access_token));
    if (response !== undefined) {
      dispatch(saveLoginUserData(response?.data));
      toast.success("Password has been changed successfully!");
      setForgetModal(false);
    }
    setForgetLoader(false);
  };

  return (
    <>
      <SideBarSkeleton>
        <Row>
          <Col>
            <div className={classes.container}>
              <ProfileWithEditButton
                isEdit={true}
                setUpdateImage={setImage}
                updateImage={
                  typeof image == "object" ? image : imageUrl(`${image}`)
                }
              />
              <Input
                disabled
                placeholder={`Edit Name`}
                type={`text`}
                setter={setName}
                value={email}
                label={"Name"}
                labelStyle={{
                  color: "var(--primary-text-color) !important",
                  fontFamily: "var(--ff-secondary-med)",
                }}
                parentCustomStyle={{ width: "300px" }}
              />
              <Input
                placeholder={`Edit Name`}
                type={`text`}
                setter={setName}
                value={name}
                label={"Name"}
                labelStyle={{
                  color: "var(--primary-text-color) !important",
                  fontFamily: "var(--ff-secondary-med)",
                }}
                parentCustomStyle={{ width: "300px" }}
              />
              <Button
                customStyle={{ width: "150px" }}
                label={isLoading ? `Updating...` : `Update`}
                onClick={() => {
                  UpdateHandler();
                }}
                disabled={isLoading}
              />
            </div>
          </Col>
          <Col className={classes.Button}>
            <Button
              className={classes.loginBtn}
              label={"Update Password"}
              onClick={() => setForgetModal(true)}
            />
          </Col>
        </Row>
        {forgetModal && (
          <ChangePasswordModal
            isLoading={forgetLoader}
            setShow={setForgetModal}
            show={forgetModal}
            handleUpdate={handleUpdatePassword}
          />
        )}
      </SideBarSkeleton>
    </>
  );
}

export default Setting;
