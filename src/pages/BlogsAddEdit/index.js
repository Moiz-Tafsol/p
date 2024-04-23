import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input";
import { TagInput } from "../../Component/MultiInput";
import { ProfileWithEditButton } from "../../Component/ProfileWithEditButton";
import QuillInput from "../../Component/QuillInput";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import UploadImageBox from "../../Component/UploadImageBox";
import { BaseURL, apiHeader, formRegEx, imageUrl } from "../../config/apiUrl";
import classes from "./BlogsAddEdit.module.css";
import { useEffect } from "react";
import { Loader } from "../../Component/Loader";

const options = [
  { label: "Active", value: true },
  { label: "Non Active", value: false },
];

const BlogsAddEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state?.data || null;

  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [authorImage, setAuthorImage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  const { access_token: accessToken } = useSelector(
    (state) => state.authReducer
  );

  const getCategories = async () => {
    const url = BaseURL(`categories/admin/all?status=all&type=blog`);
    setSubmitLoading("category");
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setCategories(response?.data?.data?.data);
      setCategory(
        response?.data?.data?.data?.find(
          (value) => value?._id == data?.category?._id
        )
      );
      setSubmitLoading(false);
    }
  };

  const addEditHandler = async () => {
    const params = {
      ...(data && { blogId: data?._id }),
      ...(data && { isActive: isActive?.value }),
      thumbnail,
      title,
      description,
      tags,
      category: category?._id,
      image: authorImage,
      author: {
        name: authorName,
        ...(twitterLink && { twitter: twitterLink }),
        ...(instagramLink && { instagram: instagramLink }),
        ...(facebookLink && { facebook: facebookLink }),
      },
    };
    for (let key in params) {
      if (
        ["", undefined, null]?.includes(params[key]) ||
        params[key]?.length === 0
      ) {
        return toast.error(
          `Please fill ${key.replace(RegExp, formRegEx)} field!`
        );
      }
    }
    const apiUrl = BaseURL(data === null ? "blogs/create" : "blogs/update");

    const formData = new FormData();
    for (let key in params) {
      if (key === "author") {
        for (let Objkey in params[key]) {
          formData.append(`author[${Objkey}]`, params[key][Objkey]);
        }
      } else if (key === "tags") {
        params[key]?.forEach((item) => formData.append("tags[]", item));
      } else {
        formData.append(key, params[key]);
      }
    }

    setSubmitLoading(true);
    const response =
      data === null
        ? await Post(apiUrl, formData, apiHeader(accessToken))
        : await Patch(apiUrl, formData, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Blog ${data === null ? "Added" : "Updated"} Successfully`);
      navigate("/blogs");
    }
    setSubmitLoading(false);
  };
  useEffect(() => {
    if (data) {
      setThumbnail(data.thumbnail);
      setTitle(data.title);
      setIsActive(options.find((item) => item.value === data.isActive));
      setDescription(data.description);
      setTags(data.tags);
      setAuthorImage(data.author.image);
      setAuthorName(data.author.name);
      setInstagramLink(data.author.instagram);
      setFacebookLink(data.author.facebook);
      setTwitterLink(data.author.twitter);
    }
  }, [data]);

  useEffect(() => {
    getCategories();
  }, []);

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
          Blogs Form
        </h1>
      }
    >
      {submitLoading === "category" ? (
        <Loader />
      ) : (
        <div className={classes.container}>
          <div>
            <UploadImageBox
              state={thumbnail}
              setter={setThumbnail}
              label={"Thumbnail"}
              labelClassName={classes.dropDownLabel}
              containerClass={classes.uploadImageBox}
            />
          </div>
          <Input
            label={"Title"}
            placeholder={"Enter Title"}
            value={title}
            setter={setTitle}
          />
          <QuillInput
            label={"Description"}
            theme="snow"
            value={description}
            setter={setDescription}
            labelClass={classes.quilLabel}
            quillClass={classes.quillClass}
          />
          <DropDown
            label={"Category"}
            labelClassName={classes.dropDownLabel}
            value={category}
            setter={(e) => {
              setCategory(e);
            }}
            options={categories}
            optionLabel={"name"}
            optionValue={"_id"}
            placeholder={"Select Category"}
            customStyle={{
              width: "100%",
              backgroundColor: "var(--white-color)",
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
            }}
            indicatorColor="var(--main-color)"
            placeholderColor="var(--label-color)"
          />
          <TagInput
            value={tags}
            setter={setTags}
            placeholder={"Enter Tags"}
            label={"Tags"}
          />

          {data && (
            <div className={classes.switchdiv}>
              <DropDown
                label={"Status"}
                labelClassName={classes.dropDownLabel}
                options={options}
                placeholder={"Select Status"}
                value={isActive}
                setter={(e) => setIsActive(e)}
                customStyle={{
                  width: "100%",
                  backgroundColor: "var(--white-color)",
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
                indicatorColor="var(--main-color)"
                placeholderColor="var(--label-color)"
              />
            </div>
          )}
          <div>
            <label className={classes.dropDownLabel}>Author Image</label>
            <ProfileWithEditButton
              updateImage={
                data && authorImage === data.author.image
                  ? imageUrl(authorImage)
                  : authorImage
              }
              setUpdateImage={setAuthorImage}
              isEdit
            />
          </div>
          <Input
            label={"Author Name"}
            placeholder={"Enter Author Name"}
            value={authorName}
            setter={setAuthorName}
          />
          <Row className="row-gap-2">
            <Col md={4}>
              <Input
                label={"Facebook Link"}
                label2={"(Optional)"}
                placeholder={"Facebook Link"}
                value={facebookLink}
                setter={setFacebookLink}
              />
            </Col>
            <Col md={4}>
              <Input
                label={"Instagram Link"}
                label2={"(Optional)"}
                placeholder={"Instagram Link"}
                value={instagramLink}
                setter={setInstagramLink}
              />{" "}
            </Col>
            <Col md={4}>
              <Input
                label={"Twitter Link"}
                label2={"(Optional)"}
                placeholder={"Twitter Link"}
                value={twitterLink}
                setter={setTwitterLink}
              />{" "}
            </Col>
          </Row>

          <Button
            customStyle={{ width: "fit-content" }}
            onClick={addEditHandler}
            disabled={submitLoading}
          >
            {data
              ? submitLoading
                ? "Updating..."
                : "Update"
              : submitLoading
              ? "Creating..."
              : "Create"}
          </Button>
        </div>
      )}
    </SideBarSkeleton>
  );
};

export default BlogsAddEdit;
