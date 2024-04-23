import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../Component/Button/Button";
import CountryStateCity from "../../Component/CountryStateCity/index";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input";
import { ProfileWithEditButton } from "../../Component/ProfileWithEditButton";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { useSelector } from "react-redux";
import {
  BaseURL,
  CreateFormData,
  apiHeader,
  formRegEx,
  formRegExReplacer,
  imageUrl,
  validateURL,
} from "../../config/apiUrl";
import classes from "./UserEdit.module.css";
import { toast } from "react-toastify";
import moment from "moment";
import { Patch } from "../../Axios/AxiosFunctions";
import validator from "validator";

const options = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "system-deactivated" },
];
function EditUser() {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const data = useLocation();
  const [Data, setData] = useState(null);
  const [status, setStatus] = useState(options[0]);
  const [isApiCall, setIsApiCall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setData(data?.state?.data);
    setStatus(data?.state?.data?.active === "active" ? options[0] : options[1]);
  }, [data]);

  const updateHandler = async () => {
    const params = {
      username: Data?.username,
      ...(typeof photo === "object" && { photo: Data?.photo }),
      city: Data?.city || "",
      country: Data?.country || "",
      state: Data?.state || "",
      active: status?.value,
      DOB: Data?.DOB
        ? moment(Data?.DOB?.$d || Data?.DOB).format("MM/DD/YYYY")
        : "",
      aboutMe: Data?.aboutMe,
      paypalLink: Data?.paypalLink,
    };

    for (let key in params) {
      if (["username", "photo"].includes(key) && !params[key]) {
        return toast.error(
          `Please fill ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
      if (key === "paypalLink" && params[key] && !validateURL(params[key])) {
        return toast.error("Invalid paypal link");
      }
    }
    const socialLinks = {
      facebook: Data?.socialLinks?.facebook,
      instagram: Data?.socialLinks?.instagram,
      twitter: Data?.socialLinks?.twitter,
      youtube: Data?.socialLinks?.youtube,
      website: Data?.socialLinks?.website,
    };

    for (let key in socialLinks) {
      if (socialLinks[key] && !validator.isURL(socialLinks[key])) {
        return toast.error(`Please enter valid ${key} link`);
      }
    }

    const formData = CreateFormData(params);
    for (let key in socialLinks) {
      formData.append(`socialLinks[${key}]`, socialLinks[key]);
    }

    setIsApiCall(true);
    const apiUrl = BaseURL(`users/admin/update/${Data?._id}`);
    const response = await Patch(apiUrl, formData, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`User Updated Successfully`);
      navigate("/users");
    }
    setIsApiCall(false);
  };

  return (
    <SideBarSkeleton
      header={
        <h1
          style={{
            fontSize: "26px",
            color: "white",
            margin: "0",
            fontFamily: "var(--ff-secondary-bold)",
          }}
        >
          Edit Users
        </h1>
      }
    >
      <div className={classes._main}>
        <div className={classes.imageDiv}>
          <div className={classes._image}>
            <ProfileWithEditButton
              updateImage={
                typeof Data?.photo === "object"
                  ? Data?.photo
                  : imageUrl(Data?.photo)
              }
              setUpdateImage={(e) =>
                setData((prev) => {
                  let temp = { ...prev };
                  temp.photo = e;
                  return temp;
                })
              }
              isEdit
            />
          </div>
        </div>
        <div className={classes._content}>
          <h1>Profile Informaton</h1>
          <div className={classes.infoDiv}>
            <Row>
              <Col xl={5} className="mb-2">
                <Input
                  label={"Username"}
                  setter={(e) => {
                    setData((prev) => {
                      let temp = { ...prev };
                      temp.username = e;
                      return temp;
                    });
                  }}
                  value={Data?.username}
                />
              </Col>
              <Col xl={5} className="mb-2">
                <Input
                  label={"Email Address"}
                  setter={(e) => {
                    setData((prev) => {
                      let temp = { ...prev };
                      temp.email = e;
                      return temp;
                    });
                  }}
                  disabled={true}
                  value={Data?.email}
                />
              </Col>
            </Row>
            <Row>
              <Col xl={5} className="my-1">
                <CountryStateCity
                  selectedCountry={Data?.country}
                  selectedState={Data?.state}
                  selectedCity={Data?.city}
                  setSelectedCity={(e) => {
                    setData((prev) => {
                      let temp = { ...prev };
                      temp.city = e;
                      return temp;
                    });
                  }}
                  setSelectedCountry={(e) => {
                    setData((prev) => {
                      let temp = { ...prev };
                      temp.country = e;
                      return temp;
                    });
                  }}
                  setSelectedState={(e) => {
                    setData((prev) => {
                      let temp = { ...prev };
                      temp.state = e;
                      return temp;
                    });
                  }}
                  countryLabel="Country"
                  stateLabel="State"
                />
              </Col>
              <Col xl={5}>
                <Col className="my-1">
                  <Input
                    label={"Date of Birth"}
                    // type={"date"}
                    placeholder={""}
                    disabled
                    value={Data?.DOB && moment(Data?.DOB).format("MMM Do YY")}
                  />
                </Col>
                <Col className="my-1 mt-3">
                  <DropDown
                    value={status}
                    label={"Status"}
                    setter={setStatus}
                    options={options}
                    customStyle={{
                      width: "100%",
                      backgroundColor: "var(--white-color)",
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                      padding: "5px 0",
                    }}
                    indicatorColor="var(--main-color)"
                    placeholderColor="var(--label-color)"
                    labelStyle={{
                      color: "var(--text-color)",
                    }}
                    labelClassName={classes.dropDownLabelClass}
                  />
                </Col>
              </Col>
            </Row>
          </div>
          <div className={classes.infoDiv}>
            <Row>
              <Col className="my-1" xl={10}>
                <Input
                  label={"About Me"}
                  setter={(e) => {
                    setData((prev) => {
                      let temp = { ...prev };
                      temp.aboutMe = e;
                      return temp;
                    });
                  }}
                  value={Data?.aboutMe}
                />
              </Col>
            </Row>
          </div>

          <div className={classes.infoDiv}>
            <h4>Donations</h4>
            <Row>
              <Col xl={8}>
                <Input
                  label={"PayPal Link"}
                  setter={(e) => {
                    setData((prev) => {
                      let temp = { ...prev };
                      temp.paypalLink = e;
                      return temp;
                    });
                  }}
                  placeholder={"Enter Link"}
                  value={Data?.paypalLink}
                />
              </Col>
            </Row>
          </div>
          {Data?.socialLinks && (
            <div className={classes._content}>
              <h1>Online Profile</h1>
              <div className={classes.infoDiv}>
                <Row>
                  <Col xl={5} className="my-1">
                    <Input
                      label={"Facebook"}
                      placeholder={"Enter Link"}
                      setter={(e) => {
                        setData((prev) => {
                          let temp = { ...prev };
                          temp.socialLinks.facebook = e;
                          return temp;
                        });
                      }}
                      value={Data?.socialLinks.facebook}
                    />
                  </Col>
                  <Col xl={5} className="my-1">
                    <Input
                      label={"Twitter"}
                      placeholder={"Enter Link"}
                      setter={(e) => {
                        setData((prev) => {
                          let temp = { ...prev };
                          temp.socialLinks.twitter = e;
                          return temp;
                        });
                      }}
                      value={Data?.socialLinks.twitter}
                    />
                  </Col>
                  <Col xl={5} className="my-1">
                    <Input
                      label={"Instagram"}
                      placeholder={"Enter Link"}
                      setter={(e) => {
                        setData((prev) => {
                          let temp = { ...prev };
                          temp.socialLinks.instagram = e;
                          return temp;
                        });
                      }}
                      value={Data?.socialLinks.instagram}
                    />
                  </Col>
                  <Col xl={5} className="my-1">
                    <Input
                      label={"Youtube"}
                      placeholder={"Enter Link"}
                      setter={(e) => {
                        setData((prev) => {
                          let temp = { ...prev };
                          temp.socialLinks.youtube = e;
                          return temp;
                        });
                      }}
                      value={Data?.socialLinks.youtube}
                    />
                  </Col>
                  <Col xl={5} className="my-1">
                    <Input
                      label={"Website"}
                      placeholder={"Enter Link"}
                      setter={(e) => {
                        setData((prev) => {
                          let temp = { ...prev };
                          temp.socialLinks.website = e;
                          return temp;
                        });
                      }}
                      value={Data?.socialLinks.website}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>

        <div className={classes._buttons}>
          <Button
            label={"Cancel"}
            customStyle={{
              backgroundColor: "transparent",
              color: "1px  var(--main-color)",

              border: "1px solid var(--main-color)",
            }}
            onClick={() => {
              navigate(-1);
            }}
          />
          <Button onClick={updateHandler} disabled={isApiCall}>
            {isApiCall ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </SideBarSkeleton>
  );
}

export default EditUser;
