import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Loader } from "../../../Component/Loader";
import QuillInput from "../../../Component/QuillInput";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import UploadImageBox from "../../../Component/UploadImageBox";
import { quillValidateHandler } from "../../../Helper/QuillValidation";
import {
  BaseURL,
  CreateFormData,
  apiHeader,
  formRegEx,
  formRegExReplacer,
} from "../../../config/apiUrl";
import classes from "./home.module.css";

const Home = () => {
  const [id, setid] = useState(null);
  const [page, setpage] = useState(null);
  const [subtitle, setsubtitle] = useState(null);
  const [image, setimage] = useState(null);
  const [title, settitle] = useState(null);
  const [loading, setloading] = useState(false); //loading state for within skeleton
  const [submitted, setsubmitted] = useState(true); //loading state for button. True if content is submitted or unsent.

  const { access_token } = useSelector((state) => state.authReducer);

  const getfields = async () => {
    setloading(true);

    const response = await Get(`${BaseURL("cms/page/home")}`);
    if (response !== undefined) {
      setid(response?.data._id);
      setpage(response?.data.home.pageName);
      setsubtitle(response?.data.home.hero_subtitle);
      settitle(response?.data.home.hero_title);
      setimage(response?.data.home.hero_image);
    }
    setloading(false);
  };

  useEffect(() => {
    getfields();
  }, []);

  const handleSubmit = async () => {
    const body = {
      id,
      pageName: page,
      hero_title: title,
      hero_subtitle: subtitle,
      hero_image: image,
    };

    for (const key in body) {
      if (body[key] === "" || body[key] === null) {
        return toast.error(
          `Please fill ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }

    if (!quillValidateHandler(body, "Please fill all quill fields!")) {
      return;
    }

    const formData = CreateFormData(body);

    setsubmitted(false);
    const res = await Patch(
      `${BaseURL("cms/page/update")}`,
      formData,
      apiHeader(access_token)
    );
    setsubmitted(true);
    if (res) {
      toast.success("Home updated successfully!");
    }
  };

  return (
    <>
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
            Home CMS
          </h1>
        }
      >
        {loading ? (
          <Loader className={classes.loader} />
        ) : (
          <div>
            <div>
              <UploadImageBox
                state={image}
                setter={setimage}
                label={"Hero Image"}
                labelClassName={classes.title}
                containerClass={classes.uploadImageBox}
              />
            </div>
            <Row>
              <Col md={6} className={classes.verticalgap}>
                <QuillInput
                  label={"Hero Title"}
                  theme="snow"
                  value={title}
                  setter={settitle}
                  labelClass={classes.title}
                  quillClass={classes.quillClass}
                />
              </Col>
              <Col md={6} className={classes.verticalgap}>
                <QuillInput
                  label={"Hero Subtitle"}
                  theme="snow"
                  value={subtitle}
                  setter={setsubtitle}
                  labelClass={classes.title}
                  quillClass={classes.quillClass}
                />
              </Col>
            </Row>
            <Button
              label={submitted ? "Submit" : "Loading.."}
              onClick={handleSubmit}
              disabled={!submitted}
            />
          </div>
        )}
      </SideBarSkeleton>
    </>
  );
};

export default Home;
