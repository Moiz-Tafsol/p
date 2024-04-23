import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import QuillInput from "../../../Component/QuillInput";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import { Button } from "../../../Component/Button/Button";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import {
  BaseURL,
  CreateFormData,
  apiHeader,
  formRegEx,
  formRegExReplacer,
} from "../../../config/apiUrl";
import { Loader } from "../../../Component/Loader";
import UploadImageBox from "../../../Component/UploadImageBox";
import { useSelector } from "react-redux";
import classes from "./blogs.module.css";
import { Input } from "../../../Component/Input";
import { quillValidateHandler } from "../../../Helper/QuillValidation";

const Blogs = () => {
  const [id, setid] = useState(null);
  const [description, setdescription] = useState(null);
  const [page, setpage] = useState(null);
  const [image, setimage] = useState(null);
  const [title, settitle] = useState(null);
  const [loading, setloading] = useState(false); //loading state for within skeleton

  const { access_token } = useSelector((state) => state.authReducer);

  const getData = async () => {
    setloading("main-loading");
    const response = await Get(`${BaseURL("cms/page/blog")}`);
    const data = response?.data?.blog;

    if (response !== undefined) {
      setid(data._id);
      setdescription(data.description);
      setpage(data.pageName);
      settitle(data.hero_title);
      setimage(data.hero_image);
    }
    setloading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const submitHandler = async () => {
    const body = {
      id,
      pageName: page,
      hero_title: title,
      description,
      hero_image: image,
    };

    for (const key in body) {
      if (!body[key]) {
        return toast.error(
          `Please fill ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()}`
        );
      }
    }

    if (!quillValidateHandler(body, "Please fill description field!")) {
      return;
    }

    const formData = CreateFormData(body);

    setloading(true);
    const res = await Patch(
      `${BaseURL("cms/page/update")}`,
      formData,
      apiHeader(access_token)
    );

    if (res !== undefined) {
      toast.success("Blog updated successfully!");
    }
    setloading(false);
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
            Blog CMS
          </h1>
        }
      >
        {loading === "main-loading" ? (
          <Loader className={classes.loader} />
        ) : (
          <div>
            {" "}
            <Row>
              <Col className={classes.verticalgap}>
                <Input label={"Title"} value={title} setter={settitle} labelStyle={{
                  color: "var(--main-color)",
                  marginLeft: "8px",
                  fontSize: "20px",
                  fontFamily: "var(--ff-primary-semiBold)",
                }} s />
              </Col>
            </Row>
            <div className={classes.row}>
              <UploadImageBox
                state={image}
                setter={setimage}
                label={"Hero Image"}
                labelClassName={classes.title}
                containerClass={classes.uploadImageBox}
              />
            </div>
            <div className={classes.row}>
              <QuillInput
                label={"Description"}
                theme="snow"
                value={description}
                setter={setdescription}
                labelClass={classes.title}
                quillClass={classes.quillClass}
              />
            </div>
            <Button
              label={loading ? "Loading..." : "Submit"}
              onClick={submitHandler}
              disabled={loading}
            />
          </div>
        )}
      </SideBarSkeleton>
    </>
  );
};

export default Blogs;
