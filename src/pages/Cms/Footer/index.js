import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input";
import { Loader } from "../../../Component/Loader";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import {
  BaseURL,
  apiHeader,
  formRegEx,
  formRegExReplacer,
  validateURL,
} from "../../../config/apiUrl";
import classes from "./Footer.module.css";
// import validator from "validator";

const Footer = () => {
  const [pageName, setPageName] = useState("");
  const [id, setId] = useState("");
  const [footerIcons, setFooterIcons] = useState([]);
  const [loading, setLoading] = useState(false);

  const { access_token } = useSelector((state) => state.authReducer);

  const getdata = async () => {
    setLoading("main-loading");
    const response = await Get(BaseURL(`cms/page/footer`));
    if (response !== undefined) {
      setId(response?.data?.footer?._id);
      setPageName(response?.data?.footer?.pageName);
      setFooterIcons(response?.data?.footer?.footer_icons);
      setLoading(false);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleSubmit = async () => {
    const params = {
      id: id,
      pageName: pageName,
      footer_icons: footerIcons,
    };

    for (let key in params) {
      if (!params[key]) {
        return toast.error(
          `Please fill ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }
    console.log(params["footer_icons"]);
    for (let val of params["footer_icons"]) {
      console.log(val?.link);
      if (!validateURL(val?.link)) {
        return toast.error(`Please enter valid ${val?.icon_type} link`);
      }
    }

    setLoading(true);
    const response = await Patch(
      BaseURL(`cms/page/update`),
      params,
      apiHeader(access_token)
    );
    if (response !== undefined) {
      toast.success("Footer updated successfully");
    }
    setLoading(false);
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
          Footer CMS
        </h1>
      }
    >
      {loading === "main-loading" ? (
        <Loader />
      ) : (
        <div className={classes.mainDiv}>
          <div className={classes.entriesDiv}>
            <div className={classes.AddIcons}>
              {footerIcons?.map((ele, index) => (
                <div className={classes.AddSection} key={index}>
                  <Row>
                    <Col lg={6} className={classes["pb-1rem"]}>
                      <Input
                        label={`Social Name`}
                        placeholder={"Enter Social Name"}
                        value={ele?.icon_type}
                        labelStyle={{
                          color: "var(--main-color)",
                          marginLeft: "8px",
                          fontSize: "20px",
                          fontFamily: "var(--ff-primary-semiBold)",
                        }}
                        setter={(e) => {
                          setFooterIcons((prev) => {
                            let temp = [...prev];
                            temp[index].icon_type = e;
                            return temp;
                          });
                        }}
                      />
                    </Col>
                    <Col lg={6} className={classes["pb-1rem"]}>
                      <Input
                        value={ele?.link}
                        labelStyle={{
                          color: "var(--main-color)",
                          marginLeft: "8px",
                          fontSize: "20px",
                          fontFamily: "var(--ff-primary-semiBold)",
                        }}
                        setter={(e) =>
                          setFooterIcons((prev) => {
                            let temp = [...prev];
                            temp[index].link = e;
                            return temp;
                          })
                        }
                        label={`Link`}
                        placeholder={"Enter Link"}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </div>

          <Button
            label={loading ? "Loading..." : "Update"}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      )}
    </SideBarSkeleton>
  );
};

export default Footer;
