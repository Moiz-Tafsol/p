import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input/index";
import { Loader } from "../../../Component/Loader";
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
import classes from "./faqs.module.css";

const Faqs = () => {
  const [id, setid] = useState("6626b4896d63f79f171c6498");
  const [secimage, setsecimage] = useState(null);
  const [page, setpage] = useState("faq");
  const [image, setimage] = useState(null);
  const [title, settitle] = useState(null);
  const [loading, setloading] = useState(false); //loading state for within skeleton
  const [submitted, setsubmitted] = useState(true); //loading state for button. True if content is submitted or unsent.

  const { access_token } = useSelector((state) => state.authReducer);

  const getfields = async () => {
    setloading(true);

    const response = await Get(`${BaseURL("cms/page/faq")}`);
    const data = response?.data.faq;
    if (data !== undefined) {
      setid(data._id);
      setpage(data.pageName);
      setsecimage(data.section1_image);
      settitle(data.hero_title);
      setimage(data.hero_image);
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
      section1_image: secimage,
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
      toast.success("Faq updated successfully!");
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
          FAQs CMS
        </h1>
      }
    >
      {loading ? (
        <Loader className={classes.loader} />
      ) : (
        <div>
          <Input
            label={"Hero Title"}
            value={title}
            setter={settitle}
            labelClass={classes.title}
            labelStyle={{
              color: "var(--main-color)",
              fontSize: "20px",
              fontFamily: "var(--ff-primary-semiBold)",
            }}
          />

          <Row>
            <Col md={6} className={classes.verticalgap}>
              <div>
                <UploadImageBox
                  state={image}
                  setter={setimage}
                  label={"Hero Image"}
                  labelClassName={classes.title}
                  containerClass={classes.uploadImageBox}
                />
              </div>
            </Col>
            <Col md={6} className={classes.verticalgap}>
              <div>
                <UploadImageBox
                  state={secimage}
                  setter={setsecimage}
                  label={"Section 1 Image"}
                  labelClassName={classes.title}
                  containerClass={classes.uploadImageBox}
                />
              </div>
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
  );
};

export default Faqs;
