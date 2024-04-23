import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input";
import { Loader } from "../../../Component/Loader";
import SideBarSkeleton from "../../../Component/SideBarSkeleton";
import UploadImageBox from "../../../Component/UploadImageBox";
import {
  BaseURL,
  CreateFormData,
  apiHeader,
  formRegEx,
  formRegExReplacer,
} from "../../../config/apiUrl";
import classes from "./Forum.module.css";

const Forum = () => {
  const [id, setid] = useState(null);
  const [page, setpage] = useState(null);
  const [image, setimage] = useState(null);
  const [title, settitle] = useState(null);
  const [loading, setloading] = useState(false); //loading state for within skeleton

  const { access_token } = useSelector((state) => state.authReducer);

  const getData = async () => {
    setloading("main-loading");
    const response = await Get(`${BaseURL("cms/page/forum")}`);
    if (response !== undefined) {
      setid(response?.data?._id);
      setpage(response?.data?.forum?.pageName);
      settitle(response?.data?.forum?.hero_title);
      setimage(response?.data?.forum?.hero_image);
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

    const formData = CreateFormData(body);

    setloading(true);
    const res = await Patch(
      `${BaseURL("cms/page/update")}`,
      formData,
      apiHeader(access_token)
    );

    if (res !== undefined) {
      toast.success("Forum updated successfully!");
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
            Forum CMS
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
                  }}/>
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

export default Forum;
