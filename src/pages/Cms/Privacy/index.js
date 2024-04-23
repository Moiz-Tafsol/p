import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Patch } from "../../../Axios/AxiosFunctions";
import { Button } from "../../../Component/Button/Button";
import { Input } from "../../../Component/Input";
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
import classes from "./Privacy.module.css";

const Privacy = () => {
  const [id, setid] = useState(null);
  const [description, setdescription] = useState(null);
  const [page, setpage] = useState(null);
  const [image, setimage] = useState(null);
  const [title, settitle] = useState(null);
  const [loading, setloading] = useState(false); //loading state for within skeleton
  const [submitted, setsubmitted] = useState(true); //loading state for button. True if content is submitted or unsent.

  const { access_token } = useSelector((state) => state.authReducer);

  const getfields = async () => {
    setloading(true);

    const response = await Get(`${BaseURL("cms/page/privacyPolicy")}`);
    const data = response?.data.privacyPolicy;
    if (data !== undefined) {
      setid(data._id);
      setpage(data.pageName);
      setdescription(data.description);
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
      description: description,
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
      toast.success("Content Uploaded Successfully!");
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
          Privacy Policy
        </h1>
      }
    >
      {loading ? (
        <Loader className={classes.loader} />
      ) : (
        <div>
          <div>
            <Input
              label={"Hero Title"}
              value={title}
              setter={settitle}
              labelClass={classes.title}
              labelStyle={{
                color: "var(--main-color)",
                marginLeft: "8px",
                fontSize: "20px",
                fontFamily: "var(--ff-primary-semiBold)",
              }}
            />
          </div>
          <div>
            <UploadImageBox
              state={image}
              setter={setimage}
              label={"Hero Image"}
              labelClassName={classes.title}
              containerClass={classes.uploadImageBox}
            />
          </div>
          <div className={classes.verticalgap}>
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
            label={submitted ? "Submit" : "Loading.."}
            onClick={handleSubmit}
            disabled={!submitted}
          />
        </div>
      )}
    </SideBarSkeleton>
  );
};

export default Privacy;
