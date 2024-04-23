import React from "react";
import QuillInput from "../../../Component/QuillInput";
import { Button } from "../../../Component/Button/Button";
import { useState, useEffect } from "react";
import classes from "./about.module.css";
import { toast } from "react-toastify";
import {
  BaseURL,
  apiHeader,
  formRegEx,
  formRegExReplacer,
  CreateFormData,
} from "../../../config/apiUrl";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import { Input } from "../../../Component/Input";
import UploadImageBox from "../../../Component/UploadImageBox";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Loader } from "../../../Component/Loader";
import { quillValidateHandler } from "../../../Helper/QuillValidation";

const About = () => {
  const [pageName, setPageName] = useState("");
  const [id, setId] = useState("");
  const [heroTitle, setherotitle] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [section_1Title, setSection_1Title] = useState("");
  const [section_1Description, setSection_1Description] = useState("");
  const [section_1Image, setSection_1image] = useState(undefined);
  const [section_2Title, setSection_2Title] = useState("");
  const [section_2Description, setSection_2Description] = useState("");
  const [section_2Image1, setSection_2image1] = useState(undefined);
  const [section_2Image2, setSection_2image2] = useState(undefined);
  const [section_3Title, setSection_3Title] = useState("");
  const [section_3Description, setSection_3Description] = useState("");
  const [section_3Image, setSection_3image] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submitted, setsubmitted] = useState(true);

  const { access_token } = useSelector((state) => state.authReducer);

  const getdata = async () => {
    setLoading(true);
    const response = await Get(BaseURL(`cms/page/about`));
    if (response !== undefined) {
      setId(response?.data?.about?._id);
      setPageName(response?.data?.about?.pageName);
      setherotitle(response?.data?.about?.hero_title);
      setHeroImage(response?.data?.about?.hero_image);
      setSection_1Description(response?.data?.about?.section1_description);
      setSection_1Title(response?.data?.about?.section1_title);
      setSection_1image(response?.data?.about?.section1_image);
      setSection_2Description(response?.data?.about?.section2_description);
      setSection_2Title(response?.data?.about?.section2_title);
      setSection_2image1(response?.data?.about?.section2_image1);
      setSection_2image2(response?.data?.about?.section2_image2);
      setSection_3Description(response?.data?.about?.section3_description);
      setSection_3Title(response?.data?.about?.section3_title);
      setSection_3image(response?.data?.about?.section3_image);
    }

    setLoading(false);
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleSubmit = async () => {
    const params = {
      id: id,
      pageName: pageName,
      hero_title: heroTitle,
      hero_image: heroImage,

      section1_title: section_1Title,
      section1_description: section_1Description,
      section1_image: section_1Image,

      section2_title: section_2Title,
      section2_description: section_2Description,
      section2_image1: section_2Image1,
      section2_image2: section_2Image2,

      section3_title: section_3Title,
      section3_description: section_3Description,
      section3_image: section_3Image,
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

    if (!quillValidateHandler(params, "please fill the ABOUT CMS Field")) {
      return;
    }
    const formData = CreateFormData(params);
    setsubmitted(false);
    const response = await Patch(
      BaseURL(`cms/page/update`),
      formData,
      apiHeader(access_token)
    );
    setsubmitted(true);
    if (response) {
      toast.success("About updated successfully!");
    }
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
          About CMS
        </h1>
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <div className={classes.mainDiv}>
          <div className={classes.entriesDiv}>
            <Row>
              <Col lg={12}>
                <Input
                  value={heroTitle}
                  setter={setherotitle}
                  placeholder={"Enter Title"}
                  label={"Hero Title"}
                  labelStyle={{
                    color: "var(--main-color)",
                    marginLeft: "8px",
                    fontSize: "20px",
                    fontFamily: "var(--ff-primary-semiBold)",
                  }}
                />
              </Col>

              <Col lg={6}>
                <UploadImageBox
                  state={heroImage}
                  setter={setHeroImage}
                  label={"Hero Image"}
                  labelClassName={classes.titles}
                  containerClass={classes.uploadImageBox}
                />
              </Col>
              <Col lg={12}>
                <Input
                  value={section_1Title}
                  setter={setSection_1Title}
                  placeholder={"Enter Title"}
                  label={"Section: 1 title"}
                  labelStyle={{
                    color: "var(--main-color)",
                    marginLeft: "8px",
                    fontSize: "20px",
                    fontFamily: "var(--ff-primary-semiBold)",
                  }}
                />
              </Col>

              <Col lg={6}>
                <UploadImageBox
                  state={section_1Image}
                  setter={setSection_1image}
                  label={"Section: 1 Image"}
                  labelClassName={classes.titles}
                  containerClass={classes.uploadImageBox}
                />
              </Col>
              <Col lg={6}>
                <QuillInput
                  value={section_1Description}
                  setter={setSection_1Description}
                  label={"Section: 1 Descrption"}
                  labelClass={classes.titles}
                  quillClass={classes.quill}
                />
              </Col>

              <Col lg={12}>
                {" "}
                <Input
                  value={section_2Title}
                  setter={setSection_2Title}
                  placeholder={"Enter Title"}
                  label={"Section: 2 title"}
                  labelStyle={{
                    color: "var(--main-color)",
                    marginLeft: "8px",
                    fontSize: "20px",
                    fontFamily: "var(--ff-primary-semiBold)",
                  }}
                />
              </Col>
              <Col lg={6}>
                <UploadImageBox
                  state={section_2Image1}
                  setter={setSection_2image1}
                  label={"Section: 2 Image 1"}
                  labelClassName={classes.titles}
                  containerClass={classes.uploadImageBox}
                />
              </Col>
              <Col lg={6}>
                <UploadImageBox
                  state={section_2Image2}
                  setter={setSection_2image2}
                  label={"Section: 2 Image 2"}
                  labelClassName={classes.titles}
                  containerClass={classes.uploadImageBox}
                />
              </Col>
              <Col lg={6}>
                <QuillInput
                  value={section_2Description}
                  setter={setSection_2Description}
                  label={"Section: 2 Descrption"}
                  labelClass={classes.titles}
                  quillClass={classes.quill}
                />
              </Col>
              <Col lg={12}>
                <Input
                  value={section_3Title}
                  setter={setSection_3Title}
                  placeholder={"Enter Title"}
                  label={"Section: 3 title"}
                  labelStyle={{
                    color: "var(--main-color)",
                    marginLeft: "8px",
                    fontSize: "20px",
                    fontFamily: "var(--ff-primary-semiBold)",
                  }}
                />
              </Col>

              <Col lg={6}>
                <UploadImageBox
                  state={section_3Image}
                  setter={setSection_3image}
                  label={"Section: 3 Image"}
                  labelClassName={classes.titles}
                  containerClass={classes.uploadImageBox}
                />
              </Col>

              <Col lg={6}>
                <QuillInput
                  value={section_3Description}
                  setter={setSection_3Description}
                  label={"Section: 3 Descrption"}
                  labelClass={classes.titles}
                  quillClass={classes.quill}
                />
              </Col>
            </Row>

            <Button
              label={submitted ? "Submit" : "Submitting.."}
              onClick={handleSubmit}
              disabled={!submitted}
            />
          </div>
        </div>
      )}
    </SideBarSkeleton>
  );
};

export default About;
