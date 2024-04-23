import React, { useEffect } from "react";
import QuillInput from "../../../Component/QuillInput";
import { Button } from "../../../Component/Button/Button";
import { useState } from "react";
import { Loader } from "../../../Component/Loader";
import classes from "./contact.module.css";
import { toast } from "react-toastify";
import { quillValidateHandler } from "../../../Helper/QuillValidation";
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
import { Row, Col } from "react-bootstrap";

const Contact = () => {
  const [pageName, setPageName] = useState("");
  const [id, setId] = useState("");
  const [heroTitle, setherotitle] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [sectionImage, setSectionimage] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submitted, setsubmitted] = useState(true);

  const { access_token } = useSelector((state) => state.authReducer);

  const getdata = async () => {
    setLoading(true);
    const response = await Get(BaseURL(`cms/page/contact`));
    if (response !== undefined) {
      setId(response?.data?.contact?._id);
      setPageName(response?.data?.contact?.pageName);
      setherotitle(response?.data?.contact?.hero_title);
      setHeroImage(response?.data?.contact?.hero_image);
      setSectionDescription(response?.data?.contact?.section1_description);
      setSectionTitle(response?.data?.contact?.section1_title);
      setSectionimage(response?.data?.contact?.section1_image);
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

      section1_title: sectionTitle,
      section1_image: sectionImage,
      section1_description: sectionDescription,
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
    if (!quillValidateHandler(params, "please fill the CONTACT CMS Field")) {
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
      toast.success("Contact updated successfully!");
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
          Contact CMS
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
                  labelClassName={classes.title}
                  containerClass={classes.uploadImageBox}
                />
              </Col>
              <Col lg={12}>
                <Input
                  value={sectionTitle}
                  setter={setSectionTitle}
                  placeholder={"Enter Title"}
                  label={"Section title"}
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
                  state={sectionImage}
                  setter={setSectionimage}
                  label={"Section Image"}
                  labelClassName={classes.title}
                  containerClass={classes.uploadImageBox}
                />
              </Col>
              <Col lg={6}>
                <QuillInput
                  value={sectionDescription}
                  setter={setSectionDescription}
                  label={"Section Descrption"}
                  labelClass={classes.title}
                  quillClass={classes.quill}
                />
              </Col>
            </Row>
          </div>
          <Button
            label={submitted ? "Submit" : "Submitting.."}
            onClick={handleSubmit}
            disabled={!submitted}
          />
        </div>
      )}
    </SideBarSkeleton>
  );
};

export default Contact;
